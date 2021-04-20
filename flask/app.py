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

@app.route("/api/clients", methods=['GET'])
def clients():
    cursor = mysql.connection.cursor()

    cursor.execute("SELECT * FROM client")
    data = cursor.fetchall()
    
    tableau_client = {}
    for i in data:
        tableau_client[i[0]] = [i[1:]]
    print(tableau_client)
    return jsonify(tableau_client)



@app.route('/api/clients/<int:id>', methods=['GET'])
def clientsId(id):
    cursor = mysql.connection.cursor()
    print(f"SELECT * FROM client WHERE client_ID = {id}")
    cursor.execute(f"SELECT * FROM client WHERE client_ID = {id}")
    client = cursor.fetchone()

    #Création du dictionnaire
    tableau_client = {}
    tableau_client["id"] = client[0]
    tableau_client["name"] = client[1]
    tableau_client["firstname"] = client[2]
    tableau_client["title"] = client[3]
    tableau_client["company"] = client[4]
    tableau_client["adress"] = client[5]
    tableau_client["tva"] = client[6]
    tableau_client["language"] = client[7]
    tableau_client["artichitecteName"] = client[8]
    tableau_client["number"] = client[9]
    tableau_client["mail"] = client[10]

    return jsonify(tableau_client)


@app.route('/api/clients/ajout', methods=['POST'])
def save_client():

    nom = "Danlee"
    prenom = "Maxime"
    titre = "M."
    societe = "Google"
    langue = "Fr"
    adress = "Av du"
    tva = "BE40"
    number = "047884948"
    email = "jean@gmail.com"
    
    #Creating a connection cursor
    cursor = mysql.connection.cursor()

    """
    cur.execute('''create CREATE  TABLE test- Projet (
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
    
    """

    #Executing SQL Statements
   
    cursor.execute(''' INSERT INTO client (client_NAME,client_SURNAME,client_TITLE,client_COMPANY,client_LANGUAGE,client_ADRESS,client_TVA,client_NUMBER,client_MAIL)
     VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s) ''',(nom,prenom,titre,societe,langue,adress,tva,number,email))
   
    
    #Saving the Actions performed on the DB
    mysql.connection.commit()
    
    #Closing the cursor
    cursor.close()


    return jsonify(msg='Le client à étét ajouté avec succès')


if __name__ == '__main__':
    app.run(debug=True) 
