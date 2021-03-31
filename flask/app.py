from flask import Flask, render_template, jsonify, request, redirect, url_for, session
from flask_mysqldb import MySQL
import json
import time

app = Flask(__name__)
# CORS(app)

app.secret_key = 'your secret key'

app.config['MYSQL_HOST'] = '127.0.0.1'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'projet-dev'
mysql = MySQL(app)


@app.route('/')
def index():
    cur = mysql.connection.cursor()
        
    """
     cur.execute('''create table user (id MEDIUMINT NOT NULL AUTO_INCREMENT,nom 	varchar(12) NULL, prenom varchar(12) NULL, PRIMARY KEY(id) );''')

     cur.execute('''create table hello (id INTEGER,nom varchar(12), prenom varchar(12), PRIMARY KEY(id) );''')
    cur.execute('''INSERT INTO client VALUES (3,'Danlee', 'Maxime');''')
    cur.execute('''SELECT * from user''')
    results = cur.fetchall()
    print(results)

    for user in results:
        list_user = {
            'ID': user[0],
            'Nom': user[1],
            'Prenom': user[2],
        }
    """
    return "Connecté à la base de données"
    

@app.route('/create_client_table')
def create_client_table():
    cur.execute('''CREATE  TABLE client (
        client_ID INT NOT NULL AUTO_INCREMENT ,
        client_NAME VARCHAR(45) NOT NULL , 
        client_SURNAME VARCHAR(45) NOT NULL ,
        client_TITLE CHAR(3) NOT NULL ,
        client_COMPANY VARCHAR(45) NOT NULL ,
        client_ADRESS VARCHAR(150) NULL ,
        client_TVA VARCHAR(45) NULL ,
        client_LANGUAGE VARCHAR(3) NOT NULL ,
        client_NAMEARCHITECTE VARCHAR(45) NULL ,
        client_NUMBER VARCHAR(45) NULL ,
        client_COMMENT VARCHAR(45) NULL ,
        PRIMARY KEY (client_ID) );''')
    return "table client créée"


@app.route('/hello')
def hello():
    return {'result': "HELLO"}

@app.route('/api/test', methods=['POST'])
def post():
    print('hello')
    record = json.loads(request.data)
    prenom = record['firstName']
    nom = record['name']

 
    return record


@app.route('/api/time')
def get_current_time():
    return {'time': time.time()}

"""
@app.route('/api/client/enregistrement', methods=['POST'])
def post():
    print('hello')
    record = json.loads(request.data)
    return record
"""

if __name__ == '__main__':
    app.run(debug=True) 
