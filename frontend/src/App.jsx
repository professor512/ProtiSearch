import { useEffect, useRef, useState } from "react";
import {
  searchProteins,
  getProtein,
  getProteinStructures,
} from "./api/api";
import ProteinViewer from "./components/ProteinViewer";
import "./App.css";

// ── tiny inline SVG icons (no dep needed) ──────────────────────
const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconDna = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 15c6.667-6 13.333 0 20-6"/><path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993"/>
    <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993"/><path d="m2 9 3-3"/>
    <path d="m2 12 6-6"/><path d="m22 15-3 3"/><path d="m22 12-6 6"/>
  </svg>
);

const IconAtom = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1"/><path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5z"/>
    <path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5z"/>
  </svg>
);

// ── Skeleton Card ───────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-block skeleton-rank" />
      <div className="skeleton-content">
        <div className="skeleton-block" style={{ height: 14, width: "55%" }} />
        <div className="skeleton-block" style={{ height: 11, width: "80%" }} />
      </div>
    </div>
  );
}

// ── Protein Card ────────────────────────────────────────────────
function ProteinCard({ protein, index, method, isActive, onClick }) {
  const score = typeof protein.score === "number"
    ? protein.score.toFixed(4)
    : protein.score;

  return (
    <div
      className={`protein-card${isActive ? " active" : ""}`}
      onClick={onClick}
    >
      <div className="card-rank">#{index + 1}</div>

      <div className="card-body">
        <div className="card-name" title={protein.protein_name}>
          {protein.protein_name}
        </div>
        <div className="card-meta">
          <span className="card-tag">
            <span className="card-tag-label">ID</span>
            {protein.protein_id}
          </span>
          {protein.gene && (
            <span className="card-tag">
              <span className="card-tag-label">Gene</span>
              {protein.gene}
            </span>
          )}
          {protein.organism && (
            <span className="card-tag">
              <span className="card-tag-label">Org</span>
              {protein.organism}
            </span>
          )}
        </div>
      </div>

      <div className="card-score">
        <span className="score-value">{score}</span>
        <span className="score-label">{method === "bm25" ? "BM25" : "TF-IDF"}</span>
      </div>
    </div>
  );
}

