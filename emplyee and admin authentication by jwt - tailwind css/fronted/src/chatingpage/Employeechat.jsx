import React, { useState, useEffect, useRef, useContext } from "react";
import { ChatContext } from "../Chatcontext/ChateContext";
import { AuthContext } from "../auth/AuthContext";
import { toast } from "react-toastify";
import EmojiPicker from "emoji-picker-react";
import { Smile, Paperclip, MessageSquare } from "lucide-react";
const EmployeeChat = () => {
  const { user, admins, fetchAdmins } = useContext(AuthContext);
  const {
    messages,
    loading, chatList,
    fetchChatList,
    sendMessage,
    getConversation,
    markAsRead,
    setMessages,
    editMessage,
    deleteForMe,
    deleteForEveryone,
    getFileUrl // Imported for industry-standard file path handling
  } = useContext(ChatContext);

  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null); // NEW: File State
  const [showEmoji, setShowEmoji] = useState(false); // NEW: Emoji Toggle
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null); // NEW: File Input Ref



  // 1. Initial Load: Fetch Sidebar with Unread Counts
  useEffect(() => {
    fetchChatList();
    // Optional: Keep a slower poll for background updates
    const interval = setInterval(() => fetchChatList(), 15000);
    return () => clearInterval(interval);
  }, []);

  // 2. Fetch conversation when admin is selected
  useEffect(() => {
    if (!selectedAdmin) return;
    const fetchChat = async () => {
      try {
        await getConversation(selectedAdmin.id);
        await markAsRead(selectedAdmin.id);
        // Refresh list to clear the unread badge after marking as read
        fetchChatList();
      } catch (err) {
        toast.error("Failed to load chat");
      }
    };
    fetchChat();
  }, [selectedAdmin]);

  // 3. Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1 * 1024 * 1024) { // Updated to match your 1MB limit
      toast.error("File exceeds 1MB limit");
      fileInputRef.current.value = "";
      return;
    }
    setSelectedFile(file);
  };

  const handleSend = async () => {
    if ((!newMessage.trim() && !selectedFile) || !selectedAdmin) return;
    try {
      await sendMessage(selectedAdmin.id, newMessage, selectedFile);
      setNewMessage("");
      setSelectedFile(null);
      setShowEmoji(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      toast.error("Message send failed");
    }
  };
  // 1. Fetch admins on mount and setup polling
  useEffect(() => {
    fetchAdmins();
    const interval = setInterval(() => { fetchAdmins(); }, 10000);
    return () => clearInterval(interval);
  }, []);

  // 2. Fetch conversation when admin is selected
  useEffect(() => {
    if (!selectedAdmin) return;
    setMessages([]);
    const fetchChat = async () => {
      try {
        await getConversation(selectedAdmin.id);
        await markAsRead(selectedAdmin.id);
        fetchAdmins();
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





  const handleEditSave = async (msgId) => {
    if (!editText.trim()) return;
    try {
      await editMessage(msgId, editText);
      setEditingId(null);
      setEditText("");
    } catch (err) {
      toast.error("Edit failed");
    }
  };

  return (
    <div className="flex h-[calc(100vh-102px)] w-full overflow-hidden bg-white">

      {/* SIDEBAR: Admin List */}
      <div className="w-1/4 bg-white border-r flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {chatList.map((admin) => {
            const isSelected = selectedAdmin?.id === admin.id;
            // Use unread_count directly from the database query
            const unreadCount = isSelected ? 0 : admin.unread_count;

            return (
              <div
                key={admin.id}
                onClick={() => setSelectedAdmin(admin)}
                className={`p-4 cursor-pointer flex items-center justify-between border-b transition-all ${isSelected ? "bg-sky-100 border-r-4 border-[#25d366]" : "hover:bg-gray-50"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center font-bold text-white uppercase">
                    {admin.name.charAt(0)}
                  </div>
                  <span className="font-semibold text-gray-700">{admin.name}</span>
                </div>

                {unreadCount > 0 && (
                  <span className="bg-[#25d366] text-white rounded-full px-2 py-0.5 text-[10px] font-bold shadow-md">
                    {unreadCount}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>


      {/* CHAT AREA: WhatsApp Styled */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#efeae2]"
        style={{ backgroundImage: "url('user-images.githubusercontent.com')", backgroundBlendMode: "overlay" }}>

        <div className="flex-1 p-4 overflow-y-auto space-y-2 custom-scrollbar">
          {!selectedAdmin ? (
            <div className="h-full flex flex-col items-center justify-center text-[#667781] gap-2">
              <span className="text-6xl">💬</span>
              <p className="text-lg font-medium">Select an employee to start</p>
            </div>
          ) : (
            messages.map(msg => {
              const isMe = Number(msg.sender_id) === Number(user.id);
              const isEditing = editingId === msg.id;

              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`group relative px-3 py-1.5 rounded-lg max-w-[70%] shadow-sm text-[14.5px] ${isMe ? "bg-[#dcf8c6] text-[#111b21] rounded-tr-none" : "bg-white text-[#111b21] rounded-tl-none"
                    }`}>

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
                      <div className="flex flex-col gap-2 min-w-[150px]">
                        <input
                          value={editText}
                          onChange={e => setEditText(e.target.value)}
                          autoFocus
                          className="border rounded px-2 py-1 outline-none text-sm"
                        />
                        <div className="flex gap-2">
                          <button onClick={() => handleEditSave(msg.id)} className="text-[10px] text-green-700 font-bold">SAVE</button>
                          <button onClick={() => setEditingId(null)} className="text-[10px] text-red-500 font-bold">CANCEL</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="break-words leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                        <div className="text-[10px] text-[#667781] text-right mt-1 flex justify-end items-center gap-1">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          {isMe && (
                            <span className={msg.read_status === "read" ? "text-[#53bdeb]" : "text-gray-400"}>
                              {msg.read_status === "read" ? "✔✔" : "✔"}
                            </span>
                          )}
                        </div>

                        {/* HOVER ACTIONS */}
                        {isMe && (
                          <div className="flex gap-3 mt-1 pt-1 border-t border-black/5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setEditingId(msg.id); setEditText(msg.message); }} className="text-[10px] text-blue-500">Edit</button>
                            <button onClick={() => deleteForMe(msg.id)} className="text-[10px] text-red-400">For Me</button>
                            <button onClick={() => deleteForEveryone(msg.id)} className="text-[10px] text-red-600">Everyone</button>
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

        {/* INPUT PANEL: WhatsApp Web Style */}
        {selectedAdmin && (
          <div className="p-2.5 bg-[#f0f2f5] flex items-center gap-3 px-4 relative">
            <button onClick={() => setShowEmoji(!showEmoji)} className="text-[#54656f] text-2xl">😊</button>

            {showEmoji && (
              <div className="absolute bottom-16 left-4 z-50">
                <EmojiPicker onEmojiClick={(d) => setNewMessage(p => p + d.emoji)} emojiStyle="apple" height={400} width={300} />
              </div>
            )}

            <button
              onClick={() => fileInputRef.current.click()}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Paperclip className="w-6 h-6 text-gray-600 rotate-45" />
            </button>
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />

            <div className="flex-1 relative">
              {selectedFile && (
                <div className="absolute -top-16 left-4 right-4 flex animate-in slide-in-from-bottom-2 duration-200">
                  <div className="bg-white shadow-xl border border-gray-200 rounded-xl p-3 flex items-center gap-3 w-full max-w-md">
                    {/* File Icon based on type */}
                    <div className="w-10 h-10 bg-[#00a884]/10 text-[#00a884] rounded-lg flex items-center justify-center text-xl">
                      {selectedFile.type?.includes("image") ? "🖼️" : "📄"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove file"
                    >
                      <span className="text-xl">×</span>
                    </button>
                  </div>
                </div>
              )}
              <input
                type="text"
                value={newMessage}
                placeholder="Type a message"
                onChange={e => setNewMessage(e.target.value)}
                onKeyPress={e => e.key === "Enter" && handleSend()}
                className="w-full p-2.5 rounded-lg border-none outline-none text-sm text-[#111b21]"
              />
            </div>

            <button onClick={handleSend} className="bg-[#00a884] text-white p-2.5 rounded-full hover:bg-[#008f6f] transition">
              <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M1.101,21.757L23.8,12.028L1.101,2.3l0.011,7.912l13.623,1.816L1.112,13.845L1.101,21.757z"></path></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeChat;
