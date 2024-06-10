import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userContext } from "../userContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUserInfo } = useContext(userContext);

  const navigate = useNavigate();

  async function login(ev) {
    ev.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("api/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        const userInfo = await response.json();
        setUserInfo(userInfo);
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
        navigate("/");
      } else if (response.status === 400) {
        throw new Error("Wrong credentials");
      }
    } catch (error) {
      setLoading(false);
      alert(error.message);
      console.error(error);
    
    }
  }

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <form className="login" onSubmit={login}>
      <h1>Login</h1>

      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
      />

      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <button>Login</button>
    </form>
  );
}
