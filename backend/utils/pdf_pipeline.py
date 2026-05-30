"""
PDF Extraction & Chunking Pipeline
====================================
Designed for large EIA PDFs (300+ pages). Extracts text page-by-page using
pdfplumber, cleans it, then splits it into overlapping chunks ready for
downstream LLM processing.

Usage (standalone):
    python pdf_pipeline.py path/to/report.pdf

Usage (as a module):
    from pdf_pipeline import process_pdf
    result = process_pdf(file_path="report.pdf")

Flask/FastAPI integration examples are included at the bottom.
"""

from __future__ import annotations

import io
import logging
import re
import unicodedata
from dataclasses import dataclass, field
from pathlib import Path
from typing import BinaryIO

import pdfplumber
from pypdf import PdfReader
from pypdf.errors import PdfReadError

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(message)s",
)
logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Data Models
# ---------------------------------------------------------------------------

@dataclass
class PageResult:
    """Raw extraction result for a single PDF page."""
    page_number: int          # 1-based
    raw_text: str
    clean_text: str
    char_count: int = field(init=False)

    def __post_init__(self):
        self.char_count = len(self.clean_text)


@dataclass
class TextChunk:
    """A single chunk produced by the recursive splitter."""
    chunk_index: int
    text: str
    char_count: int = field(init=False)
    # Source page range this chunk was drawn from (best-effort)
    source_pages: list[int] = field(default_factory=list)

    def __post_init__(self):
        self.char_count = len(self.text)


@dataclass
class PipelineResult:
    """Aggregated output of the full pipeline."""
    file_name: str
    total_pages: int
    pages_extracted: int
    pages_failed: list[int]
    chunks: list[TextChunk]
    metadata: dict = field(default_factory=dict)


# ---------------------------------------------------------------------------
# Text Cleaning
# ---------------------------------------------------------------------------

def clean_text(raw: str) -> str:
    """
    Clean extracted PDF text.

    Steps:
    1. Normalise Unicode (NFKC) — fixes ligatures, half-width chars, etc.
    2. Rejoin words broken across lines by a hyphen at line-end.
    3. Replace newlines within a paragraph with a space.
    4. Collapse runs of whitespace to a single space.
    5. Strip leading / trailing whitespace.
    """
    if not raw:
        return ""

    # 1. Unicode normalisation
    text = unicodedata.normalize("NFKC", raw)

    # 2. Rejoin soft-hyphenated words  (e.g. "environ-\nment" → "environment")
    text = re.sub(r"-\s*\n\s*", "", text)

    # 3. Newlines that are NOT paragraph breaks → space
    #    Paragraph breaks (two or more consecutive newlines) are preserved.
    text = re.sub(r"(?<!\n)\n(?!\n)", " ", text)

    # 4. Collapse whitespace runs (spaces, tabs) — keep paragraph breaks
    text = re.sub(r"[ \t]+", " ", text)

    # 5. Trim each paragraph
    paragraphs = [p.strip() for p in text.split("\n\n")]
    paragraphs = [p for p in paragraphs if p]  # drop empties
    text = "\n\n".join(paragraphs)

    return text.strip()


# ---------------------------------------------------------------------------
# PDF Text Extraction
# ---------------------------------------------------------------------------

class PDFExtractionError(Exception):
    """Raised when the PDF cannot be opened or is fundamentally unreadable."""


def _validate_pdf(source: Path | BinaryIO) -> None:
    """
    Use pypdf for a quick structural check before handing off to pdfplumber.
    Raises PDFExtractionError for encrypted or corrupted files.
    """
    try:
        if isinstance(source, Path):
            reader = PdfReader(str(source))
        else:
            pos = source.tell()
            reader = PdfReader(source)
            source.seek(pos)  # rewind for pdfplumber

        if reader.is_encrypted:
            raise PDFExtractionError(
                "PDF is encrypted. Provide a decrypted copy."
            )
    except PdfReadError as exc:
        raise PDFExtractionError(f"Corrupted or invalid PDF: {exc}") from exc


