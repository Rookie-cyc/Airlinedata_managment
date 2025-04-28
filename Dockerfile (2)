# Use an official Python runtime as base image
FROM python:3.9

# Set the working directory
WORKDIR /app

# Copy the necessary files
COPY kmeans_clustering.py .
COPY 3Ex3.csv .

# Install required Python packages
RUN pip install pandas scikit-learn

# Command to run the script
CMD ["python", "kmeans_clustering.py"]
