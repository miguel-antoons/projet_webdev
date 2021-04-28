import unittest
import requests


class EtiquettesTest(unittest.TestCase):
    ETIQUETTES_URL = "http://127.0.0.1:5000/api/etiquettes?filter={}"

    def test_get_all(self):
        test_request = requests.get(EtiquettesTest.ETIQUETTES_URL.format(''))
        self.assertEqual(test_request.status_code, 200)
        # self.assertEqual()