def extract_pages(source: Path | BinaryIO) -> list[PageResult]:
    """
    Extract and clean text from every page of a PDF.

    Parameters
    ----------
    source : Path or file-like object (binary mode)

    Returns
    -------
    List of PageResult, one per page. Pages where extraction fails are
    returned with empty text so chunking can continue with good pages.
    """
    _validate_pdf(source)

    results: list[PageResult] = []

    try:
        with pdfplumber.open(source) as pdf:
            total = len(pdf.pages)
            logger.info("Opened PDF — %d pages found.", total)

            for i, page in enumerate(pdf.pages, start=1):
                try:
                    raw = page.extract_text() or ""
                    cleaned = clean_text(raw)
                    results.append(PageResult(
                        page_number=i,
                        raw_text=raw,
                        clean_text=cleaned,
                    ))
                    if i % 50 == 0:
                        logger.info("  Extracted page %d / %d …", i, total)

                except Exception as exc:           # noqa: BLE001
                    logger.warning(
                        "  Page %d extraction failed (%s). Skipping.", i, exc
                    )
                    results.append(PageResult(
                        page_number=i,
                        raw_text="",
                        clean_text="",
                    ))

    except Exception as exc:                       # noqa: BLE001
        raise PDFExtractionError(
            f"pdfplumber could not open the file: {exc}"
        ) from exc

    return results


# ---------------------------------------------------------------------------
# Recursive Character Text Splitter
# ---------------------------------------------------------------------------

# Priority-ordered separators: try to split on paragraphs first, then
# sentences, then words, and as a last resort on individual characters.
_DEFAULT_SEPARATORS: list[str] = ["\n\n", "\n", ". ", "? ", "! ", " ", ""]


def _split_on_separator(text: str, separator: str) -> list[str]:
    """Split text and re-attach the separator to keep context."""
    if separator == "":
        return list(text)
    parts = text.split(separator)
    # Re-attach separator to all but the last segment to preserve meaning
    return [p + separator for p in parts[:-1]] + [parts[-1]]


def recursive_split(
    text: str,
    chunk_size: int = 2000,
    chunk_overlap: int = 200,
    separators: list[str] | None = None,
) -> list[str]:
    """
    Recursively split *text* into chunks of at most *chunk_size* characters
    with *chunk_overlap* characters of context carried over between chunks.

    Mirrors the behaviour of LangChain's RecursiveCharacterTextSplitter but
    with zero external dependencies.

    Parameters
    ----------
    text         : The text to split.
    chunk_size   : Target maximum characters per chunk.
    chunk_overlap: Characters repeated at the start of the next chunk.
    separators   : Ordered list of separator strings to try. Defaults to
                   paragraph → sentence → word → character.
    """
    if separators is None:
        separators = _DEFAULT_SEPARATORS

    if len(text) <= chunk_size:
        return [text] if text.strip() else []

    # Try each separator in priority order
    for sep in separators:
        if sep == "" or sep in text:
            segments = _split_on_separator(text, sep)
            break
    else:
        segments = list(text)

    chunks: list[str] = []
    current: list[str] = []
    current_len = 0

    for seg in segments:
        seg_len = len(seg)

        # If a single segment already exceeds chunk_size, recurse on it
        if seg_len > chunk_size:
            # First flush what we have
            if current:
                chunks.append("".join(current))
                # Keep overlap: slide back as many segments as needed
                current, current_len = _trim_to_overlap(
                    current, chunk_overlap
                )
            # Then recurse on the oversized segment with the next separator
            next_seps = separators[separators.index(sep) + 1:] if sep in separators else []
            chunks.extend(recursive_split(seg, chunk_size, chunk_overlap, next_seps or [""]))
            continue

        if current_len + seg_len > chunk_size and current:
            chunks.append("".join(current))
            current, current_len = _trim_to_overlap(current, chunk_overlap)

        current.append(seg)
        current_len += seg_len

    if current:
        chunks.append("".join(current))

    return [c for c in chunks if c.strip()]


