from flask import Blueprint, request, json, jsonify
from .database import mysql


app_article = Blueprint('app_article', __name__)


@app_article.route('/api/articles', methods=['GET', 'POST', 'PUT', 'DELETE'])
def articles():
    connector = mysql.connection
    cur = connector.cursor()
    response = []

    # API will return all the elements
    if request.method == 'GET':
        # prepare the sql statement (which contains arguments in order to
        # avoid sql injection)
        sql_procedure = """
            SELECT ID_ARTICLE, LIBELLE_FR, LIBELLE_NL, CATEGORIE
            FROM articles
            ORDER BY LIBELLE_FR, ID_ARTICLE asc"""

        # execute the statement
        cur.execute(sql_procedure)

        # fetch the result
        results = cur.fetchall()

        # turn the result into a list of dictionnaries
        for row in results:
            response.append({
                'id': row[0],
                'attribute1': row[1],
                'attribute2': row[2],
                'date': row[3]
            })

    # API fires when the user wants to delete a project
    elif request.method == 'DELETE':
        # get the id of the projects that has to be deleted
        id_to_delete = (int(request.args.get('id')), )

        # prepare the sql statement (which contains arguments in order
        # to avoid sql injection)
        sql_statement = """
            DELETE FROM articles
            WHERE ID_ARTICLE = %s
        """

        # execute the statement along with its arguments
        cur.execute(sql_statement, id_to_delete)

        # commit the changes to the database
        connector.commit()

        response = cur.fetchall()

    cur.close()

    return json.dumps(response)


@app_article.route("/api/articles/all", methods=['GET'])
def articles_all():
    cursor = mysql.connection.cursor()
    cursor.execute("""SELECT ID_ARTICLE,
    LIBELLE_FR, LIBELLE_NL, CATEGORIE,
    PRIX_1, PRIX_2, PRIX_3
    FROM articles""")
    data = cursor.fetchall()

    return jsonify(data)
