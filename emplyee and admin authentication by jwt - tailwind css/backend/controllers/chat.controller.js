// const db = require('../config/db.js');

// // ---------------- Send Message ----------------
// const sentMessage = (req, res) => {
//     try {
//         const { recipient_id, message } = req.body;

//         if (!recipient_id || !message) {
//             return res.status(400).json({ error: "All fields are required" });
//         }

//         const sender_id = req.user.id;
//         const sender_role = req.user.role; // 'admin' or 'employee'

//         // Determine admin_id and employee_id based on sender
//         let admin_id, employee_id;
//         if (sender_role === "admin") {
//             admin_id = sender_id;
//             employee_id = recipient_id;
//         } else {
//             admin_id = recipient_id;
//             employee_id = sender_id;
//         }

//         const query = `
//             INSERT INTO admin_employee_chat (admin_id, employee_id, sender_type, sender_id, message)
//             VALUES (?, ?, ?, ?, ?)
//         `;

//         db.run(query, [admin_id, employee_id, sender_role, sender_id, message], function(err) {
//             if (err) return res.status(500).json({ error: err.message });

//             res.status(201).json({
//                 message: "Message sent successfully",
//                 message_id: this.lastID,
//                 data: { admin_id, employee_id, sender_type: sender_role, sender_id, message }
//             });
//         });

//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // ---------------- Get Conversation ----------------
// const getConversation = (req, res) => {
//     try {
//         const { other_user_id } = req.params;

//         const viewer_id = req.user.id;
//         const viewer_role = req.user.role;

//         // Determine admin_id and employee_id based on roles
//         let admin_id, employee_id;
//         if (viewer_role === "admin") {
//             admin_id = viewer_id;
//             employee_id = parseInt(other_user_id);
//         } else {
//             admin_id = parseInt(other_user_id);
//             employee_id = viewer_id;
//         }

//         const deletedColumn = viewer_role === 'admin' ? 'deleted_for_admin' : 'deleted_for_employee';

//         const query = `
//             SELECT *
//             FROM admin_employee_chat
//             WHERE admin_id = ? AND employee_id = ? AND ${deletedColumn} = 'no'
//             ORDER BY created_at ASC
//         `;

//         db.all(query, [admin_id, employee_id], (err, rows) => {
//             if (err) return res.status(500).json({ error: err.message });
//             res.json(rows);
//         });

//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // ---------------- Mark Messages as Read ----------------
// const markAsRead = (req, res) => {
//     try {
//         const { other_user_id } = req.body;

//         if (!other_user_id) return res.status(400).json({ error: "Recipient ID required" });

//         const reader_id = req.user.id;
//         const reader_role = req.user.role;

//         let admin_id, employee_id;
//         if (reader_role === "admin") {
//             admin_id = reader_id;
//             employee_id = other_user_id;
//         } else {
//             admin_id = other_user_id;
//             employee_id = reader_id;
//         }

//         const query = `
//             UPDATE admin_employee_chat
//             SET read_status = 'read'
//             WHERE admin_id = ? AND employee_id = ? AND sender_id != ?
//         `;

//         db.run(query, [admin_id, employee_id, reader_id], function(err) {
//             if (err) return res.status(500).json({ error: err.message });
//             res.json({ message: `Marked ${this.changes} messages as read` });
//         });

//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // ---------------- Edit Message ----------------
// const editMessage = (req, res) => {
//     try {
//         const { message_id, new_message } = req.body;
//         const sender_id = req.user.id;

//         if (!message_id || !new_message) return res.status(400).json({ error: "All fields are required" });

//         const query = `
//             UPDATE admin_employee_chat
//             SET message = ?, edited = 'yes'
//             WHERE id = ? AND sender_id = ?
//         `;

//         db.run(query, [new_message, message_id, sender_id], function(err) {
//             if (err) return res.status(500).json({ error: err.message });
//             if (this.changes === 0) return res.status(404).json({ error: "Message not found or you are not the sender" });

//             res.json({ message: "Message edited successfully", data: { message_id, new_message } });
//         });

//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // ---------------- Delete For Me ----------------
// const deleteForMe = (req, res) => {
//     try {
//         const { message_id } = req.body;
//         const user_role = req.user.role;

//         if (!message_id) return res.status(400).json({ error: "Message ID required" });

//         const column = user_role === 'admin' ? 'deleted_for_admin' : 'deleted_for_employee';

//         const query = `
//             UPDATE admin_employee_chat
//             SET ${column} = 'yes'
//             WHERE id = ?
//         `;

//         db.run(query, [message_id], function(err) {
//             if (err) return res.status(500).json({ error: err.message });
//             if (this.changes === 0) return res.status(404).json({ error: "Message not found" });

//             res.json({ message: `Message deleted for ${user_role}` });
//         });

//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // ---------------- Delete For Everyone ----------------
// const deleteForEveryone = (req, res) => {
//     try {
//         const { message_id } = req.body;
//         const sender_id = req.user.id;