def _trim_to_overlap(
    segments: list[str], overlap: int
) -> tuple[list[str], int]:
    """
    Return the tail of *segments* whose combined length is ≤ *overlap*.
    Used to carry context forward into the next chunk.
    """
    kept: list[str] = []
    length = 0
    for seg in reversed(segments):
        if length + len(seg) <= overlap:
            kept.insert(0, seg)
            length += len(seg)
        else:
            break
    return kept, length


# ---------------------------------------------------------------------------
# Page-tracking wrapper
# ---------------------------------------------------------------------------

def chunk_pages(
    pages: list[PageResult],
    chunk_size: int = 2000,
    chunk_overlap: int = 200,
) -> list[TextChunk]:
    """
    Concatenate all page texts (with page markers), then chunk, preserving
    approximate source-page information for each chunk.

    Page markers look like:  «PAGE 12»
    They are lightweight enough not to skew chunk sizes meaningfully.
    """
    # Build a joined document with page markers
    segments: list[tuple[str, int]] = []  # (text_segment, page_number)
    for pr in pages:
        if pr.clean_text:
            marker = f"\n\n«PAGE {pr.page_number}»\n"
            segments.append((marker, pr.page_number))
            segments.append((pr.clean_text, pr.page_number))

    joined = "".join(s for s, _ in segments)

    if not joined.strip():
        logger.warning("No extractable text found in the PDF.")
        return []

    raw_chunks = recursive_split(joined, chunk_size, chunk_overlap)

    # Infer source pages from «PAGE N» markers inside each chunk
    chunks: list[TextChunk] = []
    page_marker_re = re.compile(r"«PAGE (\d+)»")

    for idx, chunk_text in enumerate(raw_chunks):
        found_pages = [int(m) for m in page_marker_re.findall(chunk_text)]
        # Remove the markers from the final chunk text
        clean_chunk = page_marker_re.sub("", chunk_text).strip()
        clean_chunk = re.sub(r"\s{3,}", "\n\n", clean_chunk)  # tidy up gaps

        chunks.append(TextChunk(
            chunk_index=idx,
            text=clean_chunk,
            source_pages=sorted(set(found_pages)),
        ))

    return chunks


# ---------------------------------------------------------------------------
# Main Pipeline Entry Point
# ---------------------------------------------------------------------------

def process_pdf(
    file_path: str | Path | None = None,
    file_obj: BinaryIO | None = None,
    file_name: str = "unknown.pdf",
    chunk_size: int = 2000,
    chunk_overlap: int = 200,
) -> PipelineResult:
    """
    Full pipeline: validate → extract → clean → chunk.

    Provide either *file_path* (for local files) or *file_obj* (binary IO,
    e.g. from a Flask/FastAPI upload).

    Returns a PipelineResult with all chunks ready for downstream use.
    """
    if file_path is None and file_obj is None:
        raise ValueError("Provide either file_path or file_obj.")

    source: Path | BinaryIO
    if file_path is not None:
        source = Path(file_path)
        file_name = source.name
        if not source.exists():
            raise FileNotFoundError(f"No such file: {source}")
    else:
        source = file_obj  # type: ignore[assignment]

    logger.info("=== PDF Pipeline starting: %s ===", file_name)

    # --- Step 1 & 2: Extract ---
    pages = extract_pages(source)

    failed_pages = [p.page_number for p in pages if not p.clean_text]
    good_pages = [p for p in pages if p.clean_text]

    logger.info(
        "Extraction complete. Good pages: %d | Failed: %d",
        len(good_pages), len(failed_pages),
    )

    # --- Step 3 & 4: Chunk ---
    chunks = chunk_pages(good_pages, chunk_size, chunk_overlap)
    logger.info("Chunking complete. Total chunks: %d", len(chunks))

    # Fetch PDF metadata via pypdf
    metadata: dict = {}
    try:
        if isinstance(source, Path):
            reader = PdfReader(str(source))
        else:
            source.seek(0)
            reader = PdfReader(source)
        info = reader.metadata or {}
        metadata = {
            "title": info.get("/Title", ""),
            "author": info.get("/Author", ""),
            "creator": info.get("/Creator", ""),
            "total_pages": len(reader.pages),
        }
    except Exception:                              # noqa: BLE001
        pass

    return PipelineResult(
        file_name=file_name,
        total_pages=len(pages),
        pages_extracted=len(good_pages),
        pages_failed=failed_pages,
        chunks=chunks,
        metadata=metadata,
    )


