import unittest
import requests


# class ApiTest(unittest.TestCase):
#     API_URL = "http://127.0.0.1:5000/api"
#     FACTURE_ID_URL = "{}/facture/get_facture_id/0".format(API_URL)
#     FACTURE_URL = "{}/facture?filter=""".format(API_URL)
#     FACTURE_CLIENTS_URL = "{}/facture/get_clients".format(API_URL)

#     def test_facture_id(self):
#         r = requests.get(ApiTest.FACTURE_ID_URL)
#         self.assertEqual(r.status_code, 200)
#         self.assertEqual(len(r.json()), 0)

#     def test_facture_all(self):
#         r = requests.get(ApiTest.FACTURE_URL)
#         self.assertEqual(r.status_code, 200)
#         self.assertEqual(len(r.json()), 2)

#     def test_facture_clients(self):
#         r = requests.get(ApiTest.FACTURE_CLIENTS_URL)
#         self.assertEqual(r.status_code, 200)
#         self.assertEqual(len(r.json()), 4)


# if __name__ == "__main__":
#     unittest.main()
