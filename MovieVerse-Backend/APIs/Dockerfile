FROM python:3.11-slim

WORKDIR /app
COPY api_test_suite.py /app/api_test_suite.py

RUN pip install --no-cache-dir requests

CMD ["python", "/app/api_test_suite.py"]
