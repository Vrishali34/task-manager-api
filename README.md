# Task Manager API

A simple RESTful API built with Node.js, Express, and PostgreSQL to manage tasks.

## Features

- Create tasks
- Retrieve all tasks
- Update tasks
- Delete tasks
- PostgreSQL database integration
- Centralized error handling middleware
- Environment variables using dotenv

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- dotenv

## API Endpoints

GET /tasks  
Retrieve all tasks

POST /tasks  
Create a new task

PUT /tasks/:id  
Update a task

DELETE /tasks/:id  
Delete a task

## Setup

Clone the repository

git clone <repo-url>

Install dependencies

npm install

Create a `.env` file

PORT=3000  
DB_USER=your_user  
DB_PASSWORD=your_password  
DB_NAME=your_db  
DB_PORT=5432  

Run the server

node server.js

## Learning Notes

This project helped me understand:

- REST API structure
- Async/await with database queries
- PostgreSQL integration with Node.js
- Middleware and centralized error handling
- Debugging database connection issues
