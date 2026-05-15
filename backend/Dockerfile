FROM python:3.10-slim

# Install system dependencies for psycopg2 and geoalchemy2
RUN apt-get update && apt-get install -y libpq-dev gcc gdal-bin

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
