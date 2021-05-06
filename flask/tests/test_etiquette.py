import unittest
import requests
import json
from flask import current_app as app
from api.etiquettes import get_all_etiquettes


# class EtiquettesTest(unittest.TestCase):
#     ETIQUETTES_URL = "http://127.0.0.1:5000/api/etiquettes?filter={}"

#     def test_get_all(self):
#         test_request = requests.get(EtiquettesTest.ETIQUETTES_URL.format(''))
#         self.assertEqual(test_request.status_code, 200)
#         # self.assertEqual()

class Test_etiquettes:
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
        'projectData': '[[{"bold": false, "circuitNumber": {"bold": false, "color": "black", "value": ""}, "color": "black", "colspan": 1, "tempBackground": "", "value": ""}]]',
        'projectID': test_id
    }

    def test1_get_etiquettes(self):
        response = requests.get(
            Test_etiquettes.URL_PREFIX.format("etiquettes?filter=")
        )
        assert response.status_code == 200
        assert response.headers['content-type'] == "application/json"

    def test2_post_etiquette(self):
        response = requests.post(
            Test_etiquettes.URL_PREFIX.format("etiquettes"),
            json=Test_etiquettes.test_data
        )

        Test_etiquettes.test_id = int(json.loads(response.text)['projectID'])
        Test_etiquettes.response_test_data['projectID'] = Test_etiquettes.test_id
        assert response.status_code == 200
        assert response.headers['content-type'] == "application/json"

    def test3_get_etiquette_by_id(self):
        response = requests.get(
            Test_etiquettes.URL_PREFIX.format(
                f"etiquettes/{Test_etiquettes.test_id}"
            )
        )
        print(json.loads(response.text))
        print(Test_etiquettes.response_test_data)
        assert response.status_code == 200
        assert response.headers['content-type'] == "application/json"
        assert json.loads(response.text) == Test_etiquettes.response_test_data

    def test4_update_etiquette(self):
        Test_etiquettes.update_test_data[2] = Test_etiquettes.test_id
        Test_etiquettes.response_test_data['constructionSite'] = 'Unit tests 2'
        response = requests.put(
            Test_etiquettes.URL_PREFIX.format("etiquettes"),
            json=Test_etiquettes.update_test_data
        )

        assert response.status_code == 200
        assert response.text == json.dumps(["successfully updated project"])
        assert response.headers['content-type'] == 'application/json'

    def test5_get_updated_etiquette(self):
        response = requests.get(
            Test_etiquettes.URL_PREFIX.format(
                f"etiquettes/{Test_etiquettes.test_id}"
            )
        )
        print(json.loads(response.text))
        print(Test_etiquettes.response_test_data)
        assert response.status_code == 200
        assert response.headers['content-type'] == "application/json"
        assert json.loads(response.text) == Test_etiquettes.response_test_data
