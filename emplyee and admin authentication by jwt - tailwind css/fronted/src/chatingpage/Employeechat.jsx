
// // import React, { useState, useEffect, useRef, useContext } from "react";
// // import { ChatContext } from "../Chatcontext/ChateContext";
// // import { AuthContext } from "../auth/AuthContext";
// // import { toast } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";

// // const EmployeeChat = () => {
// //   const { user, admins, fetchAdmins } = useContext(AuthContext);
// //   const { messages, loading, sendMessage, getConversation, markAsRead } = useContext(ChatContext);

// //   const [selectedAdmin, setSelectedAdmin] = useState(null);
// //   const [newMessage, setNewMessage] = useState("");
// //   const messagesTopRef = useRef(null); // scroll to top

// //   // Fetch admins on mount
// //   useEffect(() => {
// //     fetchAdmins();
// //   }, []);

// //   // Fetch conversation & mark read when admin selected
// //   useEffect(() => {
// //     if (selectedAdmin) {
// //       getConversation(selectedAdmin.id);
// //       markAsRead(selectedAdmin.id); 
// //     }
// //   }, [selectedAdmin]);

// //   // jo message last me send use last me display karo 
// //   useEffect(() => {
// //     messagesTopRef.current?.scrollIntoView({ behavior: "smooth" });
// //   }, [messages, selectedAdmin]);

// //   // eska koi  jarurat nahi hai

// //   useEffect(() => {
// //     if (messages.length > 0 && selectedAdmin) {
// //       const lastMsg = messages[messages.length - 1];
// //       if (lastMsg.sender_id === selectedAdmin.id && lastMsg.sender_type !== user.role) {
// //         toast.info(`New message from ${selectedAdmin.name}`);
// //       }
// //     }
// //   }, [messages]);

// //   const handleSend = async () => {
// //     if (!newMessage.trim() || !selectedAdmin) return;

// //     // Prepend locally so new message shows at top instantly
// //     const tempMsg = {
// //       id: Date.now(),
// //       sender_id: user.id,
// //       receiver_id: selectedAdmin.id,
// //       sender_type: user.role,
// //       message: newMessage,
// //       created_at: new Date().toISOString(),
// //       read_status: "read",
// //     };
// //     messages.unshift(tempMsg);

// //     setNewMessage("");

// //     try {
// //       await sendMessage(selectedAdmin.id, newMessage);
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

// //   // Filter and sort messages (newest first)
// //   const messagesToRender = selectedAdmin
// //     ? messages
// //         .filter(
// //           (msg) =>
// //             msg.sender_id === selectedAdmin.id || msg.receiver_id === selectedAdmin.id
// //         )
// //         .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
// //     : [];

// //   // Count unread messages per admin
// //   const getUnreadCount = (adminId) => {
// //     return messages.filter(
// //       (msg) => msg.sender_id === adminId && msg.read_status === "unread"
// //     ).length;
// //   };

// //   return (
// //     <div className="flex h-screen bg-gray-100">
// //       {/* Sidebar */}
// //       <div className="w-1/3 border-r bg-white overflow-y-auto">
// //         <h2 className="p-4 font-bold text-gray-700">Admins</h2>
// //         {admins.length === 0 ? (
// //           <p className="p-4 text-gray-500">No admins found</p>
// //         ) : (
// //           admins.map((admin) => {
// //             const unreadCount = getUnreadCount(admin.id);
// //             return (
// //               <div
// //                 key={admin.id}
// //                 onClick={() => setSelectedAdmin(admin)}
// //                 className={`cursor-pointer p-4 border-b flex justify-between items-center hover:bg-gray-100 ${
// //                   selectedAdmin?.id === admin.id ? "bg-blue-100" : ""
// //                 }`}
// //               >
// //                 <span>{admin.name}</span>
// //                 {unreadCount > 0 && (
// //                   <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
// //                     {unreadCount}
// //                   </span>
// //                 )}
// //               </div>
// //             );
// //           })
// //         )}
// //       </div>

