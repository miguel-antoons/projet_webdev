from flask import Flask, render_template, jsonify, request, redirect, url_for,\
    session, request
from flask_mysqldb import MySQL
from api import article, client, devis, etiquettes, facture, parametrage,\
    rgie, suivi
import json
import time


app = Flask(__name__)
# CORS(app)

app.secret_key = 'your secret key'

# Configuration Miguel
# app.config['MYSQL_USER'] = 'dev_user'
# app.config['MYSQL_PASSWORD'] = 'Dev_User123'
# app.config['MYSQL_DB'] = 'projet_webdev'

app.config['MYSQL_HOST'] = '127.0.0.1'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'projet-dev'
mysql = MySQL(app)


if __name__ == '__main__':
    app.run(debug=True)