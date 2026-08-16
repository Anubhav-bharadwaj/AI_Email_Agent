# Use an image that contains both Python and Node.js for a seamless monolith container
FROM nikolaik/python-nodejs:python3.10-nodejs20

# Set working directory
WORKDIR /app

# Copy the entire project into the container
COPY . .

# Install Python backend dependencies
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install python-dotenv

# Install Frontend dependencies
WORKDIR /app/frontend
RUN npm install

# Go back to root
WORKDIR /app

# Expose all three ports so they map perfectly to localhost
EXPOSE 8000 8501 5173

# Run all three services concurrently in the background using a shell command
CMD uvicorn api_server:app --host 0.0.0.0 --port 8000 & \
    streamlit run dashboard.py --server.port 8501 --server.address 0.0.0.0 & \
    cd frontend && npm run dev -- --host 0.0.0.0
