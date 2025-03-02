import React, { useState } from "react";
import ReactDOM from "react-dom";
import '../style/partials/ChatWidget.css'

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false); // Состояние окна чата
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const toggleChat = () => setIsOpen((prev) => !prev);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch(`http://127.0.0.1:8000/v1/gpt?question=${input}`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Ошибка при получении ответа");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botMessage = { sender: "bot", text: "" };

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        botMessage.text += decoder.decode(value, { stream: true });
        setMessages((prev) => [
          ...prev.filter((msg) => msg.sender !== "bot"),
          botMessage,
        ]);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Ошибка при получении ответа" },
      ]);
    }
  };

  return ReactDOM.createPortal(
    <div className="chat-widget">
      <div className={`chat-window ${isOpen ? "open" : ""}`}>
        <div className="chat-header" onClick={toggleChat}>
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M25 0C11.1925 0 0 11.1925 0 25C0 38.8075 11.1925 50 25 50H45C46.3261 50 47.5979 49.4732 48.5355 48.5355C49.4732 47.5979 50 46.3261 50 45V25C50 11.1925 38.8075 0 25 0Z" fill="#0700D8"/>
<path d="M17.4976 20H32.4997C33.1369 20.0007 33.7499 20.2447 34.2133 20.6821C34.6767 21.1195 34.9556 21.7174 34.9929 22.3535C35.0303 22.9896 34.8233 23.6159 34.4143 24.1046C34.0052 24.5932 33.425 24.9072 32.7922 24.9825L32.4997 25H17.4976C16.8603 24.9993 16.2473 24.7553 15.7839 24.3179C15.3205 23.8805 15.0416 23.2826 15.0043 22.6465C14.967 22.0104 15.1739 21.3841 15.583 20.8954C15.992 20.4068 16.5722 20.0928 17.205 20.0175L17.4976 20ZM24.9986 30H32.4997C33.1628 30 33.7988 30.2634 34.2677 30.7322C34.7366 31.2011 35 31.837 35 32.5C35 33.163 34.7366 33.7989 34.2677 34.2678C33.7988 34.7366 33.1628 35 32.4997 35H24.9986C24.3355 35 23.6995 34.7366 23.2306 34.2678C22.7617 33.7989 22.4983 33.163 22.4983 32.5C22.4983 31.837 22.7617 31.2011 23.2306 30.7322C23.6995 30.2634 24.3355 30 24.9986 30Z" fill="white"/></svg>
        </div>
        {isOpen && (
          <div className="chat-body">
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-message ${
                    msg.sender === "user" ? "user" : "bot"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                placeholder="Введите сообщение..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
              <button onClick={sendMessage}>Отправить</button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body // Рендерим в конец body
  );
}

export default ChatWidget;

