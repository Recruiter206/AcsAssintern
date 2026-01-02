const express = require('express');
const router = express.Router();
const auth = require('../Middleware/auth.middleware.js');

const {
  sentMessage,
  getConversation,
  markAsRead,
  editMessage,
  deleteForMe,
  deleteForEveryone
} = require('../controllers/chat.controller.js');

router.post('/send', auth, sentMessage);


router.get('/:other_user_id', auth, getConversation);


router.post('/mark-read', auth, markAsRead);


router.put('/edit', auth, editMessage);


router.put('/delete-for-me', auth, deleteForMe);


router.delete('/delete-for-everyone', auth, deleteForEveryone);

module.exports = router;

