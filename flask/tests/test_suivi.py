import unittest

class test_api(unittest.TestCase):
    url = "http://127.0.0.1:5000/api/"
    url_matos = "{}/suivi".format(url)

    def test_matos(self):
        requete = requests.get(ApiTest.url_matos)
        self.assertEqual(requete.status_code, 200)

if __name__ == "__main__":
    unittest.main()
