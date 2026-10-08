import pandas as pd

input_file = "data/proteins.tsv"
output_file = "data/proteins.csv"

df = pd.read_csv(input_file, sep="\t")

df.to_csv(output_file, index=False)

print(f"Downloaded records: {len(df)}")
print(f"Saved to: {output_file}")
print(df.head())