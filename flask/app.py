from flask import Flask, render_template, jsonify, request, redirect, url_for, \
    session, request, Response
from api import blueprints, database
from os import environ
import json
import time


def create_app():
    app = Flask(__name__)
    # CORS(app)

    app.secret_key = environ.get('SECRET_KEY')
    app.config['MYSQL_USER'] = environ.get('DB_USER')
    app.config['MYSQL_PASSWORD'] = environ.get('DB_PASSWORD')
    app.config['MYSQL_DB'] = environ.get('DB')
    app.config['MYSQL_HOST'] = environ.get('DB_HOST')

    for blueprint in blueprints:
        app.register_blueprint(blueprint)

    return app


app = create_app()
database.mysql.init_app(app)


# if __name__ == '__main__':
#     app.run(debug=True)
