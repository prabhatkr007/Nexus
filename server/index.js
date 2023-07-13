const express = require('express');
const app = express();

app.get('/',(req,res) => {
    res.json('test Ok');
});

app.post('/register',(req,res) => {
    res.json('test Ok2');
});

app.listen(4000);
