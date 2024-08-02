from flask import Flask, jsonify, request, abort
from flask_cors import CORS
import requests
import psycopg2

app = Flask(__name__)
CORS(app)

# Configuration for TheCatAPI
API_KEY = 'your_api_key'
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
            cur.execute(
                "INSERT INTO cats (api_id, url) VALUES (%s, %s)",
                (cat['id'], cat['url'])
            )
        self.conn.commit()

    def get_cats(self, page, per_page):
        cur = self.conn.cursor()
        cur.execute(
            "SELECT * FROM cats ORDER BY id LIMIT %s OFFSET %s",
            (per_page, (page - 1) * per_page)
        )
        return cur.fetchall()

    def get_cat(self, cat_id):
        cur = self.conn.cursor()
        cur.execute(
            "SELECT * FROM cats WHERE id = %s",
            (cat_id,)
        )
        return cur.fetchone()

    def add_cat(self, new_cat):
        cur = self.conn.cursor()
        cur.execute(
            "INSERT INTO cats (api_id, url, favorite, custom_name, description) VALUES (%s, %s, %s, %s, %s)",
            (new_cat['api_id'], new_cat['url'], new_cat['favorite'], new_cat['custom_name'], new_cat['description'])
        )
        self.conn.commit()

    def update_cat(self, cat_id, new_data):
        cur = self.conn.cursor()
        cur.execute(
            "UPDATE cats SET url = %s, favorite = %s, custom_name = %s, description = %s WHERE id = %s",
            (new_data['url'], new_data['favorite'], new_data['custom_name'], new_data['description'], cat_id)
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
    page = request.args.get('page', default=1)
    per_page = request.args.get('per_page', default=10)
    cats = cat_api.get_cats(page, per_page)
    return jsonify(cats)

@app.route('/cats/<int:cat_id>', methods=['GET'])
def get_cat(cat_id):
    cat = cat_api.get_cat(cat_id)
    if cat is None:
        abort(404)
    return jsonify(cat)

@app.route('/cats', methods=['POST'])
def add_cat():
    new_cat = request.get_json()
    cat_api.add_cat(new_cat)
    return jsonify(new_cat), 201

@app.route('/cats/<int:cat_id>', methods=['PUT'])
def update_cat(cat_id):
    new_data = request.get_json()
    cat_api.update_cat(cat_id, new_data)
    return '', 204

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

if __name__ == '__main__':
    cats = cat_api.fetch_cats()
    cat_api.insert_cats(cats)
    app.run(debug=True)
