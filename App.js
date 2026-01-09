import { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:5000");

function App() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [joined, setJoined] = useState(false);

  const joinChat = () => {
    if (username.trim() !== "") setJoined(true);
  };

  const sendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("send_message", {
        user: username,
        text: message
      });
      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
    });
    return () => socket.off("receive_message");
  }, []);

  if (!joined) {
    return (
      <div className="join-container">
        <h2>Join Chat</h2>
        <input placeholder="Enter name"
          onChange={(e) => setUsername(e.target.value)} />
        <button onClick={joinChat}>Join</button>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">💬 Real-Time Chat</div>

      <div className="chat-body">
        {chat.map((msg, i) => (
          <div key={i} className={msg.user === username ? "message own" : "message"}>
            <strong>{msg.user}</strong>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      <div className="chat-footer">
        <input
          value={message}
          placeholder="Type message..."
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
