from flask import Flask, jsonify, request, abort
from flask_cors import CORS
import requests
import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

API_KEY = os.getenv('API_KEY')
API_URL = 'https://api.thecatapi.com/v1/images/search'

DB_NAME = os.getenv('DB_NAME')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT')

class CatAPI:
    def __init__(self):
        self.conn = self.connect_db()

    def connect_db(self):
        try:
            conn = psycopg2.connect(
                dbname=DB_NAME,
                user=DB_USER,
                password=DB_PASSWORD,
                host=DB_HOST,
                port=DB_PORT
            )
            return conn
        except psycopg2.Error as e:
            print(f"Error connecting to the database: {e}")
            raise

    def fetch_cats(self, limit=100):
        headers = {
            'x-api-key': API_KEY
        }
        cats = []
        while len(cats) < limit:
            try:
                response = requests.get(f'{API_URL}?limit={limit}&has_breeds=1', headers=headers)
                response.raise_for_status()
                data = response.json()
                for cat in data:
                    if 'breeds' in cat and len(cat['breeds']) > 0:
                        breed_info = cat['breeds'][0]
                        if (cat.get('url') and breed_info.get('description') and
                            breed_info.get('name') and breed_info.get('life_span') and
                            breed_info.get('alt_names') and breed_info.get('id') and
                            breed_info.get('origin') and breed_info.get('cfa_url') and
                            breed_info.get('vetstreet_url') and breed_info.get('vcahospitals_url')):
                            cats.append({
                                'api_id': cat['id'],
                                'url': cat['url'],
                                'favorite': False,
                                'custom_name': None,
                                'description': breed_info.get('description'),
                                'breed_id': breed_info.get('id'),
                                'breed_name': breed_info.get('name'),
                                'cfa_url': breed_info.get('cfa_url'),
                                'vetstreet_url': breed_info.get('vetstreet_url'),
                                'vcahospitals_url': breed_info.get('vcahospitals_url'),
                                'origin': breed_info.get('origin'),
                                'life_span': breed_info.get('life_span'),
                                'alt_names': breed_info.get('alt_names')
                            })
                    if len(cats) >= limit:
                        break
            except requests.exceptions.RequestException as e:
                print(f"Error fetching data from TheCatAPI: {e}")
                break
            except KeyError as e:
                print(f"KeyError processing data: {e}")
                continue
            except Exception as e:
                print(f"Unexpected error: {e}")
                continue
        return cats[:limit]

    def insert_cats(self, cats):
        cur = self.conn.cursor()
        for cat in cats:
            try:
                cur.execute(
                    """
                    INSERT INTO cats (api_id, url, favorite, custom_name, description, breed_id, breed_name, cfa_url, vetstreet_url, vcahospitals_url, origin, life_span, alt_names)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """,
                    (
                        cat['api_id'], cat['url'], cat['favorite'], cat['custom_name'],
                        cat['description'], cat['breed_id'], cat['breed_name'],
                        cat['cfa_url'], cat['vetstreet_url'], cat['vcahospitals_url'],
                        cat['origin'], cat['life_span'], cat['alt_names']
                    )
                )
            except Exception as e:
                print(f"Error inserting cat data: {e}")
        self.conn.commit()

    def get_cats(self, page, per_page, breed=None):
        try:
            cur = self.conn.cursor()
            base_query = "SELECT * FROM cats WHERE favorite = false"
            params = []
            if breed:
                base_query += " AND breed_name = %s"
                params.append(breed)
            base_query += " ORDER BY id LIMIT %s OFFSET %s"
            params.extend([per_page, (page - 1) * per_page])
            cur.execute(base_query, params)
            rows = cur.fetchall()
            columns = [desc[0] for desc in cur.description]
            return [dict(zip(columns, row)) for row in rows]
        except Exception as e:
            print(f"Error fetching cats: {e}")
            abort(500, description="Error fetching cats")

    def get_favourite_cats(self):
        try:
            cur = self.conn.cursor()
            cur.execute("SELECT * FROM cats WHERE favorite = true ORDER BY id")
            rows = cur.fetchall()
            columns = [desc[0] for desc in cur.description]
            return [dict(zip(columns, row)) for row in rows]
        except Exception as e:
            print(f"Error fetching favorite cats: {e}")
            abort(500, description="Error fetching favorite cats")

    def get_cat(self, cat_id):
        try:
            cur = self.conn.cursor()
            cur.execute("SELECT * FROM cats WHERE id = %s", (cat_id,))
            cat = cur.fetchone()
            if cat is None:
                abort(404)
            columns = [desc[0] for desc in cur.description]
            return dict(zip(columns, cat))
        except Exception as e:
            print(f"Error fetching cat with ID {cat_id}: {e}")
            abort(500, description="Error fetching cat")

    def update_cat(self, cat_id, new_data):
        try:
            cur = self.conn.cursor()
            cur.execute(
                """
                UPDATE cats
                SET
                    url = %s,
                    favorite = %s,
                    custom_name = %s,
                    description = %s,
                    breed_id = %s,
                    breed_name = %s,
                    cfa_url = %s,
                    vetstreet_url = %s,
                    origin = %s,
                    life_span = %s,
                    alt_names = %s
                WHERE id = %s
                """,
                (
                    new_data['url'], new_data['favorite'], new_data['custom_name'],
                    new_data['description'], new_data['breed_id'], new_data['breed_name'],
                    new_data['cfa_url'], new_data['vetstreet_url'], new_data['origin'],
                    new_data['life_span'], new_data['alt_names'], cat_id
                )
            )
            self.conn.commit()
        except Exception as e:
            print(f"Error updating cat with ID {cat_id}: {e}")
            abort(500, description="Error updating cat")

    def delete_cat(self, cat_id):
        try:
            cur = self.conn.cursor()
            cur.execute("DELETE FROM cats WHERE id = %s", (cat_id,))
            self.conn.commit()
        except Exception as e:
            print(f"Error deleting cat with ID {cat_id}: {e}")
            abort(500, description="Error deleting cat")

    def mark_cat_as_favorite(self, cat_id):
        try:
            cur = self.conn.cursor()
            cur.execute("UPDATE cats SET favorite = TRUE WHERE id = %s", (cat_id,))
            self.conn.commit()
        except Exception as e:
            print(f"Error marking cat as favorite with ID {cat_id}: {e}")
            abort(500, description="Error marking cat as favorite")

    def unmark_cat_as_favorite(self, cat_id):
        try:
            cur = self.conn.cursor()
            cur.execute("UPDATE cats SET favorite = FALSE WHERE id = %s", (cat_id,))
            self.conn.commit()
        except Exception as e:
            print(f"Error unmarking cat as favorite with ID {cat_id}: {e}")
            abort(500, description="Error unmarking cat as favorite")


