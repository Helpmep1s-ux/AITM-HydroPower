from services.storage_services import store_ifc_chunk

MOCK_IFC_STANDARDS = [

    # =====================
    # PS1
    # =====================

    {
        "ps_number": 1,
        "ps_name": "Assessment and Management of Environmental and Social Risks and Impacts",
        "section": "Environmental and Social Assessment",
        "content": "Projects shall conduct environmental and social assessments that identify direct, indirect, induced, cumulative, and transboundary impacts. Assessments must be based on current baseline data and consider environmental, social, health, safety, labor, biodiversity, cultural heritage, and climate-related risks."
    },

    {
        "ps_number": 1,
        "ps_name": "Assessment and Management of Environmental and Social Risks and Impacts",
        "section": "Environmental and Social Management System",
        "content": "Projects shall establish and maintain an Environmental and Social Management System (ESMS) including policy, risk identification, management programs, organizational capacity, emergency preparedness, stakeholder engagement, monitoring, and review."
    },

    {
        "ps_number": 1,
        "ps_name": "Assessment and Management of Environmental and Social Risks and Impacts",
        "section": "Stakeholder Engagement and Grievance Mechanism",
        "content": "Affected communities shall be engaged through meaningful consultation and disclosure processes. Projects must maintain accessible grievance mechanisms that receive, document, investigate, and resolve stakeholder concerns."
    },

    # =====================
    # PS2
    # =====================

    {
        "ps_number": 2,
        "ps_name": "Labor and Working Conditions",
        "section": "Human Resources Policies",
        "content": "Projects shall adopt labor policies and procedures that clearly communicate employment conditions, worker rights, compensation, benefits, working hours, and disciplinary procedures."
    },

    {
        "ps_number": 2,
        "ps_name": "Labor and Working Conditions",
        "section": "Occupational Health and Safety",
        "content": "Employers shall provide safe and healthy working conditions through hazard identification, risk assessment, worker training, accident prevention measures, emergency preparedness, and incident reporting systems."
    },

    {
        "ps_number": 2,
        "ps_name": "Labor and Working Conditions",
        "section": "Child Labor and Forced Labor",
        "content": "Projects shall prohibit child labor, forced labor, bonded labor, trafficking, and other forms of involuntary employment. Employment practices must comply with national law and international labor standards."
    },

    {
        "ps_number": 2,
        "ps_name": "Labor and Working Conditions",
        "section": "Worker Grievance Mechanism",
        "content": "Projects shall establish grievance mechanisms allowing workers to raise workplace concerns confidentially without fear of retaliation."
    },

    # =====================
    # PS3
    # =====================

    {
        "ps_number": 3,
        "ps_name": "Resource Efficiency and Pollution Prevention",
        "section": "Resource Efficiency",
        "content": "Projects shall implement measures to improve efficiency in water, energy, raw materials, and natural resource use while minimizing waste generation."
    },

    {
        "ps_number": 3,
        "ps_name": "Resource Efficiency and Pollution Prevention",
        "section": "Pollution Prevention",
        "content": "Projects shall avoid or minimize emissions of pollutants to air, water, and land. Pollution prevention measures should follow good international industry practice."
    },

    {
        "ps_number": 3,
        "ps_name": "Resource Efficiency and Pollution Prevention",
        "section": "Greenhouse Gas Emissions",
        "content": "Projects generating significant greenhouse gas emissions should quantify emissions, evaluate reduction opportunities, and implement technically and financially feasible mitigation measures."
    },

    {
        "ps_number": 3,
        "ps_name": "Resource Efficiency and Pollution Prevention",
        "section": "Water Management",
        "content": "Projects shall assess water availability, competing uses, water quality impacts, and downstream effects. Water conservation and efficient use measures should be incorporated into project design."
    },

    # =====================
    # PS4
    # =====================

    {
        "ps_number": 4,
        "ps_name": "Community Health, Safety, and Security",
        "section": "Community Health and Safety",
        "content": "Projects shall identify and manage risks to surrounding communities arising from construction activities, operations, traffic, hazardous materials, disease transmission, and emergency situations."
    },

    {
        "ps_number": 4,
        "ps_name": "Community Health, Safety, and Security",
        "section": "Emergency Preparedness",
        "content": "Emergency preparedness and response plans shall be developed in collaboration with local authorities and affected communities."
    },

    {
        "ps_number": 4,
        "ps_name": "Community Health, Safety, and Security",
        "section": "Security Personnel",
        "content": "Security arrangements shall respect human rights principles. Security personnel must be trained appropriately and incidents involving use of force must be documented and investigated."
    },

    # =====================
    # PS5
    # =====================

    {
        "ps_number": 5,
        "ps_name": "Land Acquisition and Involuntary Resettlement",
        "section": "Avoidance of Displacement",
        "content": "Projects should avoid involuntary resettlement whenever feasible and minimize displacement through alternative project designs."
    },

    {
        "ps_number": 5,
        "ps_name": "Land Acquisition and Involuntary Resettlement",
        "section": "Resettlement Action Plan",
        "content": "Where displacement is unavoidable, projects shall prepare a Resettlement Action Plan covering compensation, relocation assistance, livelihood restoration, consultation, grievance mechanisms, and monitoring."
    },

    {
        "ps_number": 5,
        "ps_name": "Land Acquisition and Involuntary Resettlement",
        "section": "Compensation and Livelihood Restoration",
        "content": "Affected persons shall receive compensation at replacement cost and support measures to restore or improve livelihoods and living standards."
    },

    # =====================
    # PS6
    # =====================

    {
        "ps_number": 6,
        "ps_name": "Biodiversity Conservation and Sustainable Management of Living Natural Resources",
        "section": "Mitigation Hierarchy",
        "content": "Projects shall apply the mitigation hierarchy for biodiversity impacts: avoidance, minimization, restoration, and offsetting of residual impacts."
    },

    {
        "ps_number": 6,
        "ps_name": "Biodiversity Conservation and Sustainable Management of Living Natural Resources",
        "section": "Critical Habitat",
        "content": "Projects in critical habitats must demonstrate no measurable adverse impacts on biodiversity values and implement robust mitigation and monitoring measures."
    },

    {
        "ps_number": 6,
        "ps_name": "Biodiversity Conservation and Sustainable Management of Living Natural Resources",
        "section": "Ecosystem Services",
        "content": "Projects shall identify ecosystem services relied upon by affected communities and implement measures to avoid or mitigate adverse impacts."
    },

    {
        "ps_number": 6,
        "ps_name": "Biodiversity Conservation and Sustainable Management of Living Natural Resources",
        "section": "Living Natural Resources",
        "content": "Projects utilizing living natural resources shall adopt sustainable management practices and comply with recognized certification systems where appropriate."
    },

    # =====================
    # PS7
    # =====================

    {
        "ps_number": 7,
        "ps_name": "Indigenous Peoples",
        "section": "Identification of Indigenous Peoples",
        "content": "Projects shall identify Indigenous Peoples who may be affected directly or indirectly by project activities and assess impacts on their rights, lands, resources, institutions, and cultural heritage."
    },

    {
        "ps_number": 7,
        "ps_name": "Indigenous Peoples",
        "section": "Free Prior and Informed Consent",
        "content": "Where required under IFC Performance Standard 7, projects shall obtain Free, Prior, and Informed Consent (FPIC) before undertaking activities affecting Indigenous Peoples' lands, resources, relocation, or critical cultural heritage."
    },

    {
        "ps_number": 7,
        "ps_name": "Indigenous Peoples",
        "section": "Benefit Sharing",
        "content": "Projects should provide culturally appropriate benefits and opportunities to Indigenous Peoples and ensure equitable participation in project-related development programs."
    },

    # =====================
    # PS8
    # =====================

    {
        "ps_number": 8,
        "ps_name": "Cultural Heritage",
        "section": "Identification of Cultural Heritage",
        "content": "Projects shall identify tangible and intangible cultural heritage resources that may be affected by project activities, including archaeological, historical, religious, and cultural sites."
    },

    {
        "ps_number": 8,
        "ps_name": "Cultural Heritage",
        "section": "Chance Find Procedure",
        "content": "Projects shall establish chance find procedures for the discovery of previously unknown cultural heritage resources during construction and excavation activities."
    },

    {
        "ps_number": 8,
        "ps_name": "Cultural Heritage",
        "section": "Critical Cultural Heritage",
        "content": "Projects shall avoid significant impacts on critical cultural heritage and implement consultation, mitigation, preservation, and management measures where impacts cannot be avoided."
    },

    # =====================
    # HYDROPOWER SPECIFIC
    # =====================

    {
        "ps_number": 6,
        "ps_name": "Hydropower Biodiversity Requirements",
        "section": "Environmental Flows",
        "content": "Hydropower projects shall assess and maintain environmental flows necessary to sustain aquatic ecosystems, biodiversity, fisheries, ecosystem services, and downstream community water needs."
    },

    {
        "ps_number": 6,
        "ps_name": "Hydropower Biodiversity Requirements",
        "section": "Fish Passage",
        "content": "Where migratory fish species are present, projects shall evaluate barriers to migration and implement fish passage measures where technically feasible."
    },

    {
        "ps_number": 6,
        "ps_name": "Hydropower Biodiversity Requirements",
        "section": "Sediment Management",
        "content": "Hydropower projects shall assess impacts on sediment transport and implement measures to maintain downstream geomorphological processes and aquatic habitat quality."
    },

    {
        "ps_number": 4,
        "ps_name": "Hydropower Community Safety",
        "section": "Dam Safety",
        "content": "Projects involving dams shall establish dam safety programs covering design review, independent expert assessment, operation and maintenance procedures, emergency preparedness, and downstream risk management."
    }
]

if __name__ == "__main__":
    print("Seeding IFC standards...")
    for chunk in MOCK_IFC_STANDARDS:
        store_ifc_chunk(**chunk)
        print(f"  ✓ PS{chunk['ps_number']} — {chunk['section']}")
    print("Done.")