// src/Login.js
import React, { useState } from 'react';

const Login = ({ onLogin, onToggleSignUp }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Implement your login logic here (e.g., API request)
    // For simplicity, we'll assume the login is successful
    onLogin(username);
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <span onClick={onToggleSignUp}>Sign Up</span></p>
    </div>
  );
};

export default Login;
