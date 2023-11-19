// src/ChatRoom.js
import React, { useState } from 'react';

const ChatRoom = ({ user, socket }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() !== '') {
      socket.emit('chat message', { user, message, type: 'text' });
      setMessage('');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const uploadFile = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileData = e.target.result;
        socket.emit('file upload', { user, fileData, fileName: file.name, type: 'file' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignOut = () => {
    // Implement sign-out logic here
    window.location.reload(); // For simplicity, reloading the entire app
  };

  const handleSearch = () => {
    // Implement search logic here
    console.log('Searching for:', searchTerm);
  };

  socket.on('chat message', (msg) => {
    setMessages((prevMessages) => [...prevMessages, msg]);
  });

  socket.on('file upload', (uploadedFile) => {
    setMessages((prevMessages) => [...prevMessages, uploadedFile]);
  });

  return (
    <div>
      <nav className="navbar">
        <div className="nav-left">
          <span className="nav-item">Chat Room</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <div className="nav-right">
          <span className="nav-item">Profile</span>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      </nav>
      <div className="chat-container">
        <h3>Welcome, {user}!</h3>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>
              {msg.type === 'text' ? (
                <span>{msg.user}: {msg.message}</span>
              ) : (
                <span>{msg.user} uploaded a file: {msg.fileName}</span>
              )}
            </li>
          ))}
        </ul>
        <form onSubmit={sendMessage}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button type="submit">Send</button>
        </form>
        <input type="file" onChange={handleFileChange} />
        <button onClick={uploadFile}>Upload File</button>
      </div>
    </div>
  );
};

export default ChatRoom;
