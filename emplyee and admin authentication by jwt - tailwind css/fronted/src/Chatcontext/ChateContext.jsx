

import React, { createContext, useContext, useState } from "react";
import API from "../api/Api";
import { AuthContext } from "../auth/AuthContext";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch conversation with selected user
  const getConversation = async (otherUserId) => {
    try {
      setLoading(true);
      const res = await API.get(`/chat/${otherUserId}`);
      setMessages(res.data || []);
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setLoading(false);
      throw err;
    }
  };

  // Send a new message
  const sendMessage = async (recipientId, message) => {
    try {
      const res = await API.post("/chat/send", {
        recipient_id: recipientId,
        message,
      });
      setMessages((prev) => [...prev, res.data]); // append new message
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    }
  };

  // Mark messages as read
  const markAsRead = async (otherUserId) => {
    try {
      await API.post("/chat/mark-read", { other_user_id: otherUserId });
      setMessages((prev) =>
        prev.map((msg) => ({ ...msg, read_status: "read" }))
      );
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  // Edit message
  const editMessage = async (messageId, newMessage) => {
    try {
      const res = await API.put("/chat/edit", { message_id: messageId, new_message: newMessage });
      // update messages in state
      setMessages(prev =>
        prev.map(msg => msg.id === messageId ? { ...msg, message: newMessage, edited: 'yes' } : msg)
      );
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    }
  };

  // Delete for me
  const deleteForMe = async (messageId) => {
    try {
      const res = await API.put("/chat/delete-for-me", { message_id: messageId });
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    }
  };

  // Delete for everyone
  const deleteForEveryone = async (messageId) => {
    try {
      const res = await API.delete("/chat/delete-for-everyone", { data: { message_id: messageId } });
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
        setMessages,
        loading,
        error,
        sendMessage,
        getConversation,
        markAsRead,
        editMessage,
        deleteForMe,
        deleteForEveryone,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;