# Cat Collector Application

## Objective
The Cat Collector application interacts with TheCatAPI to retrieve information about 100 random cats, including their images, and allows users to perform create, read, update, and delete (CRUD) operations on this data within a local application.

## Table of Contents
- [Requirements](#requirements)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Testing](#testing)
- [Bonus](#bonus)
- [License](#license)

## Requirements
### Front-end
- Use JavaScript with a modern framework/library (React, Vue.js, etc.) or vanilla JavaScript with HTML/CSS.
- Provide a user-friendly interface that displays cat images and information.
- Functionality to add, remove, and update cat information.
- Implement pagination or infinite scroll.
- Allow users to specify a cat breed to retrieve specific cats.

### Back-end
- Use Python with Flask or Django.
- Create RESTful API endpoints for CRUD operations on cat data.
- Fetch 100 random cats from TheCatAPI upon initial setup and store in PostgreSQL.

### Database
- Use PostgreSQL to store cat information.
- Design a schema with a table for storing cat data.

### Integration with TheCatAPI
- Register and use an API key to fetch cat data.

## Features
- Fetch and display 100 random cats.
- CRUD operations on cat data.
- Pagination or infinite scroll.
- Breed-specific search functionality.

## Technologies Used
- Front-end: React/Vue.js/Vanilla JavaScript, HTML, CSS
- Back-end: Python, Flask/Django
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
    git clone <repository-url>
    cd <repository-folder>
    ```

2. **Set up a virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate
    ```

3. **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4. **Create a `.env` file:**
    ```env
    DATABASE_URL=postgresql://<username>:<password>@localhost/<database_name>
    CAT_API_KEY=your-cat-api-key
    ```

5. **Initialize the database:**
    ```bash
    python manage.py migrate
    ```

6. **Fetch and store 100 random cats:**
    ```bash
    python manage.py fetch_cats
    ```

7. **Run the backend server:**
    ```bash
    python manage.py runserver
    ```

### Frontend Setup
1. **Navigate to the frontend directory:**
    ```bash
    cd frontend
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
- **Description:** Retrieve all cat data.
- **Response:**
    ```json
    [
        {
            "id": 1,
            "api_id": "abc123",
            "image_url": "https://example.com/cat.jpg",
            "name": "Fluffy",
            "description": "A cute cat.",
            "favorite": true
        },
        ...
    ]
    ```

### POST /cats
- **Description:** Add a new cat to favorites.
- **Request:**
    ```json
    {
        "api_id": "abc123",
        "image_url": "https://example.com/cat.jpg",
        "name": "Fluffy",
        "description": "A cute cat.",
        "favorite": true
    }
    ```
- **Response:**
    ```json
    {
        "id": 1,
        "api_id": "abc123",
        "image_url": "https://example.com/cat.jpg",
        "name": "Fluffy",
        "description": "A cute cat.",
        "favorite": true
    }
    ```

### GET /cats/:id
- **Description:** Retrieve a specific cat's details.
- **Response:**
    ```json
    {
        "id": 1,
        "api_id": "abc123",
        "image_url": "https://example.com/cat.jpg",
        "name": "Fluffy",
        "description": "A cute cat.",
        "favorite": true
    }
    ```

### PUT /cats/:id
- **Description:** Update a specific cat's details.
- **Request:**
    ```json
    {
        "name": "Fluffy",
        "description": "A very cute cat.",
        "favorite": false
    }
    ```
- **Response:**
    ```json
    {
        "id": 1,
        "api_id": "abc123",
        "image_url": "https://example.com/cat.jpg",
        "name": "Fluffy",
        "description": "A very cute cat.",
        "favorite": false
    }
    ```

### DELETE /cats/:id
- **Description:** Remove a cat from favorites.
- **Response:**
    ```json
    {
        "message": "Cat removed successfully"
    }
    ```

## Usage
1. **Run the backend server.**
2. **Run the frontend server.**
3. **Navigate to `http://localhost:3000` in your web browser.**
4. **Use the application to view, add, update, and delete cat information.**

## Testing
- **Unit Tests:** Run unit tests to ensure reliability and functionality.
    ```bash
    python manage.py test
    ```
- **Integration Tests:** Ensure integration tests cover end-to-end functionality.

## Bonus
- **Unit Tests:** Comprehensive unit tests for backend APIs.
- **Integration Tests:** Testing the entire flow from front-end to back-end.

## License
This project is licensed under the MIT License.
