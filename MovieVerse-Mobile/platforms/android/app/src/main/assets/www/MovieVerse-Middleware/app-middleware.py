from flask import Flask, request, Response
import json
import time

app = Flask(__name__)

# Custom Logger Middleware
class LoggerMiddleware:
    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        request_start = time.time()
        request_method = environ['REQUEST_METHOD']
        request_path = environ['PATH_INFO']

        def custom_start_response(status, headers, exc_info=None):
            request_end = time.time()
            print(f'{request_method} {request_path} - {status} - Time: {request_end - request_start:.5f}s')
            return start_response(status, headers, exc_info)

        return self.app(environ, custom_start_response)

# Apply Logger Middleware
app.wsgi_app = LoggerMiddleware(app.wsgi_app)

# Custom Request Processing Middleware
@app.before_request
def before_request_func():
    print(f"Before Request: {request.method} {request.path}")
    content_length = request.content_length
    if content_length is not None and content_length > 0:
        print(f"Content Length: {content_length}")
        print(f"Content Type: {request.content_type}")
        print(f"Request Body: {request.get_data()}")
    print(f"Request Headers: {request.headers}")
    request.environ['start_time'] = time.time()
    return None

# Custom Response Modification Middleware
@app.after_request
def after_request_func(response):
    print("After Request")
    request_end = time.time()
    print(f"Response Status: {response.status}")
    print(f"Response Headers: {response.headers}")
    print(f"Response Body: {response.get_data()}")
    print(f"Time: {request_end - request.environ['start_time']:.5f}s")
    return response

# Custom Error Handling Middleware
@app.errorhandler(404)
def not_found(error):
    return Response(json.dumps({"message": "Resource not found"}), mimetype='application/json'), 404

# Custom Exception Handling Middleware
@app.errorhandler(Exception)
def handle_exception(e):
    return Response(json.dumps({"message": "Internal server error"}), mimetype='application/json'), 500

# Custom Authentication Middleware
@app.route('/api/movies', methods=['GET', 'POST'])
def handle_movies():
    if request.method == 'POST':
        data = request.get_json()
        # Process POST request data
        return Response(json.dumps({"message": "Movie added successfully"}), mimetype='application/json')
    else:
        # Process GET request
        return Response(json.dumps({"message": "Movies fetched successfully"}), mimetype='application/json')

if __name__ == '__main__':
    app.run(debug=True)
# Path: middleware/app-middleware.py
