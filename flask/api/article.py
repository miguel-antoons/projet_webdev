from flask import Blueprint, request, json
from .database import mysql


app_article = Blueprint('app_article', __name__)


@app_article.route('/api/articles', methods=['GET', 'POST', 'PUT', 'DELETE'])
def articles():
    connector = mysql.connection
    cur = connector.cursor()
    response = []

    # API will return all the elements
    if request.method == 'GET':
        response = get_all_articles(cur)

    # API fires when the user wants to delete a project
    elif request.method == 'DELETE':
        response = delete_article(cur, int(request.args.get('id')))

    # API fires when the user wants to POST a project
    elif request.method == 'POST':
        response = create_article(cur, request.json)

    elif request.method == 'PUT':
        response = update_article(cur, request.json)

    connector.commit()
    cur.close()

    return json.dumps(response)


def create_article(cursor, data):
    arguments = (
        data["code"],
        data["LibelleFR"],
        data["libelleFrPluriel"],
        data["LibelleNDL"],
        data["libelleNlPluriel"],
        data["prix1"],
        data["prix2"],
        data["prix3"],
        data["presentation"],
    )

    # Executing SQL Statements
    cursor.execute(
        '''
        INSERT INTO articles (
            CODE_RACCOURCI, LIBELLE_FR, LIBELLE_FR_PLURAL, LIBELLE_NL,
            LIBELLE_NL_PLURAL, PRIX_1, PRIX_2, PRIX_3, PRESENTATION_DEVIS
        )
        VALUES(%s ,%s ,%s ,%s ,%s ,%s, %s, %s, %s)
        ''',
        arguments
    )

    # get the id of the newly created row
    sql_procedure = """
        SELECT LAST_INSERT_ID();
    """

    cursor.execute(sql_procedure)
    mysql_result = cursor.fetchall()

    # set the response to the id of the newly created row
    response = {
        'projectID': mysql_result[0][0]
    }

    return response


def get_all_articles(cursor):
    response = []

    # prepare the sql statement (which contains arguments in order to
    # avoid sql injection)
    sql_procedure = """
        SELECT ID_ARTICLE, LIBELLE_FR, LIBELLE_NL, CODE_RACCOURCI
        FROM articles
        ORDER BY LIBELLE_FR, ID_ARTICLE asc"""

    # execute the statement
    cursor.execute(sql_procedure)

    # fetch the result
    results = cursor.fetchall()

    # turn the result into a list of dictionnaries
    for row in results:
        response.append({
            'id': row[0],
            'attribute1': row[1],
            'attribute2': row[2],
            'date': row[3]
        })

    return response


def delete_article(cursor, id):
    arguments = (id, )

    # prepare the sql statement (which contains arguments in order
    # to avoid sql injection)
    sql_statement = """
        DELETE FROM articles
        WHERE ID_ARTICLE = %s
    """

    # execute the statement along with its arguments
    cursor.execute(sql_statement, arguments)

    return cursor.fetchall()


def update_article(cursor, data):
    arguments = (
        data["code"],
        data["LibelleFR"],
        data["libelleFrPluriel"],
        data["LibelleNDL"],
        data["libelleNlPluriel"],
        data["prix1"],
        data["prix2"],
        data["prix3"],
        data["presentation"],
        data["articleID"],
    )

    sql_statement = """
        UPDATE articles
        SET
            CODE_RACCOURCI = %s,
            LIBELLE_FR = %s,
            LIBELLE_FR_PLURAL = %s,
            LIBELLE_NL = %s,
            LIBELLE_NL_PLURAL = %s,
            PRIX_1 = %s,
            PRIX_2 = %s,
            PRIX_3 = %s,
            PRESENTATION_DEVIS = %s
        WHERE
            ID_ARTICLE = %s
    """

    cursor.execute(sql_statement, arguments)

    sql_statement = """
        SELECT ID_ARTICLE
        FROM articles
        WHERE
            CODE_RACCOURCI = %s
            and LIBELLE_FR = %s
            and LIBELLE_FR_PLURAL = %s
            and LIBELLE_NL = %s
            and LIBELLE_NL_PLURAL = %s
            and PRIX_1 = %s
            and PRIX_2 = %s
            and PRIX_3 = %s
            and PRESENTATION_DEVIS = %s
            and ID_ARTICLE = %s
    """

    cursor.execute(sql_statement, arguments)

    mysql_result = cursor.fetchall()

    # set the response to the id of the newly created row
    if len(mysql_result):
        response = {
            'projectID': mysql_result[0][0]
        }

        return response

    return 0


@app_article.route("/api/article/<id>", methods=['GET'])
def articles_all(id):
    cursor = mysql.connection.cursor()
    arguments = (id, )

    sql_statement = """
        SELECT
            CODE_RACCOURCI,
            LIBELLE_FR,
            LIBELLE_FR_PLURAL,
            LIBELLE_NL,
            LIBELLE_NL_PLURAL,
            PRIX_1,
            PRIX_2,
            PRIX_3,
            PRESENTATION_DEVIS
        FROM articles
        WHERE
            ID_ARTICLE = %s
    """

    cursor.execute(sql_statement, arguments)

    return json.dumps(cursor.fetchall())
