const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
const User = require('./models/User');
const PORT = process.env.PORT;

const app = express();

require('./DB/conn.js');

//middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json('test Ok');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const userDoc = await User.create({ username, password });

  res.json(userDoc);
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
