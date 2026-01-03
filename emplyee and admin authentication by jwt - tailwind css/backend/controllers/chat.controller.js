
const db = require('../config/db.js');

// ---------------- Send Message ----------------
const sendMessage = (req, res) => {
  try {
    const { recipient_id, message } = req.body;
    if (!recipient_id || !message) return res.status(400).json({ error: "All fields are required" });

    const sender_id = req.user.id;
    const sender_role = req.user.role;

    let admin_id = sender_role === 'admin' ? sender_id : recipient_id;
    let employee_id = sender_role === 'employee' ? sender_id : recipient_id;

    const query = `INSERT INTO admin_employee_chat
      (admin_id, employee_id, sender_type, sender_id, message)
      VALUES (?, ?, ?, ?, ?)`;

    db.run(query, [admin_id, employee_id, sender_role, sender_id, message], function(err) {
      if (err) return res.status(500).json({ error: err.message });

      res.status(201).json({
        id: this.lastID,
        admin_id,
        employee_id,
        sender_type: sender_role,
        sender_id,
        message,
        created_at: new Date().toISOString(),
        read_status: 'unread',
        edited: 'no',
        deleted_for_admin: 'no',
        deleted_for_employee: 'no'
      });
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// ---------------- Get Conversation ----------------
const getConversation = (req, res) => {
  try {
    const { other_user_id } = req.params;
    const viewer_id = req.user.id;
    const viewer_role = req.user.role;

    const admin_id = viewer_role === 'admin' ? viewer_id : parseInt(other_user_id);
    const employee_id = viewer_role === 'employee' ? viewer_id : parseInt(other_user_id);
    const deletedColumn = viewer_role === 'admin' ? 'deleted_for_admin' : 'deleted_for_employee';

    const query = `SELECT * FROM admin_employee_chat
                   WHERE admin_id=? AND employee_id=? AND ${deletedColumn}='no'
                   ORDER BY created_at ASC`;

    db.all(query, [admin_id, employee_id], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows || []);
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// ---------------- Mark as Read ----------------
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
// ---------------- Delete For Me ----------------
const deleteForMe = (req, res) => {
    try {
        const { message_id } = req.body;
        const role = req.user.role;
        if (!message_id) return res.status(400).json({ error: "Message ID required" });

        const column = role === 'admin' ? 'deleted_for_admin' : 'deleted_for_employee';
        const query = `UPDATE admin_employee_chat SET ${column}='yes' WHERE id=?`;

        db.run(query, [message_id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: "Message not found" });
            res.json({ message: `Deleted message for ${role}` });
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// ---------------- Delete For Everyone ----------------
const deleteForEveryone = (req, res) => {
    try {
        const { message_id } = req.body;
        const sender_id = req.user.id;
        if (!message_id) return res.status(400).json({ error: "Message ID required" });

        const query = `DELETE FROM admin_employee_chat WHERE id=? AND sender_id=?`;
        db.run(query, [message_id, sender_id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: "Message not found or not sender" });
            res.json({ message: "Deleted message for everyone" });
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
};
const editMessage = (req, res) => {
    try {
        const { message_id, new_message } = req.body;
        const sender_id = req.user.id;
        if (!message_id || !new_message) return res.status(400).json({ error: "All fields required" });

        const query = `UPDATE admin_employee_chat SET message=?, edited='yes' WHERE id=? AND sender_id=?`;
        db.run(query, [new_message, message_id, sender_id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: "Message not found or not sender" });
            res.json({ message: "Message edited", data: { message_id, new_message } });
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
};


module.exports = { sendMessage, getConversation, markAsRead ,deleteForMe,deleteForEveryone,editMessage};