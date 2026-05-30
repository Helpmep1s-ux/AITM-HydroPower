from services.storage_services import store_ifc_chunk

MOCK_IFC_STANDARDS = [
    {
        "ps_number": 1,
        "ps_name": "Assessment and Management of Environmental and Social Risks",
        "section": "Environmental and Social Assessment",
        "content": "The client must conduct an environmental and social assessment covering all relevant risks and impacts, including cumulative impacts. The assessment must consider physical, biological, and socio-economic aspects of the project area."
    },
    {
        "ps_number": 1,
        "ps_name": "Assessment and Management of Environmental and Social Risks",
        "section": "Stakeholder Engagement",
        "content": "The client must identify and engage with affected communities and stakeholders throughout the project lifecycle. Engagement must be free, prior, and informed, especially for vulnerable groups."
    },
    {
        "ps_number": 3,
        "ps_name": "Resource Efficiency and Pollution Prevention",
        "section": "Water Usage",
        "content": "The client must quantify water use and implement measures to reduce consumption. For hydropower, this includes maintaining minimum environmental flows downstream of the project."
    },
    {
        "ps_number": 5,
        "ps_name": "Land Acquisition and Involuntary Resettlement",
        "section": "Resettlement Plan",
        "content": "Where involuntary resettlement is unavoidable, a Resettlement Action Plan must be prepared. It must cover compensation at replacement cost, livelihood restoration, and grievance mechanisms."
    },
    {
        "ps_number": 6,
        "ps_name": "Biodiversity Conservation and Sustainable Natural Resource Management",
        "section": "Aquatic Biodiversity",
        "content": "The client must assess impacts on aquatic species and habitats. For hydropower, this includes fish passage, sediment transport, and downstream flow alterations. Mitigation must follow the mitigation hierarchy."
    },
    {
        "ps_number": 7,
        "ps_name": "Indigenous Peoples",
        "section": "Free Prior Informed Consent",
        "content": "Where Indigenous Peoples are present or have collective attachment to the project area, the client must conduct Free, Prior, and Informed Consent (FPIC) processes. Documentation of FPIC must be included in the ESIA."
    },
    {
        "ps_number": 8,
        "ps_name": "Cultural Heritage",
        "section": "Physical Cultural Resources",
        "content": "The client must identify physical cultural resources in the project area including archaeological sites, sacred areas, and intangible heritage. A chance find procedure must be in place during construction."
    }
]

if __name__ == "__main__":
    print("Seeding IFC standards...")
    for chunk in MOCK_IFC_STANDARDS:
        store_ifc_chunk(**chunk)
        print(f"  ✓ PS{chunk['ps_number']} — {chunk['section']}")
    print("Done.")