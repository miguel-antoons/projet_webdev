import unittest
import requests


class ApiTest(unittest.TestCase):
    API_URL = "http://127.0.0.1:5000/api"
    CLIENT_ID_URL = "{}/client/<id".format(API_URL)
    CLIENT_URL = "{}/client?filter=""".format(API_URL)
    CLIENTS_URL = "{}/client>".format(API_URL)

    def test_client_id(self):
        r = requests.get(ApiTest.CLIENT_ID_URL)
        self.assertEqual(r.status_code, 200)
        self.assertEqual(len(r.json()), 0)

    def test_client_all(self):
        r = requests.get(ApiTest.CLIENT_URL)
        self.assertEqual(r.status_code, 200)
        self.assertEqual(len(r.json()), 2)

    def test_clients(self):
        r = requests.get(ApiTest.CLIENTS_URL)
        self.assertEqual(r.status_code, 200)
        self.assertEqual(len(r.json()), 4)


if __name__ == "__main__":
    unittest.main()