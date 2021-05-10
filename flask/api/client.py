from flask import Blueprint, request, jsonify,json
from .database import mysql



app_client = Blueprint('app_client', __name__)


@app_client.route('/api/client', methods=['GET', 'POST', 'PUT', 'DELETE'])
def client():
 

    connector = mysql.connection
    cur = connector.cursor()
    response = []

    # API will return all the elements
    if request.method == 'GET':
        # prepare the sql statement (which contains arguments in order to
        # avoid sql injection)
        sql_procedure = """
            SELECT ID_CLIENT, NOM_CLIENT, PRENOM_CLIENT, SOCIETE_CLIENT,
                ADRESSE_CLIENT, CAST(TELEPHONE_CLIENT AS CHAR)
            FROM clients
            ORDER BY NOM_CLIENT, PRENOM_CLIENT, SOCIETE_CLIENT, ID_CLIENT asc
            """

        # execute the statement
        cur.execute(sql_procedure)

        # fetch the result
        results = cur.fetchall()

        # turn the result into a list of dictionnaries
        for row in results:
            response.append({
                'id': row[0],
                'attribute1': f"{row[1]} {row[2]}, {row[3]}",
                'attribute2': row[4],
                'date': row[5]
            })

    elif request.method == 'DELETE':
        # get the id of the projects that has to be deleted
        id_to_delete = (int(request.args.get('id')), )

        # prepare the sql statement (which contains arguments in order
        # to avoid sql injection)
        sql_statement_1 = """
            DELETE FROM clients
            WHERE ID_CLIENT = %s
        """

        # execute the statement along with its arguments
        cur.execute(sql_statement_1, id_to_delete)

        # commit the changes to the database
        connector.commit()

        response = cur.fetchall()

    elif request.method == 'POST':
    
        requete = request.json
        post_client(requete)



    elif request.method == 'PUT':
        
        requete = request.json
        put_client(requete)


    return json.dumps(response)


def post_client(requete):

    nom = requete["name"]
    prenom = requete["firstname"]
    societe = requete["societe"]
    titre = requete["titre"]
    langue =  requete["langue"]
    adress = requete["adress"] 
    tva = requete["tva"]
    number = requete["number"]
    email = requete["email"] 


    # Creating a connection cursor
    cursor = mysql.connection.cursor()

    # Executing SQL Statements

    cursor.execute(
        '''INSERT INTO clients (NOM_CLIENT,PRENOM_CLIENT,TITRE_CLIENT,SOCIETE_CLIENT,LANGUE_CLIENT,ADRESSE_CLIENT,NUMERO_TVA_CLIENT ,TELEPHONE_CLIENT ,EMAIL_CLIENT  )
        VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s) ''',

        (nom, prenom, titre, societe, langue, adress, tva, number, email)
    )

    # Saving the Actions performed on the DB
    mysql.connection.commit()

    # Closing the cursor
    cursor.close()

    return jsonify(msg='Le client à étét ajouté avec succès')      

        

def put_client(requete):
    print("methode PUT")
    print(requete)

        
    id = str(requete["id"])
    nom = str(requete["name"])
    prenom = str(requete["firstname"])
    societe = str(requete["societe"])
    titre = str(requete["titre"])
    langue =  str(requete["langue"])
    adress = str(requete["adress"] )
    tva = str(requete["tva"])
    number = str(requete["number"])
    email = str(requete["email"])

        # Creating a connection cursor
    cursor = mysql.connection.cursor()
 
    # Executing SQL Statements

    cursor.execute(
        "UPDATE clients SET NOM_CLIENT='" + nom + "',PRENOM_CLIENT='" + prenom + "',TITRE_CLIENT = '" + titre + "',SOCIETE_CLIENT= '" + societe + "',LANGUE_CLIENT= '" + langue + "',ADRESSE_CLIENT= '" + adress + "',NUMERO_TVA_CLIENT= '" + tva  + "',TELEPHONE_CLIENT= '" + number + "',EMAIL_CLIENT= '" + email + "'WHERE ID_CLIENT='" + id + "' " 
    
    )

    # Saving the Actions performed on the DB
    mysql.connection.commit()

    # Closing the cursor
    cursor.close()

    return jsonify(msg='Le client à été modifier avec succès')


@app_client.route("/api/client/<id>", methods=['GET'])
def client_id(id):
    cursor = mysql.connection.cursor()

    cursor.execute("SELECT * FROM clients where ID_CLIENT = %s", (id))
    data = cursor.fetchall()

    return json.dumps(data)

