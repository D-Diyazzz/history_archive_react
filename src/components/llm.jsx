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
          Чат
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

