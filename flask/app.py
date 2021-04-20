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




    

    

@app.route("/api/client", methods=['GET','POST'])
def clients():

    if request.method == 'GET':

        cursor = mysql.connection.cursor()

        cursor.execute("SELECT * FROM client_table")
        data = cursor.fetchall()
        print(data)
        
        tableau_client = {}
        for i in data:
            tableau_client[i[0]] = [i[1:]]
        print(tableau_client)

        return jsonify(tableau_client)

    elif request.method == 'POST':
        
        requete = request.json
        print(requete)
        nom =  requete['name']
        prenom = requete['firstname']
        titre = requete["titre"]
        societe = requete["societe"]
        langue = requete["langue"]
        adress = requete['adress']
        tva = requete['tva']
        number = requete['number']
        email = requete['email']

        #Creating a connection cursor
        cursor = mysql.connection.cursor()
        #Executing SQL Statements
   
        cursor.execute(''' INSERT INTO client_table (client_NAME,client_SURNAME,client_TITLE,client_COMPANY,client_LANGUAGE,client_ADRESS,client_TVA,client_NUMBER,client_MAIL)
        VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s) ''',(nom,prenom,titre,societe,langue,adress,tva,number,email))
   
    
        #Saving the Actions performed on the DB
        mysql.connection.commit()
        
        #Closing the cursor
        cursor.close()


     
        return jsonify(msg='Le client à étét ajouté avec succès') 

    

@app.route("/api/client", methods=['GET'])
def clients_id():

    
        cursor = mysql.connection.cursor()

        cursor.execute("SELECT * FROM client_table WHERE client_ID = %s ",(id,))
        data = cursor.fetchall()
        print(data)
        
        tableau_client = {}
        for i in data:
            tableau_client[i[0]] = [i[1:]]
        print(tableau_client)

        return jsonify(tableau_client)
   
    #return render_template('client.html', data=data)

@app.route("/api/client/<int:id>", methods=['DELETE'])
def delete_clients_id():
    cursor = mysql.connection.cursor()
    cursor.execute("DELETE client_table WHERE client_ID = %s ",(id,))
    client = cursor.fetchone()
    return render_template("client.html",client=client)


@app.route('/api/time')
def get_current_time():
    return {'time': time.time()}


    
    

if __name__ == '__main__':
    app.run(debug=True) 
