# Use Python 3.11 slim image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONPATH=/app

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    libpq-dev \
    libffi-dev \
    libssl-dev \
    curl \
    tesseract-ocr \
    tesseract-ocr-ara \
    tesseract-ocr-eng \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Create necessary directories
RUN mkdir -p models_cache uploads logs

# Download AI models (optional, can be done at runtime)
RUN python -c "from transformers import AutoTokenizer, AutoModel; \
    AutoTokenizer.from_pretrained('ProsusAI/finbert'); \
    AutoModel.from_pretrained('ProsusAI/finbert')"

# Create non-root user
RUN useradd --create-home --shell /bin/bash finclick && \
    chown -R finclick:finclick /app
USER finclick

# Expose port
EXPOSE 9000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:9000/health')" || exit 1

# Run the AI engine
CMD ["python", "ai_engine_server.py"]
