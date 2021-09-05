from flask import Blueprint, request, json
from .database import mysql


app_rgie = Blueprint('app_rgie', __name__)


@app_rgie.route('/api/rgie', methods=['GET', 'POST'])
def rgie():
    connector = mysql.connection
    cur = connector.cursor()
    response = []

    # API will return all the projects
    if request.method == 'GET':
        # complete arguments according to the filter
        # then get all etiquettes and store them into the response variable
        response = get_all_rgie(set_arguments(request.args.get('filter')), cur)

    elif request.method == "POST":
        response = post_rgie(cur, request.json)

    elif request.method == "PUT":
        put_rgie()

    connector.commit()
    cur.close()

    return json.dumps(response)


def get_all_rgie(arguments, cursor):
    response = []

    # prepare the sql statement (which contains arguments in order to
    # avoid sql injection)
    sql_procedure = """
        SELECT R.ID_LISTE_ARTICLE_RGIE, C.NOM_CLIENT, C.PRENOM_CLIENT,
            C.SOCIETE_CLIENT, R.CHANTIER,
            date_format(R.DATE, '%%D %%M %%Y')
        FROM rgie as R
            join clients as C on R.ID_CLIENT = C.ID_CLIENT
        WHERE R.DATE >= str_to_date(%s, %s)
            and extract(year from R.DATE) >= %s
            and extract(year from R.DATE) <= %s
        ORDER BY R.DATE desc"""

    cursor.execute(sql_procedure, arguments)

    # fetch the result
    results = cursor.fetchall()

    # turn the result into a list of dictionnaries
    for row in results:
        response.append({
            'id': row[0],
            'attribute1': f"{row[1]} {row[2]}, {row[3]}",
            'attribute2': row[4],
            'date': row[5]
        })

    return response


def set_arguments(filter):
    # complete arguments according to the filter
    if len(filter) > 4:
        return (filter, "%a %b %e %Y %H:%i:%s", 1, 999999999, )
    elif len(filter) == 4:
        return ("1999-01-01", "%Y-%m-%d", filter, filter, )
    else:
        return ("1999-01-01", "%Y-%m-%d", 1, 999999999, )


def post_rgie(cursor, data):
    custom_articles = []
    normal_articles = []
    all_articles = []

    sql_statement = """
        INSERT INTO rgie (ID_CLIENT, CHANTIER)
        VALUES
            (%(selectedClient)s, %(constructionSite)s)
    """

    cursor.execute(sql_statement, data)

    sql_statement = """
        SELECT LAST_INSERT_ID();
    """

    cursor.execute(sql_statement)
    new_project_id = cursor.fetchall()[0][0]

    for article in data['rgieList']:
        article['rgieID'][-1] = new_project_id

    add_articles_to_rgie(cursor, data['rgieList'])

    return new_project_id


def add_articles_to_rgie(cursor, new_articles):
    custom_articles = []
    normal_articles = []
    all_articles = []

    for article in new_articles:
        if article['custom']:
            custom_articles.append(article)
        else:
            normal_articles.append(article)

    if len(custom_articles):
        all_articles = (
            normal_articles +
            save_custom_articles(cursor, custom_articles))
    else:
        all_articles = normal_articles

    sql_statement = """
        INSERT INTO liste_articles_rgie (
            ID_LISTE_RGIE,
            ID_ARTICLE_RGIE,
            QUANTITE,
            POSITION_LISTE,
            CUSTOM_ARTICLE,
            PRICE_CHOICE)
        VALUES (
            %(rgieID)s,
            %(articleID)s,
            %(quantity)s,
            %(position)s,
            %(custom)s,
            %(price1)s)
    """

    cursor.executemany(sql_statement, all_articles)


def save_custom_articles(cursor, custom_articles):
    sql_statement = """
        INSERT INTO temp_articles_rgie (ID_LISTE_RGIE, LIBELLE, PRIX)
        VALUES
            (%(rgieID)s, %(libelle)s, %(price)s)
    """

    cursor.executemany(sql_statement, custom_articles)

    sql_statement = """
        SELECT ID_TEMP_ARTICLES_RGIE
        FROM temp_articles_rgie
        WHERE
            ID_LISTE_RGIE = %(rgieID)s
        ORDER BY ID_TEMP_ARTICLES_RGIE
    """

    cursor.execute(sql_statement, custom_articles[0])
    results = cursor.fetchall()

    for index, custom_article_id in enumerate(results):
        custom_articles[index]['articleID'] = custom_article_id[0]

    return custom_articles


