// src/App.js
import React, { useState } from 'react';
import io from 'socket.io-client';
import Login from './Login';
import SignUp from './SignUp';
import ChatRoom from './ChatRoom';
import './App.css';

const socket = io('http://localhost:3001'); // Adjust the server URL as needed

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleLogin = (username) => {
    setLoggedInUser(username);
  };

  const handleSignUp = (username) => {
    setLoggedInUser(username);
  };

  const handleToggleSignUp = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div>
      {loggedInUser ? (
        <ChatRoom user={loggedInUser} socket={socket} />
      ) : isSignUp ? (
        <SignUp onSignUp={handleSignUp} />
      ) : (
        <Login onLogin={handleLogin} onToggleSignUp={handleToggleSignUp} />
      )}
    </div>
  );
}

export default App;
