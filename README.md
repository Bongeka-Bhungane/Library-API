# Library-API
## Project Overview

This project is a RESTful API built with **Node.js, Express, and TypeScript** to manage a simple library system.
The API allows librarians to manage **authors and books**, including creating, reading, updating, and deleting records.

Each **book belongs to an author**, and the API ensures that a book cannot exist without a valid author.

The system also supports **validation, error handling, filtering, searching, sorting, and pagination**.

---

# Technologies Used

* Node.js
* Express
* TypeScript
* Express Validator
* Nodemon

---

# Running the Project

## Install dependencies

```
npm install
```

## Run the server

```
npm run dev
```

Server runs at:

```
http://localhost:3000
```

---

# API Endpoints

## Authors

### Create Author

POST `/authors`

Request Body

```
{
"name": "Zakes Mda",
"bio": "South African novelist"
}
```

Response

```
201 Created
```

---

### Get All Authors

GET `/authors`

Response

```
200 OK
```

Returns a list of all authors.

---

### Get Author by ID

GET `/authors/:id`

Example

```
GET /authors/1
```

Response

```
200 OK
```

---

### Update Author

PUT `/authors/:id`

Request Body

```
{
"name": "Updated Name",
"bio": "Updated bio"
}
```

Response

```
200 OK
```

---

### Delete Author

DELETE `/authors/:id`

Response

```
204 No Content
```

---

### Get Books by Author

GET `/authors/:id/books`

Example

```
GET /authors/1/books
```

Returns all books written by the specified author.

---

# Books

### Create Book

POST `/books`

Request Body

```
{
"title": "Ways of Dying",
"year": 1995,
"authorId": 1
}
```

Responses

```
201 Created
```

If author does not exist

```
400 Bad Request
```

If duplicate book exists

```
409 Conflict
```

---

### Get All Books

GET `/books`

Returns a paginated list of books including author details.

Example Response

```
{
"total": 1,
"page": 1,
"limit": 10,
"data": [
  {
    "id": 1,
    "title": "Ways of Dying",
    "year": 1995,
    "authorId": 1,
    "author": {
      "id": 1,
      "name": "Zakes Mda",
      "bio": "South African novelist"
    }
  }
]
}
```

---

### Get Book by ID

GET `/books/:id`

Example

```
GET /books/1
```

Response

```
200 OK
```

---

### Update Book

PUT `/books/:id`

Request Body

```
{
"title": "Updated Title",
"year": 2000,
"authorId": 1
}
```

Response

```
200 OK
```

---

### Delete Book

DELETE `/books/:id`

Response

```
204 No Content
```

---

# Query Parameters (Books)

The API supports advanced queries.

### Search

Search books by title

```
GET /books?search=ways
```

---

### Filter

Filter books by year

```
GET /books?year=1995
```

---

### Sort

Sort books by title or year

```
GET /books?sort=title
```

or

```
GET /books?sort=year
```

---

### Pagination

Limit the number of results

```
GET /books?page=1&limit=5
```

---

# Error Handling

The API returns appropriate HTTP status codes.

| Status | Meaning              |
| ------ | -------------------- |
| 200    | Success              |
| 201    | Created              |
| 204    | Deleted successfully |
| 400    | Invalid input        |
| 404    | Resource not found   |
| 409    | Duplicate resource   |

---

# Middleware

## Logger

Logs every request method and URL.

Example:

```
GET /authors
POST /books
```

## Validation

Input validation is handled using **express-validator**.

Invalid requests return:

```
400 Bad Request
```

---

# Example Workflow

1. Create an author
2. Create a book using that author's ID
3. Retrieve books or authors using the API

Example:

```
POST /authors
POST /books
GET /books
GET /authors/1/books
```
