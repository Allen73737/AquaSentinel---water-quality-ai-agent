"""
AquaSentinel Flask Server Entrypoint.
"""

from flask import Flask
from flask_cors import CORS
from api.routes import api_bp

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
    app.register_blueprint(api_bp)

    @app.route('/')
    def root():
        return {
            "name": "AquaSentinel Environmental Intelligence API",
            "version": "2.4.0",
            "status": "OPERATIONAL",
            "river": "Periyar River, Kerala, India",
            "documentation": "/api/v1/status"
        }

    return app


if __name__ == '__main__':
    app = create_app()
    print("--------------------------------------------------")
    print(" Launching AquaSentinel Core API Server on port 5000...")
    print(" Monitoring River: Periyar (Bhoothathankettu to Kochi)")
    print("--------------------------------------------------")
    app.run(host='0.0.0.0', port=5000, debug=True)
