# ---- Base Node ----
FROM node:14 AS base
WORKDIR /app
COPY package*.json ./

# ---- Dependencies ----
FROM base AS dependencies
RUN npm set progress=false && npm config set depth 0
RUN npm install --only=production
COPY . .
RUN npm run build

# ---- Copy Frontend Artifacts ----
# Separate stage for extracting frontend build artifacts
FROM dependencies AS frontend-artifacts
RUN mkdir -p /app/public
RUN cp -R build/ /app/public/

# ---- Python Base ----
FROM python:3.8 AS python-base
WORKDIR /app
COPY --from=frontend-artifacts /app/public /app/public
COPY backend/requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# ---- Copy Backend Code ----
FROM python-base AS backend-code
COPY backend /app

# ---- Release with Gunicorn ----
FROM backend-code AS release
# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PATH="/app:${PATH}"

# Expose port for the backend
EXPOSE 8080

# Start Gunicorn (adjust the number of workers and threads as necessary)
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--workers", "3", "--threads", "3", "myproject.wsgi:application"]
