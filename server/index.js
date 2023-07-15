const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const User = require('./models/User');
const PORT = process.env.PORT;
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
const secret = process.env.SECRET_KEY;
const cookieParser = require('cookie-parser');

const app = express();
const jwt = require('jsonwebtoken');

require('./DB/conn.js');


//middleware
app.use(cors({
    credentials: true,
    origin:'http://localhost:3000'
}));

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.json('server is Ok');
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

app.post('/login', async (req,res) => {
    const {username, password} = req.body;
    const userDoc = await User.findOne({username});
    
    const passOk = bcrypt.compareSync(password, userDoc.password);
  
    if(passOk){
        //logedin
        jwt.sign({username,id:userDoc.id},secret,{}, (err,token) => {

            if(err) throw err;
            res.cookie('token',token).json({
                id:userDoc._id,
                username,
            }
            );
        });
        // req.json();,()
    }else{
        res.status(400).json('wrong credentials');
    }
});

app.get('/profile' , (req, res ) => {
    const{token} = req.cookies;
    jwt.verify(token,secret,{}, (err,info) =>{
        if(err) throw err;
        res.json(info);
    });

});

app.post('/logout',(req, res) => {
    res.cookie('token','').json('logout');
});


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
