


const db = require('../config/db.js');


const sendMessage = (req, res) => {
  try {
    const { recipient_id, message } = req.body;
    const sender_id = req.user.id;
    const sender_role = req.user.role;

    if (!recipient_id || (!message && (!req.files || req.files.length === 0))) {
      return res.status(400).json({ error: "Message text or at least one file is required" });
    }

    let admin_id = sender_role === 'admin' ? sender_id : recipient_id;
    let employee_id = sender_role === 'employee' ? sender_id : recipient_id;

    // 1. Insert Text Message first
    const msgQuery = `INSERT INTO admin_employee_chat
      (admin_id, employee_id, sender_type, sender_id, message)
      VALUES (?, ?, ?, ?, ?)`;

    db.run(msgQuery, [admin_id, employee_id, sender_role, sender_id, message || null], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      
      const chatId = this.lastID;
      const uploadedFiles = [];

      // 2. Insert Multiple Files into chat_attachments table
      if (req.files && req.files.length > 0) {
        const fileQuery = `INSERT INTO chat_attachments (chat_id, file_path, file_name, file_type) VALUES (?, ?, ?, ?)`;
        req.files.forEach(file => {
          const filePath = `/uploads/${file.filename}`;
          db.run(fileQuery, [chatId, filePath, file.originalname, file.mimetype]);
          uploadedFiles.push({ path: filePath, name: file.originalname, type: file.mimetype });
        });
      }

      // 3. Real-time delivery via WebSocket
      const fullMessageData = {
        id: chatId, admin_id, employee_id, sender_type: sender_role,
        sender_id, message, files: uploadedFiles,
        created_at: new Date().toISOString(), read_status: 'unread'
      };

      // Emit to specific room (ensure global.io is setup in server.js)
      if (global.io) {
        global.io.to(`room_${recipient_id}`).emit('receive_message', fullMessageData);
      }

      res.status(201).json(fullMessageData);
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
const getConversation = (req, res) => {
  try {
    const { other_user_id } = req.params;
    const viewer_id = req.user.id;
    const viewer_role = req.user.role;

    const admin_id = viewer_role === 'admin' ? viewer_id : parseInt(other_user_id);
    const employee_id = viewer_role === 'employee' ? viewer_id : parseInt(other_user_id);
    const deletedColumn = viewer_role === 'admin' ? 'deleted_for_admin' : 'deleted_for_employee';

    // Use LEFT JOIN to get messages even if they don't have attachments
    const query = `
      SELECT m.*, GROUP_CONCAT(a.file_path) as file_paths, GROUP_CONCAT(a.file_name) as file_names
      FROM admin_employee_chat m
      LEFT JOIN chat_attachments a ON m.id = a.chat_id
      WHERE m.admin_id=? AND m.employee_id=? AND m.${deletedColumn}='no'
      GROUP BY m.id
      ORDER BY m.created_at ASC`;

    db.all(query, [admin_id, employee_id], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows || []);
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
};


// 3. Mark as Read (No Changes)
const markAsRead = (req, res) => {
  try {
    const { other_user_id } = req.body;
    const reader_id = req.user.id;
    const reader_role = req.user.role;

    const admin_id = reader_role === 'admin' ? reader_id : other_user_id;
    const employee_id = reader_role === 'employee' ? reader_id : other_user_id;

    const query = `UPDATE admin_employee_chat
                   SET read_status='read'
                   WHERE admin_id=? AND employee_id=? AND sender_id!=?`;

    db.run(query, [admin_id, employee_id, reader_id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: `Marked ${this.changes} messages as read` });
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// 4. Get Chat List with Unread Count (New Addition)
const getChatListWithUnread = (req, res) => {
    const login_user_id = req.user.id;
    const login_user_role = req.user.role;

    let query = "";
    if (login_user_role === 'admin') {
        query = `
            SELECT u.id, u.name,
            (SELECT COUNT(*) FROM admin_employee_chat 
             WHERE admin_id = ? AND employee_id = u.id 
             AND sender_id != ? AND read_status = 'unread') as unread_count
            FROM users u WHERE u.role = 'employee'`;// FROM users u WHERE u.role = 'employee'` esko sort form likhane ke liye likha hai 
    } else {
        query = `
            SELECT u.id, u.name,
            (SELECT COUNT(*) FROM admin_employee_chat 
             WHERE employee_id = ? AND admin_id = u.id 
             AND sender_id != ? AND read_status = 'unread') as unread_count
            FROM users u WHERE u.role = 'admin'`;
    }

    db.all(query, [login_user_id, login_user_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

// 5. Delete For Me (No Changes)
const deleteForMe = (req, res) => {
    try {
        const { message_id } = req.body;
        const role = req.user.role;
        const column = role === 'admin' ? 'deleted_for_admin' : 'deleted_for_employee';
        const query = `UPDATE admin_employee_chat SET ${column}='yes' WHERE id=?`;
        db.run(query, [message_id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: `Deleted message for ${role}` });
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// 6. Delete For Everyone (No Changes)
const deleteForEveryone = (req, res) => {
    try {
        const { message_id } = req.body;
        const sender_id = req.user.id;
        const query = `DELETE FROM admin_employee_chat WHERE id=? AND sender_id=?`;
        db.run(query, [message_id, sender_id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Deleted message for everyone" });
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// 7. Edit Message (No Changes)
const editMessage = (req, res) => {
    try {
        const { message_id, new_message } = req.body;
        const sender_id = req.user.id;
        const query = `UPDATE admin_employee_chat SET message=?, edited='yes' WHERE id=? AND sender_id=?`;
        db.run(query, [new_message, message_id, sender_id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Message edited", data: { message_id, new_message } });
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { 
  sendMessage, 
  getConversation, 
  getChatListWithUnread, 
  markAsRead, 
  deleteForMe, 
  deleteForEveryone, 
  editMessage 
};


// const db = require('../config/db.js');


// const sendMessage = (req, res) => {
//   try {

//     // recipient_id here jisko send kar rahe uski id le rahe hai 
//     const { recipient_id, message } = req.body;
//     const sender_id = req.user.id;
//     const sender_role = req.user.role;

//     if (!recipient_id || (!message && !req.file)) {
//       return res.status(400).json({ error: "Message text or a file is required" });
//     }

//     let admin_id = sender_role === 'admin' ? sender_id : recipient_id;
//     let employee_id = sender_role === 'employee' ? sender_id : recipient_id;

//     const file_path = req.file ? `/uploads/${req.file.filename}` : null;
//     const file_name = req.file ? req.file.originalname : null;
//     const file_type = req.file ? req.file.mimetype : null;

//     const query = `INSERT INTO admin_employee_chat
//       (admin_id, employee_id, sender_type, sender_id, message, file_path, file_name, file_type)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

//     const params = [admin_id, employee_id, sender_role, sender_id, message || null, file_path, file_name, file_type];

//     db.run(query, params, function(err) {
//       if (err) return res.status(500).json({ error: err.message });
//       res.status(201).json({
//         id: this.lastID, admin_id, employee_id, sender_type: sender_role,
//         sender_id, message, file_path, file_name, file_type,
//         created_at: new Date().toISOString(), read_status: 'unread'
//       });
//     });
//   } catch (err) { res.status(500).json({ error: err.message }); }
// };

// // 2. Get Conversation (No Changes)
// const getConversation = (req, res) => {
//   try {

//     // other_user_id ye uski id leta hai jo login hai 
//     const { other_user_id } = req.params;
//     const viewer_id = req.user.id;
//     const viewer_role = req.user.role;

//     const admin_id = viewer_role === 'admin' ? viewer_id : parseInt(other_user_id);
//     const employee_id = viewer_role === 'employee' ? viewer_id : parseInt(other_user_id);
//     const deletedColumn = viewer_role === 'admin' ? 'deleted_for_admin' : 'deleted_for_employee';

//     const query = `SELECT * FROM admin_employee_chat
//                    WHERE admin_id=? AND employee_id=? AND ${deletedColumn}='no'
//                    ORDER BY created_at ASC`;

//     db.all(query, [admin_id, employee_id], (err, rows) => {
//       if (err) return res.status(500).json({ error: err.message });
//       res.json(rows || []);
//     });
//   } catch (err) { res.status(500).json({ error: err.message }); }
// };

// // 3. Mark as Read (No Changes)
// const markAsRead = (req, res) => {
//   try {
//     const { other_user_id } = req.body;
//     const reader_id = req.user.id;
//     const reader_role = req.user.role;

//     const admin_id = reader_role === 'admin' ? reader_id : other_user_id;
//     const employee_id = reader_role === 'employee' ? reader_id : other_user_id;

//     const query = `UPDATE admin_employee_chat
//                    SET read_status='read'
//                    WHERE admin_id=? AND employee_id=? AND sender_id!=?`;

//     db.run(query, [admin_id, employee_id, reader_id], function(err) {
//       if (err) return res.status(500).json({ error: err.message });
//       res.json({ message: `Marked ${this.changes} messages as read` });
//     });
//   } catch (err) { res.status(500).json({ error: err.message }); }
// };

// // 4. Get Chat List with Unread Count (New Addition)
// const getChatListWithUnread = (req, res) => {
//     const login_user_id = req.user.id;
//     const login_user_role = req.user.role;

//     let query = "";
//     if (login_user_role === 'admin') {
//         query = `
//             SELECT u.id, u.name,
//             (SELECT COUNT(*) FROM admin_employee_chat 
//              WHERE admin_id = ? AND employee_id = u.id 
//              AND sender_id != ? AND read_status = 'unread') as unread_count
//             FROM users u WHERE u.role = 'employee'`;// FROM users u WHERE u.role = 'employee'` esko sort form likhane ke liye likha hai 
//     } else {
//         query = `
//             SELECT u.id, u.name,
//             (SELECT COUNT(*) FROM admin_employee_chat 
//              WHERE employee_id = ? AND admin_id = u.id 
//              AND sender_id != ? AND read_status = 'unread') as unread_count
//             FROM users u WHERE u.role = 'admin'`;
//     }

//     db.all(query, [login_user_id, login_user_id], (err, rows) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.json(rows);
//     });
// };

// // 5. Delete For Me (No Changes)
// const deleteForMe = (req, res) => {
//     try {
//         const { message_id } = req.body;
//         const role = req.user.role;
//         const column = role === 'admin' ? 'deleted_for_admin' : 'deleted_for_employee';
//         const query = `UPDATE admin_employee_chat SET ${column}='yes' WHERE id=?`;
//         db.run(query, [message_id], function(err) {
//             if (err) return res.status(500).json({ error: err.message });
//             res.json({ message: `Deleted message for ${role}` });
//         });
//     } catch (err) { res.status(500).json({ error: err.message }); }
// };

// // 6. Delete For Everyone (No Changes)
// const deleteForEveryone = (req, res) => {
//     try {
//         const { message_id } = req.body;
//         const sender_id = req.user.id;
//         const query = `DELETE FROM admin_employee_chat WHERE id=? AND sender_id=?`;
//         db.run(query, [message_id, sender_id], function(err) {
//             if (err) return res.status(500).json({ error: err.message });
//             res.json({ message: "Deleted message for everyone" });
//         });
//     } catch (err) { res.status(500).json({ error: err.message }); }
// };

// // 7. Edit Message (No Changes)
// const editMessage = (req, res) => {
//     try {
//         const { message_id, new_message } = req.body;
//         const sender_id = req.user.id;
//         const query = `UPDATE admin_employee_chat SET message=?, edited='yes' WHERE id=? AND sender_id=?`;
//         db.run(query, [new_message, message_id, sender_id], function(err) {
//             if (err) return res.status(500).json({ error: err.message });
//             res.json({ message: "Message edited", data: { message_id, new_message } });
//         });
//     } catch (err) { res.status(500).json({ error: err.message }); }
// };

// module.exports = { 
//   sendMessage, 
//   getConversation, 
//   getChatListWithUnread, 
//   markAsRead, 
//   deleteForMe, 
//   deleteForEveryone, 
//   editMessage 
// };
