import re
import pandas as pd


def clean_text(text: str) -> str:
    """
    Clean and normalize text for information retrieval.
    """

    # Convert to string
    text = str(text)

    # Convert to lowercase
    text = text.lower()

    # Remove HTML/XML tags
    text = re.sub(r"<[^>]+>", " ", text)

    # Keep letters, numbers, and spaces
    text = re.sub(r"[^a-z0-9\s]", " ", text)

    # Remove extra whitespace
    text = re.sub(r"\s+", " ", text).strip()

    return text


def preprocess_proteins(input_file: str, output_file: str):

    # Load dataset
    df = pd.read_csv(input_file)

    print(f"Loaded {len(df)} protein records")

    # Replace missing values
    df = df.fillna("")

    # Combine important protein information
    df["search_text"] = (
        df["Protein names"].astype(str)
        + " "
        + df["Gene Names"].astype(str)
        + " "
        + df["Function [CC]"].astype(str)
        + " "
        + df["Gene Ontology IDs"].astype(str)
    )

    # Clean the combined text
    df["search_text"] = df["search_text"].apply(clean_text)

    # Save processed dataset
    df.to_csv(output_file, index=False)

    print(f"Processed dataset saved to: {output_file}")

    return df


if __name__ == "__main__":

    input_file = "data/proteins.csv"
    output_file = "data/proteins_processed.csv"

    preprocess_proteins(
        input_file,
        output_file
    )