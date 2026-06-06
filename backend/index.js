require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Auth Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Members Routes (Phase 3)
const memberRoutes = require('./routes/memberRoutes');
app.use('/api/members', memberRoutes);

// Events Routes (Phase 3 Admin)
const eventRoutes = require('./routes/eventRoutes');
app.use('/api/events', eventRoutes);

// Member Events Routes (Phase 4)
const memberEventRoutes = require('./routes/memberEventRoutes');
app.use('/api/member/events', memberEventRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok' }, message: 'Server is running' });
});

// Centralized Error Handler
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
