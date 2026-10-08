from app.pdb_service import (
    find_pdb_structures,
    get_pdb_structure
)


# =========================================================
# FIND STRUCTURES
# =========================================================

uniprot_id = "Q92889"

print(
    f"Searching PDB structures for {uniprot_id}..."
)

pdb_ids = find_pdb_structures(
    uniprot_id
)

print("\nPDB structures found:")

for pdb_id in pdb_ids:
    print(f"- {pdb_id}")


# =========================================================
# DOWNLOAD STRUCTURE
# =========================================================

selected_pdb = "6SXA"

print(
    f"\nDownloading structure {selected_pdb}..."
)

structure = get_pdb_structure(
    selected_pdb
)

print(
    f"Structure data received: "
    f"{len(structure)} characters"
)

print("\nFirst 500 characters:\n")

print(structure[:500])