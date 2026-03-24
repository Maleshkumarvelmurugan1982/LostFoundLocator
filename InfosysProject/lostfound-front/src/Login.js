import React, { useState } from "react";
import axios from "axios";

function Login() {

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const loginUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9595/lostfound/login/${userId}/${password}`
      );

      setMessage("Role: " + response.data);
    } catch (error) {
      setMessage("Login Failed");
    }
  };

  return (
    <div>
      <h2>Login Page</h2>

      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUserId(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={loginUser}>Login</button>

      <p>{message}</p>
    </div>
  );
}

export default Login;