# ---------------------------------------------------------------------------
# Framework Integration Snippets
# ---------------------------------------------------------------------------

# ── Flask ──────────────────────────────────────────────────────────────────
FLASK_SNIPPET = '''
from flask import Flask, request, jsonify
from pdf_pipeline import process_pdf, PDFExtractionError

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 100 * 1024 * 1024  # 100 MB

@app.post("/upload")
def upload():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    f = request.files["file"]
    if not f.filename.lower().endswith(".pdf"):
        return jsonify({"error": "Only PDF files accepted"}), 415
    try:
        result = process_pdf(file_obj=f.stream, file_name=f.filename)
    except PDFExtractionError as exc:
        return jsonify({"error": str(exc)}), 422
    return jsonify({
        "file_name": result.file_name,
        "total_pages": result.total_pages,
        "pages_extracted": result.pages_extracted,
        "pages_failed": result.pages_failed,
        "chunk_count": len(result.chunks),
        "metadata": result.metadata,
        "chunks": [
            {
                "chunk_index": c.chunk_index,
                "char_count": c.char_count,
                "source_pages": c.source_pages,
                "text": c.text,
            }
            for c in result.chunks
        ],
    })
'''

# ── FastAPI ────────────────────────────────────────────────────────────────
FASTAPI_SNIPPET = '''
import io
from fastapi import FastAPI, File, UploadFile, HTTPException
from pdf_pipeline import process_pdf, PDFExtractionError

app = FastAPI()

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=415, detail="Only PDF files accepted")
    contents = await file.read()
    try:
        result = process_pdf(
            file_obj=io.BytesIO(contents),
            file_name=file.filename,
        )
    except PDFExtractionError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    return {
        "file_name": result.file_name,
        "total_pages": result.total_pages,
        "pages_extracted": result.pages_extracted,
        "pages_failed": result.pages_failed,
        "chunk_count": len(result.chunks),
        "metadata": result.metadata,
        "chunks": [
            {
                "chunk_index": c.chunk_index,
                "char_count": c.char_count,
                "source_pages": c.source_pages,
                "text": c.text,
            }
            for c in result.chunks
        ],
    }
'''


# ---------------------------------------------------------------------------
# CLI Entry Point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import json
    import sys

    if len(sys.argv) < 2:
        print("Usage: python pdf_pipeline.py <path_to_pdf>")
        sys.exit(1)

    pdf_path = sys.argv[1]

    try:
        result = process_pdf(file_path=pdf_path)
    except (PDFExtractionError, FileNotFoundError) as e:
        logger.error("Pipeline failed: %s", e)
        sys.exit(1)

    print("\n" + "=" * 60)
    print(f"  File        : {result.file_name}")
    print(f"  Total pages : {result.total_pages}")
    print(f"  Extracted   : {result.pages_extracted}")
    print(f"  Failed pages: {result.pages_failed or 'none'}")
    print(f"  Chunks      : {len(result.chunks)}")
    print(f"  Metadata    : {json.dumps(result.metadata, indent=4)}")
    print("=" * 60)

    # Show a preview of the first 3 chunks
    for chunk in result.chunks[:3]:
        print(f"\n── Chunk {chunk.chunk_index} "
              f"(pages {chunk.source_pages}, {chunk.char_count} chars) ──")
        print(chunk.text[:400] + ("…" if chunk.char_count > 400 else ""))