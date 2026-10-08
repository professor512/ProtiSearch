from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.search import ProteinSearchEngine
from app.pdb_service import (
    find_pdb_structures,
    get_pdb_structure
)


# =========================================================
# FASTAPI APPLICATION
# =========================================================

app = FastAPI(
    title="ProtiSearch API",
    description="Protein Function Information Retrieval API",
    version="1.0.0"
)

# =========================================================
# CORS CONFIGURATION
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================================================
# LOAD SEARCH ENGINE
# =========================================================

engine = ProteinSearchEngine(
    "data/proteins_processed.csv"
)


# =========================================================
# ROOT ENDPOINT
# =========================================================

@app.get("/")
def root():

    return {
        "message": "ProtiSearch API is running!",
        "status": "success"
    }

# =========================================================
# SEARCH ENDPOINT
# =========================================================

@app.get("/api/search")
def search_proteins(
    q: str,
    method: str = "bm25",
    top_k: int = 10
):

    # Validate query
    if not q.strip():
        return {
            "error": "Search query cannot be empty."
        }

    # Validate search method
    if method.lower() not in ["tfidf", "bm25"]:
        return {
            "error": "Invalid search method. Use 'tfidf' or 'bm25'."
        }

    # Validate top_k
    if top_k < 1 or top_k > 100:
        return {
            "error": "top_k must be between 1 and 100."
        }

    # Perform search
    results = engine.search_with_method(
        query=q,
        top_k=top_k,
        method=method
    )

    return {
        "query": q,
        "method": method.lower(),
        "top_k": top_k,
        "results": results
    }

# =========================================================
# PROTEIN DETAILS ENDPOINT
# =========================================================

@app.get("/api/proteins/{protein_id}")
def get_protein(protein_id: str):

    # Find protein by UniProt accession
    protein = engine.df[
        engine.df["Entry"].astype(str).str.upper()
        == protein_id.upper()
    ]

    # Protein not found
    if protein.empty:
        return {
            "error": "Protein not found."
        }

    # Get first matching protein
    protein = protein.iloc[0]

    return {
        "protein_id": str(protein["Entry"]),
        "protein_name": str(protein["Protein names"]),
        "gene": str(protein["Gene Names"]),
        "organism": str(protein["Organism"]),
        "length": int(protein["Length"]),
        "function": str(protein["Function [CC]"]),
        "subcellular_location": str(
            protein["Subcellular location [CC]"]
        ),
        "go_ids": str(protein["Gene Ontology IDs"])
    }

    # =========================================================
# PDB STRUCTURES ENDPOINT
# =========================================================

@app.get("/api/proteins/{protein_id}/structures")
def get_protein_structures(protein_id: str):

    pdb_ids = find_pdb_structures(
        protein_id
    )

    return {
        "protein_id": protein_id.upper(),
        "pdb_structures": pdb_ids,
        "count": len(pdb_ids)
    }

# =========================================================
# PDB STRUCTURE DATA ENDPOINT
# =========================================================

@app.get("/api/structures/{pdb_id}")
def get_structure(pdb_id: str):

    structure = get_pdb_structure(
        pdb_id
    )

    return {
        "pdb_id": pdb_id.upper(),
        "format": "mmcif",
        "structure": structure
    }