// //       {/* Chat Area */}
// //       <div className="flex-1 flex flex-col">
// //         {/* Messages */}
// //         <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-2">
// //           <div ref={messagesTopRef} /> {/* bottom karo jaise real chat me hosta hai */}
// //           {selectedAdmin ? (
// //             loading ? (
// //               <p className="text-center text-gray-500">Loading messages...</p>
// //             ) : messagesToRender.length === 0 ? (
// //               <p className="text-center text-gray-400">No messages yet</p>
// //             ) : (
// //               messagesToRender.map((msg) => {
// //                 const isSender = msg.sender_type === user.role;
// //                 return (
// //                   <div
// //                     key={msg.id}
// //                     className={`flex ${isSender ? "justify-end" : "justify-start"}`}
// //                   >
// //                     <div
// //                       className={`p-2 rounded-lg max-w-xs break-words relative ${
// //                         isSender
// //                           ? "bg-green-500 text-white"
// //                           : "bg-white text-gray-800 border"
// //                       }`}
// //                     >
// //                         {/* refresh hone pe sender message hot ja raha hia ese nhi hatna chaiye  */}
// //                       {msg.message}
// //                       {isSender && (
// //                         <span className="absolute bottom-1 right-1 text-xs text-gray-200">
// //                           {msg.read_status === "read" ? "✔✔" : "✔"}
// //                         </span>
// //                       )}
// //                     </div>
// //                   </div>
// //                 );
// //               })
// //             )
// //           ) : (
// //             <p className="text-center text-gray-400">Select an admin to start chatting</p>
// //           )}
// //         </div>

// //         {/* Input */}
// //         {selectedAdmin && (
// //           <div className="p-4 border-t flex items-center gap-2 bg-white">
// //             <input
// //               type="text"
// //               className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
// //               placeholder="Type a message..."
// //               value={newMessage}
// //               onChange={(e) => setNewMessage(e.target.value)}
// //               onKeyDown={(e) => e.key === "Enter" && handleSend()}
// //             />
// //             <button
// //               onClick={handleSend}
// //               className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
// //             >
// //               Send
// //             </button>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default EmployeeChat;
// import React, { useState, useEffect, useRef, useContext } from "react";
// import { ChatContext } from "../Chatcontext/ChateContext";
// import { AuthContext } from "../auth/AuthContext";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const EmployeeChat = () => {
//   const { user, admins, fetchAdmins } = useContext(AuthContext);
//   const { messages, loading,sendMessage, getConversation, markAsRead, setMessages } = useContext(ChatContext);

//   const [selectedAdmin, setSelectedAdmin] = useState(null);
//   const [newMessage, setNewMessage] = useState("");
//   const messagesEndRef = useRef(null);

//   // Fetch admins on mount
//   useEffect(() => {
//     fetchAdmins();
//   }, []);

//   // Fetch conversation & mark as read when admin selected
//   useEffect(() => {
//     if (selectedAdmin) {
//       getConversation(selectedAdmin.id);
//       markAsRead(selectedAdmin.id);
//     }
//   }, [selectedAdmin]);

//   // Scroll to bottom on new messages
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, selectedAdmin]);

//   // Toast notification for new messages from admin
//   useEffect(() => {
//     if (messages.length > 0 && selectedAdmin) {
//       const lastMsg = messages[messages.length - 1];
//       if (lastMsg.sender_id === selectedAdmin.id && lastMsg.sender_type !== user.role) {
//         toast.info(`New message from ${selectedAdmin.name}`);
//       }
//     }
//   }, [messages, selectedAdmin]);

//   // ---------------- Handle Send ----------------
//   const handleSend = async () => {
//     const trimmed = newMessage.trim();
//     if (!trimmed || !selectedAdmin) return;

//     const tempMsg = {
//       id: Date.now(),
//       sender_id: user.id,
//       receiver_id: selectedAdmin.id,
//       sender_type: user.role,
//       message: trimmed,
//       created_at: new Date().toISOString(),
//       read_status: "read",
//     };

