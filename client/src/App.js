import { useState, useEffect } from 'react';
import {Routes, Route} from "react-router-dom";

import './App.css';
import Layout from './Layout';
import IndexPage from './pages/indexPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import {userContext} from './userContext'
import CreatePost from './pages/CreatePost';
import PostPage from './pages/PostPage';
import EditPost from './pages/EditPost';

function App() {
  const [userInfo, setUserInfo] = useState({})
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const response = await fetch('api/profile', {
        credentials: 'include',
      });

    const user = await response.json()
    setUserInfo(user)
    } catch (err) {
      console.log(err.message);
    }
    finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);


  return (
    <userContext.Provider value = {{userInfo, setUserInfo}}>
      <Routes>
      <Route path='/' element={<Layout loading = {loading}/>} >
        <Route index element = {<IndexPage />} />
        <Route path='/login'element={<LoginPage />}/>
        <Route path='/register'element={<RegisterPage />}/>
        <Route path='/create' element={<CreatePost />}/>
        <Route path='/article/:id' element={<PostPage />}/>
        <Route path='/edit/:id' element={<EditPost />}/>
      </Route>
    </Routes>
  </userContext.Provider>
  );
}

export default App;
