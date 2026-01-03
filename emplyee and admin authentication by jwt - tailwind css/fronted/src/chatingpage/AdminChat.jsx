
// import React, { useState, useEffect, useRef, useContext } from "react";
// import { ChatContext } from "../Chatcontext/ChateContext";
// import { AuthContext } from "../auth/AuthContext";

// const AdminChat = () => {
//   const { user, employees, fetchEmployees } = useContext(AuthContext);
//   const {
//     messages,
//     loading,
//     sendMessage,
//     getConversation,
//     markAsRead,
//     addMessageToState,
//   } = useContext(ChatContext);

//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [newMessage, setNewMessage] = useState("");
//   const messagesEndRef = useRef(null);

//   // Fetch employees on mount
//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   // Fetch conversation & mark as read when selecting employee
//   useEffect(() => {
//     if (selectedEmployee) {
//       getConversation(selectedEmployee.id);
//       markAsRead(selectedEmployee.id);
//     }
//   }, [selectedEmployee]);

//   // Auto-scroll to bottom when messages change
//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages, selectedEmployee]);

//   // Filter messages for selected employee
//   const conversation = selectedEmployee
//     ? messages.filter(
//         (msg) =>
//           (msg.senderId === selectedEmployee.id &&
//             msg.receiverId === user.id) ||
//           (msg.senderId === user.id && msg.receiverId === selectedEmployee.id)
//       )
//     : [];

//   // Count unread messages
//   const getUnreadCount = (employeeId) => {
//     return messages.filter(
//       (msg) => msg.senderId === employeeId && !msg.read
//     ).length;
//   };

//   // Handle sending message
//   const handleSend = () => {
//     if (!newMessage.trim() || !selectedEmployee) return;

//     const messageData = {
//       senderId: user.id,
//       receiverId: selectedEmployee.id,
//       text: newMessage.trim(),
//       timestamp: new Date().toISOString(),
//       read: false,
//     };

//     // Update UI immediately
//     addMessageToState(messageData);

//     // Send to backend
//     sendMessage(selectedEmployee.id, newMessage).catch((err) =>
//       console.error("Send message error:", err)
//     );

//     setNewMessage("");
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") handleSend();
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className="w-1/3 border-r bg-white overflow-y-auto">
//         <h2 className="p-4 font-bold text-gray-700">Employees</h2>
//         {employees.length === 0 ? (
//           <p className="p-4 text-gray-500">No employees found</p>
//         ) : (
//           employees.map((emp) => {
//             const unreadCount = getUnreadCount(emp.id);
//             return (
//               <div
//                 key={emp.id}
//                 onClick={() => setSelectedEmployee(emp)}
//                 className={`cursor-pointer p-4 border-b flex justify-between items-center hover:bg-gray-100 ${
//                   selectedEmployee?.id === emp.id ? "bg-blue-100" : ""
//                 }`}
//               >
//                 <span>{emp.name}</span>
//                 {unreadCount > 0 && (
//                   <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
//                     {unreadCount}
//                   </span>
//                 )}
//               </div>
//             );
//           })
//         )}
//       </div>

//       {/* Chat Area */}
//       <div className="flex-1 flex flex-col">
//         {/* Chat Header */}
//         <div className="p-4 border-b bg-white">
//           <h2 className="font-bold text-gray-700">
//             {selectedEmployee ? selectedEmployee.name : "Select an employee"}
//           </h2>
//         </div>

//         {/* Messages */}
//         <div className="flex-1 p-4 overflow-y-auto">
//           {loading ? (
//             <p className="text-gray-500">Loading messages...</p>
//           ) : selectedEmployee ? (
//             conversation.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`mb-2 flex ${
//                   msg.senderId === user.id ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 <div
//                   className={`p-2 rounded-lg max-w-xs ${
//                     msg.senderId === user.id
//                       ? "bg-blue-500 text-white"
//                       : "bg-gray-200 text-gray-800"
//                   }`}
//                 >
//                   {msg.text}
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500">No conversation selected</p>
//           )}
//           <div ref={messagesEndRef} />
//         </div>

