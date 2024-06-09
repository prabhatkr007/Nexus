import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { userContext } from './userContext';
import './styles/loader.css'

export default function Header() {
  const { setUserInfo, userInfo } = useContext(userContext);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      await fetch('api/profile', {
        credentials: 'include',
      });
      setLoading(false);
    } catch (err) {
      console.log(err.message);
      setLoading(false); // Set loading to false even if there's an error
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);


  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, [setUserInfo]);

  useEffect(() => {
    if (userInfo) {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    } else {
      localStorage.removeItem('userInfo');
    }
  }, [userInfo]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (userInfo) {
        const response = await fetch('api/profile', {
          credentials: 'include',
        });
  
        if (response.status === 401) {
          setUserInfo({});
        }
      }
    };
  
    fetchUserProfile();
  }, []);
  

  function logout() {
    fetch('api/logout', {
      credentials: 'include',
      method: 'POST',
    })
    .then(() => {
      setUserInfo({});
    })
    .catch(error => {
      console.log('Logout failed:', error);
    });
  }

  const username = userInfo?.username;

  return (
    <>
    <header>
      <Link to='/' className='logo'>Nexus</Link>

      <nav>
        {username && (
          <>
            <Link to='/create'>Create new post</Link>
            <a onClick={logout}>Logout({username})</a>
          </>
        )}

        {!username && (
          <>
            <Link to='/login'>Login</Link>
            <Link to='/register'>Register</Link>
          </>
        )}
      </nav>
    </header>

    {loading &&(
      <div className="loader-container">
        <div className="loader"></div>
        <h3>Free Server Guys, Please Wait !🦜</h3>
      </div>
    )
  }
    
  </>
  )
}
