const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/',(req,res) => {
    res.json('test Ok');

});

app.post('/register',(req,res) => {
    const {username, password} = req.body;

    res.json({requesData:{username,password}});
    
});

app.listen(4000);
