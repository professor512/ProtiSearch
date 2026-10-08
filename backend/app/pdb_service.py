import requests


# RCSB PDB API
PDB_SEARCH_URL = (
    "https://search.rcsb.org/rcsbsearch/v2/query"
)


def find_pdb_structures(uniprot_id: str):
    query = {
        "query": {
            "type": "terminal",
            "service": "text",
            "parameters": {
                "attribute": "rcsb_polymer_entity_container_identifiers.reference_sequence_identifiers.database_accession",
                "operator": "exact_match",
                "value": uniprot_id
            }
        },
        "return_type": "entry"
    }

    response = requests.post(
        PDB_SEARCH_URL,
        json=query,
        timeout=20
    )

    print("RCSB status:", response.status_code)
    print("RCSB response:", response.text[:500])

    response.raise_for_status()

    try:
        data = response.json()
    except ValueError:
        print("RCSB did not return JSON.")
        return []

    pdb_ids = []

    for result in data.get("result_set", []):
        pdb_ids.append(result["identifier"])

    return pdb_ids

def get_pdb_structure(pdb_id: str):

    pdb_id = pdb_id.upper()

    url = (
        f"https://files.rcsb.org/download/"
        f"{pdb_id}.cif"
    )

    response = requests.get(
        url,
        timeout=20
    )

    response.raise_for_status()

    return response.text