

import React, { createContext, useContext, useState } from "react";
import API from "../api/Api";
import { AuthContext } from "../auth/AuthContext";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatList, setChatList] = useState([]);


  // <---  NEW: Fetch Employees/Admins with Unread Counts ---
  const fetchChatList = async () => {
    try {
      setLoading(true);
      const res = await API.get("/chat/chat-list"); 
      setChatList(res.data || []);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setLoading(false);
    }
  };

 const getConversation = async (otherUserId) => {
    try {
      setLoading(true);
      const res = await API.get(`/chat/${otherUserId}`);
      setMessages(res.data || []);
      setLoading(false);
      
      // When opening a conversation, reset its count locally for instant UX
      setChatList(prev => 
        prev.map(item => item.id === otherUserId ? { ...item, unread_count: 0 } : item)
      );
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setLoading(false);
      throw err;
    }
  };



const getFileUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;

  // Industry Standard: Extract the domain from Axios instance
  // This turns "http://localhost:5000/api" into "http://localhost:5000"
  const baseUrl = API.defaults.baseURL.split('/api')[0]; 
  
  return `${baseUrl}${path}`;
};
  // UPDATED: Support for Files and Emojis via FormData
  const sendMessage = async (recipientId, message, file = null) => {
    try {
      // 1. Frontend File Size Restriction (2026 UX Standard)
      if (file && file.size > 5 * 1024 * 1024) {
        throw new Error("File is too large. Max limit is 5MB.");
      }

      // 2. Prepare FormData
      const formData = new FormData();
      formData.append("recipient_id", recipientId);
      
      // If message contains emojis, append normally as string
      if (message) formData.append("message", message);
      
      // Append file if it exists
      if (file) formData.append("file", file);

      // 3. Post to API
      // Note: Do NOT set Content-Type manually, Axios does it for FormData
      const res = await API.post("/chat/send", formData);
      
      setMessages((prev) => [...prev, res.data]);
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

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

  const editMessage = async (messageId, newMessage) => {
    try {
      const res = await API.put("/chat/edit", { message_id: messageId, new_message: newMessage });
      setMessages(prev =>
        prev.map(msg => msg.id === messageId ? { ...msg, message: newMessage, edited: 'yes' } : msg)
      );
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    }
  };

  const deleteForMe = async (messageId) => {
    try {
      await API.put("/chat/delete-for-me", { message_id: messageId });
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    }
  };

  const deleteForEveryone = async (messageId) => {
    try {
      await API.delete("/chat/delete-for-everyone", { data: { message_id: messageId } });
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,       
        chatList, 
        setMessages,
        loading,
        error,
        fetchChatList,
        sendMessage,
        getConversation,
        markAsRead,
        editMessage,
        deleteForMe,
        deleteForEveryone,
        getFileUrl
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