@app_rgie.route('/api/rgie/<id>', methods=['GET', 'PUT', 'DELETE'])
def rgie_unit(id):
    connector = mysql.connection
    cursor = connector.cursor()
    response = []

    if request.method == 'GET':
        response = get_rgie_unit(cursor, id)

    elif request.method == 'DELETE':
        response = delete_rgie(cursor, id)

    elif request.method == 'PUT':
        print(request.json)
        response = put_rgie(cursor, id, request.json)

    connector.commit()
    cursor.close()

    return json.dumps(response)


def get_rgie_unit(cursor, id):
    rgie_data = {}

    sql_statement = """
        SELECT ID_LISTE_ARTICLE_RGIE, ID_CLIENT, CHANTIER
        FROM rgie
        WHERE ID_LISTE_ARTICLE_RGIE = %s
    """

    cursor.execute(sql_statement, (id, ))
    temp_data = cursor.fetchall()[0]

    rgie_data['rgieID'] = temp_data[0]
    rgie_data['clientID'] = temp_data[1]
    rgie_data['constructSite'] = temp_data[2]
    rgie_data['articles'] = get_articles_rgie_project(cursor, id)

    print(rgie_data)

    return rgie_data


def get_articles_rgie_project(cursor, id):
    article_array = (
        get_temp_articles(cursor, id)
        + get_stored_articles(cursor, id)
    )
    article_array.sort(key=sortPosition)
    return article_array


def get_temp_articles(cursor, id):
    article_array = []

    sql_statement = """
        SELECT
            ID_ARTICLE_RGIE,
            QUANTITE,
            POSITION_LISTE,
            CUSTOM_ARTICLE,
            PRICE_CHOICE,
            tar.LIBELLE,
            tar.PRIX
        FROM
            liste_articles_rgie lar,
            temp_articles_rgie tar
        WHERE
            (
                lar.ID_ARTICLE_RGIE = tar.ID_TEMP_ARTICLES_RGIE
                and CUSTOM_ARTICLE = 1
            )
            and lar.ID_LISTE_RGIE = %s
    """

    cursor.execute(sql_statement, (id, ))
    temp_article_array = cursor.fetchall()
    print(temp_article_array)

    for temp_article in temp_article_array:
        article_array.append(
            {
                'articleID': temp_article[0],
                'libelle': temp_article[5],
                'quantity': temp_article[1],
                'price': temp_article[6],
                'price1': temp_article[4],
                'custom': temp_article[3],
                'position': temp_article[2]
            }
        )

    return article_array


def get_stored_articles(cursor, id):
    article_array = []

    sql_statement = """
        SELECT
            lar.ID_ARTICLE_RGIE,
            QUANTITE,
            POSITION_LISTE,
            CUSTOM_ARTICLE,
            PRICE_CHOICE,
            ar.LIBELLE,
            ar.PRIX,
            ar.PRIX_2
        FROM
            liste_articles_rgie lar,
            articles_rgie ar
        WHERE
            CUSTOM_ARTICLE = 0
            and ID_LISTE_RGIE = %s
    """

    cursor.execute(sql_statement, (id, ))
    temp_article_array = cursor.fetchall()

    for article in temp_article_array:
        price = 0

        if article[4]:
            price = article[6]
        else:
            price = article[7]

        article_array.append(
            {
                'articleID': article[0],
                'libelle': article[5],
                'quantity': article[1],
                'price': price,
                'price1': article[4],
                'custom': article[3],
                'position': article[2]
            }
        )

    return article_array


def sortPosition(article):
    return article['position']


def put_rgie(cursor, id, data):
    delete_elements(cursor, data['deletedElements'])
    modify_elements(cursor, data['modifiedElements'])
    add_articles_to_rgie(cursor, data['newElements'])
    data['id'] = id

    sql_statement = """
        UPDATE rgie
        SET
            ID_CLIENT = %(client)s,
            CHANTIER = %(constructSite)s
        WHERE
            ID_LISTE_ARTICLE_RGIE = %(id)s
    """

    cursor.execute(sql_statement, data)

    return id


def delete_elements(cursor, deleted_articles):
    sql_statement = """
        DELETE FROM liste_articles_rgie
        WHERE
            ID_LISTE_RGIE = %(rgieID)s
            and ID_ARTICLE_RGIE = %(articleID)s
            and CUSTOM_ARTICLE = %(custom)s
            and PRICE_CHOICE = %(price1)s
    """

    cursor.executemany(sql_statement, deleted_articles)

    sql_statement = """
        DELETE FROM temp_articles_rgie
        WHERE
            ID_TEMP_ARTICLES_RGIE = %(articleID)s
            and ID_LISTE_RGIE = %(rgieID)s
            and 1 = %(custom)s
    """

    cursor.executemany(sql_statement, deleted_articles)


