import React, { createContext, useContext, useState } from 'react';
import API from '../api/Api'; // axios instance
import { AuthContext } from "../auth/AuthContext";

// Create Chat Context
export const ChatContext = createContext();

// Provider Component
export const ChatProvider = ({ children }) => {
  const { user } = useContext(AuthContext); // logged-in user
  const [messages, setMessages] = useState([]);      // conversation messages
  const [loading, setLoading] = useState(false);     // loading state
  const [error, setError] = useState(null);          // error state

  // ---------------- Send Message ----------------
  const sendMessage = async (recipientId, message) => {
    try {
      const res = await API.post('/chat/send', { recipient_id: recipientId, message });
      setMessages(prev => [...prev, res.data.data]);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    }
  };

  // ---------------- Get Conversation ----------------
  const getConversation = async (otherUserId) => {
    try {
      setLoading(true);
      const res = await API.get(`/chat/${otherUserId}`);
      setMessages(res.data);
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setLoading(false);
      throw err;
    }
  };

  // ---------------- Mark Messages as Read ----------------
  const markAsRead = async (otherUserId) => {
    try {
      const res = await API.post('/chat/mark-read', { other_user_id: otherUserId });
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    }
  };

  // ---------------- Edit Message ----------------
  const editMessage = async (messageId, newMessage) => {
    try {
      const res = await API.put('/chat/edit', { message_id: messageId, new_message: newMessage });
      setMessages(prev =>
        prev.map(msg => (msg.id === messageId ? { ...msg, message: newMessage, edited: 'yes' } : msg))
      );
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    }
  };

  // ---------------- Delete For Me ----------------
  const deleteForMe = async (messageId) => {
    try {
      const res = await API.put('/chat/delete-for-me', { message_id: messageId });
      setMessages(prev =>
        prev.map(msg => (msg.id === messageId ? { ...msg, deleted: true } : msg))
      );
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    }
  };

  // ---------------- Delete For Everyone ----------------
  const deleteForEveryone = async (messageId) => {
    try {
      const res = await API.delete('/chat/delete-for-everyone', { data: { message_id: messageId } });
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        loading,
        error,
        sendMessage,
        getConversation,
        markAsRead,
        editMessage,
        deleteForMe,
        deleteForEveryone,
        setMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
