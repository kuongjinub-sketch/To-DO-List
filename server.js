const express = require('express');
const path = require('path');
const { connectDB } = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Main route
app.get('/api', (req, res) => {
    res.send('To-Do List API is running!');
});

// Task routes
app.use('/api/tasks', taskRoutes);

// Start server
async function startServer() {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Unable to start application.');
        process.exit(1);
    }
}

startServer();