//     // Optimistic UI
//     setMessages(prev => [...prev, tempMsg]);
//     setNewMessage("");

//     try {
//       const sent = await sendMessage(selectedAdmin.id, trimmed);
//       // Replace tempMsg with server data if needed
//       if (sent?.data) {
//         setMessages(prev => prev.map(msg => (msg.id === tempMsg.id ? sent.data : msg)));
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to send message");
//     }
//   };

//   console.log("handle",handleSend)

//   // Filter and sort messages (oldest first)
//   const messagesToRender = selectedAdmin
//     ? messages
//         .filter(msg => msg.sender_id === selectedAdmin.id || msg.receiver_id === selectedAdmin.id)
//         .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
//     : [];

//   // Count unread messages per admin
//   const getUnreadCount = adminId =>
//     messages.filter(msg => msg.sender_id === adminId && msg.read_status === "unread").length;

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className="w-1/3 border-r bg-white overflow-y-auto">
//         <h2 className="p-4 font-bold text-gray-700">Admins</h2>
//         {admins.length === 0 ? (
//           <p className="p-4 text-gray-500">No admins found</p>
//         ) : (
//           admins.map(admin => {
//             const unreadCount = getUnreadCount(admin.id);
//             return (
//               <div
//                 key={admin.id}
//                 onClick={() => setSelectedAdmin(admin)}
//                 className={`cursor-pointer p-4 border-b flex justify-between items-center hover:bg-gray-100 ${
//                   selectedAdmin?.id === admin.id ? "bg-blue-100" : ""
//                 }`}
//               >
//                 <span>{admin.name}</span>
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
//         {/* Messages */}
//         <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-2">
//           {selectedAdmin ? (
//             loading ? (
//               <p className="text-center text-gray-500">Loading messages...</p>
//             ) : messagesToRender.length === 0 ? (
//               <p className="text-center text-gray-400">No messages yet</p>
//             ) : (
//               messagesToRender.map(msg => {
//                 const isSender = msg.sender_type === user.role;
//                 return (
//                   <div
//                     key={msg.id}
//                     className={`flex ${isSender ? "justify-end" : "justify-start"}`}
//                   >
//                     <div
//                       className={`p-2 rounded-lg max-w-xs break-words relative ${
//                         isSender ? "bg-green-500 text-white" : "bg-white text-gray-800 border"
//                       }`}
//                     >
//                       {msg.deleted ? (
//                         <i className="text-gray-400 italic">Message deleted</i>
//                       ) : (
//                         <>
//                           {msg.message}
//                           {msg.edited === "yes" && (
//                             <span className="text-xs text-gray-200 ml-1">(edited)</span>
//                           )}
//                         </>
//                       )}
//                       {isSender && !msg.deleted && (
//                         <span className="absolute bottom-1 right-1 text-xs text-gray-200">
//                           {msg.read_status === "read" ? "✔✔" : "✔"}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })
//             )
//           ) : (
//             <p className="text-center text-gray-400">Select an admin to start chatting</p>
//           )}
//           <div ref={messagesEndRef} /> {/* scroll target */}
//         </div>

//         {/* Input */}
//         {selectedAdmin && (
//           <div className="p-4 border-t flex items-center gap-2 bg-white">
//             <input
//               type="text"
//               className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
//               placeholder="Type a message..."
//               value={newMessage}
//               onChange={e => setNewMessage(e.target.value)}
//               onKeyDown={e => e.key === "Enter" && handleSend()}
//             />
//             <button
//               onClick={handleSend}
//               className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//             >
//               Send
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EmployeeChat;

