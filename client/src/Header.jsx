import { useContext} from 'react'
import { Link } from 'react-router-dom'
import { userContext } from './userContext';


export default function Header() {
  const { userInfo, setUserInfo } = useContext(userContext);
  
  function logout() {
    fetch('api/logout', {
      credentials: 'include',
      method: 'POST',
    })
    .then(() => {
      setUserInfo("");
      localStorage.removeItem('username')
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
            <Link onClick={logout}>Logout({username})</Link>
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
  </>
  )
}
