from flask import Blueprint, request, json
from .database import mysql


app_suivi = Blueprint('app_suivi', __name__)


# @app_suivi.route('/api/suivi', methods=['GET', 'POST', 'PUT', 'DELETE'])
# def materiel():
#     connector = mysql.connection
#     cur = connector.cursor()
#     response = []

#     # API will return all the elements
#     if request.method == 'GET':
#         # prepare the sql statement (which contains arguments in order to
#         # avoid sql injection)
#         sql_procedure = """
#             SELECT ID_SUIVI_MATERIEL, MATERIEL, NOM, TEL, EMAIL, DATE_EMPRUNT,
#             DATE_RETOUR
#             FROM suivi_materiel
#             """

#         # execute the statement
#         cur.execute(sql_procedure)

#         # fetch the result
#         results = cur.fetchall()

#         # turn the result into a list of dictionnaries
#         for row in results:
#             response.append({
#                 'id': row[0],
#                 'materiel': row[1],
#                 'name': row[2],
#                 'telephone': row[3],
#                 'email': row[4],
#                 'date_emprunt': row[5],
#                 'date_retour': row[6]
#             })

#     elif request.method == 'DELETE':
#         # get the id of the projects that has to be deleted
#         id_to_delete = (int(request.args.get('id')), )

#         # prepare the sql statement (which contains arguments in order
#         # to avoid sql injection)
#         sql_statement = """
#             DELETE FROM clients
#             WHERE ID_CLIENT = %s
#         """

#         # execute the statement along with its arguments
#         cur.execute(sql_statement, id_to_delete)

#         # commit the changes to the database
#         connector.commit()
#         response = cur.fetchall()

#     cur.close()
#     return json.dumps(response)