//         if (!message_id) return res.status(400).json({ error: "Message ID required" });

//         const query = `
//             DELETE FROM admin_employee_chat
//             WHERE id = ? AND sender_id = ?
//         `;

//         db.run(query, [message_id, sender_id], function(err) {
//             if (err) return res.status(500).json({ error: err.message });
//             if (this.changes === 0) return res.status(404).json({ error: "Message not found or you are not the sender" });

//             res.json({ message: "Message deleted for everyone" });
//         });

//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// module.exports = {
//     sentMessage,
//     getConversation,
//     markAsRead,
//     editMessage,
//     deleteForMe,
//     deleteForEveryone
// };



const db = require('../config/db.js');

// ---------------- Send Message ----------------
const sentMessage = (req, res) => {
    try {
        const { recipient_id, message } = req.body;
        if (!recipient_id || !message) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const sender_id = req.user.id;
        const sender_role = req.user.role; // 'admin' or 'employee'

        // Determine admin and employee IDs
        let admin_id, employee_id;
        if (sender_role === 'admin') {
            admin_id = sender_id;
            employee_id = recipient_id;
        } else {
            admin_id = recipient_id;
            employee_id = sender_id;
        }

        const query = `
            INSERT INTO admin_employee_chat 
            (admin_id, employee_id, sender_type, sender_id, message)
            VALUES (?, ?, ?, ?, ?)
        `;

        db.run(query, [admin_id, employee_id, sender_role, sender_id, message], function(err) {
            if (err) return res.status(500).json({ error: err.message });

            // Return the new message info
            res.status(201).json({
                message: "Message sent successfully",
                message_id: this.lastID,
                data: {
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
                }
            });
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ---------------- Get Conversation ----------------
const getConversation = (req, res) => {
    try {
        const { other_user_id } = req.params;
        const viewer_id = req.user.id;
        const viewer_role = req.user.role;

        let admin_id, employee_id;
        if (viewer_role === 'admin') {
            admin_id = viewer_id;
            employee_id = parseInt(other_user_id);
        } else {
            admin_id = parseInt(other_user_id);
            employee_id = viewer_id;
        }

        const deletedColumn = viewer_role === 'admin' ? 'deleted_for_admin' : 'deleted_for_employee';

        const query = `
            SELECT *
            FROM admin_employee_chat
            WHERE admin_id = ? AND employee_id = ? AND ${deletedColumn} = 'no'
            ORDER BY created_at ASC
        `;

        db.all(query, [admin_id, employee_id], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ---------------- Mark Messages as Read ----------------
const markAsRead = (req, res) => {
    try {
        const { other_user_id } = req.body;
        if (!other_user_id) return res.status(400).json({ error: "Recipient ID required" });

        const reader_id = req.user.id;
        const reader_role = req.user.role;

        let admin_id, employee_id;
        if (reader_role === 'admin') {
            admin_id = reader_id;
            employee_id = other_user_id;
        } else {
            admin_id = other_user_id;
            employee_id = reader_id;
        }

        const query = `
            UPDATE admin_employee_chat
            SET read_status = 'read'
            WHERE admin_id = ? AND employee_id = ? AND sender_id != ?
        `;

        db.run(query, [admin_id, employee_id, reader_id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: `Marked ${this.changes} messages as read` });
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ---------------- Edit Message ----------------
const editMessage = (req, res) => {
    try {
        const { message_id, new_message } = req.body;
        const sender_id = req.user.id;

        if (!message_id || !new_message) return res.status(400).json({ error: "All fields are required" });

        const query = `
            UPDATE admin_employee_chat
            SET message = ?, edited = 'yes'
            WHERE id = ? AND sender_id = ?
        `;

        db.run(query, [new_message, message_id, sender_id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: "Message not found or you are not the sender" });

            res.json({ message: "Message edited successfully", data: { message_id, new_message } });
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ---------------- Delete For Me ----------------
const deleteForMe = (req, res) => {
    try {
        const { message_id } = req.body;
        const user_role = req.user.role;
        if (!message_id) return res.status(400).json({ error: "Message ID required" });

        const column = user_role === 'admin' ? 'deleted_for_admin' : 'deleted_for_employee';

        const query = `
            UPDATE admin_employee_chat
            SET ${column} = 'yes'
            WHERE id = ?
        `;

        db.run(query, [message_id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: "Message not found" });

            res.json({ message: `Message deleted for ${user_role}` });
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ---------------- Delete For Everyone ----------------
const deleteForEveryone = (req, res) => {
    try {
        const { message_id } = req.body;
        const sender_id = req.user.id;
        if (!message_id) return res.status(400).json({ error: "Message ID required" });

        const query = `
            DELETE FROM admin_employee_chat
            WHERE id = ? AND sender_id = ?
        `;

        db.run(query, [message_id, sender_id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: "Message not found or you are not the sender" });

            res.json({ message: "Message deleted for everyone" });
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    sentMessage,
    getConversation,
    markAsRead,
    editMessage,
    deleteForMe,
    deleteForEveryone
};
