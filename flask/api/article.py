from flask import Blueprint, request, json, jsonify
from .database import connect


app_article = Blueprint('app_article', __name__)


@app_article.route('/api/articles', methods=['GET', 'POST'])
def articles():
    connector = connect()
    cur = connector.cursor()

    # API will return all the elements
    if request.method == 'GET':
        return json.dumps(get_articles(cur))
    # API fires when the user wants to POST a project
    elif request.method == 'POST':
        return json.dumps(create_article(cur, request.json))


@app_article.route('/api/articles/<id>', methods=['PUT', 'DELETE'])
def articles(art_id):
    connector = connect()
    cur = connector.cursor()

    # API fires when the user wants to delete a project
    if request.method == 'DELETE':
        return json.dumps(delete_article(cur, art_id))
    elif request.method == 'PUT':
        pass


@app_article.route("/api/articles/all", methods=['GET'])
def articles_all():
    conn = connect()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT ID_ARTICLE, LIBELLE_FR, LIBELLE_NL, CATEGORIE, PRIX_1, PRIX_2, PRIX_3
        FROM articles
    """)
    data = cursor.fetchall()

    return jsonify(data)


def get_articles(cursor):
    response = []
    # prepare the sql statement (which contains arguments in order to
    # avoid sql injection)
    sql_procedure = """
        SELECT ID_ARTICLE, LABEL_FR, LABEL_NL, CATEGORY, LAST_MODIFIED, CREATION_DATE
        FROM articles
        ORDER BY LABEL_FR, ID_ARTICLE asc
    """

    # execute the statement
    cursor.execute(sql_procedure)
    # fetch the result
    results = cursor.fetchall()

    # turn the result into a list of dictionnaries
    for row in results:
        response.append({
            'id': row[0],
            'label_fr': row[1],
            'label_nl': row[2],
            'category': row[3],
            'last_modified': row[4],
            'creation_date': row[5]
        })

    return response


def delete_article(connector, art_id):
    cur = connector.cursor()
    # prepare the sql statement (which contains arguments in order
    # to avoid sql injection)
    sql_statement = """
        DELETE FROM articles
        WHERE ID_ARTICLE = %s
    """

    # execute the statement along with its arguments
    cur.execute(sql_statement, art_id)
    # commit the changes to the database
    connector.commit()

    return cur.fetchall()


def create_article(connector, data):
    label_fr = data["label_fr"]
    label_nl = data["label_nl"]
    label_en = data["label_en"]
    category = data["category"]
    price_1 = data["price_1"]
    price_2 = data["price_2"]
    price_3 = data["price_3"]

    # Creating a connection cursor
    cursor = connector.cursor()
    # Executing SQL Statements
    cursor.execute(
        """
        INSERT INTO articles (LABEL_FR, LABEL_NL, LABEL_EN, CATEGORY, PRICE_1, PRICE_2, PRICE_3)
        VALUES (%s, %s, %s, %s, %s, %s)
        """,
        (label_fr, label_nl, label_en, category, price_1, price_2, price_3)
    )

    # Saving the Actions performed on the DB
    connector.commit()

    return cursor.fetchall()
