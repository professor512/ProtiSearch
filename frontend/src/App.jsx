import { useEffect, useState } from "react";
import {
  searchProteins,
  getProtein,
  getProteinStructures
} from "./api/api";
import ProteinViewer from "./components/ProteinViewer";
import "./App.css";

function App() {

  const [query, setQuery] = useState("");
  const [method, setMethod] = useState("bm25");

  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const [selectedProtein, setSelectedProtein] =
    useState(null);

  const [loading, setLoading] = useState(false);

  const [detailsLoading, setDetailsLoading] =
    useState(false);

  const [pdbStructures, setPdbStructures] =
    useState([]);

  const [selectedPdbId, setSelectedPdbId] =
    useState(null);

  useEffect(() => {

    if (selectedProtein) {

      document
        .getElementById("protein-details")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

    }

  }, [selectedProtein]);


  // =========================================================
  // SEARCH
  // =========================================================

  const handleSearch = async () => {

    if (!query.trim()) {
      return;
    }

    try {

      setLoading(true);

      setSelectedProtein(null);
      setSearched(true);

      const data = await searchProteins(
        query,
        method,
        10
      );

      setResults(data.results);

    } catch (error) {

      console.error(
        "Search failed:",
        error
      );

    } finally {

      setLoading(false);

    }
  };


  // =========================================================
  // PROTEIN DETAILS
  // =========================================================

  const handleProteinClick = async (
    proteinId
  ) => {

    try {

      setDetailsLoading(true);

      setSelectedPdbId(null);

      // Get protein details
      const proteinData = await getProtein(
        proteinId
      );

      setSelectedProtein(proteinData);

      // Get available PDB structures
      const structureData =
        await getProteinStructures(
          proteinId
        );

      const structures =
        structureData.pdb_structures || [];

      setPdbStructures(structures);

      if (structures.length > 0) {
        setSelectedPdbId(structures[0]);
      }

    } catch (error) {

      console.error(
        "Failed to load protein:",
        error
      );

      setPdbStructures([]);

    } finally {

      setDetailsLoading(false);

    }
  };

  return (

    <div className="app">

      <header className="header">

        <h1>ProtiSearch</h1>

        <p>
          Protein Function Information Retrieval System
        </p>

      </header>


      <main className="main">

        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="search-container">

          <input
            type="text"
            placeholder="Search proteins, genes, functions..."
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            onKeyDown={(event) => {

              if (event.key === "Enter") {
                handleSearch();
              }

            }}
          />


          <select
            value={method}
            onChange={(event) =>
              setMethod(event.target.value)
            }
          >

            <option value="bm25">
              BM25
            </option>

            <option value="tfidf">
              TF-IDF
            </option>

          </select>


          <button
            onClick={handleSearch}
            disabled={loading}
          >

            {loading
              ? "Searching..."
              : "Search"}

          </button>

        </div>


        {/* =================================================
            SEARCH RESULTS
        ================================================= */}

        <div className="results">
          {searched && !loading && results.length === 0 && (

            <div className="no-results">

              <h2>No proteins found</h2>

              <p>
                Try searching with a different protein name,
                gene, function, or biological process.
              </p>

            </div>

          )}

          {results.map((protein, index) => (

            <div
              className="protein-card"
              key={protein.protein_id}
              onClick={() =>
                handleProteinClick(
                  protein.protein_id
                )
              }
            >

              <span className="rank">
                #{index + 1}
              </span>

              <h2>
                {protein.protein_name}
              </h2>

              <p>
                <strong>Protein ID:</strong>{" "}
                {protein.protein_id}
              </p>

              <p>
                <strong>Gene:</strong>{" "}
                {protein.gene}
              </p>

              <p>
                <strong>Organism:</strong>{" "}
                {protein.organism}
              </p>

              <p>
                <strong>
                  {method === "bm25"
                    ? "BM25"
                    : "TF-IDF"}{" "}
                  Score:
                </strong>{" "}
                {protein.score}
              </p>

              <span className="view-details">
                View protein details →
              </span>

            </div>

          ))}

        </div>


        {/* =================================================
            PROTEIN DETAILS
        ================================================= */}

        {detailsLoading && (

          <div className="protein-details">

            <p>
              Loading protein details...
            </p>

          </div>

        )}


        {selectedProtein && !detailsLoading && (

          <div
            id="protein-details"
            className="protein-details"
          >

            <h2>
              {selectedProtein.protein_name}
            </h2>

            <p>
              <strong>Protein ID:</strong>{" "}
              {selectedProtein.protein_id}
            </p>

            <p>
              <strong>Gene:</strong>{" "}
              {selectedProtein.gene}
            </p>

            <p>
              <strong>Organism:</strong>{" "}
              {selectedProtein.organism}
            </p>

            <p>
              <strong>Length:</strong>{" "}
              {selectedProtein.length} amino acids
            </p>

            <p>
              <strong>Function:</strong>{" "}
              {selectedProtein.function}
            </p>

            <p>
              <strong>Subcellular Location:</strong>{" "}
              {selectedProtein.subcellular_location}
            </p>

            <p>
              <strong>Gene Ontology IDs:</strong>{" "}
              {selectedProtein.go_ids}
            </p>
            <div className="pdb-section">
              <h3>Available 3D Structures</h3>

              {pdbStructures.length === 0 ? (
                <p>No PDB structures available.</p>
              ) : (
                <div className="pdb-list">
                  {pdbStructures.map((pdbId) => (
                    <button
                      key={pdbId}
                      className={`pdb-button ${selectedPdbId === pdbId
                        ? "selected"
                        : ""
                        }`}
                      onClick={() => setSelectedPdbId(pdbId)}
                    >
                      {pdbId}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

        )}


        <div className="structure-section">
          <h2>3D Protein Structure</h2>

          {selectedPdbId ? (
            <>
              <p>
                Selected PDB Structure:{" "}
                <strong>{selectedPdbId}</strong>
              </p>

              <ProteinViewer pdbId={selectedPdbId} />
            </>
          ) : (
            <p>
              Select a PDB structure above to view the
              3D protein structure.
            </p>
          )}
        </div>

      </main>

    </div>

  );
}


export default App;