import React, { useState, useEffect, useRef, useContext } from "react";
import { ChatContext } from "../Chatcontext/ChateContext";
import { AuthContext } from "../auth/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmployeeChat = () => {
  const { user, admins, fetchAdmins } = useContext(AuthContext);
  const { messages, loading, sendMessage, getConversation, markAsRead, setMessages } = useContext(ChatContext);

  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Fetch admins on mount
  useEffect(() => { fetchAdmins(); }, []);

  // Fetch conversation & mark as read when admin selected
  useEffect(() => {
    if (selectedAdmin) {
      getConversation(selectedAdmin.id);
      markAsRead(selectedAdmin.id);
    }
  }, [selectedAdmin]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedAdmin]);

  // Toast notification for new messages from admin
  useEffect(() => {
    if (messages.length > 0 && selectedAdmin) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.sender_id === selectedAdmin.id && lastMsg.sender_type !== user.role) {
        toast.info(`New message from ${selectedAdmin.name}`);
      }
    }
  }, [messages, selectedAdmin]);

  // ---------------- Handle Send ----------------
  const handleSend = async () => {
  const trimmed = newMessage.trim();
  if (!trimmed || !selectedAdmin) return;

  const tempMsg = {
    id: Date.now(),
    sender_id: user.id,
    receiver_id: selectedAdmin.id,
    sender_type: user.role,
    message: trimmed,
    created_at: new Date().toISOString(),
    read_status: "read",
  };

  // Update state immediately for UI
  setMessages(prev => [...prev, tempMsg]);
  setNewMessage("");

  try {
    const sent = await sendMessage(selectedAdmin.id, trimmed);
    if (sent?.data?.id) {
      setMessages(prev =>
        prev.map(msg => (msg.id === tempMsg.id ? sent.data : msg))
      );
    }
  } catch (err) {
    console.error(err);
    toast.error("Failed to send message");
  }
};

  // Filter and sort messages (oldest first)
  const messagesToRender = selectedAdmin
    ? messages
        .filter(msg => msg.sender_id === selectedAdmin.id || msg.receiver_id === selectedAdmin.id)
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    : [];

  const getUnreadCount = adminId =>
    messages.filter(msg => msg.sender_id === adminId && msg.read_status === "unread").length;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/3 border-r bg-white overflow-y-auto">
        <h2 className="p-4 font-bold text-gray-700">Admins</h2>
        {admins.length === 0 ? (
          <p className="p-4 text-gray-500">No admins found</p>
        ) : (
          admins.map(admin => {
            const unreadCount = getUnreadCount(admin.id);
            return (
              <div
                key={admin.id}
                onClick={() => setSelectedAdmin(admin)}
                className={`cursor-pointer p-4 border-b flex justify-between items-center hover:bg-gray-100 ${
                  selectedAdmin?.id === admin.id ? "bg-blue-100" : ""
                }`}
              >
                <span>{admin.name}</span>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
                    {unreadCount}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-2">
          {selectedAdmin ? (
            loading ? (
              <p className="text-center text-gray-500">Loading messages...</p>
            ) : messagesToRender.length === 0 ? (
              <p className="text-center text-gray-400">No messages yet</p>
            ) : (
              messagesToRender.map(msg => {
                const isSender = msg.sender_type === user.role;
                return (
                  <div key={msg.id} className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
                    <div className={`p-2 rounded-lg max-w-xs break-words relative ${isSender ? "bg-green-500 text-white" : "bg-white text-gray-800 border"}`}>
                      {msg.deleted ? (
                        <i className="text-gray-400 italic">Message deleted</i>
                      ) : (
                        <>
                          {msg.message}
                          {msg.edited === "yes" && <span className="text-xs text-gray-200 ml-1">(edited)</span>}
                        </>
                      )}
                      {isSender && !msg.deleted && (
                        <span className="absolute bottom-1 right-1 text-xs text-gray-200">
                          {msg.read_status === "read" ? "✔✔" : "✔"}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )
          ) : (
            <p className="text-center text-gray-400">Select an admin to start chatting</p>
          )}
          <div ref={messagesEndRef} />
        </div>

        {selectedAdmin && (
          <div className="p-4 border-t flex items-center gap-2 bg-white">
            <input
              type="text"
              className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Type a message..."
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeChat;
