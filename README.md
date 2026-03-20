# Task Manager API

A secure, production-style RESTful API for managing personal tasks — built with Node.js, Express.js, and PostgreSQL.

---

## 🚀 Features

- **Authentication** — Register and login with email and password
- **JWT Authorization** — Protected routes using JSON Web Tokens
- **Task Management** — Full CRUD operations on tasks
- **Validation** — Request validation using Joi schemas on all endpoints
- **Pagination** — Page through tasks with page and limit controls
- **Filtering** — Filter tasks by completion status
- **Sorting** — Sort tasks by id, title, or completed status
- **Swagger Docs** — Interactive API documentation at `/api-docs`
- **Error Handling** — Centralized error handling with consistent responses
- **Automated Testing** — 19 tests covering auth and task endpoints using Jest and Supertest

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js v24 |
| Framework | Express.js v5 |
| Database | PostgreSQL |
| Authentication | JWT + bcrypt |
| Validation | Joi |
| Documentation | Swagger (OpenAPI 3.0) |
| Testing | Jest + Supertest |
| Configuration | dotenv |

---

## 📁 Project Structure
```
task-manager-api
│
├── config
│   └── db.js                 # PostgreSQL connection pool
│
├── controllers
│   ├── authController.js     # Register and login logic
│   └── taskController.js     # CRUD task logic
│
├── middleware
│   ├── authMiddleware.js     # JWT verification
│   ├── validateMiddleware.js # Reusable Joi validation
│   └── errorHandler.js      # Centralized error handler
│
├── routes
│   ├── authRoutes.js         # Auth endpoints + Swagger docs
│   └── taskRoutes.js         # Task endpoints + Swagger docs
│
├── validators
│   ├── authValidator.js      # Register and login schemas
│   └── taskValidator.js      # Create and update task schemas
│
├── docs
│   └── swagger.js            # Swagger configuration
│
├── tests
│   ├── auth.test.js          # Auth endpoint tests
│   └── task.test.js          # Task endpoint tests
│
├── app.js                    # Express app configuration
├── server.js                 # Server entry point
├── .env                      # Environment variables (not committed)
└── package.json
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v20 or higher
- PostgreSQL

### 1. Clone the repository
```bash
git clone https://github.com/Vrishali34/task-manager-api.git
cd task-manager-api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:
```
PORT=5000
DB_USER=your_db_user
DB_HOST=localhost
DB_NAME=taskdb
DB_PASSWORD=your_db_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret_key
```

### 4. Set up the database

Run these SQL commands in your PostgreSQL client:
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Start the server
```bash
npm start
```

Server runs at `http://localhost:5000`

---

## 🧪 Running Tests

The test suite uses Jest and Supertest with a separate isolated test database.

### Set up test database
```sql
CREATE DATABASE taskdb_test;
```

Create tables in test database (same schema as above but in `taskdb_test`).

Create a `.env.test` file:
```
PORT=5001
DB_USER=your_db_user
DB_HOST=localhost
DB_NAME=taskdb_test
DB_PASSWORD=your_db_password
DB_PORT=5432
JWT_SECRET=test_jwt_secret_key
```

### Run tests
```bash
npm test
```

Expected output:
```
Tests:       19 passed, 19 total
Test Suites: 2 passed, 2 total
```

---

## 📖 API Documentation

Interactive Swagger documentation available at:
```
http://localhost:5000/api-docs
```

---

## 🔗 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | /auth/register | Register a new user | No |
| POST | /auth/login | Login and get JWT token | No |

### Tasks

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | /tasks | Get all tasks | Yes |
| POST | /tasks | Create a new task | Yes |
| PUT | /tasks/:id | Update a task | Yes |
| DELETE | /tasks/:id | Delete a task | Yes |

### GET /tasks Query Parameters

| Parameter | Type | Description | Example |
|---|---|---|---|
| page | integer | Page number | 1 |
| limit | integer | Tasks per page | 10 |
| completed | boolean | Filter by status | true |
| sort | string | Sort field | title |
| order | string | Sort direction | desc |

---

## 🔐 Authentication Flow
```
1. Register → POST /auth/register
2. Login    → POST /auth/login → receive JWT token
3. Use token in Authorization header for all task requests
   Authorization: Bearer <your_token>
```

---

## ✅ Validation Rules

### Register
- Email must be a valid email address
- Password must be at least 6 characters and max 128 characters

### Login
- Email must be a valid email address
- Password must not be empty

### Create Task
- Title is required, min 3 characters, max 255 characters

### Update Task
- Title is optional, min 3 characters, max 255 characters
- Completed is optional, must be boolean

---

## 🗺️ Roadmap

- [x] JWT Authentication
- [x] CRUD Task Operations
- [x] Pagination, Filtering, Sorting
- [x] Joi Request Validation
- [x] Swagger Documentation
- [x] Automated Testing with Jest
- [ ] Cursor-based Pagination
- [ ] Docker Support
- [ ] Winston Logging

---

## 👩‍💻 Author

Vrishali — [GitHub](https://github.com/Vrishali34)
