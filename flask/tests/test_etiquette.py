import unittest
import requests
import json
from flask import current_app as app
from api.etiquettes import get_all_etiquettes, create_new_etiquette, \
    set_arguments, get_etiquette_by_id, delete_etiquette, update_etiquette


# class EtiquettesTest(unittest.TestCase):
#     ETIQUETTES_URL = "http://127.0.0.1:5000/api/etiquettes?filter={}"

#     def test_get_all(self):
#         test_request = requests.get(EtiquettesTest.ETIQUETTES_URL.format(''))
#         self.assertEqual(test_request.status_code, 200)
#         # self.assertEqual()

class TestApiEtiquettes:
    URL_PREFIX = "http://127.0.0.1/api/{}"
    test_id = 0
    test_data = [
        3,
        'Unit tests',
        [
            [
                {
                    'tempBackground': '',
                    'color': 'black',
                    'bold': False,
                    'colspan': 1,
                    'value': '',
                    'circuitNumber': {
                        'color': 'black',
                        'bold': False,
                        'value': ''
                    }
                }
            ]
        ]
    ]

    update_test_data = [
        'Unit tests 2',
        [
            [
                {
                    'tempBackground': '',
                    'color': 'black',
                    'bold': False,
                    'colspan': 1,
                    'value': '',
                    'circuitNumber': {
                        'color': 'black',
                        'bold': False,
                        'value': ''
                    }
                }
            ]
        ],
        'test_number'
    ]

    response_test_data = {
        'clientID': 3,
        'clientInfo': 'Miguel Antoons, Ephec',
        'constructionSite': 'Unit tests',
        'projectData': '[[{"bold": false, "circuitNumber": {"bold": false,'
        ' "color": "black", "value": ""}, "color": "black", "colspan": 1,'
        ' "tempBackground": "", "value": ""}]]',

        'projectID': test_id
    }

    def test1_get_etiquettes(self):
        response = requests.get(
            TestApiEtiquettes.URL_PREFIX.format("etiquettes?filter=")
        )
        assert response.status_code == 200
        assert response.headers['content-type'] == "application/json"

    def test2_post_etiquette(self):
        response = requests.post(
            TestApiEtiquettes.URL_PREFIX.format("etiquettes"),
            json=TestApiEtiquettes.test_data
        )

        TestApiEtiquettes.test_id = int(json.loads(response.text)['projectID'])
        TestApiEtiquettes.response_test_data['projectID'] = \
            TestApiEtiquettes.test_id
        assert response.status_code == 200
        assert response.headers['content-type'] == "application/json"

    def test3_get_etiquette_by_id(self):
        response = requests.get(
            TestApiEtiquettes.URL_PREFIX.format(
                f"etiquettes/{TestApiEtiquettes.test_id}"
            )
        )

        assert response.status_code == 200
        assert response.headers['content-type'] == "application/json"
        assert json.loads(response.text) == \
            TestApiEtiquettes.response_test_data

    def test4_update_etiquette(self):
        TestApiEtiquettes.update_test_data[2] = TestApiEtiquettes.test_id
        TestApiEtiquettes.response_test_data['constructionSite'] = \
            'Unit tests 2'
        response = requests.put(
            TestApiEtiquettes.URL_PREFIX.format("etiquettes"),
            json=TestApiEtiquettes.update_test_data
        )

        assert response.status_code == 200
        assert response.text == json.dumps(["successfully updated project"])
        assert response.headers['content-type'] == 'application/json'

    def test5_get_updated_etiquette(self):
        response = requests.get(
            TestApiEtiquettes.URL_PREFIX.format(
                f"etiquettes/{TestApiEtiquettes.test_id}"
            )
        )

        assert response.status_code == 200
        assert response.headers['content-type'] == "application/json"
        assert json.loads(response.text) == \
            TestApiEtiquettes.response_test_data

    def test6_delete_etiquette(self):
        response = requests.delete(
            TestApiEtiquettes.URL_PREFIX.format(
                f"etiquettes?id={TestApiEtiquettes.test_id}"
            )
        )

        assert response.status_code == 200
        assert response.headers['content-type'] == "application/json"


