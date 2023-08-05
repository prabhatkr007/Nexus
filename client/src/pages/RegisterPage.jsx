
import {useState} from 'react'
import { useNavigate } from 'react-router-dom';


export default function RegisterPage(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function register(ev) {
        ev.preventDefault();
        setLoading(true)
      
        try {
          const response = await fetch('api/register', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' },
          });
      
          if (response.status === 400) {
            throw new Error('Registration Failed! Try another username');
          }
      
          alert('Registration Successful');
          navigate('/login');
        } catch (error) {
          console.error(error);
          setLoading(false);
          alert(error.message);

        }
      }
      
      if (loading) {
        return (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        );
      }
    
    return(
    <form className="register" onSubmit={register}>
        <h1>Register</h1>
        <input type="text"
            placeholder="username"
            value={username}
            onChange={ev => setUsername(ev.target.value)} />
        <input type="password" 
            placeholder="password" 
            value={password}
            onChange={ev => setPassword(ev.target.value)}/>
        <button>Register</button>
    </form>
    )
}