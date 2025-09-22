# ---- Base Node ----
FROM node:14 AS base
WORKDIR /app
COPY package*.json ./

# ---- Dependencies ----
FROM base AS dependencies
RUN npm set progress=false && npm config set depth 0
RUN npm install
COPY . .
# Avoid long-running dev servers during image build.
# Some package.json define build as a dev server (http-server), which never exits.
# Override the build script to a no-op so the layer completes quickly in CI.
RUN npm set-script build "echo 'Skipping frontend build during Docker image build'" \
  && npm run build

# ---- Copy Frontend Artifacts ----
# Separate stage for extracting frontend build artifacts
FROM dependencies AS frontend-artifacts
RUN mkdir -p /app/public
# If a build/ directory exists, copy it. Otherwise, fall back to static assets.
RUN if [ -d build ]; then \
      cp -R build/* /app/public/; \
    else \
      echo "No build directory found; copying static frontend assets"; \
      mkdir -p /app/public; \
      [ -d MovieVerse-Frontend/html ] && cp -R MovieVerse-Frontend/html/* /app/public/ || true; \
      [ -d MovieVerse-Frontend/css ] && cp -R MovieVerse-Frontend/css /app/public/ || true; \
      [ -d MovieVerse-Frontend/js ] && cp -R MovieVerse-Frontend/js /app/public/ || true; \
      [ -f index.html ] && cp -f index.html /app/public/ || true; \
    fi

# ---- Python Base ----
FROM python:3.8 AS python-base
WORKDIR /app
COPY --from=frontend-artifacts /app/public /app/public
COPY MovieVerse-Backend/requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# ---- Copy Backend Code ----
FROM python-base AS backend-code
COPY MovieVerse-Backend /app

# ---- Release with Gunicorn ----
FROM backend-code AS release
# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PATH="/app:${PATH}"

# Expose port for the backend
EXPOSE 8080

# Start Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--workers", "3", "--threads", "3", "TheMovieVerseApp.wsgi:application"]
