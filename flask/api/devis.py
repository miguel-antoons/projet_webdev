from flask import Blueprint, request, json, jsonify
from .database import mysql


app_devis = Blueprint('app_devis', __name__)


# API serves for all devis
@app_devis.route('/api/devis', methods=['GET', 'POST', 'PUT', 'DELETE'])
def devis():
    connector = mysql.connection
    cur = connector.cursor()
    response = []

    # API will return all the projects
    if request.method == 'GET':
        # get the filter to apply to the projects
        filter = request.args.get('filter')
        arguments = ()

        # prepare the sql statement (which contains arguments in order to
        # avoid sql injection)
        sql_procedure = """
            SELECT D.ID_DEVIS, C.NOM_CLIENT, C.PRENOM_CLIENT, C.SOCIETE_CLIENT,
                D.CHANTIER, date_format(D.DATE_DEVIS, '%%D %%M %%Y')
            FROM devis as D
                join clients as C on D.ID_CLIENT = C.ID_CLIENT
            WHERE D.DATE_DEVIS >= str_to_date(%s, %s)
                and extract(year from D.DATE_DEVIS) >= %s
                and extract(year from D.DATE_DEVIS) <= %s
            ORDER BY D.DATE_DEVIS desc"""

        # complete arguments according to the filter
        if len(filter) > 4:
            arguments = (filter, "%a %b %e %Y %H:%i:%s", 1, 999999999, )
        elif len(filter) == 4:
            arguments = ("1999-01-01", "%Y-%m-%d", filter, filter, )
        else:
            arguments = ("1999-01-01", "%Y-%m-%d", 1, 999999999, )

        # execute the statement
        cur.execute(sql_procedure, arguments)

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

    # API fires when the user wants to delete a project
    elif request.method == 'DELETE':
        # get the id of the projects that has to be deleted
        id_to_delete = (int(request.args.get('id')), )

        # prepare the sql statement (which contains arguments in order
        # to avoid sql injection)
        sql_statement = """
            DELETE FROM devis
            WHERE ID_DEVIS = %s
        """

        # execute the statement along with its arguments
        cur.execute(sql_statement, id_to_delete)

        # commit the changes to the database
        connector.commit()

        response = cur.fetchall()

    elif request.method == 'POST':
        # Creating a connection cursor
        cursor = mysql.connection.cursor()
        requete = request.json

        print(requete)

        # Executing SQL Statements

        cursor.execute(
            '''INSERT INTO devis (id_client, date_devis,
            chantier, choix_prix, modification_prix_pourcentage,
            modification_prix_fixe, id_devis_texte)
            VALUES(%s,%s,%s,%s,%s,%s,%s) ''',

            (requete["id_client"], requete["date_devis"],
             requete["chantier"], requete["choix_prix"],
             requete["modification_prix_pourcentage"],
             requete["modification_prix_fixe"],
             requete["id_texte_devis"])
        )

        # Saving the Actions performed on the DB
        mysql.connection.commit()

        # Closing the cursor
        cursor.close()

        return jsonify(msg='Le devis a été ajouté avec succès')

    elif request.method == 'PUT':
        # Creating a connection cursor
        cursor = mysql.connection.cursor()
        requete = request.json

        print(requete)
        # Executing SQL Statements
        cursor.execute(
            '''UPDATE devis
                SET id_client = %s,
                    date_devis = %s,
                    chantier = %s,
                    choix_prix = %s,
                    modification_prix_pourcentage = %s,
                    modification_prix_fixe = %s,
                    id_devis_texte = %s
                where ID_DEVIS = %s
             ''',

            (requete["id_client"], requete["date_devis"],
             requete["chantier"], requete["choix_prix"],
             requete["modification_prix_pourcentage"], requete["modification_prix_fixe"], requete["id_texte_devis"],
             requete["devisId"])
        )

        # Saving the Actions performed on the DB
        mysql.connection.commit()

        # Closing the cursor
        cur.close()
        return jsonify(msg='Le devis a été modifié avec succès')

    return json.dumps(response)


@app_devis.route("/api/devis/get_devis_id/<id>", methods=['GET'])
def devis_id(id):
    cursor = mysql.connection.cursor()
    print(id)
    cursor.execute("SELECT * FROM devis where ID_devis = %s", (id))
    data = cursor.fetchall()

    return jsonify(data)
