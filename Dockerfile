# Use an official Python runtime as a base image
FROM python:3.9

# Set the working directory inside the container
WORKDIR /app

# Copy necessary files into the container
COPY linear_regression.py predict.py 3Ex1.csv /app/

# Install dependencies
RUN pip install numpy pandas scikit-learn

# Run the model training script
RUN python linear_regression.py

# Define the default command to run predictions
CMD ["python", "predict.py"]