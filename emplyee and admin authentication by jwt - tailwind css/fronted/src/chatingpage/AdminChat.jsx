import React, { useState, useEffect, useRef, useContext } from "react";
import { ChatContext } from "../Chatcontext/ChateContext";
import { AuthContext } from "../auth/AuthContext";
import { toast } from "react-toastify";

const AdminChat = () => {
  const { user, employees, fetchEmployees } = useContext(AuthContext);
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

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => { fetchEmployees(); }, []);

  useEffect(() => {
    if (!selectedEmployee) return;
    setMessages([]);
    const fetchChat = async () => {
      try {
        await getConversation(selectedEmployee.id);
        await markAsRead(selectedEmployee.id);
      } catch (err) {
        console.error("Error fetching conversation:", err);
      }
    };
    fetchChat();
  }, [selectedEmployee]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedEmployee) return;
    const text = newMessage;
    setNewMessage("");
    try {
      await sendMessage(selectedEmployee.id, text);
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  const handleEditSave = async (msgId) => {
    if (!editText.trim()) return;
    try {
      await editMessage(msgId, editText);
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, message: editText } : m));
      setEditingId(null);
    } catch (err) {
      toast.error("Edit failed");
    }
  };

  const getUnreadCount = (empId) =>
    messages.filter(m => Number(m.sender_id) === Number(empId) && m.read_status !== "read").length;

  return (
    <div className="flex h-[calc(100vh-102px)] w-full overflow-hidden bg-white">
      
      {/* --- SIDEBAR: Left Side --- */}
      <div className="w-1/4 min-w-[280px] border-r flex flex-col h-full bg-gray-50">
        {/* <div className="p-4 border-b bg-white font-bold text-gray-700">Employees</div> */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {employees.map((emp) => {
            const unread = getUnreadCount(emp.id);
            return (
              <div
                key={emp.id}
                onClick={() => setSelectedEmployee(emp)}
                className={`p-4 border-b cursor-pointer transition-all flex items-center justify-between ${
                  selectedEmployee?.id === emp.id 
                  ? "bg-sky-100 border-r-4 border-sky-600" 
                  : "hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sky-800 text-white flex items-center justify-center font-bold shadow-sm">
                    {emp.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold ${selectedEmployee?.id === emp.id ? "text-sky-900" : "text-gray-700"}`}>
                      {emp.name}
                    </p>
                    <p className="text-xs text-gray-500">View Chat</p>
                  </div>
                </div>
                {/* Unread Badge */}
                {unread > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {unread}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* --- CHAT AREA: Right Side --- */}
      <div className="flex-1 flex flex-col h-full bg-[#e5ddd5] overflow-hidden">
        {selectedEmployee ? (
          <>
            {/* Header
            <div className="p-4 border-b bg-white flex items-center shadow-sm z-10">
              <h2 className="font-bold text-gray-700">{selectedEmployee.name}</h2>
            </div> */}

            {/* Message List */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
              {loading ? (
                <div className="flex justify-center mt-10"><span className="bg-white px-4 py-1 rounded-full shadow text-sm">Loading...</span></div>
              ) : (
                messages.map((msg) => {
                  const isMe = Number(msg.sender_id) === Number(user.id);
                  const isEditing = editingId === msg.id;

                  return (
                    <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`px-3 py-2 rounded-lg max-w-[75%] shadow-sm text-sm ${
                        isMe ? "bg-[#dcf8c6] rounded-br-none" : "bg-white rounded-bl-none"
                      }`}>
                        {isEditing ? (
                          <div className="flex flex-col gap-2">
                            <input
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="p-1 border rounded text-black outline-none"
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <button onClick={() => handleEditSave(msg.id)} className="text-[10px] text-green-700 font-bold">Save</button>
                              <button onClick={() => setEditingId(null)} className="text-[10px] text-gray-500">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="break-words">{msg.message}</p>
                            <div className="text-[9px] text-gray-500 text-right mt-1 flex justify-end gap-1">
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              {isMe && (
                                <span className={msg.read_status === "read" ? "text-blue-500" : "text-gray-400"}>
                                  {msg.read_status === "read" ? "✔✔" : "✔"}
                                </span>
                              )}
                            </div>

                            {/* Actions Buttons for Admin (isMe) */}
                            {isMe && (
                              <div className="flex gap-3 mt-2 pt-1 border-t border-black/5">
                                <button 
                                  onClick={() => { setEditingId(msg.id); setEditText(msg.message); }}
                                  className="text-[10px] text-blue-600 font-semibold"
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => deleteForMe(msg.id)}
                                  className="text-[10px] text-red-500 font-semibold"
                                >
                                  For Me
                                </button>
                                <button 
                                  onClick={() => deleteForEveryone(msg.id)}
                                  className="text-[10px] text-red-700 font-bold"
                                >
                                  Everyone
                                </button>
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

            {/* Input Field */}
            <div className="p-3 bg-[#f0f0f0] border-t flex gap-2 items-center">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 rounded-full border-none outline-none focus:ring-2 focus:ring-sky-600 shadow-sm"
              />
              <button 
                onClick={handleSend}
                className="bg-sky-800 text-white p-2.5 rounded-full hover:bg-sky-900 shadow-md"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
             <div className="text-6xl mb-4">💬</div>
             <p className="text-lg font-medium">Select an employee to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;



