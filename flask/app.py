from flask import Flask, render_template, jsonify, request, redirect, url_for,\
    session, request
from flask_mysqldb import MySQL
from api import article, client, database, devis, etiquettes, facture,\
    parametrage, rgie, suivi
from os import environ
import json
import time


app = Flask(__name__)
# CORS(app)

app.secret_key = environ.get('SECRET_KEY')
app.config['MYSQL_USER'] = environ.get('DB_USER')
app.config['MYSQL_PASSWORD'] = environ.get('DB_PASSWORD')
app.config['MYSQL_DB'] = environ.get('DB')
app.config['MYSQL_HOST'] = environ.get('DB_HOST')

app.register_blueprint(article.app_article)
app.register_blueprint(client.app_client)
app.register_blueprint(devis.app_devis)
app.register_blueprint(etiquettes.app_etiquette)
app.register_blueprint(facture.app_facture)
app.register_blueprint(parametrage.app_parametrage)
app.register_blueprint(rgie.app_rgie)
app.register_blueprint(suivi.app_suivi)

database.mysql.init_app(app)


if __name__ == '__main__':
    app.run(debug=True)