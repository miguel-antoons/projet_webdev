@app.route('/api/client', methods=['GET', 'POST', 'PUT', 'DELETE'])
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

        sql_statement_2 = """
            DELETE FROM devis
            WHERE ID_CLIENT = %s
        """

        sql_statement_3 = """
            DELETE FROM factures
            WHERE ID_CLIENT = %s
        """

        sql_statement_4 = """
            DELETE FROM rgie
            WHERE ID_CLIENT = %s
        """

        sql_statement_5 = """
            DELETE FROM etiquettes
            WHERE ID_CLIENT = %s
        """

        # execute the statement along with its arguments
        cur.execute(sql_statement_2, id_to_delete)
        cur.execute(sql_statement_3, id_to_delete)
        cur.execute(sql_statement_4, id_to_delete)
        cur.execute(sql_statement_5, id_to_delete)
        cur.execute(sql_statement_1, id_to_delete)

        # commit the changes to the database
        connector.commit()

        response = cur.fetchall()

    elif request.method == 'POST':
        nom = "Danlee"
        prenom = "Maxime"
        titre = "M."
        societe = "Google"
        langue = "Fr"
        adress = "Av du"
        tva = "BE40"
        number = "047884948"
        email = "jean@gmail.com"

        # Creating a connection cursor
        cursor = mysql.connection.cursor()

        """
        cur.execute('''create CREATE  TABLE test- Projet (
            client_ID INT NOT NULL AUTO_INCREMENT ,
            client_NAME VARCHAR(45) NOT NULL,
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

        # Executing SQL Statements

        cursor.execute('''
            INSERT INTO client (client_NAME,client_SURNAME,client_TITLE,
                client_COMPANY,client_LANGUAGE,client_ADRESS,client_TVA,
                client_NUMBER,client_MAIL)
            VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s) ''',

            (nom, prenom, titre, societe, langue, adress, tva, number, email)
        )

        # Saving the Actions performed on the DB
        mysql.connection.commit()

        # Closing the cursor
        cursor.close()

        return jsonify(msg='Le client à étét ajouté avec succès')

    cur.close()

    return json.dumps(response)
