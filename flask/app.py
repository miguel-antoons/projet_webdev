from flask import Flask, render_template, jsonify, request, redirect, url_for, session
from flask_mysqldb import MySQL
import json
import time

app = Flask(__name__)
# CORS(app)

app.secret_key = 'your secret key'

app.config['MYSQL_HOST'] = '127.0.0.1'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Dev-Web1234'
app.config['MYSQL_DB'] = 'projet-dev'
mysql = MySQL(app)




    

    


@app.route('/')
def index():
    cur = mysql.connection.cursor()

    # cur.execute('''create table hello (id INTEGER,nom varchar(12), prenom varchar(12), PRIMARY KEY(id) );''')

    #cur.execute('''INSERT INTO user VALUES (3,'Danlee', 'Maxime');''')

    cur.execute('''SELECT * from user''')
    results = cur.fetchall()
    print(results)

    for user in results:
        list_user = {
            'ID': user[0],
            'Nom': user[1],
            'Prenom': user[2],
        }

    return json.dumps(list_user)


@app.route('/hello')
def hello():
    return {'result': "HELLO"}

@app.route('/api/enregistrement_client', methods=['POST','GET'])
def save_client():

    
    print('hello')
    record = json.loads(request.data)
    print(record)
    nom =  record['name']
    prenom = record['firstName']
    titre = record["titre"]
    societe = record["societe"]
    langue = record["langue"]
    adress = record['adress']
    tva = record['tva']
    number = record['number']
    email = record['email']
    
    print(nom)
    print(prenom)
    print(titre)
    print(societe)
    print(langue)


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
   
    cursor.execute(''' INSERT INTO client_table (client_NAME,client_SURNAME,client_TITLE,client_COMPANY,client_LANGUAGE,client_ADRESS,client_TVA,client_NUMBER,client_MAIL)
     VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s) ''',(nom,prenom,titre,societe,langue,adress,tva,number,email))
   
    
    #Saving the Actions performed on the DB
    mysql.connection.commit()
    
    #Closing the cursor
    cursor.close()


    return record


@app.route('/api/time')
def get_current_time():
    return {'time': time.time()}


if __name__ == '__main__':
    app.run(debug=True) 
