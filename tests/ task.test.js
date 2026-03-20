// tests/task.test.js
const request = require('supertest');
const app = require('../app');
const pool = require('../config/db');

let token;

// Clean up and get token before all tests
beforeAll(async () => {
  await pool.query('DELETE FROM tasks');
  await pool.query('DELETE FROM users');

  // Register and login to get a valid token
  await request(app)
    .post('/auth/register')
    .send({ email: 'taskuser@example.com', password: 'secret123' });

  const res = await request(app)
    .post('/auth/login')
    .send({ email: 'taskuser@example.com', password: 'secret123' });

  token = res.body.token;
});

// Close database connection after all tests
afterAll(async () => {
  await pool.end();
});

// ─── CREATE TASK TESTS ─────────────────────────────────────

describe('POST /tasks', () => {

  it('should create a task successfully', async () => {
    const res = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'My first task' });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('success');
    expect(res.body.data.title).toBe('My first task');
    expect(res.body.data.completed).toBe(false);
  });

  it('should not create task without token', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'My first task' });

    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe('error');
  });

  it('should not create task with short title', async () => {
    const res = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'ab' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Title must be at least 3 characters long');
  });

  it('should not create task with empty title', async () => {
    const res = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Title is required');
  });

});

// ─── GET TASKS TESTS ───────────────────────────────────────

describe('GET /tasks', () => {

  it('should get all tasks for logged in user', async () => {
    const res = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should not get tasks without token', async () => {
    const res = await request(app)
      .get('/tasks');

    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe('error');
  });

});

// ─── UPDATE TASK TESTS ─────────────────────────────────────

describe('PUT /tasks/:id', () => {

  it('should update a task successfully', async () => {
    // First create a task
    const created = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Task to update' });

    const taskId = created.body.data.id;

    const res = await request(app)
      .put(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ completed: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.completed).toBe(true);
  });

  it('should return 404 for non existent task', async () => {
    const res = await request(app)
      .put('/tasks/99999')
      .set('Authorization', `Bearer ${token}`)
      .send({ completed: true });

    expect(res.statusCode).toBe(404);
  });

});

// ─── DELETE TASK TESTS ─────────────────────────────────────

describe('DELETE /tasks/:id', () => {

  it('should delete a task successfully', async () => {
    // First create a task
    const created = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Task to delete' });

    const taskId = created.body.data.id;

    const res = await request(app)
      .delete(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
  });

  it('should return 404 for non existent task', async () => {
    const res = await request(app)
      .delete('/tasks/99999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });

});