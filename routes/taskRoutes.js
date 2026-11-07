const express = require('express');
const router = express.Router();

const { sql } = require('../config/db');

// GET: Retrieve all tasks
router.get('/', async (req, res) => {
    try {
        const result = await sql.query(
            'SELECT * FROM tasks ORDER BY id DESC'
        );

        res.json(result.recordset);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST: Add a new task
router.post('/', async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: 'Task title is required'
            });
        }

        const result = await sql.query`
            INSERT INTO tasks (title, description, status)
            OUTPUT INSERTED.*
            VALUES (${title.trim()}, ${description || ''}, 'pending')
        `;

        res.status(201).json({
            message: 'Task added successfully!',
            task: result.recordset[0]
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// PATCH: Update task status
router.patch('/:id/status', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: 'Invalid task ID'
            });
        }

        if (!['pending', 'completed'].includes(status)) {
            return res.status(400).json({
                message: 'Invalid task status'
            });
        }

        const result = await sql.query`
            UPDATE tasks
            SET status = ${status}
            WHERE id = ${id}
        `;

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                message: 'Task not found'
            });
        }

        res.json({
            message: 'Task status updated successfully!'
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE: Remove a task
router.delete('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: 'Invalid task ID'
            });
        }

        const result = await sql.query`
            DELETE FROM tasks
            WHERE id = ${id}
        `;

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                message: 'Task not found'
            });
        }

        res.json({
            message: 'Task deleted successfully!'
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;