const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// API endpoints that work with db.json
app.get('/api/test', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

app.get('/api/jobs', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync('./db.json', 'utf8'));
        res.json(data.jobs || []);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load jobs' });
    }
});

app.get('/api/jobs/:id', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync('./db.json', 'utf8'));
        const job = data.jobs.find(j => j.id === req.params.id);
        if (job) {
            res.json(job);
        } else {
            res.status(404).json({ error: 'Job not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to load job' });
    }
});

app.post('/api/auth/login', (req, res) => {
    try {
        const { email, password } = req.body;
        const data = JSON.parse(fs.readFileSync('./db.json', 'utf8'));
        const user = data.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            res.json({
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    title: user.title
                }
            });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Simple test server running on http://localhost:${PORT}`);
    console.log(`📂 Serving files from: ${process.cwd()}`);
});
