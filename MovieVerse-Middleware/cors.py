from flask import Flask, request, jsonify

app = Flask(__name__)

class CorsMiddleware:
    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        def cors_headers(status, headers):
            headers.extend([
                ('Access-Control-Allow-Origin', '*'),
                ('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'),
                ('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
            ])
            return start_response(status, headers)

        if environ['REQUEST_METHOD'] == 'OPTIONS':
            # Handle preflight requests
            return cors_headers('200 OK', [])

        def modified_start_response(status, headers, exc_info=None):
            return cors_headers(status, headers)

        return self.app(environ, modified_start_response)

app.wsgi_app = CorsMiddleware(app.wsgi_app)

@app.route('/api/movies', methods=['GET'])
def get_movies():
    movies = [
        {'title': 'Inception', 'director': 'Christopher Nolan'},
        {'title': 'The Shawshank Redemption', 'director': 'Frank Darabont'}
        # More movies will be appended dynamically by API
    ]
    return jsonify(movies)

if __name__ == '__main__':
    app.run(debug=True)
