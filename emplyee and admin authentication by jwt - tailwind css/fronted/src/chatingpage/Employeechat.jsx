
import React, { useState, useEffect, useRef, useContext } from "react";
import { ChatContext } from "../Chatcontext/ChateContext";
import { AuthContext } from "../auth/AuthContext";
import { toast } from "react-toastify";

const EmployeeChat = () => {
  const { user, admins, fetchAdmins } = useContext(AuthContext);
  const {
    messages,
    loading,
    sendMessage,
    getConversation,
    markAsRead,
    setMessages,
    editMessage,
    deleteForMe,
    deleteForEveryone,
  } = useContext(ChatContext);

  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const messagesEndRef = useRef(null);

  // 1. Fetch admins on mount and setup polling for real-time unread dots
  useEffect(() => {
    fetchAdmins();
    const interval = setInterval(() => {
      fetchAdmins(); 
    }, 10000); 
    return () => clearInterval(interval);
  }, []);

  // 2. Fetch conversation when admin is selected
  useEffect(() => {
    if (!selectedAdmin) return;
    setMessages([]); // Clear previous chat UI
    const fetchChat = async () => {
      try {
        await getConversation(selectedAdmin.id);
        await markAsRead(selectedAdmin.id);
        fetchAdmins(); // Refresh admin list to clear the unread count immediately
      } catch (err) {
        toast.error("Failed to load chat");
      }
    };
    fetchChat();
  }, [selectedAdmin]);

  // 3. Auto scroll to bottom
  useEffect(() => { 
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); 
  }, [messages]);

  const handleSend = async () => {
    const text = newMessage.trim();
    if (!text || !selectedAdmin) return;
    setNewMessage("");
    try { 
      await sendMessage(selectedAdmin.id, text); 
    } catch (err) { 
      toast.error("Message send failed"); 
    }
  };

  const handleEditSave = async (msgId) => {
    if (!editText.trim()) return;
    try {
      await editMessage(msgId, editText);
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, message: editText } : m));
      setEditingId(null);
      setEditText("");
    } catch (err) {
      toast.error("Edit failed");
    }
  };

  // Logic to calculate unread from local messages state if backend count isn't available
  const getUnreadCountFromState = (adminId) =>
    messages.filter(m => Number(m.sender_id) === Number(adminId) && m.read_status !== "read").length;

  return (
    <div className="flex h-[calc(100vh-102px)] w-full overflow-hidden bg-[#e5ddd5]">
      
      {/* --- SIDEBAR --- */}
      <div className="w-1/3 md:w-1/4 bg-white border-r flex flex-col h-full overflow-hidden">
        {/* <div className="p-4 font-bold border-b bg-gray-50 text-gray-700">Admins</div> */}
        <div className="flex-1 overflow-y-auto bg-white">
          {admins.map(admin => {
            const isSelected = selectedAdmin?.id === admin.id;
            
            // Try to get unread count from API, otherwise calculate from local messages
            const unread = admin.unread_count !== undefined ? admin.unread_count : getUnreadCountFromState(admin.id);

            return (
              <div
                key={admin.id}
                onClick={() => setSelectedAdmin(admin)}
                className={`p-4 cursor-pointer flex items-center justify-between border-b transition-all ${
                  isSelected ? "bg-blue-50 border-r-4 border-blue-600" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    {admin.name.charAt(0)}
                  </div>
                  <span className={`font-semibold ${isSelected ? "text-blue-900" : "text-gray-700"}`}>
                    {admin.name}
                  </span>
                </div>
                
                {unread > 0 && (
                  <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-[10px] font-bold animate-pulse">
                    {unread}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* --- CHAT AREA --- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
          {!selectedAdmin ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
              <span className="text-5xl">💬</span>
              <p>Select an admin to chat</p>
            </div>
          ) : loading ? (
            <div className="text-center py-10 text-gray-500">Loading messages...</div>
          ) : (
            messages
              .slice()
              .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
              .map(msg => {
                const isMe = Number(msg.sender_id) === Number(user.id);
                const isEditing = editingId === msg.id;

                return (
                  <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`px-3 py-2 rounded-lg max-w-[80%] shadow-sm text-sm ${
                      isMe ? "bg-[#dcf8c6] rounded-br-none" : "bg-white rounded-bl-none"
                    }`}>
                      
                      {isEditing ? (
                        <div className="flex flex-col gap-2">
                          <input
                            value={editText}
                            onChange={e => setEditText(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleEditSave(msg.id)}
                            autoFocus
                            className="border rounded px-2 py-1 text-black outline-none w-full"
                          />
                          <div className="flex gap-3">
                            <button onClick={() => handleEditSave(msg.id)} className="text-[10px] text-green-700 font-bold">SAVE</button>
                            <button onClick={() => setEditingId(null)} className="text-[10px] text-red-500 font-bold">CANCEL</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="break-words text-gray-800">{msg.message}</p>
                          <div className="text-[9px] text-gray-500 text-right mt-1 flex justify-end items-center gap-1">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            {isMe && (
                              <span className={msg.read_status === "read" ? "text-blue-500 font-bold" : "text-gray-400"}>
                                {msg.read_status === "read" ? "✔✔" : "✔"}
                              </span>
                            )}
                          </div>

                          {isMe && (
                            <div className="flex gap-4 mt-2 pt-1 border-t border-black/5">
                              <button onClick={() => { setEditingId(msg.id); setEditText(msg.message); }} className="text-[10px] text-blue-600 font-semibold hover:underline">Edit</button>
                              <button onClick={async () => { await deleteForMe(msg.id); setMessages(p => p.filter(m => m.id !== msg.id)); }} className="text-[10px] text-red-400 font-semibold hover:underline">For Me</button>
                              <button onClick={async () => { await deleteForEveryone(msg.id); setMessages(p => p.filter(m => m.id !== msg.id)); }} className="text-[10px] text-red-500 font-bold hover:underline">Everyone</button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        {selectedAdmin && (
          <div className="p-3 bg-[#f0f0f0] border-t flex gap-2 items-center">
            <input
              type="text"
              placeholder="Write a message..."
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              className="flex-1 border-none rounded-full px-5 py-2.5 outline-none shadow-sm focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button onClick={handleSend} className="bg-blue-600 text-white p-2.5 rounded-full shadow-md">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeChat;