class TestFunctionEtiquettes:
    test_id = 0
    test_data = [
        0,
        'Unit tests',
        [
            [
                {
                    'tempBackground': '',
                    'color': 'black',
                    'bold': False,
                    'colspan': 1,
                    'value': '',
                    'circuitNumber': {
                        'color': 'black',
                        'bold': False,
                        'value': ''
                    }
                }
            ]
        ]
    ]

    update_test_data = [
        'Unit tests 2',
        [
            [
                {
                    'tempBackground': '',
                    'color': 'black',
                    'bold': False,
                    'colspan': 1,
                    'value': '',
                    'circuitNumber': {
                        'color': 'black',
                        'bold': False,
                        'value': ''
                    }
                }
            ]
        ],
        'test_number'
    ]

    response_test_data = {
        'clientID': 3,
        'clientInfo': 'Miguel Antoons, Ephec',
        'constructionSite': 'Unit tests',
        'projectData': '[[{"bold": false, "circuitNumber": {"bold": false,'
        ' "color": "black", "value": ""}, "color": "black", "colspan": 1,'
        ' "tempBackground": "", "value": ""}]]',

        'projectID': test_id
    }

    def test1_insert_etiquette(self, cursor, insert_client):
        TestFunctionEtiquettes.test_data[0] = insert_client
        response = create_new_etiquette(
            TestFunctionEtiquettes.test_data,
            cursor
        )

        cursor.execute('SELECT LAST_INSERT_ID();')

        assert response['projectID'] == cursor.fetchall()[0][0]

    def test2_get_filter1(self):
        response = set_arguments('')

        assert response == ("1999-01-01", "%Y-%m-%d", 1, 999999999, )

    def test2_get_filter2(self):
        response = set_arguments('2020')

        assert response == ("1999-01-01", "%Y-%m-%d", '2020', '2020', )

    def test2_get_filter3(self):
        response = set_arguments(
            'Thu Feb 11 2021 21:49:03 GMT+0100'
            ' (Central European Standard Time)'
        )

        assert response == (
            'Thu Feb 11 2021 21:49:03 GMT+0100'
            ' (Central European Standard Time)',
            "%a %b %e %Y %H:%i:%s",
            1,
            999999999,
        )

    def test3_get_all_etiquettes(self, cursor, create_new_etiquette):
        response = get_all_etiquettes(
            '',
            cursor
        )

        assert len(response) >= 1

    def test4_get_etiquette_by_id(self, cursor, create_new_etiquette):
        response = get_etiquette_by_id(create_new_etiquette[0], cursor)

        assert len(response) == 5
        assert response == {
            'projectID': create_new_etiquette[0],
            'clientID': create_new_etiquette[1],
            'clientInfo': f"Dupont Jean, test_societe",
            'constructionSite': 'test_chantier',
            'projectData': json.dumps(
                [
                    [
                        {
                            'tempBackground': '',
                            'color': 'black',
                            'bold': False,
                            'colspan': 1,
                            'value': '',
                            'circuitNumber': {
                                'color': 'black',
                                'bold': False,
                                'value': ''
                            }
                        }
                    ]
                ]
            )
        }

    def test5_delete_etiquette(self, cursor, create_new_etiquette):
        response = delete_etiquette(create_new_etiquette[0], cursor)

        assert len(response) == 1
        assert response == ['Successfully deleted']

    def test6_update_etiquette(self, cursor, create_new_etiquette):
        TestFunctionEtiquettes.update_test_data[2] = create_new_etiquette[1]
        response = update_etiquette(
            TestFunctionEtiquettes.update_test_data,
            cursor
        )

        assert len(response) == 1
        assert response == ["successfully updated project"]
