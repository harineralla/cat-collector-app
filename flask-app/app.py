from flask import Flask, jsonify, request, abort
from flask_cors import CORS
import requests
import psycopg2

app = Flask(__name__)
CORS(app)

API_KEY = 'live_RNONcningE3gOznNu8w7hN02iVk0WRYc9BeimyYGGYjraakrDUmz4Vc2zGSfJ5y4'
API_URL = 'https://api.thecatapi.com/v1/images/search'

class CatAPI:
    def __init__(self):
        self.conn = self.connect_db()

    def connect_db(self):
        return psycopg2.connect(
            dbname="cat_collector",
            user="postgres",
            password="12345",
            host="localhost",
            port="5432"
        )

    def fetch_cats(self):
        headers = {
            'x-api-key': API_KEY
        }
        response = requests.get(f'{API_URL}?limit=100', headers=headers)
        return response.json()

    def insert_cats(self, cats):
        cur = self.conn.cursor()
        for cat in cats:
            breed_id, breed_name, cfa_url, vetstreet_url, vcahospitals_url, origin, description, life_span, alt_names = (
                None, None, None, None, None, None, None, None, None)
            if len(cat["breeds"]) > 0:
                breed_id = cat["breeds"][0].get("id")
                breed_name = cat["breeds"][0].get("name")
                cfa_url = cat["breeds"][0].get("cfa_url")
                vetstreet_url = cat["breeds"][0].get("vetstreet_url")
                origin = cat["breeds"][0].get("origin")
                description = cat["breeds"][0].get("description")
                life_span = cat["breeds"][0].get("life_span")
                alt_names = cat["breeds"][0].get("alt_names")
            cur.execute(
                "INSERT INTO cats (api_id, url, breed_id, breed_name, cfa_url, vetstreet_url, origin, description, life_span, alt_names) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                (cat['id'], cat['url'], breed_id, breed_name, cfa_url,
                 vetstreet_url, origin, description, life_span, alt_names)
            )
        self.conn.commit()

    def get_cats(self, page, per_page, breed=None):
        cur = self.conn.cursor()
        query = "SELECT * FROM cats where favorite =  false"
        if breed:
            query += f" AND breed_name ilike '%{breed}%'"
        query += f" ORDER BY id LIMIT {per_page} OFFSET {(page - 1) * per_page}"
        cur.execute(
            query
        )
        rows = cur.fetchall()
        columns = [desc[0] for desc in cur.description]
        return [dict(zip(columns, row)) for row in rows]

    def get_favourite_cats(self):
        cur = self.conn.cursor()
        cur.execute(
            "SELECT * FROM cats where favorite =  true ORDER BY id"
        )
        rows = cur.fetchall()
        columns = [desc[0] for desc in cur.description]
        return [dict(zip(columns, row)) for row in rows]

    def get_cat(self, cat_id):
        cur = self.conn.cursor()
        cur.execute(
            "SELECT * FROM cats WHERE id = %s",
            (cat_id,)
        )
        return cur.fetchone()

    def update_cat(self, cat_id, new_data):
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

    def delete_cat(self, cat_id):
        cur = self.conn.cursor()
        cur.execute(
            "DELETE FROM cats WHERE id = %s",
            (cat_id,)
        )
        self.conn.commit()

    def mark_cat_as_favorite(self, cat_id):
        cur = self.conn.cursor()
        cur.execute(
            "UPDATE cats SET favorite = TRUE WHERE id = %s",
            (cat_id,)
        )
        self.conn.commit()

    def unmark_cat_as_favorite(self, cat_id):
        cur = self.conn.cursor()
        cur.execute(
            "UPDATE cats SET favorite = FALSE WHERE id = %s",
            (cat_id,)
        )
        self.conn.commit()


cat_api = CatAPI()


@app.route('/cats', methods=['GET'])
def get_cats():
    page = request.args.get('page', default=1, type=int)
    per_page = request.args.get('per_page', default=10, type=int)
    breed = request.args.get('breed', default=None)
    cats = cat_api.get_cats(page, per_page, breed)
    return jsonify(cats)


@app.route('/getFavouriteCats', methods=['GET'])
def get_favourite_cats():
    page = request.args.get('page', default=1, type=int)
    per_page = request.args.get('per_page', default=10, type=int)
    cats = cat_api.get_favourite_cats()
    return jsonify(cats)


@app.route('/cats/<int:cat_id>', methods=['GET'])
def get_cat(cat_id):
    cat = cat_api.get_cat(cat_id)
    if cat is None:
        abort(404)
    return jsonify(cat)


@app.route('/cats/<int:cat_id>', methods=['DELETE'])
def delete_cat(cat_id):
    cat_api.delete_cat(cat_id)
    return '', 204


@app.route('/cats/<int:cat_id>/favorite', methods=['POST'])
def mark_cat_as_favorite(cat_id):
    cat_api.mark_cat_as_favorite(cat_id)
    return '', 204


@app.route('/cats/<int:cat_id>/unfavorite', methods=['POST'])
def unmark_cat_as_favorite(cat_id):
    cat_api.unmark_cat_as_favorite(cat_id)
    return '', 204


cur = cat_api.conn.cursor()
cur.execute("SELECT COUNT(*) FROM cats")
count = cur.fetchone()[0]
if count == 0:
    cats = cat_api.fetch_cats()
    cat_api.insert_cats(cats)

if __name__ == '__main__':
    app.run(debug=True)
