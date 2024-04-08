setup:
	python3 -m venv venv
	. venv/bin/activate; pip install -r requirements.txt

run:
	python3 main.py

test:
	python3 -m unittest discover -s tests

docker-build:
	docker build -t ai-classifier .

docker-run:
	docker run -p 5000:80 ai-classifier
