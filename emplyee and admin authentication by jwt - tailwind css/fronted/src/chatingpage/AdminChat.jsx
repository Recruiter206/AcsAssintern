import React, { useState, useEffect, useRef, useContext } from "react";
import { ChatContext } from "../Chatcontext/ChateContext";
import { AuthContext } from "../auth/AuthContext";
import { toast } from "react-toastify";
import EmojiPicker from "emoji-picker-react";
import {

  Smile, Paperclip // Add these two
} from "lucide-react";
const AdminChat = () => {
  const { user, employees, fetchEmployees } = useContext(AuthContext);
  const {
    messages,
    loading,
    chatList,
    fetchChatList,
    sendMessage,
    getConversation,
    markAsRead,
    editMessage,
    deleteForMe,
    deleteForEveryone,
    getFileUrl
  } = useContext(ChatContext);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => { fetchEmployees(); }, []);

  useEffect(() => {
    if (!selectedEmployee) return;
    getConversation(selectedEmployee.id);
    markAsRead(selectedEmployee.id);
  }, [selectedEmployee]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);




  // Load the sidebar with unread counts from Database on mount
  useEffect(() => {
    fetchChatList();
  }, []);

  useEffect(() => {
    if (!selectedEmployee) return;
    getConversation(selectedEmployee.id);
    markAsRead(selectedEmployee.id);
  }, [selectedEmployee]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);



  // 1. Sidebar ko initial load aur har 5 second mein refresh karna (Polling)
  useEffect(() => {
    fetchChatList();
    const interval = setInterval(() => {
      fetchChatList();
    }, 5000); // Har 5 second mein naye messages check karega
    return () => clearInterval(interval);
  }, []);

  // 2. Jab employee select ho, tab conversation load karein aur count clean karein
  useEffect(() => {
    if (!selectedEmployee) return;

    const syncChat = async () => {
      try {
        await getConversation(selectedEmployee.id);
        await markAsRead(selectedEmployee.id);
        // Backend update ke baad turant sidebar list refresh karein
        await fetchChatList();
      } catch (err) {
        console.error("Sync error:", err);
      }
    };

    syncChat();
  }, [selectedEmployee]);

  // 3. Messages aane par auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1 * 1024 * 1024) {
      toast.error("File size must be less than 1MB");
      fileInputRef.current.value = "";
      return;
    }
    setSelectedFile(file);
  };

  const handleSend = async () => {
    if ((!newMessage.trim() && !selectedFile) || !selectedEmployee) return;
    try {
      await sendMessage(selectedEmployee.id, newMessage, selectedFile);
      setNewMessage("");
      setSelectedFile(null);
      setShowEmoji(false);
      if (fileInputRef.current) fileInputRef.current.value = "";

      // Message bhejne ke baad sidebar ko refresh karein
      fetchChatList();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEditSave = async (msgId) => {
    if (!editText.trim()) return;
    try {
      await editMessage(msgId, editText);
      setEditingId(null);
    } catch (err) {
      toast.error("Edit failed");
    }
  };


  return (
    <div className="flex h-[calc(100vh-102px)] w-full overflow-hidden bg-white">
      {/* SIDEBAR */}
      <div className="w-1/4 min-w-[280px] border-r flex flex-col h-full bg-gray-50">
        <div className="flex-1 overflow-y-auto">
          {chatList.map((emp) => {
            const isSelected = selectedEmployee?.id === emp.id;
            // Use the unread_count directly from the SQL query
            const unreadCount = isSelected ? 0 : emp.unread_count;

            return (
              <div
                key={emp.id}
                onClick={() => setSelectedEmployee(emp)}
                className={`py-3 px-3 border-b cursor-pointer transition-all flex justify-between items-center ${isSelected ? "bg-sky-100 border-r-4 border-sky-600" : "hover:bg-gray-100"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center font-bold text-white uppercase">
                    {emp.name.charAt(0)}
                  </div>
                  <span className="font-semibold text-gray-700">{emp.name}</span>
                </div>
                {unreadCount > 0 && (
                  <span className="bg-[#25d366] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col h-full bg-[#e5ddd5] overflow-hidden">
        {selectedEmployee ? (
          <>
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
              {messages.map((msg) => {
                const isMe = Number(msg.sender_id) === Number(user.id);
                const isEditing = editingId === msg.id;

                return (
                  <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`px-3 py-2 rounded-lg max-w-[75%] shadow-sm text-sm ${isMe ? "bg-[#dcf8c6] rounded-tr-none" : "bg-white rounded-tl-none"}`}>
                      {msg.file_path && (
                        <div className="mb-2 overflow-hidden rounded-md">
                          {/* 1. IMAGE DISPLAY */}
                          {msg.file_type?.includes("image") ? (
                            <img
                              src={getFileUrl(msg.file_path)}
                              alt="attachment"
                              className="max-h-64 w-full object-cover rounded cursor-zoom-in"
                              onClick={() => window.open(getFileUrl(msg.file_path), "_blank")}
                            />
                          ) :
                            /* 2. VIDEO DISPLAY */
                            msg.file_type?.includes("video") ? (
                              <video controls className="max-h-64 w-full rounded bg-black">
                                <source src={getFileUrl(msg.file_path)} type={msg.file_type} />
                              </video>
                            ) : (
                              /* 3. DOCUMENT CARD (PDF, XL, WORD, ZIP) */
                              <a
                                href={getFileUrl(msg.file_path)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all group min-w-[220px]"
                              >
                                {/* Dynamic Icons based on File Name */}
                                <div className="flex items-center justify-center w-10 h-10 rounded shadow-inner bg-white">
                                  {msg.file_name?.toLowerCase().endsWith('.pdf') ? (
                                    <span className="text-red-600 font-bold text-[10px]">PDF</span>
                                  ) : msg.file_name?.toLowerCase().match(/\.(xls|xlsx|csv)$/) ? (
                                    <span className="text-green-600 font-bold text-[10px]">XL</span>
                                  ) : msg.file_name?.toLowerCase().match(/\.(doc|docx)$/) ? (
                                    <span className="text-blue-600 font-bold text-[10px]">DOC</span>
                                  ) : (
                                    <svg xmlns="www.w3.org" className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                    </svg>
                                  )}
                                </div>

                                <div className="flex flex-col overflow-hidden">
                                  <span className="text-xs font-bold text-gray-800 truncate max-w-[140px]">
                                    {msg.file_name || "Attachment"}
                                  </span>
                                  <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest">
                                    {msg.file_name?.split('.').pop() || 'FILE'}
                                  </span>
                                </div>

                                {/* Download Arrow Icon */}
                                <div className="ml-auto bg-white p-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                  <svg xmlns="www.w3.org" className="w-4 h-4 text-[#065051]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                  </svg>
                                </div>
                              </a>
                            )}
                        </div>
                      )}

                      {isEditing ? (
                        <div className="flex flex-col gap-2">
                          <input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="p-1 border rounded outline-none text-black"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <button onClick={() => handleEditSave(msg.id)} className="text-[10px] text-green-700 font-bold uppercase">Save</button>
                            <button onClick={() => setEditingId(null)} className="text-[10px] text-gray-500 uppercase">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="break-words text-[15px]  font-medium">{msg.message}</p>
                          <div className="text-[9px] text-gray-500 text-right mt-1 flex justify-end items-center gap-1">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {isMe && <span className={msg.read_status === "read" ? "text-blue-500" : "text-gray-400"}>{msg.read_status === "read" ? "✔✔" : "✔"}</span>}
                          </div>
                          {isMe && (
                            <div className="flex gap-3 mt-2 pt-1 border-t border-black/5 opacity-70 hover:opacity-100 transition-opacity">
                              <button onClick={() => { setEditingId(msg.id); setEditText(msg.message); }} className="text-[10px] text-blue-600 font-semibold uppercase">Edit</button>
                              <button onClick={() => deleteForMe(msg.id)} className="text-[10px] text-red-500  ">For Me</button>
                              <button onClick={() => deleteForEveryone(msg.id)} className="text-[10px] text-red-700  ">Everyone</button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT PANEL */}
            <div className="p-3 bg-[#f0f2f5] border-t relative overflow-visible">
              {showEmoji && (
                <div className="absolute bottom-16 left-4 z-50 shadow-xl">
                  <EmojiPicker onEmojiClick={(d) => setNewMessage(p => p + d.emoji)} height={350} width={280} emojiStyle="apple" />
                </div>
              )}

              {/* FILE PREVIEW: Fixed positioning and z-index */}
              {selectedFile && (
                <div className="absolute bottom-full left-4 right-4 mb-2 z-50 animate-in slide-in-from-bottom-2">
                  <div className="bg-white shadow-2xl border border-gray-200 rounded-xl p-3 flex items-center gap-3 w-full max-w-md border-b-4 border-b-[#00a884]">
                    <div className="w-10 h-10 bg-[#00a884]/10 text-[#00a884] rounded-lg flex items-center justify-center text-xl">
                      {selectedFile.type?.includes("image") ? "🖼️" : "📄"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">{selectedFile.name}</p>
                      <p className="text-[10px] text-gray-500 font-black uppercase">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button onClick={() => { setSelectedFile(null); fileInputRef.current.value = ""; }} className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500">
                      <span className="text-2xl">&times;</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-2 items-center">
                <button onClick={() => setShowEmoji(!showEmoji)} className="text-2xl">😊</button>
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Paperclip className="w-6 h-6 text-gray-600 rotate-45" />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                <input
                  type="text"
                  placeholder={selectedFile ? "Add a caption..." : "Type a message"}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1 p-2 rounded-lg border-none outline-none text-sm text-black shadow-inner"
                />
                <button onClick={handleSend} className="bg-[#00a884] text-white p-2.5 rounded-full hover:bg-[#008f6f] transition">
                  <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M1.101,21.757L23.8,12.028L1.101,2.3l0.011,7.912l13.623,1.816L1.112,13.845L1.101,21.757z"></path></svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-[#667781] gap-2">
            <span className="text-6xl">💬</span>
            <p className="text-lg font-medium">Select an employee to start</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;


