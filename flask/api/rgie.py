@app.route('/api/rgie', methods=['GET', 'POST', 'PUT', 'DELETE'])
def rgie():
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
            SELECT R.ID_LISTE_ARTICLE_RGIE, C.NOM_CLIENT, C.PRENOM_CLIENT,
                C.SOCIETE_CLIENT, R.CHANTIER,
                date_format(R.DATE, '%%D %%M %%Y')
            FROM rgie as R
                join clients as C on R.ID_CLIENT = C.ID_CLIENT
            WHERE R.DATE >= str_to_date(%s, %s)
                and extract(year from R.DATE) >= %s
                and extract(year from R.DATE) <= %s
            ORDER BY R.DATE desc"""

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

    elif request.method == 'DELETE':
        # get the id of the projects that has to be deleted
        id_to_delete = (int(request.args.get('id')), )

        # prepare the sql statement (which contains arguments in order
        # to avoid sql injection)
        sql_statement = """
            DELETE FROM rgie
            WHERE ID_LISTE_ARTICLE_RGIE = %s
        """

        # execute the statement along with its arguments
        cur.execute(sql_statement, id_to_delete)

        # commit the changes to the database
        connector.commit()

        response = cur.fetchall()

    cur.close()

    return json.dumps(response)
