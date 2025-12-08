const pool = require('../db');

// Send Message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverType, receiverId, message } = req.body;
    const senderType = 'manager';
    const senderId = req.manager.managerid;

    const query = `
      INSERT INTO chatmessage (sendertype, senderid, receivertype, receiverid, message)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      senderType, senderId, receiverType, receiverId, message
    ]);

    res.status(201).json({ message: 'Message sent', chatMessage: result.rows[0] });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
};

// Get Conversations
exports.getConversations = async (req, res) => {
  try {
    const managerId = req.manager.managerid;

    const query = `
      SELECT DISTINCT
        CASE 
          WHEN sendertype = 'manager' AND senderid = $1 THEN receivertype
          ELSE sendertype
        END as other_type,
        CASE 
          WHEN sendertype = 'manager' AND senderid = $1 THEN receiverid
          ELSE senderid
        END as other_id,
        (SELECT a.name FROM admin1 a WHERE a.adminid = 
          CASE 
            WHEN sendertype = 'manager' AND senderid = $1 THEN receiverid
            ELSE senderid
          END
          AND CASE 
            WHEN sendertype = 'manager' AND senderid = $1 THEN receivertype
            ELSE sendertype
          END = 'admin'
        ) as other_name
      FROM chatmessage
      WHERE (sendertype = 'manager' AND senderid = $1) 
         OR (receivertype = 'manager' AND receiverid = $1)
    `;
    
    const result = await pool.query(query, [managerId]);
    res.json({ conversations: result.rows });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Failed to fetch conversations' });
  }
};

// Get Messages
exports.getMessages = async (req, res) => {
  try {
    const managerId = req.manager.managerid;
    const { userId, userType } = req.query;

    const query = `
      SELECT cm.*, 
        CASE 
          WHEN cm.sendertype = 'admin' THEN a.name
          ELSE m.name
        END as sender_name
      FROM chatmessage cm
      LEFT JOIN admin a ON cm.sendertype = 'admin' AND cm.senderid = a.adminid
      LEFT JOIN aidcentermanager m ON cm.sendertype = 'manager' AND cm.senderid = m.managerid
      WHERE 
        (cm.sendertype = 'manager' AND cm.senderid = $1 AND cm.receivertype = $2 AND cm.receiverid = $3)
        OR
        (cm.sendertype = $2 AND cm.senderid = $3 AND cm.receivertype = 'manager' AND cm.receiverid = $1)
      ORDER BY cm.createdat ASC
    `;
    
    const result = await pool.query(query, [managerId, userType, userId]);
    
    // Mark as read
    await pool.query(
      `UPDATE chatmessage SET isread = TRUE 
       WHERE receivertype = 'manager' AND receiverid = $1 AND sendertype = $2 AND senderid = $3`,
      [managerId, userType, userId]
    );

    res.json({ messages: result.rows });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};

// Get Unread Count
exports.getUnreadCount = async (req, res) => {
  try {
    const query = `
      SELECT COUNT(*) as count
      FROM chatmessage
      WHERE receivertype = 'manager' AND receiverid = $1 AND isread = FALSE
    `;
    const result = await pool.query(query, [req.manager.managerid]);
    res.json({ unreadCount: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Failed to get unread count' });
  }
};
