const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const User = require('./models/User');
const Post = require('./models/Post');
const PORT = process.env.PORT;
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
const secret = process.env.SECRET_KEY;
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({dest:'uploads/'});
const fs = require('fs');



const app = express();
const jwt = require('jsonwebtoken');

require('./DB/conn.js');
const { ObjectId } = require('mongoose').Types;

//middleware
app.use(cors({
    credentials: true,
    origin:'http://localhost:3000'
}));

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

app.get('/', (req, res) => {
  res.json('server is Ok');
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json('Username and password are required');
    }
  
    try {
      const userDoc = await User.create({
        username,
        password: bcrypt.hashSync(password, salt),
      });
      res.json(userDoc);
    } catch (e) {
      console.log(e);
      res.status(400).json(e);
    }
  });
  
  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json('Username and password are required');
    }
  
    try {
      const userDoc = await User.findOne({ username });
  
      if (!userDoc) {
        return res.status(400).json('User not found');
      }
  
      const passOk = bcrypt.compareSync(password, userDoc.password);
  
      if (passOk) {
        jwt.sign({ username, id: userDoc.id }, secret, {}, (err, token) => {
          if (err) throw err;
          res
            .cookie('token', token)
            .json({
              id: userDoc._id,
              username,
            });
        });
      } else {
        res.status(400).json('Wrong credentials');
      }
    } catch (e) {
      console.log(e);
      res.status(500).json('Internal Server Error');
    }
  });
  

app.get('/profile' , (req, res ) => {
    const{token} = req.cookies;
    if (!token) {
        return res.status(401).json('Unauthorized: Token is missing');
      }
    jwt.verify(token,secret,{}, (err,info) =>{
        if(err) throw err;
        else{
            res.json('ok')
        }
    });

});

app.post('/logout',(req, res) => {
    res.cookie('token','').json('logout');
});

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    try {
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
      const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
  
      const { token } = req.cookies;
      if (!token) {
        return res.status(401).json('Unauthorized: Token is missing');
      }
      jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
  
        const { title, summary, content } = req.body;
        const postDoc = await Post.create({
          title,
          summary,
          content,
          cover: newPath,
          author: info.id,
        });
  
        res.json(postDoc);
      });
    } catch (error) {
      console.error(error);
      res.status(500).json('Internal Server Error');
    }
  });
  

  app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    try {
      let newPath = null;
      if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
      }
  
      const { token } = req.cookies;
      if (!token) {
        return res.status(401).json('Unauthorized: Token is missing');
      }
      jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
  
        const { id, title, summary, content } = req.body;
        const postDoc = await Post.findById(id);
        if (!postDoc) {
          return res.status(404).json('Post not found');
        }
  
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if (!isAuthor) {
          return res.status(400).json('You are not the author');
        }
  
        postDoc.title = title;
        postDoc.summary = summary;
        postDoc.content = content;
        postDoc.cover = newPath ? newPath : postDoc.cover;
  
        await postDoc.save(); // Save the updated document
  
        res.json(postDoc);
      });
    } catch (error) {
      console.error(error);
      res.status(500).json('Internal Server Error');
    }
  });
  

  


app.get('/post',async(req, res) => {
    res.json(
        await Post.find()
        .populate('author',['username'])
        .sort({createdAt: -1})
        .limit(20)
        );
});

app.get('/post/:id', async (req, res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author',['username']);
    res.json(postDoc);

})

app.delete('/post/:id', async (req, res) => {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json('Invalid post ID');
      }
      const { token } = req.cookies;
      if (!token) {
        return res.status(401).json('Unauthorized: Token is missing');
      }
      jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
  
        const postDoc = await Post.findByIdAndDelete(id);
        if (!postDoc) {
          return res.status(404).json('Post not found');
        }
  
        res.json('Post deleted successfully');
      });
    } catch (error) {
      console.error(error);
      res.status(500).json('Internal Server Error');
    }
  });
  

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json('Internal Server Error');
  });
  
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
