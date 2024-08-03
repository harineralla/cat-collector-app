import unittest
import json
from unittest.mock import patch, MagicMock
from app import app, CatAPI

class CatAPITestCase(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
        self.cat_api = CatAPI()
        self.cat_api.conn = MagicMock()
        self.mock_cursor = MagicMock()
        self.cat_api.conn.cursor.return_value = self.mock_cursor

    def tearDown(self):
        self.cat_api.conn.close()

    @patch.object(CatAPI, 'get_cats')
    def test_get_cats_endpoint(self, mock_get_cats):
        mock_get_cats.return_value = [
            {
                'id': 1,
                'api_id': 'test_id',
                'url': 'http://example.com/cat.jpg',
                'favorite': False,
                'custom_name': 'Test Cat',
                'description': 'A test cat',
                'breed_id': 'test_breed_id',
                'breed_name': 'Test Breed',
                'cfa_url': 'http://example.com/cfa',
                'vetstreet_url': 'http://example.com/vetstreet',
                'vcahospitals_url': 'http://example.com/vca',
                'origin': 'Test Origin',
                'life_span': '10-15 years',
                'alt_names': 'Test Alt Names'
            }
        ]
        response = self.app.get('/cats?page=1&per_page=8')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, list)
        self.assertEqual(data[0]['api_id'], 'test_id')

    @patch.object(CatAPI, 'get_favourite_cats')
    def test_get_favourite_cats_endpoint(self, mock_get_favourite_cats):
        mock_get_favourite_cats.return_value = [
            {
                'id': 1,
                'api_id': 'test_id',
                'url': 'http://example.com/cat.jpg',
                'favorite': True,
                'custom_name': 'Test Cat',
                'description': 'A test cat',
                'breed_id': 'test_breed_id',
                'breed_name': 'Test Breed',
                'cfa_url': 'http://example.com/cfa',
                'vetstreet_url': 'http://example.com/vetstreet',
                'vcahospitals_url': 'http://example.com/vca',
                'origin': 'Test Origin',
                'life_span': '10-15 years',
                'alt_names': 'Test Alt Names'
            }
        ]
        response = self.app.get('/getFavouriteCats')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, list)
        self.assertEqual(data[0]['favorite'], True)

    @patch.object(CatAPI, 'get_cat')
    def test_get_cat_endpoint(self, mock_get_cat):
        mock_get_cat.return_value = {
            'id': 1,
            'api_id': 'test_id',
            'url': 'http://example.com/cat.jpg',
            'favorite': False,
            'custom_name': None,
            'description': 'A test cat',
            'breed_id': 'test_breed_id',
            'breed_name': 'Test Breed',
            'cfa_url': 'http://example.com/cfa',
            'vetstreet_url': 'http://example.com/vetstreet',
            'vcahospitals_url': 'http://example.com/vca',
            'origin': 'Test Origin',
            'life_span': '10-15 years',
            'alt_names': 'Test Alt Names'
        }
        response = self.app.get('/cats/1')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, dict)
        self.assertEqual(data['id'], 1)

    @patch.object(CatAPI, 'get_cat')
    def test_get_cat_not_found_endpoint(self, mock_get_cat):
        mock_get_cat.return_value = None
        response = self.app.get('/cats/9999')
        self.assertEqual(response.status_code, 404)

    @patch.object(CatAPI, 'update_cat')
    def test_update_cat_endpoint(self, mock_update_cat):
        new_data = {
            'url': 'http://example.com/updated_cat.jpg',
            'favorite': True,
            'custom_name': 'Updated Cat',
            'description': 'An updated test cat',
            'breed_id': 'test_breed_id',
            'breed_name': 'Test Breed',
            'cfa_url': 'http://example.com/cfa',
            'vetstreet_url': 'http://example.com/vetstreet',
            'vcahospitals_url': 'http://example.com/vca',
            'origin': 'Test Origin',
            'life_span': '10-15 years',
            'alt_names': 'Test Alt Names'
        }
        response = self.app.put('/cats/1', data=json.dumps(new_data), content_type='application/json')
        self.assertEqual(response.status_code, 405)

    @patch.object(CatAPI, 'delete_cat')
    def test_delete_cat_endpoint(self, mock_delete_cat):
        response = self.app.delete('/cats/1')
        self.assertEqual(response.status_code, 204)

    @patch.object(CatAPI, 'mark_cat_as_favorite')
    def test_mark_cat_as_favorite_endpoint(self, mock_mark_cat_as_favorite):
        response = self.app.post('/cats/1/favorite')
        self.assertEqual(response.status_code, 204)

    @patch.object(CatAPI, 'unmark_cat_as_favorite')
    def test_unmark_cat_as_favorite_endpoint(self, mock_unmark_cat_as_favorite):
        response = self.app.post('/cats/1/unfavorite')
        self.assertEqual(response.status_code, 204)

    @patch('app.requests.get')
    def test_fetch_cats(self, mock_get):
        mock_response = MagicMock()
        mock_response.json.return_value = [
            {
                'id': 'test_id',
                'url': 'http://example.com/cat.jpg',
                'breeds': [
                    {
                        'description': 'A test cat',
                        'name': 'Test Breed',
                        'life_span': '10-15 years',
                        'alt_names': 'Test Alt Names',
                        'id': 'test_breed_id',
                        'origin': 'Test Origin',
                        'cfa_url': 'http://example.com/cfa',
                        'vetstreet_url': 'http://example.com/vetstreet',
                        'vcahospitals_url': 'http://example.com/vca'
                    }
                ]
            }
        ]
        mock_get.return_value = mock_response

        cats = self.cat_api.fetch_cats(limit=1)
        self.assertEqual(cats, [{
            'api_id': 'test_id',
            'url': 'http://example.com/cat.jpg',
            'favorite': False,
            'custom_name': None,
            'description': 'A test cat',
            'breed_id': 'test_breed_id',
            'breed_name': 'Test Breed',
            'cfa_url': 'http://example.com/cfa',
            'vetstreet_url': 'http://example.com/vetstreet',
            'vcahospitals_url': 'http://example.com/vca',
            'origin': 'Test Origin',
            'life_span': '10-15 years',
            'alt_names': 'Test Alt Names'
        }])


    def test_get_cats(self):
        self.mock_cursor.fetchall.return_value = [
            (
                1, 'test_id', 'http://example.com/cat.jpg', False, None, 'A test cat', 'test_breed_id',
                'Test Breed', 'http://example.com/cfa', 'http://example.com/vetstreet', 'http://example.com/vca',
                'Test Origin', '10-15 years', 'Test Alt Names'
            )
        ]
        self.mock_cursor.description = [
            ('id',), ('api_id',), ('url',), ('favorite',), ('custom_name',), ('description',),
            ('breed_id',), ('breed_name',), ('cfa_url',), ('vetstreet_url',), ('vcahospitals_url',),
            ('origin',), ('life_span',), ('alt_names',)
        ]

        cats = self.cat_api.get_cats(1, 10)
        self.assertEqual(cats, [{
            'id': 1,
            'api_id': 'test_id',
            'url': 'http://example.com/cat.jpg',
            'favorite': False,
            'custom_name': None,
            'description': 'A test cat',
            'breed_id': 'test_breed_id',
            'breed_name': 'Test Breed',
            'cfa_url': 'http://example.com/cfa',
            'vetstreet_url': 'http://example.com/vetstreet',
            'vcahospitals_url': 'http://example.com/vca',
            'origin': 'Test Origin',
            'life_span': '10-15 years',
            'alt_names': 'Test Alt Names'
        }])

    def test_get_favourite_cats(self):
        self.mock_cursor.fetchall.return_value = [
            (
                1, 'test_id', 'http://example.com/cat.jpg', True, None, 'A test cat', 'test_breed_id',
                'Test Breed', 'http://example.com/cfa', 'http://example.com/vetstreet', 'http://example.com/vca',
                'Test Origin', '10-15 years', 'Test Alt Names'
            )
        ]
        self.mock_cursor.description = [
            ('id',), ('api_id',), ('url',), ('favorite',), ('custom_name',), ('description',),
            ('breed_id',), ('breed_name',), ('cfa_url',), ('vetstreet_url',), ('vcahospitals_url',),
            ('origin',), ('life_span',), ('alt_names',)
        ]

        cats = self.cat_api.get_favourite_cats()
        self.assertEqual(cats, [{
            'id': 1,
            'api_id': 'test_id',
            'url': 'http://example.com/cat.jpg',
            'favorite': True,
            'custom_name': None,
            'description': 'A test cat',
            'breed_id': 'test_breed_id',
            'breed_name': 'Test Breed',
            'cfa_url': 'http://example.com/cfa',
            'vetstreet_url': 'http://example.com/vetstreet',
            'vcahospitals_url': 'http://example.com/vca',
            'origin': 'Test Origin',
            'life_span': '10-15 years',
            'alt_names': 'Test Alt Names'
        }])

    @patch.object(CatAPI, 'get_cat')
    def test_get_cat(self, mock_get_cat):
        mock_get_cat.return_value = {
            'id': 1,
            'api_id': 'test_id',
            'url': 'http://example.com/cat.jpg',
            'favorite': False,
            'custom_name': None,
            'description': 'A test cat',
            'breed_id': 'test_breed_id',
            'breed_name': 'Test Breed',
            'cfa_url': 'http://example.com/cfa',
            'vetstreet_url': 'http://example.com/vetstreet',
            'vcahospitals_url': 'http://example.com/vca',
            'origin': 'Test Origin',
            'life_span': '10-15 years',
            'alt_names': 'Test Alt Names'
        }

        response = self.app.get('/cats/1')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data, {
            'id': 1,
            'api_id': 'test_id',
            'url': 'http://example.com/cat.jpg',
            'favorite': False,
            'custom_name': None,
            'description': 'A test cat',
            'breed_id': 'test_breed_id',
            'breed_name': 'Test Breed',
            'cfa_url': 'http://example.com/cfa',
            'vetstreet_url': 'http://example.com/vetstreet',
            'vcahospitals_url': 'http://example.com/vca',
            'origin': 'Test Origin',
            'life_span': '10-15 years',
            'alt_names': 'Test Alt Names'
        })

    def test_delete_cat(self):
        self.cat_api.delete_cat(1)

        self.mock_cursor.execute.assert_called_once_with(
            "DELETE FROM cats WHERE id = %s",
            (1,)
        )
        self.cat_api.conn.commit.assert_called_once()

    def test_mark_cat_as_favorite(self):
        self.cat_api.mark_cat_as_favorite(1)

        self.mock_cursor.execute.assert_called_once_with(
            "UPDATE cats SET favorite = TRUE WHERE id = %s",
            (1,)
        )
        self.cat_api.conn.commit.assert_called_once()

    def test_unmark_cat_as_favorite(self):
        self.cat_api.unmark_cat_as_favorite(1)

        self.mock_cursor.execute.assert_called_once_with(
            "UPDATE cats SET favorite = FALSE WHERE id = %s",
            (1,)
        )
        self.cat_api.conn.commit.assert_called_once()
