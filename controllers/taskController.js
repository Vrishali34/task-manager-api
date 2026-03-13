const pool = require('../config/db');

// GET all tasks for logged-in user with pagination + metadata + filtering + sorting
const getTasks = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const completed = req.query.completed;

    // Sorting parameters
    const sort = req.query.sort || 'id';
    const order = req.query.order === 'desc' ? 'DESC' : 'ASC';

    const offset = (page - 1) * limit;

    // Allowed fields for sorting (security)
    const allowedSortFields = ['id', 'title', 'completed'];
    const sortField = allowedSortFields.includes(sort) ? sort : 'id';

    // Build filtering condition
    let filterQuery = 'WHERE user_id = $1';
    let queryParams = [userId];

    if (completed !== undefined) {
      filterQuery += ' AND completed = $2';
      queryParams.push(completed === 'true');
    }

    // 1️⃣ Get total number of tasks (with filter applied)
    const countQuery = `SELECT COUNT(*) FROM tasks ${filterQuery}`;
    const countResult = await pool.query(countQuery, queryParams);

    const totalTasks = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalTasks / limit);

    // 2️⃣ Add pagination parameters
    queryParams.push(limit);
    queryParams.push(offset);

    // 3️⃣ Fetch tasks with sorting
    const result = await pool.query(
      `SELECT * FROM tasks
       ${filterQuery}
       ORDER BY ${sortField} ${order}
       LIMIT $${queryParams.length - 1}
       OFFSET $${queryParams.length}`,
      queryParams
    );

    res.status(200).json({
      status: 'success',
      page,
      limit,
      totalTasks,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      sort: sortField,
      order: order.toLowerCase(),
      data: result.rows
    });

  } catch (err) {
    next(err);
  }
};


// CREATE task for logged-in user
const createTask = async (req, res, next) => {
  try {
    const { title } = req.body;
    const userId = req.user.userId;

    if (!title) {
      const error = new Error('Title is required');
      error.statusCode = 400;
      return next(error);
    }

    const result = await pool.query(
      'INSERT INTO tasks (title, user_id) VALUES ($1, $2) RETURNING *',
      [title, userId]
    );

    res.status(201).json({
      status: 'success',
      data: result.rows[0]
    });

  } catch (err) {
    next(err);
  }
};


// UPDATE task (only if it belongs to logged-in user)
const updateTask = async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id);
    const { title, completed } = req.body;
    const userId = req.user.userId;

    const result = await pool.query(
      `UPDATE tasks
       SET title = COALESCE($1, title),
           completed = COALESCE($2, completed)
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [title, completed, taskId, userId]
    );

    if (result.rows.length === 0) {
      const error = new Error('Task not found or not authorized');
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


// DELETE task (only if it belongs to logged-in user)
const deleteTask = async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id);
    const userId = req.user.userId;

    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *',
      [taskId, userId]
    );

    if (result.rows.length === 0) {
      const error = new Error('Task not found or not authorized');
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


module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};