def modify_elements(cursor, modified_elements):
    sql_statement = """
        UPDATE liste_articles_rgie
        SET
            QUANTITE = %(quantity)s,
            POSITION_LISTE = %(position)s
        WHERE
            ID_LISTE_RGIE = %(rgieID)s
            and ID_ARTICLE_RGIE = %(articleID)s
            and CUSTOM_ARTICLE = %(custom)s
            and PRICE_CHOICE = %(price1)s
    """

    cursor.executemany(sql_statement, modified_elements)


def delete_rgie(cursor, id_to_delete):
    arguments = (id_to_delete, )

    # prepare the sql statement (which contains arguments in order
    # to avoid sql injection)
    sql_statement = """
        DELETE
        FROM liste_articles_rgie
        WHERE ID_LISTE_RGIE = %s
    """

    cursor.execute(sql_statement, arguments)

    sql_statement = """
        DELETE
        FROM temp_articles_rgie
        WHERE ID_LISTE_RGIE = %s
    """

    cursor.execute(sql_statement, arguments)

    sql_statement = """
        DELETE
        FROM rgie
        WHERE ID_LISTE_ARTICLE_RGIE = %s
    """

    # execute the statement along with its arguments
    cursor.execute(sql_statement, arguments)

    # return the result of the statement
    return cursor.fetchall()


@app_rgie.route(
    '/api/articles_rgie/<id>',
    methods=['GET', 'PUT', 'DELETE']
)
def articles_rgie_specific(id):
    connector = mysql.connection
    cursor = connector.cursor()
    response = []

    if request.method == 'GET':
        print("get 1 article")

    elif request.method == 'DELETE':
        response = delete_article_rgie(cursor, id)

    elif request.method == 'PUT':
        response = update_article(cursor, request.json, id)

    connector.commit()
    cursor.close()

    return json.dumps(response)


def delete_article_rgie(cursor, id_to_delete):
    arguments = (id_to_delete, )

    sql_statement = """
        DELETE FROM articles_rgie
        WHERE ID_ARTICLE_RGIE = %s
    """

    cursor.execute(sql_statement, arguments)

    sql_statement = """
        SELECT ID_ARTICLE_RGIE
        FROM articles_rgie
        WHERE ID_ARTICLE_RGIE = %s
    """

    cursor.execute(sql_statement, arguments)

    return cursor.fetchall()


def update_article(cursor, data, id_to_update):
    response = {}
    arguments = (
        data['article_name'],
        data['article_price'],
        data['article_price2'],
        id_to_update,
    )

    sql_statement = """
        UPDATE articles_rgie
        SET
            LIBELLE = %s,
            PRIX = %s,
            PRIX_2 = %s
        WHERE ID_ARTICLE_RGIE = %s
    """

    cursor.execute(sql_statement, arguments)

    sql_statement = """
        SELECT ID_ARTICLE_RGIE
        FROM articles_rgie
        WHERE
            LIBELLE = %s
            and PRIX = %s
            and PRIX_2 = %s
            and ID_ARTICLE_RGIE = %s
    """

    cursor.execute(sql_statement, arguments)
    mysql_result = cursor.fetchall()

    # set the response to the id of the newly created row
    response = {
        'projectID': mysql_result[0][0]
    }

    return response


@app_rgie.route(
    '/api/articles_rgie/',
    methods=['GET', 'POST']
)
def articles_rgie():
    connector = mysql.connection
    cursor = connector.cursor()
    response = []

    if request.method == 'GET':
        response = get_all_articles(cursor)

    elif request.method == 'POST':
        response = create_new_article(cursor, request.json)

    connector.commit()
    cursor.close()

    return json.dumps(response)


def get_all_articles(cursor):
    response = []

    sql_statement = """
        SELECT ID_ARTICLE_RGIE, LIBELLE, PRIX, PRIX_2
        FROM articles_rgie
    """

    cursor.execute(sql_statement)

    mysql_result = cursor.fetchall()

    for article in mysql_result:
        response.append(
            {
                'articleID': article[0],
                'article_name': article[1],
                'article_price': article[2],
                'article_price2': article[3]
            }
        )

    return response


def create_new_article(cursor, data):
    response = {}
    arguments = (
        data['article_name'],
        data['article_price'],
        data['article_price2'],
    )

    sql_statement = """
        INSERT INTO articles_rgie (LIBELLE, PRIX, PRIX_2)
        VALUES (%s, %s, %s)
    """

    cursor.execute(sql_statement, arguments)

    sql_statement = """
        SELECT LAST_INSERT_ID()
    """

    cursor.execute(sql_statement)
    mysql_result = cursor.fetchall()

    # set the response to the id of the newly created row
    response = {
        'projectID': mysql_result[0][0]
    }

    return response
