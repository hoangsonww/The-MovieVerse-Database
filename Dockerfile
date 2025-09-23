FROM python:3.8 AS release
WORKDIR /app

# ---- Public assets (no Node build needed) ----
RUN mkdir -p /app/public
COPY MovieVerse-Frontend/html /app/public/html
COPY MovieVerse-Frontend/css /app/public/css
COPY MovieVerse-Frontend/js /app/public/js
COPY images /app/public/images
COPY fonts /app/public/fonts
COPY index.html /app/public/
COPY index.js /app/public/
COPY 404.html /app/public/
COPY manifest.json /app/public/

# ---- Python dependencies ----
COPY MovieVerse-Backend/requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# ---- Backend code ----
COPY MovieVerse-Backend /app

# ---- Runtime ----
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PATH="/app:${PATH}"

EXPOSE 8080
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--workers", "3", "--threads", "3", "TheMovieVerseApp.wsgi:application"]