//         {/* Message Input */}
//         {selectedEmployee && (
//           <div className="p-4 border-t bg-white flex">
//             <input
//               type="text"
//               className="flex-1 border rounded px-3 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//               placeholder="Type your message..."
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               onKeyPress={handleKeyPress}
//             />
//             <button
//               className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//               onClick={handleSend}
//             >
//               Send
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminChat;



import React, { useState, useEffect, useRef, useContext } from "react";
import { ChatContext } from "../Chatcontext/ChateContext";
import { AuthContext } from "../auth/AuthContext";

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
    deleteForEveryone
  } = useContext(ChatContext);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingText, setEditingText] = useState("");
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
    const text = newMessage.trim();
    if (!text || !selectedEmployee) return;
    setNewMessage("");
    try { await sendMessage(selectedEmployee.id, text); } 
    catch (err) { console.error("Failed to send message:", err); }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (editingMessageId) handleEditSave();
      else handleSend();
    }
  };

  const handleEditSave = async () => {
    if (!editingText.trim()) return;
    await editMessage(editingMessageId, editingText);
    setEditingMessageId(null);
    setEditingText("");
  };

  const getUnreadCount = (empId) =>
    messages.filter(m => Number(m.sender_id) === Number(empId) && m.read_status !== "read").length;

  return (
    <div className="flex h-screen bg-[#e5ddd5]">
      {/* Sidebar */}
      <div className="w-1/3 border-r bg-white overflow-y-auto">
        <h2 className="p-4 font-bold border-b">Employees</h2>
        {employees.map(emp => {
          const unread = getUnreadCount(emp.id);
          return (
            <div
              key={emp.id}
              onClick={() => setSelectedEmployee(emp)}
              className={`cursor-pointer p-4 border-b flex justify-between items-center hover:bg-gray-100 ${
                selectedEmployee?.id === emp.id ? "bg-green-100" : ""
              }`}
            >
              <span>{emp.name}</span>
              {unread > 0 && (
                <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">{unread}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b bg-white">
          <h2 className="font-bold text-gray-700">
            {selectedEmployee ? selectedEmployee.name : "Select an employee"}
          </h2>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-2">
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : selectedEmployee && messages.length > 0 ? (
            messages
              .slice()
              .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
              .map(msg => {
                const isMe = Number(msg.sender_id) === Number(user.id);
                const isEditing = editingMessageId === msg.id;

                return (
                  <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`px-3 py-2 rounded-lg max-w-xs shadow text-sm break-words ${
                      isMe ? "bg-[#dcf8c6] rounded-br-none" : "bg-white rounded-bl-none"
                    }`}>

                      {/* Inline editing */}
                      {isEditing ? (
                        <input
                          type="text"
                          value={editingText}
                          onChange={e => setEditingText(e.target.value)}
                          onKeyDown={handleKeyPress}
                          className="border px-2 py-1 rounded w-full"
                          autoFocus
                        />
                      ) : (
                        <span>{msg.message}</span>
                      )}

                      <div className="text-[10px] text-gray-500 text-right mt-1">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        {isMe && (msg.read_status === "read" ? "✔✔" : "✔")}
                      </div>

                      {/* Edit/Delete buttons */}
                      {isMe && !isEditing && (
                        <div className="flex gap-2 mt-1">
                          <button
                            className="text-blue-500 text-xs"
                            onClick={() => { setEditingMessageId(msg.id); setEditingText(msg.message); }}
                          >
                            Edit
                          </button>
                          <button className="text-red-500 text-xs" onClick={() => deleteForMe(msg.id)}>
                            Delete For Me
                          </button>
                          <button className="text-red-700 text-xs" onClick={() => deleteForEveryone(msg.id)}>
                            Delete For Everyone
                          </button>
                        </div>
                      )}

                      {isEditing && (
                        <div className="flex gap-2 mt-1">
                          <button className="text-green-500 text-xs" onClick={handleEditSave}>
                            Save
                          </button>
                          <button className="text-gray-500 text-xs" onClick={() => setEditingMessageId(null)}>
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
          ) : (
            <p className="text-gray-500">No conversation</p>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {selectedEmployee && (
          <div className="p-3 border-t bg-white flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 border rounded-full px-4 py-2 outline-none"
            />
            <button onClick={handleSend} className="bg-blue-500 text-white px-5 py-2 rounded-full">
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;