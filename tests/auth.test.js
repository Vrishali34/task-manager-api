// tests/auth.test.js
const request = require('supertest');
const app = require('../app');
const pool = require('../config/db');

// Clean up database before all tests run
beforeAll(async () => {
  await pool.query('DELETE FROM tasks');
  await pool.query('DELETE FROM users');
});

// Close database connection after all tests finish
afterAll(async () => {
  await pool.end();
});

// ─── REGISTER TESTS ───────────────────────────────────────

describe('POST /auth/register', () => {

  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'test@example.com', password: 'secret123' });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('success');
    expect(res.body.data.email).toBe('test@example.com');
  });

  it('should not register with duplicate email', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'test@example.com', password: 'secret123' });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toBe('Email already registered');
  });

  it('should not register with invalid email', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'notanemail', password: 'secret123' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Please provide a valid email address');
  });

  it('should not register with short password', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'new@example.com', password: '123' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Password must be at least 6 characters long');
  });

  it('should not register with empty body', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Email is required');
  });

});

// ─── LOGIN TESTS ───────────────────────────────────────────

describe('POST /auth/login', () => {

  it('should login successfully and return a token', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'secret123' });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.token).toBeDefined();
  });

  it('should not login with wrong password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Invalid email or password');
  });

  it('should not login with unregistered email', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'nobody@example.com', password: 'secret123' });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Invalid email or password');
  });

  it('should not login with missing fields', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Email is required');
  });

});