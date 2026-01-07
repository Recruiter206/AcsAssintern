

const express = require('express');
const router = express.Router();
const auth = require('../Middleware/auth.middleware.js');
const chatController = require('../controllers/chat.controller.js');
const upload = require('../Middleware/upload.middleware.js');

// This single line handles both plain text and file uploads
router.get('/chat-list', auth, chatController.getChatListWithUnread);
router.post('/send', auth, upload.single('file'), chatController.sendMessage);

router.get('/:other_user_id', auth, chatController.getConversation);
router.post('/mark-read', auth, chatController.markAsRead);
router.put('/edit', auth, chatController.editMessage);
router.put('/delete-for-me', auth, chatController.deleteForMe);
router.delete('/delete-for-everyone', auth, chatController.deleteForEveryone);


module.exports = router;