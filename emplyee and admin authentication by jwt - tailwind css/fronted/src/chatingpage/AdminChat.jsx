
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
    addMessageToState,
  } = useContext(ChatContext);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Fetch employees on mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fetch conversation & mark as read when selecting employee
  useEffect(() => {
    if (selectedEmployee) {
      getConversation(selectedEmployee.id);
      markAsRead(selectedEmployee.id);
    }
  }, [selectedEmployee]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedEmployee]);

  // Filter messages for selected employee
  const conversation = selectedEmployee
    ? messages.filter(
        (msg) =>
          (msg.senderId === selectedEmployee.id &&
            msg.receiverId === user.id) ||
          (msg.senderId === user.id && msg.receiverId === selectedEmployee.id)
      )
    : [];

  // Count unread messages
  const getUnreadCount = (employeeId) => {
    return messages.filter(
      (msg) => msg.senderId === employeeId && !msg.read
    ).length;
  };

  // Handle sending message
  const handleSend = () => {
    if (!newMessage.trim() || !selectedEmployee) return;

    const messageData = {
      senderId: user.id,
      receiverId: selectedEmployee.id,
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    // Update UI immediately
    addMessageToState(messageData);

    // Send to backend
    sendMessage(selectedEmployee.id, newMessage).catch((err) =>
      console.error("Send message error:", err)
    );

    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/3 border-r bg-white overflow-y-auto">
        <h2 className="p-4 font-bold text-gray-700">Employees</h2>
        {employees.length === 0 ? (
          <p className="p-4 text-gray-500">No employees found</p>
        ) : (
          employees.map((emp) => {
            const unreadCount = getUnreadCount(emp.id);
            return (
              <div
                key={emp.id}
                onClick={() => setSelectedEmployee(emp)}
                className={`cursor-pointer p-4 border-b flex justify-between items-center hover:bg-gray-100 ${
                  selectedEmployee?.id === emp.id ? "bg-blue-100" : ""
                }`}
              >
                <span>{emp.name}</span>
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
        {/* Chat Header */}
        <div className="p-4 border-b bg-white">
          <h2 className="font-bold text-gray-700">
            {selectedEmployee ? selectedEmployee.name : "Select an employee"}
          </h2>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {loading ? (
            <p className="text-gray-500">Loading messages...</p>
          ) : selectedEmployee ? (
            conversation.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 flex ${
                  msg.senderId === user.id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-2 rounded-lg max-w-xs ${
                    msg.senderId === user.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No conversation selected</p>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        {selectedEmployee && (
          <div className="p-4 border-t bg-white flex">
            <input
              type="text"
              className="flex-1 border rounded px-3 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleSend}
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;


// import React, { useState, useEffect, useRef, useContext } from "react";
// import { ChatContext } from "../Chatcontext/ChateContext";
// import { AuthContext } from "../auth/AuthContext";

// const AdminChat = () => {
//   const { user, employees, fetchEmployees } = useContext(AuthContext);
//   const { messages, loading, sendMessage, getConversation, markAsRead } = useContext(ChatContext);

//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [newMessage, setNewMessage] = useState("");
//   const messagesTopRef = useRef(null); // scroll to top

//   // Fetch employees on mount
//   useEffect(() => {
//     fetchEmployees();
//   }, []);

  



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
      
//     </div>
//   );
// };

// export default AdminChat;
// import React, { useState, useEffect, useRef, useContext } from "react";
// import { ChatContext } from "../Chatcontext/ChateContext";
// import { AuthContext } from "../auth/AuthContext";

// const AdminChat = () => {
//   const { user, employees, fetchEmployees } = useContext(AuthContext);
//   const { messages, loading, sendMessage, getConversation, markAsRead } = useContext(ChatContext);

//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [newMessage, setNewMessage] = useState("");
//   const messagesEndRef = useRef(null);

//   const [sortedEmployees, setSortedEmployees] = useState([]);

//   // Fetch employees on mount
//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   // Update sidebar order whenever employees or messages change
//   useEffect(() => {
//     const employeesWithLastMsg = employees.map((emp) => {
//       // Get last message for this employee
//       const lastMsg = messages
//         .filter((msg) => msg.sender_id === emp.id || msg.receiver_id === emp.id)
//         .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
//       return { ...emp, lastMessageTime: lastMsg ? new Date(lastMsg.created_at) : 0 };
//     });

//     // Sort employees by lastMessageTime descending
//     employeesWithLastMsg.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
//     setSortedEmployees(employeesWithLastMsg);
//   }, [employees, messages]);

//   // Fetch conversation & mark read when employee selected
//   useEffect(() => {
//     if (selectedEmployee) {
//       getConversation(selectedEmployee.id);
//       markAsRead(selectedEmployee.id);
//     }
//   }, [selectedEmployee]);

//   // Scroll to bottom when messages update
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, selectedEmployee]);

//   // Send message
//   const handleSend = async () => {
//     if (!newMessage.trim() || !selectedEmployee) return;
//     await sendMessage(selectedEmployee.id, newMessage);
//     setNewMessage("");
//   };

//   // Count unread messages
//   const getUnreadCount = (empId) => {
//     return messages.filter(
//       (msg) => msg.sender_id === empId && msg.read_status === "unread"
//     ).length;
//   };

//   // Filter messages for selected employee & sort oldest → newest
//   const messagesToRender = selectedEmployee
//     ? messages
//         .filter(
//           (msg) =>
//             msg.sender_id === selectedEmployee.id || msg.receiver_id === selectedEmployee.id
//         )
//         .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
//     : [];

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className="w-1/3 border-r bg-white overflow-y-auto">
//         <h2 className="p-4 font-bold text-gray-700">Employees</h2>
//         {sortedEmployees.length === 0 ? (
//           <p className="p-4 text-gray-500">No employees found</p>
//         ) : (
//           sortedEmployees.map((emp) => {
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
//         {/* Messages */}
//         <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-2">
//           {selectedEmployee ? (
//             loading ? (
//               <p className="text-center text-gray-500">Loading messages...</p>
//             ) : messagesToRender.length === 0 ? (
//               <p className="text-center text-gray-400">No messages yet</p>
//             ) : (
//               messagesToRender.map((msg) => {
//                 const isSender = msg.sender_type === user.role;
//                 return (
//                   <div
//                     key={msg.id}
//                     className={`flex ${isSender ? "justify-end" : "justify-start"}`}
//                   >
//                     <div
//                       className={`p-2 rounded-lg max-w-xs break-words ${
//                         isSender ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
//                       }`}
//                     >
//                       {msg.message}
//                     </div>
//                   </div>
//                 );
//               })
//             )
//           ) : (
//             <p className="text-center text-gray-400">Select an employee to start chatting</p>
//           )}
//           <div ref={messagesEndRef} />
//         </div>

//         {/* Input */}
//         {selectedEmployee && (
//           <div className="p-4 border-t flex items-center gap-2 bg-white">
//             <input
//               type="text"
//               className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//               placeholder="Type a message..."
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleSend()}
//             />
//             <button
//               onClick={handleSend}
//               className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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
