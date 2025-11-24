import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles.css';

function ManagerDashboard() {
  const navigate = useNavigate();
  const [manager, setManager] = useState(null);
  const [activeTab, setActiveTab] = useState('chat');
  const [inventory, setInventory] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const managerData = localStorage.getItem('managerData');
    const token = localStorage.getItem('managerToken');
    
    if (!token) {
      navigate('/manager/login');
      return;
    }

    if (managerData) {
      setManager(JSON.parse(managerData));
      fetchData();
    }

    const interval = setInterval(() => {
      if (activeTab === 'chat') fetchConversations();
    }, 3000);

    return () => clearInterval(interval);
  }, [activeTab]);

  useEffect(() => {
    if (selectedAdmin) {
      fetchMessages();
    }
  }, [selectedAdmin]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchData = async () => {
    fetchConversations();
    fetchInventory();
    fetchUnreadCount();
  };

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('managerToken');
      const response = await fetch('http://localhost:4003/manager/chat/conversations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations);
        if (!selectedAdmin && data.conversations.length > 0) {
          setSelectedAdmin(data.conversations[0]);
        }
      }
    } catch (error) {
      console.error('Fetch conversations error:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('managerToken');
      const response = await fetch(
        `http://localhost:4003/manager/chat/messages?userId=${selectedAdmin.other_id}&userType=${selectedAdmin.other_type}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Fetch messages error:', error);
    }
  };

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem('managerToken');
      const response = await fetch('http://localhost:4003/manager/inventory', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setInventory(data.inventory);
      }
    } catch (error) {
      console.error('Fetch inventory error:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('managerToken');
      const response = await fetch('http://localhost:4003/manager/chat/unread-count', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Fetch unread count error:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedAdmin) return;

    try {
      const token = localStorage.getItem('managerToken');
      const response = await fetch('http://localhost:4003/manager/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverType: selectedAdmin.other_type,
          receiverId: selectedAdmin.other_id,
          message: newMessage
        })
      });

      if (response.ok) {
        setNewMessage('');
        fetchMessages();
        fetchConversations();
      }
    } catch (error) {
      console.error('Send message error:', error);
    }
  };

  const handleUpdateInventory = async (itemcategory, quantity) => {
    try {
      const token = localStorage.getItem('managerToken');
      const response = await fetch('http://localhost:4003/manager/inventory/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ itemcategory, quantity })
      });

      if (response.ok) {
        fetchInventory();
      }
    } catch (error) {
      console.error('Update inventory error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('managerToken');
    localStorage.removeItem('managerData');
    navigate('/manager/login');
  };

  if (!manager) return <div className="loading">Loading...</div>;

  return (
    <div className="manager-dashboard">
      <nav className="dashboard-navbar">
        <div className="navbar-brand">
          <h2>Aid Center Manager</h2>
        </div>
        <div className="navbar-user">
          <span className="user-name">{manager.name}</span>
          <span className="user-district">{manager.district}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <div className="sidebar-menu">
            <button 
              className={`menu-item ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
              </svg>
              <span>Live Chat</span>
              {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </button>
            
            <button 
              className={`menu-item ${activeTab === 'inventory' ? 'active' : ''}`}
              onClick={() => setActiveTab('inventory')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 1 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
              </svg>
              <span>Aid Center Inventory</span>
            </button>
          </div>
        </aside>

        <main className="dashboard-content">
          {activeTab === 'chat' && (
            <div className="chat-section">
              <div className="section-header">
                <h2>Live Chat with Admin</h2>
              </div>

              <div className="chat-container">
                <div className="chat-sidebar">
                  <h3>Conversations</h3>
                  {conversations.length === 0 ? (
                    <p className="empty-state">No conversations yet</p>
                  ) : (
                    conversations.map(conv => (
                      <div
                        key={`${conv.other_type}-${conv.other_id}`}
                        className={`conversation-item ${selectedAdmin?.other_id === conv.other_id ? 'active' : ''}`}
                        onClick={() => setSelectedAdmin(conv)}
                      >
                        <div className="conv-avatar">{conv.other_name?.charAt(0) || 'A'}</div>
                        <div className="conv-info">
                          <div className="conv-name">{conv.other_name || 'Admin'}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="chat-main">
                  {selectedAdmin ? (
                    <>
                      <div className="chat-header">
                        <h3>{selectedAdmin.other_name || 'Admin'}</h3>
                      </div>

                      <div className="messages-area">
                        {messages.length === 0 ? (
                          <p className="empty-state">No messages yet. Start the conversation!</p>
                        ) : (
                          messages.map(msg => (
                            <div
                              key={msg.messageid}
                              className={`message ${msg.sendertype === 'manager' ? 'sent' : 'received'}`}
                            >
                              <div className="message-bubble">
                                <div className="message-sender">{msg.sender_name}</div>
                                <div className="message-text">{msg.message}</div>
                                <div className="message-time">
                                  {new Date(msg.createdat).toLocaleTimeString()}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                        <div ref={messagesEndRef} />
                      </div>

                      <form onSubmit={handleSendMessage} className="chat-input">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                        />
                        <button type="submit" disabled={!newMessage.trim()}>
                          Send
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="empty-state">Select a conversation to start chatting</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="inventory-section">
              <div className="section-header">
                <h2>Aid Center Inventory</h2>
              </div>

              {inventory.length === 0 ? (
                <div className="empty-state">
                  <p>No inventory items found</p>
                  <p className="text-muted">Contact admin to assign an aid center to your account</p>
                </div>
              ) : (
                <div className="inventory-grid">
                  {inventory.map(item => (
                    <div key={item.inventoryid} className="inventory-card">
                      <h3>{item.itemcategory}</h3>
                      <div className="inventory-quantity">
                        <span className="quantity-label">Quantity:</span>
                        <span className="quantity-value">{item.quantity}</span>
                      </div>
                      <div className="inventory-meta">
                        <small>Last updated: {new Date(item.lastupdated).toLocaleString()}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default ManagerDashboard;
