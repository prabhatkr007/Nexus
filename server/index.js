const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const User = require('./models/User');
const PORT = process.env.PORT;
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
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
    try{
        const userDoc = await User.create({ username, 
            password:bcrypt.hashSync(password,salt) });
        res.json(userDoc);
    } catch(e){
        console.log(e);
        res.status(400).json(e);
    }
 

});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
