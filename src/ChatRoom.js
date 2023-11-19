// ChatRoom.js

import React, { useState, useEffect } from 'react';
import './ChatRoom.css'; // Import the CSS file

const ChatRoom = ({ user, socket }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [lastSentMessage, setLastSentMessage] = useState(null);
  const friends = ['Friend 1', 'Friend 2', 'Friend 3']; // Replace with your actual list of friends

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() !== '') {
      const newMessage = { user, message, type: 'text', to: selectedFriend };
      socket.emit('chat message', newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setLastSentMessage(message); // Set the last sent message
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
        const newFileMessage = { user, fileData, fileName: file.name, type: 'file', to: selectedFriend };
        socket.emit('file upload', newFileMessage);
        setMessages((prevMessages) => [...prevMessages, newFileMessage]);
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

  const handleFriendClick = (friend) => {
    setSelectedFriend(friend);
  };

  socket.on('chat message', (msg) => {
    setMessages((prevMessages) => [...prevMessages, msg]);
  });

  socket.on('file upload', (uploadedFile) => {
    setMessages((prevMessages) => [...prevMessages, uploadedFile]);
  });

  useEffect(() => {
    // Clear last sent message after a delay
    const timeout = setTimeout(() => {
      setLastSentMessage(null);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [lastSentMessage]);

  return (
    <div className="chat-room-container">
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
        <div className="sidebar">
          <h3>Friends</h3>
          <ul>
            {friends.map((friend, index) => (
              <li key={index} onClick={() => handleFriendClick(friend)} className={selectedFriend === friend ? 'selected' : ''}>
                {friend}
              </li>
            ))}
          </ul>
        </div>
        <div className="chat-content">
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
          {/* Display the last sent message */}
          {lastSentMessage && <div className="last-sent-message">{`Last Sent: ${lastSentMessage}`}</div>}
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
    </div>
  );
};

export default ChatRoom;
