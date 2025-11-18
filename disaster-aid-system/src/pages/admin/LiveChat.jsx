import React, { useState, useEffect, useRef } from 'react';
import '../../styles.css';

function LiveChat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([
    { id: 1, name: 'Relief Center A', status: 'online' },
    { id: 2, name: 'Volunteer Team B', status: 'online' },
    { id: 3, name: 'Donor Group C', status: 'offline' }
  ]);
  const [selectedUser, setSelectedUser] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load messages for selected user
  useEffect(() => {
    if (selectedUser) {
      // TODO: Fetch messages from backend
      setMessages([
        {
          id: 1,
          sender: 'Relief Center A',
          text: 'We need more water supplies urgently!',
          timestamp: new Date(Date.now() - 300000),
          isAdmin: false
        },
        {
          id: 2,
          sender: 'Admin',
          text: 'Roger that. We are dispatching 500 water bottles now.',
          timestamp: new Date(Date.now() - 180000),
          isAdmin: true
        }
      ]);
    }
  }, [selectedUser]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const message = {
      id: messages.length + 1,
      sender: 'Admin',
      text: newMessage,
      timestamp: new Date(),
      isAdmin: true
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // TODO: Send message to backend via WebSocket or API
  };

  return (
    <div className="live-chat-container">
      <h1>Live Chat Support</h1>

      <div className="chat-layout">
        {/* Users List */}
        <div className="chat-users-panel">
          <h3>Active Conversations</h3>
          <div className="users-list">
            {users.map(user => (
              <div
                key={user.id}
                className={`user-item ${selectedUser?.id === user.id ? 'active' : ''}`}
                onClick={() => setSelectedUser(user)}
              >
                <div className="user-avatar">{user.name.charAt(0)}</div>
                <div className="user-info">
                  <div className="user-name">{user.name}</div>
                  <div className={`user-status ${user.status}`}>
                    {user.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          {selectedUser ? (
            <>
              <div className="chat-header">
                <h3>{selectedUser.name}</h3>
                <span className={`status-badge ${selectedUser.status}`}>
                  {selectedUser.status}
                </span>
              </div>

              <div className="messages-container">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`message ${msg.isAdmin ? 'admin-message' : 'user-message'}`}
                  >
                    <div className="message-sender">{msg.sender}</div>
                    <div className="message-text">{msg.text}</div>
                    <div className="message-time">
                      {msg.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="message-input-form">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="message-input"
                />
                <button type="submit" className="send-button">
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="no-chat-selected">
              <p>Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LiveChat;
