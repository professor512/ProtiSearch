# ProtiSearch

## Protein Function Information Retrieval and 3D Visualization System

ProtiSearch is a bioinformatics-focused information retrieval system designed to help users search, explore, and visualize human protein information.

The system combines **Information Retrieval (IR)** techniques with **Bioinformatics** data and interactive **3D protein structure visualization**.

Users can search proteins using protein names, gene names, biological functions, and related terms. ProtiSearch ranks the results using **BM25** or **TF-IDF**, displays detailed protein information, retrieves available experimentally determined structures from the **RCSB Protein Data Bank (PDB)**, and visualizes selected structures interactively using **Mol\***.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Objectives](#objectives)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Dataset](#dataset)
- [Information Retrieval](#information-retrieval)
- [Bioinformatics Integration](#bioinformatics-integration)
- [3D Structure Visualization](#3d-structure-visualization)
- [Project Structure](#project-structure)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Search Workflow](#search-workflow)
- [3D Structure Workflow](#3d-structure-workflow)
- [Example Search](#example-search)
- [Current Limitations](#current-limitations)
- [Future Enhancements](#future-enhancements)
- [Academic Relevance](#academic-relevance)
- [Conclusion](#conclusion)
- [External Resources](#external-resources)

---

## Project Overview

Modern biological databases contain a huge amount of protein information. Finding relevant information manually can be time-consuming, especially when a user wants to search by biological function rather than by an exact protein name.

ProtiSearch addresses this problem by providing a searchable interface over a curated human protein dataset.

The system performs:

1. Dataset collection from UniProt.
2. Text preprocessing.
3. Search indexing.
4. Protein retrieval and ranking.
5. Detailed protein information retrieval.
6. PDB structure discovery through RCSB.
7. Interactive 3D structure visualization using Mol*.

The project therefore combines:

> **Bioinformatics + Information Retrieval + Web Development + Data Visualization**

---

## Objectives

The main objectives of ProtiSearch are:

- Build a searchable database of human proteins.
- Allow users to search proteins using natural text queries.
- Implement and compare TF-IDF and BM25 information retrieval methods.
- Rank proteins according to query relevance.
- Display important biological information for each protein.
- Retrieve available experimental 3D structures from RCSB PDB.
- Provide interactive visualization of protein structures.
- Create a simple and user-friendly web interface.
- Demonstrate the application of Information Retrieval techniques in Bioinformatics.

---

## Key Features

### 1. Protein Search

Users can search using:

- Protein names
- Gene names
- Protein functions
- Biological processes
- Gene Ontology IDs
- Other indexed biological terms

Example:

```text
DNA repair
```

---

### 2. TF-IDF Search

ProtiSearch implements **Term Frequency-Inverse Document Frequency (TF-IDF)** using Scikit-learn.

TF-IDF represents documents and queries as vectors and uses cosine similarity to calculate relevance.

---

### 3. BM25 Search

The system also implements **BM25**, a probabilistic ranking algorithm commonly used in information retrieval.

BM25 considers:

- Term frequency
- Inverse document frequency
- Document length
- Query terms

Users can switch between:

```text
BM25
TF-IDF
```

directly from the interface.

---

### 4. Ranked Search Results

Search results display:

- Rank
- Protein name
- UniProt accession
- Gene
- Organism
- Relevance score

---

### 5. Protein Details

Clicking a result displays:

- Protein name
- Protein ID
- Gene
- Organism
- Protein length
- Biological function
- Subcellular location
- Gene Ontology IDs

---

### 6. RCSB PDB Integration

For a selected protein, ProtiSearch queries the **RCSB Protein Data Bank** to find experimentally determined structures associated with the protein's UniProt accession.

The available PDB IDs are displayed to the user.

---

### 7. Interactive 3D Protein Visualization

The selected PDB structure is loaded into **Mol***.

Users can:

- Rotate the structure
- Zoom in/out
- Inspect the molecular structure
- View the protein sequence
- Change available molecular representations using Mol* controls
- Switch between available PDB structures

---

### 8. Handling Proteins Without PDB Structures

Not every protein has an experimentally determined PDB structure.

When no PDB structure is available, ProtiSearch displays:

```text
No PDB structures are currently available for this protein.
```

AlphaFold integration is considered a future enhancement rather than part of the current mini-project implementation.

---

## System Architecture

```text
                         ┌─────────────────────┐
                         │       User          │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   React Frontend    │
                         │      + Mol*         │
                         └──────────┬──────────┘
                                    │
                              HTTP / REST
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   FastAPI Backend   │
                         └──────────┬──────────┘
                                    │
                    ┌───────────────┼────────────────┐
                    │               │                │
                    ▼               ▼                ▼
             ┌────────────┐  ┌────────────┐  ┌─────────────┐
             │ TF-IDF     │  │   BM25     │  │ Protein API │
             │ Search     │  │   Search   │  │   Details   │
             └────────────┘  └────────────┘  └──────┬──────┘
                    │               │                │
                    └───────────────┼────────────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ Processed UniProt   │
                         │ Human Protein Data  │
                         └─────────────────────┘

                                    │
                                    │ Selected Protein
                                    ▼
                         ┌─────────────────────┐
                         │   RCSB PDB API      │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ Available PDB IDs   │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      Mol* Viewer    │
                         │ Interactive 3D      │
                         │ Protein Structure   │
                         └─────────────────────┘
```

---

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- Axios
- Mol*

### Backend

- Python
- FastAPI
- Uvicorn
- Pandas
- NumPy
- Scikit-learn
- rank-bm25
- Requests

### Bioinformatics Data

- UniProt
- RCSB Protein Data Bank
- Gene Ontology identifiers

### Visualization

- Mol*

### Development Environment

- Windows
- PowerShell
- Python Virtual Environment
- Node.js / npm

---

## Dataset

ProtiSearch uses a curated dataset of **20,431 reviewed human proteins** obtained from UniProt.

The dataset was retrieved using the UniProt REST API with:

- Organism: Human
- Taxonomy ID: `9606`
- Reviewed proteins: Swiss-Prot

### Original Dataset Fields

The dataset contains:

```text
Entry
Entry Name
Protein names
Gene Names
Organism
Length
Function [CC]
Subcellular location [CC]
Gene Ontology IDs
```

### Processed Dataset

During preprocessing, a combined searchable field called:

```text
search_text
```

is created.

It combines:

```text
Protein names
+
Gene Names
+
Function [CC]
+
Gene Ontology IDs
```

This field is then used to construct the information retrieval indexes.

---

## Data Preprocessing

The preprocessing pipeline performs:

1. Missing-value handling.
2. Conversion of text to lowercase.
3. Removal of HTML tags.
4. Removal of unnecessary special characters.
5. Whitespace normalization.
6. Creation of a combined searchable text field.

Example:

```text
Protein Name
+
Gene Name
+
Function
+
GO IDs
```

becomes:

```text
search_text
```

The processed dataset is saved as:

```text
data/proteins_processed.csv
```

---

## Information Retrieval

ProtiSearch implements two retrieval methods.

### TF-IDF

TF-IDF calculates the importance of terms within the protein collection.

The basic concept is:

```text
TF-IDF = Term Frequency × Inverse Document Frequency
```

The resulting vectors are compared using:

```text
Cosine Similarity
```

The higher the cosine similarity, the more relevant the protein is considered to the query.

### BM25

BM25 is a probabilistic ranking method.

It considers:

- Query term frequency
- Inverse document frequency
- Document length normalization
- Average document length

BM25 is implemented using:

```text
rank-bm25
```

### Why Both?

Using both methods makes it possible to demonstrate and compare two different information retrieval approaches.

---

## Search Index

The current TF-IDF index contains approximately:

```text
134,672 terms
```

The BM25 index is built from tokenized `search_text` documents.

Both indexes are constructed when the FastAPI application starts.

---

## Bioinformatics Integration

ProtiSearch integrates biological information from multiple sources.

### UniProt

Used for:

- Protein identifiers
- Protein names
- Gene names
- Organisms
- Protein length
- Protein functions
- Subcellular locations
- Gene Ontology IDs

### RCSB Protein Data Bank

Used for:

- Finding experimentally determined protein structures.
- Retrieving PDB/mmCIF structure data.
- Providing structure identifiers for visualization.

---

## 3D Structure Visualization

The project uses **Mol*** for interactive molecular visualization.

When a user selects a PDB structure:

```text
PDB ID
   ↓
Mol* Viewer
   ↓
RCSB PDB
   ↓
mmCIF Structure
   ↓
Interactive 3D Model
```

For example:

```text
6SXA
```

can be loaded and displayed interactively.

The current implementation does not permanently store downloaded structure files on the user's computer. Mol* retrieves the structure for browser-based visualization.

---

## Project Structure

```text
ProtiSearch/
│
├── backend/
│   │
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── search.py
│   │   ├── preprocessing.py
│   │   ├── pdb_service.py
│   │   │
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── proteins.py
│   │       └── search.py
│   │
│   ├── data/
│   │   ├── proteins.csv
│   │   ├── proteins_processed.csv
│   │   └── proteins.tsv
│   │
│   ├── test_search.py
│   ├── test_pdb.py
│   ├── requirements.txt
│   └── venv/
│
├── frontend/
│   │
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js
│   │   │
│   │   ├── components/
│   │   │   └── ProteinViewer.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## Backend Setup

### 1. Open the project

```powershell
cd D:\Karan\work\ProtiSearch
```

### 2. Enter backend

```powershell
cd backend
```

### 3. Create virtual environment

```powershell
python -m venv venv
```

### 4. Activate virtual environment

```powershell
.\venv\Scripts\activate
```

### 5. Install dependencies

```powershell
pip install -r requirements.txt
```

If creating the environment from scratch:

```powershell
pip install fastapi uvicorn pandas numpy scikit-learn rank-bm25 requests
```

---

## Frontend Setup

Open another PowerShell terminal.

```powershell
cd D:\Karan\work\ProtiSearch\frontend
```

Install dependencies:

```powershell
npm install
```

Mol* is included as a dependency:

```powershell
npm install molstar
```

The current project uses Mol* `5.13.1`.

---

## Running the Project

Two terminals are recommended.

### Terminal 1 — Backend

```powershell
cd D:\Karan\work\ProtiSearch\backend
.\venv\Scripts\activate
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

### Terminal 2 — Frontend

```powershell
cd D:\Karan\work\ProtiSearch\frontend
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## API Endpoints

### Root

```http
GET /
```

Example response:

```json
{
  "message": "ProtiSearch API is running!",
  "status": "success"
}
```

---

### Search Proteins

```http
GET /api/search?q=DNA%20repair&method=bm25&top_k=10
```

Parameters:

| Parameter | Description |
|---|---|
| `q` | Search query |
| `method` | `bm25` or `tfidf` |
| `top_k` | Number of results |

---

### Get Protein Details

```http
GET /api/proteins/Q92889
```

Returns:

- Protein ID
- Protein name
- Gene
- Organism
- Length
- Function
- Subcellular location
- Gene Ontology IDs

---

### Get Protein Structures

```http
GET /api/proteins/Q92889/structures
```

Returns available PDB IDs associated with the UniProt accession.

Example:

```json
{
  "protein_id": "Q92889",
  "pdb_structures": [
    "1Z00",
    "2A1J",
    "2AQ0",
    "2KN7",
    "2MUT",
    "6SXA"
  ],
  "count": 10
}
```

---

### Get PDB Structure

```http
GET /api/structures/6SXA
```

Returns the mmCIF structure data retrieved from RCSB PDB.

---

## Search Workflow

The search process follows:

```text
User Query
    ↓
React Frontend
    ↓
FastAPI /api/search
    ↓
Selected Retrieval Method
    ↓
TF-IDF / BM25
    ↓
Similarity / Relevance Scores
    ↓
Ranked Results
    ↓
React Result Cards
```

---

## Protein Detail Workflow

When a user clicks a result:

```text
Protein Result
     ↓
GET /api/proteins/{protein_id}
     ↓
Protein Information
     ↓
GET /api/proteins/{protein_id}/structures
     ↓
Available PDB IDs
```

---

## 3D Structure Workflow

```text
Selected Protein
       ↓
UniProt Accession
       ↓
RCSB PDB Search
       ↓
PDB IDs
       ↓
User selects structure
       ↓
Mol* Viewer
       ↓
Interactive 3D Protein Structure
```

If multiple structures are available, the first structure is automatically selected and the user can switch between the available PDB IDs.

---

## Example Search

Try:

```text
DNA repair
```

with:

```text
BM25
```

The system retrieves and ranks relevant proteins.

Example proteins may include proteins associated with:

- DNA repair
- DNA damage response
- DNA recombination
- Repair pathways

Users can then select a result to inspect its biological information and available 3D structures.

---

## Example PDB Integration

For:

```text
UniProt: Q92889
```

the system can retrieve multiple PDB structures, including examples such as:

```text
1Z00
2A1J
2AQ0
2KN7
2MUT
6SXA
6SXB
9A88
9A89
9PCP
```

The user can select one of these structures and view it using Mol*.

---

## Error Handling

The system handles several common cases:

### Empty Search

If the user submits an empty query, the system prevents an unnecessary search request.

### No Search Results

The frontend displays:

```text
No proteins found
```

and suggests trying another query.

### Protein Not Found

The API returns:

```text
Protein not found.
```

### No PDB Structure

If RCSB has no matching structure:

```text
No PDB structures are currently available for this protein.
```

### RCSB Response Handling

The backend also handles cases where the RCSB service does not return valid JSON, preventing the application from unnecessarily crashing.

---

## Current Limitations

The current mini-project intentionally keeps the scope manageable.

### Dataset

The current dataset contains reviewed human proteins rather than all known proteins across every organism.

### Search

The current retrieval methods are lexical:

- TF-IDF
- BM25

They do not understand biological semantics in the way a modern language model or embedding model would.

### PDB Availability

Not every protein has an experimentally determined PDB structure.

### Structure Storage

Protein structures are retrieved for visualization rather than permanently stored as a local structural database.

### Evaluation

A formal relevance-labeled benchmark can be added for more extensive Precision@K and Recall@K evaluation.

---

## Future Enhancements

The following features can be added in future versions.

### 1. AlphaFold Integration

Use AlphaFold predicted structures as a fallback when an experimental PDB structure is unavailable.

```text
PDB available
    ↓
Use experimental structure

PDB unavailable
    ↓
Use AlphaFold prediction
```

---

### 2. Semantic Search

Use biomedical sentence embeddings to understand semantic similarity between queries and protein functions.

Possible technologies:

- Sentence Transformers
- BioBERT
- PubMedBERT

---

### 3. Hybrid Search

Combine BM25 and semantic similarity:

```text
Hybrid Score =
α × BM25
+
(1 - α) × Semantic Similarity
```

This could improve retrieval for conceptual biological queries.

---

### 4. Biomedical Named Entity Recognition

Automatically identify entities such as:

- Genes
- Proteins
- Diseases
- Biological processes
- Drug names
- Organisms

---

### 5. Advanced Filtering

Possible filters:

- Organism
- Protein length
- Cellular location
- Gene Ontology category
- PDB availability
- Protein family

---

### 6. Search Evaluation Dashboard

Add:

- Precision@K
- Recall@K
- F1 score
- Mean Average Precision
- Search method comparison

---

### 7. Expanded Dataset

Support additional:

- Organisms
- UniProt entries
- Protein families
- Disease-related proteins

---

## Academic Relevance

ProtiSearch demonstrates concepts from several academic areas.

### Bioinformatics

- Protein databases
- UniProt
- Gene Ontology
- Protein structures
- PDB
- Molecular visualization

### Information Retrieval

- Text preprocessing
- TF-IDF
- Cosine similarity
- BM25
- Ranking
- Search evaluation

### Machine Learning / Data Science

- Vector representations
- Similarity measurement
- Ranking
- Text processing

### Web Development

- REST APIs
- FastAPI
- React
- Axios
- Frontend/backend integration

### Data Visualization

- Interactive molecular structure visualization
- Search result presentation

---

## Why This Project Is Useful

Traditional database interfaces often require users to know exact identifiers or navigate complex database structures.

ProtiSearch provides a simpler workflow:

```text
Search in natural language
        ↓
Find relevant proteins
        ↓
Understand their function
        ↓
Explore available structures
        ↓
Visualize the protein in 3D
```

This makes the system useful as an educational and exploratory interface for students and researchers working with protein information.

---

## Project Demonstration Flow

A recommended project demonstration is:

### Step 1

Open ProtiSearch.

### Step 2

Search:

```text
DNA repair
```

### Step 3

Select:

```text
BM25
```

### Step 4

Show ranked results.

### Step 5

Click a protein such as:

```text
ERCC4
```

### Step 6

Show:

- Protein information
- Gene
- Function
- Length
- GO IDs

### Step 7

Show available PDB structures.

### Step 8

Select a PDB ID.

### Step 9

Demonstrate:

- Rotate
- Zoom
- Molecular representation
- Sequence panel

### Step 10

Switch to another PDB structure.

This demonstrates the complete ProtiSearch workflow.

---

## Project Status

**Status: Mini-project implementation complete**

Current major functionality:

```text
[✓] Dataset collection
[✓] Data preprocessing
[✓] TF-IDF indexing
[✓] BM25 indexing
[✓] Protein search
[✓] Ranked results
[✓] Protein details
[✓] UniProt data
[✓] RCSB PDB integration
[✓] PDB structure selection
[✓] Mol* 3D visualization
[✓] Multiple structure switching
[✓] No-result handling
[✓] No-PDB handling
```

---

## Conclusion

ProtiSearch demonstrates how Information Retrieval techniques can be applied to biological data.

The project combines a curated human protein dataset with TF-IDF and BM25 search methods, allowing users to retrieve proteins based on names, genes, functions, and related biological information.

The integration with RCSB PDB and Mol* extends the system beyond text search by allowing users to explore protein structures interactively in three dimensions.

The resulting system provides a compact but practical demonstration of:

> **Information Retrieval + Bioinformatics + Web Development + 3D Molecular Visualization**

---

## External Resources

### UniProt

https://www.uniprot.org/

Used as the primary source for curated protein information.

### RCSB Protein Data Bank

https://www.rcsb.org/

Used to discover and retrieve experimentally determined protein structures.

### Mol*

https://molstar.org/

Used for interactive 3D molecular visualization.

### FastAPI

https://fastapi.tiangolo.com/

Used to implement the backend REST API.

### React

https://react.dev/

Used to build the frontend interface.

### Scikit-learn

https://scikit-learn.org/

Used for TF-IDF vectorization and cosine similarity.

### rank-bm25

https://pypi.org/project/rank-bm25/

Used for BM25 information retrieval.

---

## Author

**Karan Salunkhe**

### Project

**ProtiSearch — Protein Function Information Retrieval and 3D Visualization System**

Built as a Bioinformatics / Information Retrieval mini-project.
