FROM python:3.10-slim 

# Install dependencies
RUN pip install --no-cache-dir pandas numpy scikit-learn==1.3.0 flask

# Set working directory
WORKDIR /app

# Copy necessary files
COPY sentiment_analysis.py /app
COPY model.pkl /app
COPY vectorizer.pkl /app
COPY predict1.py /app

# Expose port 5000 (if running Flask)
EXPOSE 5000

# Run prediction script
CMD ["python", "predict1.py"]
