

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware.js');
const chatController = require('../controllers/chat.controller.js');

router.post('/send', auth, chatController.sendMessage);
router.get('/:other_user_id', auth, chatController.getConversation);
router.post('/mark-read', auth, chatController.markAsRead);
router.put('/edit', auth, chatController.editMessage);
router.put('/delete-for-me', auth, chatController.deleteForMe);
router.delete('/delete-for-everyone', auth, chatController.deleteForEveryone);


module.exports = router;