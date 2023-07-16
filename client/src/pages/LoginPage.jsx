import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom";
import { userContext } from "../userContext";


export default function LoginPage(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const{setUserInfo} = useContext(userContext);

    const navigate = useNavigate();

    async function login(ev) {
        ev.preventDefault();
      
        try {
          const response = await fetch('http://localhost:4000/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          });
      
          if (response.ok) {
            const userInfo = await response.json();
            setUserInfo(userInfo);
            navigate('/');
          } else if (response.status === 400) {
            throw new Error('Wrong credentials');
          }
        } catch (error) {
          console.error(error);
          alert(error.message);
        }
      }
      

    return(
        <form className="login" onSubmit={login}>
            <h1>Login</h1>

            <input type="text" 
            placeholder="username" 
            value={username}
            onChange={ev => setUsername(ev.target.value)}/>

            <input type="password" 
            placeholder="password" 
            value={password}
            onChange={ev => setPassword(ev.target.value)}
            />
            <button>Login</button>
        </form>
    )
}