// ── Main App ────────────────────────────────────────────────────
function App() {
  const [query, setQuery] = useState("");
  const [method, setMethod] = useState("bm25");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [selectedProtein, setSelectedProtein] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [pdbStructures, setPdbStructures] = useState([]);
  const [selectedPdbId, setSelectedPdbId] = useState(null);
  const [activeId, setActiveId] = useState(null);

  const detailRef = useRef(null);

  // Scroll to detail when it opens
  useEffect(() => {
    if (selectedProtein && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedProtein]);

  // ── Search ─────────────────────────────────────────────────
  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      setLoading(true);
      setSelectedProtein(null);
      setActiveId(null);
      setSearched(true);
      const data = await searchProteins(query, method, 10);
      setResults(data.results);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // ── Protein Details ─────────────────────────────────────────
  const handleProteinClick = async (protein) => {
    try {
      setDetailsLoading(true);
      setSelectedPdbId(null);
      setActiveId(protein.protein_id);

      const [proteinData, structureData] = await Promise.all([
        getProtein(protein.protein_id),
        getProteinStructures(protein.protein_id),
      ]);

      setSelectedProtein(proteinData);
      const structures = structureData.pdb_structures || [];
      setPdbStructures(structures);
      if (structures.length > 0) setSelectedPdbId(structures[0]);
    } catch (err) {
      console.error("Failed to load protein:", err);
      setPdbStructures([]);
    } finally {
      setDetailsLoading(false);
    }
  };

  // ── Close detail ────────────────────────────────────────────
  const handleCloseDetail = () => {
    setSelectedProtein(null);
    setActiveId(null);
    setSelectedPdbId(null);
    setPdbStructures([]);
  };

  // ── GO IDs helper ────────────────────────────────────────────
  const renderGoIds = (goIds) => {
    if (!goIds) return <span className="detail-text">—</span>;
    const ids = typeof goIds === "string"
      ? goIds.split(/[;,\s]+/).filter(Boolean)
      : [String(goIds)];
    return (
      <div className="go-ids-wrap">
        {ids.map((id) => (
          <span key={id} className="go-id-pill">{id.trim()}</span>
        ))}
      </div>
    );
  };

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="header">
        <div className="header-logo">
          <div className="header-logo-icon">P</div>
          <h1>ProtiSearch</h1>
        </div>
        <span className="header-tagline">Protein Function Information Retrieval</span>
      </header>

      <main className="main">
        {/* ── Search ── */}
        <section className="search-section">
          <div className="search-container">
            <div className="search-input-wrapper">
              <span className="search-icon"><IconSearch /></span>
              <input
                id="search-input"
                type="text"
                placeholder="Search proteins, genes, functions, biological processes…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                autoComplete="off"
              />
            </div>

            <select
              id="search-method"
              className="search-method-select"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              <option value="bm25">BM25</option>
              <option value="tfidf">TF-IDF</option>
            </select>

            <button
              id="search-btn"
              className="search-btn"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? (
                <><div className="btn-spinner" />Searching</>
              ) : (
                <><IconSearch />Search</>
              )}
            </button>
          </div>
        </section>

        {/* ── Results ── */}
        {loading && (
          <div className="results-grid">
            {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🔬</div>
            <h3>No proteins found</h3>
            <p>Try a different protein name, gene symbol, function keyword, or biological process.</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <div className="results-meta">
              <strong>{results.length} results</strong> for "{query}" &middot; {method === "bm25" ? "BM25" : "TF-IDF"} ranking
            </div>
            <div className="results-grid">
              {results.map((protein, index) => (
                <ProteinCard
                  key={protein.protein_id}
                  protein={protein}
                  index={index}
                  method={method}
                  isActive={activeId === protein.protein_id}
                  onClick={() => handleProteinClick(protein)}
                />
              ))}
            </div>
          </>
        )}

        {/* ── Detail Panel ── */}
        {detailsLoading && (
          <div className="detail-panel" ref={detailRef}>
            <div className="detail-loading">
              <div className="detail-loading-spinner" />
              Loading protein details…
            </div>
          </div>
        )}

        {selectedProtein && !detailsLoading && (
          <div id="protein-details" className="detail-panel" ref={detailRef}>
            <div className="detail-header">
              <div className="detail-header-info">
                <div className="detail-protein-id">{selectedProtein.protein_id}</div>
                <div className="detail-title">{selectedProtein.protein_name}</div>
              </div>
              <button
                className="detail-close"
                onClick={handleCloseDetail}
                title="Close details"
                aria-label="Close protein details"
              >
                ✕
              </button>
            </div>

            <div className="detail-body">
              {/* Metadata grid */}
              <div className="detail-meta-grid">
                <div className="detail-meta-item">
                  <div className="detail-meta-key">Gene</div>
                  <div className="detail-meta-value mono">{selectedProtein.gene || "—"}</div>
                </div>
                <div className="detail-meta-item">
                  <div className="detail-meta-key">Organism</div>
                  <div className="detail-meta-value">{selectedProtein.organism || "—"}</div>
                </div>
                <div className="detail-meta-item">
                  <div className="detail-meta-key">Length</div>
                  <div className="detail-meta-value mono">{selectedProtein.length ? `${selectedProtein.length} aa` : "—"}</div>
                </div>
                <div className="detail-meta-item">
                  <div className="detail-meta-key">Subcellular Location</div>
                  <div className="detail-meta-value">{selectedProtein.subcellular_location || "—"}</div>
                </div>
              </div>

              {/* Function */}
              <div className="detail-section">
                <div className="detail-section-title">Function</div>
                <p className="detail-text">{selectedProtein.function || "No function annotation available."}</p>
              </div>

              {/* GO IDs */}
              <div className="detail-section">
                <div className="detail-section-title">Gene Ontology IDs</div>
                {renderGoIds(selectedProtein.go_ids)}
              </div>

              {/* PDB Structures */}
              <div className="detail-section">
                <div className="detail-section-title">Available 3D Structures</div>
                {pdbStructures.length === 0 ? (
                  <p className="detail-text">No PDB structures available for this protein.</p>
                ) : (
                  <div className="pdb-list">
                    {pdbStructures.map((pdbId) => (
                      <button
                        key={pdbId}
                        className={`pdb-btn${selectedPdbId === pdbId ? " active" : ""}`}
                        onClick={() => setSelectedPdbId(pdbId)}
                      >
                        {pdbId}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── 3D Structure Viewer ── */}
        {(selectedPdbId || (selectedProtein && !detailsLoading)) && (
          <div className="structure-section">
            <div className="structure-header">
              <div className="structure-title">
                <IconAtom />
                3D Protein Structure
                {selectedPdbId && (
                  <span className="structure-pdb-badge">{selectedPdbId}</span>
                )}
              </div>
            </div>

            {selectedPdbId ? (
              <ProteinViewer pdbId={selectedPdbId} />
            ) : (
              <div className="structure-placeholder">
                <p>Select a PDB structure above to visualise the 3D protein model.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;