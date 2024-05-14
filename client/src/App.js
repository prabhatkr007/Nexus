import { useState } from 'react';
import './App.css';
import Layout from './Layout';
import { Routes, Route } from "react-router-dom";
import IndexPage from './pages/indexPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { UserContextProvider } from './userContext';
import CreatePost from './pages/CreatePost';
import PostPage from './pages/PostPage';
import EditPost from './pages/EditPost';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <UserContextProvider>
    <Routes>
    <Route path='/' element={<Layout />} >
      <Route index element = {<IndexPage loading={loading} setLoading={setLoading}/>} />
      <Route path='/login'element={<LoginPage />}/>
      <Route path='/register'element={<RegisterPage />}/>
      <Route path='/create' element={<CreatePost loading={loading} setLoading={setLoading}/>}/>
      <Route path='/article/:id' element={<PostPage />}/>
      <Route path='/edit/:id' element={<EditPost loading={loading} setLoading={setLoading}/>}/>
    </Route>
   </Routes>

    </UserContextProvider>
   

  );
}

export default App;
