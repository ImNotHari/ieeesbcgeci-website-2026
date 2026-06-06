require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// TODO Phase 2: Add Auth logic and route guards

app.get('/api/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok' }, message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
