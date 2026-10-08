from app.search import ProteinSearchEngine


# Create search engine
engine = ProteinSearchEngine(
    "data/proteins_processed.csv"
)


query = "DNA repair"


# =========================================================
# TF-IDF
# =========================================================

print("\n" + "=" * 70)
print("TF-IDF SEARCH")
print("=" * 70)

tfidf_results = engine.search_with_method(
    query,
    top_k=5,
    method="tfidf"
)

for i, result in enumerate(tfidf_results, start=1):

    print(f"\n{i}. {result['protein_name']}")
    print(f"   Protein ID : {result['protein_id']}")
    print(f"   Gene       : {result['gene']}")
    print(f"   Score      : {result['score']}")


# =========================================================
# BM25
# =========================================================

print("\n" + "=" * 70)
print("BM25 SEARCH")
print("=" * 70)

bm25_results = engine.search_with_method(
    query,
    top_k=5,
    method="bm25"
)

for i, result in enumerate(bm25_results, start=1):

    print(f"\n{i}. {result['protein_name']}")
    print(f"   Protein ID : {result['protein_id']}")
    print(f"   Gene       : {result['gene']}")
    print(f"   Score      : {result['score']}")