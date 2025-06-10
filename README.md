# 📦 Shurah Product API

A simple, scalable Node.js web application demonstrating how to handle multiple concurrent connections using Node.js core modules. This API allows users to perform basic CRUD operations (currently GET and POST) on a list of products stored in a JSON file.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [How to Run](#how-to-run)
- [API Endpoints](#api-endpoints)
- [Scalability Explanation](#scalability-explanation)
- [Example Test with Postman](#example-test-with-postman)
- [Future Improvements](#future-improvements)

---

## ✨ Features

- View all products (`GET /products`)
- Add new products (`POST /products`)
- Update a product (`PUT /products?id=ID`)
- Delete a product (`DELETE /products?id=ID`)
- Handles multiple connections concurrently using non-blocking I/O
- Reads from and writes to `products.json` file
- No external frameworks (built entirely with Node.js core modules)

---

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Core Modules**: `http`, `fs`, `path`, `url`

---

## 🚀 How to Run

1. Clone the repository or download the code.
2. Open the project folder in **VSCode**.
3. Make sure your `products.json` file is in a `data/` folder inside your project like this:

   ```
   project-folder/
   ├── data/
   │   └── products.json
   ├── index.js
   ```

4. Run the server:

   ```bash
   node index.js
   ```

5. Make requests using Postman or Thunder Client at:

   ```
   http://localhost:500/products
   ```

---

## 🔌 API Endpoints

### 1. `GET /`

Returns a welcome message.

**Response:**

```json
{ "message": "Welcome to Shurah Product API!" }
```

---

### 2. `GET /products`

Returns the full list of products from `products.json`.

**Example Response:**

```json
[
  {
    "id": 0,
    "name": "Coke",
    "category": "Drinks",
    "quantity": 10
  },
  {
    "id": 1,
    "name": "Bournvita",
    "category": "Provision",
    "quantity": 20
  }
]
```

---

### 3. `POST /products`

Adds a new product to the list.

**Request Body (JSON):**

```json
{
  "name": "Milo",
  "category": "Provision",
  "quantity": 12
}
```

**Success Response:**

```
Product added successfully
```

---

### 4. `PUT /products?id=0`

Updates an existing product with the given id.

**Request Body (JSON):**

```json
{
  "name": "Milo",
  "category": "Provision",
  "quantity": 15
}
```

**Success Response:**

```
Product updated successfully
```

---

### 5. `DELETE /products?id=0`

Deletes the product with the specified id.

**Success Response:**

```
Product deleted successfully
```

---

## ⚙️ Scalability Explanation

This project showcases Node.js’s non-blocking I/O and asynchronous event loop capabilities.

- When multiple users make requests (e.g., sending new product data), Node.js doesn't block other operations — it reads and writes files asynchronously.
- This means even under multiple concurrent connections, the server remains responsive.
- Node’s single-threaded nature, combined with its event-driven architecture, makes it highly suitable for I/O-heavy tasks like this one.

---

## 🧪 Example Test with Postman

1. Download and install [Postman](https://www.postman.com/downloads/) or use the Thunder Client extension in VSCode.
2. Set method to `POST`.
3. Set the URL to:
   ```
   http://localhost:500/products
   ```
4. Under **Body > raw > JSON**, paste this:

```json
{
  "name": "Pepsi",
  "category": "Drinks",
  "quantity": 5
}
```

5. Click **Send**.

---

## 🔮 Future Improvements

- Add validation for product fields.
- Handle error responses with more clarity and consistency.
- Use `stream` module for large file handling.
- Persist data with a database like MongoDB or PostgreSQL.
