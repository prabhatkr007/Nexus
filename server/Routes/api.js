const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../models/User');
const Post = require('../models/Post');
const secret = process.env.SECRET_KEY;
const multer = require('multer');
const uploadMiddleware = multer({dest:'uploads/'});
const fs = require('fs');
const salt = bcrypt.genSaltSync(10);
const path = require('path');

const router = express.Router();

router.get('/', (req, res) => {
    res.json('server is Ok');
  });
  
  router.post('/register', async (req, res) => {
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
    
    router.post('/login', async (req, res) => {
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
          jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
            if (err) throw err;
            res
              .cookie('token', token, { httpOnly: true, secure: true  ,sameSite: 'none'}) // Set httpOnly and secure attributes for production
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
    
    
  
  router.get('/profile' , (req, res ) => {
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
  
  router.post('/logout', (req, res) => {
    res
      .cookie('token', null, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        expires: new Date(0),
      })
      .json('logout');
  });
  
  router.post('/post', uploadMiddleware.single('file'), async (req, res) => {
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
    
  
    router.put('/post', uploadMiddleware.single('file'), async (req, res) => {
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
    
          // Delete the previously associated file in /uploads directory
          if (newPath && postDoc.cover) {
            const prevFilePath = path.join(__dirname, '../', postDoc.cover);
            try {
              fs.unlinkSync(prevFilePath); // Remove the previous file from /uploads
            } catch (err) {
              console.error('Error while deleting the previously associated file:', err);
            }
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
    
    
  
  
  router.get('/post',async(req, res) => {
      res.json(
          await Post.find()
          .populate('author',['username'])
          .sort({createdAt: -1})
          .limit(20)
          );
  });
  
  router.get('/post/:id', async (req, res) => {
      const {id} = req.params;
      const postDoc = await Post.findById(id).populate('author',['username']);
      res.json(postDoc);
  
  })
  

  
  router.delete('/post/:id', async (req, res) => {
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
  
        const postDoc = await Post.findById(id);
        if (!postDoc) {
          return res.status(404).json('Post not found');
        }
  
        // Check if the logged-in user is the author of the post
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if (!isAuthor) {
          return res.status(400).json('You are not the author');
        }
  
        // Delete the associated file in /uploads directory
        if (postDoc.cover) {
          const filePath = path.join(__dirname, '../', postDoc.cover);
          try {
            fs.unlinkSync(filePath); // Remove the file from /uploads
          } catch (err) {
            console.error('Error while deleting the associated file:', err);
          }
        }
  
        // Delete the post from the database
        await Post.findByIdAndDelete(id);
  
        res.json('Post and associated file deleted successfully');
      });
    } catch (error) {
      console.error(error);
      res.status(500).json('Internal Server Error');
    }
  });
  

    module.exports = router;
  