@app.route('/cats', methods=['GET'])
def get_cats():
    try:
        page = request.args.get('page', default=1, type=int)
        per_page = request.args.get('per_page', default=10, type=int)
        breed = request.args.get('breed', default=None)
        cats = cat_api.get_cats(page, per_page, breed)
        return jsonify(cats)
    except Exception as e:
        print(f"Error in get_cats endpoint: {e}")
        abort(500, description="Error fetching cats")


@app.route('/getFavouriteCats', methods=['GET'])
def get_favourite_cats():
    try:
        cats = cat_api.get_favourite_cats()
        return jsonify(cats)
    except Exception as e:
        print(f"Error in get_favourite_cats endpoint: {e}")
        abort(500, description="Error fetching favorite cats")


@app.route('/cats/<int:cat_id>', methods=['GET'])
def get_cat(cat_id):
    try:
        cat = cat_api.get_cat(cat_id)
        if cat is None:
            abort(404)
        return jsonify(cat)
    except Exception as e:
        print(f"Error in get_cat endpoint for cat ID {cat_id}: {e}")
        abort(500, description="Error fetching cat")


@app.route('/cats/<int:cat_id>', methods=['DELETE'])
def delete_cat(cat_id):
    try:
        cat_api.delete_cat(cat_id)
        return '', 204
    except Exception as e:
        print(f"Error in delete_cat endpoint for cat ID {cat_id}: {e}")
        abort(500, description="Error deleting cat")


@app.route('/cats/<int:cat_id>/favorite', methods=['POST'])
def mark_cat_as_favorite(cat_id):
    try:
        cat_api.mark_cat_as_favorite(cat_id)
        return '', 204
    except Exception as e:
        print(f"Error in mark_cat_as_favorite endpoint for cat ID {cat_id}: {e}")
        abort(500, description="Error marking cat as favorite")


@app.route('/cats/<int:cat_id>/unfavorite', methods=['POST'])
def unmark_cat_as_favorite(cat_id):
    try:
        cat_api.unmark_cat_as_favorite(cat_id)
        return '', 204
    except Exception as e:
        print(f"Error in unmark_cat_as_favorite endpoint for cat ID {cat_id}: {e}")
        abort(500, description="Error unmarking cat as favorite")


cat_api = CatAPI()

try:
    cur = cat_api.conn.cursor()
    cur.execute("SELECT COUNT(*) FROM cats")
    count = cur.fetchone()[0]
    if count == 0:
        cats = cat_api.fetch_cats()
        print("Entering here and finishing fetching of cats")
        cat_api.insert_cats(cats)
    cur.close()
except Exception as e:
    print(f"Error during initial data setup: {e}")

if __name__ == '__main__':
    app.run(debug=True)
