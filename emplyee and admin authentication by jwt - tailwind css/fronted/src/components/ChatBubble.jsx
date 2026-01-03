import React from "react";

const ChatBubble = ({ msg, currentUserId }) => {
  const isMe = Number(msg.sender_id) === Number(currentUserId);

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-3 py-2 rounded-lg max-w-xs break-words shadow text-sm
          ${isMe ? "bg-[#dcf8c6] rounded-br-none" : "bg-white rounded-bl-none"}`}
      >
        {msg.message}
        <div className="text-[10px] text-gray-500 text-right mt-1">
          {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          {isMe && (msg.read_status === "read" ? "✔✔" : "✔")}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;