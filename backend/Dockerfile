# Use an official Python image
FROM python:3.11-slim

# Install build tools required for packages like wordcloud (gcc, python headers)
RUN apt-get update && apt-get install -y build-essential python3-dev && rm -rf /var/lib/apt/lists/*

# Set working directory inside the container
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your app code
COPY . .

EXPOSE 8000

# Run the app with debug mode
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]