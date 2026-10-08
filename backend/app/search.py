import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from rank_bm25 import BM25Okapi


class ProteinSearchEngine:

    def __init__(self, data_path: str):

        print("Loading protein dataset...")

        # Load processed dataset
        self.df = pd.read_csv(data_path)

        # Replace missing values
        self.df = self.df.fillna("")

        print(f"Loaded {len(self.df)} proteins")

        # =========================================================
        # TF-IDF INDEX
        # =========================================================

        # Create TF-IDF vectorizer
        self.vectorizer = TfidfVectorizer(
            lowercase=True,
            stop_words="english"
        )

        print("Building TF-IDF index...")

        # Convert protein search text into TF-IDF vectors
        self.tfidf_matrix = self.vectorizer.fit_transform(
            self.df["search_text"]
        )

        print(
            f"TF-IDF vocabulary size: "
            f"{len(self.vectorizer.vocabulary_)}"
        )

        print("TF-IDF index ready!")

        # =========================================================
        # BM25 INDEX
        # =========================================================

        print("Building BM25 index...")

        # Convert each protein's search text into tokens
        self.tokenized_corpus = (
            self.df["search_text"]
            .apply(lambda text: text.split())
            .tolist()
        )

        # Build BM25 index
        self.bm25 = BM25Okapi(
            self.tokenized_corpus
        )

        print("BM25 index ready!")

    # =============================================================
    # TF-IDF SEARCH
    # =============================================================

    def search(self, query: str, top_k: int = 10):

        # Convert user query into TF-IDF vector
        query_vector = self.vectorizer.transform([query])

        # Calculate cosine similarity
        similarity_scores = cosine_similarity(
            query_vector,
            self.tfidf_matrix
        ).flatten()

        # Get indexes sorted by highest similarity
        ranked_indexes = similarity_scores.argsort()[::-1]

        # Keep only top K results
        ranked_indexes = ranked_indexes[:top_k]

        results = []

        for index in ranked_indexes:

            score = similarity_scores[index]

            # Ignore results with zero similarity
            if score <= 0:
                continue

            protein = self.df.iloc[index]

            results.append({
                "protein_id": protein["Entry"],
                "protein_name": protein["Protein names"],
                "gene": protein["Gene Names"],
                "organism": protein["Organism"],
                "score": round(float(score), 4)
            })

        return results


        # =============================================================
    # BM25 SEARCH
    # =============================================================

    def search_bm25(self, query: str, top_k: int = 10):

        # Convert query into tokens
        query_tokens = query.lower().split()

        # Calculate BM25 scores
        bm25_scores = self.bm25.get_scores(
            query_tokens
        )

        # Get indexes sorted by highest BM25 score
        ranked_indexes = bm25_scores.argsort()[::-1]

        # Keep only top K results
        ranked_indexes = ranked_indexes[:top_k]

        results = []

        for index in ranked_indexes:

            score = bm25_scores[index]

            # Ignore zero-score results
            if score <= 0:
                continue

            protein = self.df.iloc[index]

            results.append({
                "protein_id": protein["Entry"],
                "protein_name": protein["Protein names"],
                "gene": protein["Gene Names"],
                "organism": protein["Organism"],
                "score": round(float(score), 4)
            })

        return results
    
        # =============================================================
    # UNIFIED SEARCH
    # =============================================================

    def search_with_method(
        self,
        query: str,
        top_k: int = 10,
        method: str = "tfidf"
    ):

        if method.lower() == "tfidf":

            return self.search(
                query,
                top_k
            )

        elif method.lower() == "bm25":

            return self.search_bm25(
                query,
                top_k
            )

        else:

            raise ValueError(
                "Invalid search method. "
                "Use 'tfidf' or 'bm25'."
            )