// server/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const todosRouter = require('./routes/todos');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// health & ping
app.get('/_health', (req, res) => res.json({ status: 'ok', timestamp: Date.now() }));
app.get('/api/ping', (req, res) => res.json({ message: 'pong' }));

// Mount API
app.use('/api/todos', todosRouter);

// Error handler (basic)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

async function start() {
  if (!MONGO_URI) {
    console.error('MONGO_URI not set. Check .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected ✅');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  const graceful = () => {
    console.log('Shutting down gracefully...');
    server.close(() => {
      mongoose.disconnect().then(() => {
        console.log('MongoDB disconnected');
        process.exit(0);
      });
    });
  };
  process.on('SIGINT', graceful);
  process.on('SIGTERM', graceful);
}

start();

