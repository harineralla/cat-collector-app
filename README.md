# Cat Collector Application

## Description
The Cat Collector application interacts with TheCatAPI to retrieve information about 100 random cats, including their images, and allows users to perform create, read, update, and delete (CRUD) operations on this data within a local application.

### Integration with TheCatAPI
- Register and use an API key to fetch cat data.
- [The Cat API](https://thecatapi.com/)

## Technologies Used
- Front-end: React.js, HTML, CSS
- Back-end: Python, Flask
- Database: PostgreSQL
- External API: TheCatAPI

## Setup Instructions

### Prerequisites
- Node.js and npm
- Python
- PostgreSQL
- TheCatAPI API key

### Backend Setup
1. **Clone the repository:**
    ```bash
    git clone https://github.com/harineralla/cat-collector-app.git
    cd cat-collector-app
    ```

2. **Set up a virtual environment:**
    ```bash
    cd flask-app
    python -m venv venvv
    source venvv/bin/activate
    ```

3. **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

5. **Initialize the database:**
    ```bash
    psql -U postgres -f init_db.sql
    password:  12345 
    ```

7. **Run the backend server:**
    ```bash
    flask --app app.py run
    ```

### Frontend Setup
1. **Navigate to the frontend directory:**
    ```bash
    cd react-app
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Run the frontend server:**
    ```bash
    npm start
    ```

## Database Schema
### Cats Table
| Column         | Type    | Description                      |
| -------------- | ------- | -------------------------------- |
| id             | SERIAL  | Primary key                      |
| api_id         | VARCHAR | ID from TheCatAPI                |
| image_url      | TEXT    | URL of the cat's image           |
| name           | VARCHAR | Name of the cat                  |
| description    | TEXT    | Description of the cat           |
| favorite       | BOOLEAN | Indicates if the cat is a favorite|

## API Endpoints

### GET /cats
- **Description:** Retrieve all cat data with pagination and optional breed filter.
- **Query Parameters:**
    - `page` (int, default=1): The page number.
    - `per_page` (int, default=10): Number of cats per page.
    - `breed` (string, optional): Filter cats by breed name.
- **Response:**
    ```json
    [
        {
            "id": 101,
            "api_id": "OhTkBTPnD",
            "url": "https://cdn2.thecatapi.com/images/OhTkBTPnD.jpg",
            "favorite": false,
            "custom_name": null,
            "description": "The Birman is a docile, quiet cat...",
            "breed_id": "birm",
            "breed_name": "Birman",
            "cfa_url": "http://cfa.org/Breeds/BreedsAB/Birman.aspx",
            "vetstreet_url": "http://www.vetstreet.com/cats/birman",
            "vcahospitals_url": "https://vcahospitals.com/know-your-pet/cat-breeds/birman",
            "origin": "France",
            "life_span": "14 - 15",
            "alt_names": "Sacred Birman, Sacred Cat Of Burma"
        }
    ]
    ```

### GET /getFavouriteCats
- **Description:** Retrieve all favorite cats.
- **Response:**
    ```json
    [
        {
            "id": 101,
            "api_id": "OhTkBTPnD",
            "url": "https://cdn2.thecatapi.com/images/OhTkBTPnD.jpg",
            "favorite": true,
            "custom_name": null,
            "description": "The Birman is a docile, quiet cat...",
            "breed_id": "birm",
            "breed_name": "Birman",
            "cfa_url": "http://cfa.org/Breeds/BreedsAB/Birman.aspx",
            "vetstreet_url": "http://www.vetstreet.com/cats/birman",
            "vcahospitals_url": "https://vcahospitals.com/know-your-pet/cat-breeds/birman",
            "origin": "France",
            "life_span": "14 - 15",
            "alt_names": "Sacred Birman, Sacred Cat Of Burma"
        }
    ]
    ```

### GET /cats/:id
- **Description:** Retrieve a specific cat's details by its ID.
- **Response:**
    ```json
    {
        "id": 1,
        "api_id": "abc123",
        "url": "https://example.com/cat.jpg",
        "custom_name": "Fluffy",
        "description": "A cute cat.",
        "favorite": true,
        "breed_id": "breed1",
        "breed_name": "BreedName",
        "cfa_url": "http://example.com/cfa",
        "vetstreet_url": "http://example.com/vetstreet",
        "vcahospitals_url": "http://example.com/vcahospitals",
        "origin": "Country",
        "life_span": "10-15 years",
        "alt_names": "Alternate Name"
    }
    ```

### POST /cats/:id/favorite
- **Description:** Mark a specific cat as a favorite.
- **Response:**
    ```json
    {
        "message": "Cat marked as favorite successfully."
    }
    ```

### POST /cats/:id/unfavorite
- **Description:** Unmark a specific cat as a favorite.
- **Response:**
    ```json
    {
        "message": "Cat unmarked as favorite successfully."
    }
    ```

### DELETE /cats/:id
- **Description:** Remove a specific cat from the database.
- **Response:**
    ```json
    {
        "message": "Cat removed successfully."
    }
    ```

## Usage
1. **Run the backend server.**
    ```bash
    flask --app app.py run
    ```

2. **Run the frontend server.**
    ```bash
    npm start
    ```
3. **Navigate to `http://localhost:3000` in your web browser.**

4. **Use the application to view, add, update, and delete cat information.**

## Testing
- **Unit Tests:** Run unit tests to ensure reliability and functionality.
    ```bash
    python -m unittest    
    ```
