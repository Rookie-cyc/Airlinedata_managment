import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

# Load the dataset
file_path = "3Ex3.csv"  # Ensure the file is in the same directory as the script
df = pd.read_csv(file_path)

# Drop non-numeric columns
df_numeric = df.drop(columns=["CUST_ID"])

# Fill missing values with the median
df_numeric.fillna(df_numeric.median(), inplace=True)

# Normalize the data
scaler = StandardScaler()
df_scaled = scaler.fit_transform(df_numeric)

# Apply K-Means clustering
kmeans = KMeans(n_clusters=5, random_state=42, n_init=10)
df_numeric["Cluster"] = kmeans.fit_predict(df_scaled)

# Save the clustered data
df_numeric.to_csv("clustered_output.csv", index=False)
print("Clustering completed. Results saved in 'clustered_output.csv'.")


