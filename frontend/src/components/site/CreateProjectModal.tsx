import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { createProject, saveActiveProjectId } from "@/lib/api/projectApi";
import { saveProject } from "@/lib/project-cache";

type Props = {
  open: boolean;
  onClose: () => void;
};

const PHASES = ["scoping", "assessment", "disclosure", "monitoring"];

export function CreateProjectModal({ open, onClose }: Props) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    developer: "",
    location: "",
    phase: "scoping",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.developer.trim() || !form.location.trim()) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await createProject(form);
      saveActiveProjectId(res.project_id);
      saveProject({
        name: form.name,
        capacity: 0,
        financier: form.developer,
        basin: form.location,
      });
      onClose();
      navigate({ to: "/upload" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white border border-border p-8 shadow-2xl shadow-ink/20">
        <h2 className="text-2xl font-display font-medium text-ink">New Project</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a project to start uploading EIA documents.
        </p>

        <div className="mt-6 space-y-4">
          <Field label="Project Name">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Upper Tamakoshi Extension"
              className="w-full rounded-lg border border-border px-3 py-2.5 text-sm text-ink outline-none focus:border-mint focus:ring-1 focus:ring-mint transition"
            />
          </Field>

          <Field label="Developer / Organisation">
            <input
              name="developer"
              value={form.developer}
              onChange={handleChange}
              placeholder="AITM Hydro Ltd."
              className="w-full rounded-lg border border-border px-3 py-2.5 text-sm text-ink outline-none focus:border-mint focus:ring-1 focus:ring-mint transition"
            />
          </Field>

          <Field label="Location">
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Dolakha, Nepal"
              className="w-full rounded-lg border border-border px-3 py-2.5 text-sm text-ink outline-none focus:border-mint focus:ring-1 focus:ring-mint transition"
            />
          </Field>

          <Field label="Phase">
            <select
              name="phase"
              value={form.phase}
              onChange={handleChange}
              className="w-full rounded-lg border border-border px-3 py-2.5 text-sm text-ink outline-none focus:border-mint focus:ring-1 focus:ring-mint transition bg-white"
            >
              {PHASES.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {error && <p className="mt-4 text-sm text-rose-500">{error}</p>}

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-ink hover:bg-surface-soft transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-ink/90 transition shadow-lg shadow-ink/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating…" : "Create Project"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}