from flask import Flask

from config import FLASK_SECRET_KEY
from routes.cover_letter_api import cover_letter_bp
from routes.export_api import export_bp
from routes.pages import pages_bp
from routes.resume_generator_api import resume_generator_bp


def create_app() -> Flask:
    app = Flask(__name__)
    app.secret_key = FLASK_SECRET_KEY

    app.register_blueprint(pages_bp)
    app.register_blueprint(resume_generator_bp)
    app.register_blueprint(cover_letter_bp)
    app.register_blueprint(export_bp)

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=3000)
