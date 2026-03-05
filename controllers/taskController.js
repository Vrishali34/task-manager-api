const pool = require('../config/db');

// GET all tasks
const getTasks = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY id ASC');

    res.status(200).json({
      status: 'success',
      data: result.rows
    });

  } catch (err) {
    next(err);
  }
};

// CREATE task
const createTask = async (req, res, next) => {
  try {
    const { title } = req.body;

    if (!title) {
      const error = new Error('Title is required');
      error.statusCode = 400;
      return next(error);
    }

    const result = await pool.query(
      'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
      [title]
    );

    res.status(201).json({
      status: 'success',
      data: result.rows[0]
    });

  } catch (err) {
    next(err);
  }
};

// UPDATE task
const updateTask = async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id);
    const { title, completed } = req.body;

    const result = await pool.query(
      `UPDATE tasks 
       SET title = COALESCE($1, title), 
           completed = COALESCE($2, completed) 
       WHERE id = $3 
       RETURNING *`,
      [title, completed, taskId]
    );

    if (result.rows.length === 0) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      status: 'success',
      data: result.rows[0]
    });

  } catch (err) {
    next(err);
  }
};

// DELETE task
const deleteTask = async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id);

    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING *',
      [taskId]
    );

    if (result.rows.length === 0) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      status: 'success',
      data: result.rows[0]
    });

  } catch (err) {
    next(err);
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };