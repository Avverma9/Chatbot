import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css";
import { FaTimes, FaTrash } from "react-icons/fa";
import { AiOutlineSend } from "react-icons/ai";
import {TiDeleteOutline} from 'react-icons/ti'

const ChatBox = () => {
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [botResponse, setBotResponse] = useState("");
  const [showClearButton, setShowClearButton] = useState(false);

  const messagesContainerRef = useRef(null);

  const toggleChat = () => {
    setShowChat((prevShowChat) => !prevShowChat);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const sendMessageAndGetBotResponse = async (userMessage) => {
    try {
      const response = await fetch(
        `https://testforchatbot.vercel.app/get_bot_response?message=${encodeURIComponent(
          userMessage
        )}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      setBotResponse(data.message || "Sorry, didn't get you.");
    } catch (error) {
      console.error("Error fetching bot response:", error);
    }
  };

  const handleMessageSend = () => {
    if (message.trim() !== "") {
      const currentTime = new Date().toLocaleTimeString();
      const userMessage = { text: message, user: true, timestamp: currentTime };

      setMessages((prevMessages) => [...prevMessages, userMessage]);

      sendMessageAndGetBotResponse(message);

      setMessage("");
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setBotResponse("");
    setShowClearButton(false);
  };

  useEffect(() => {
    if (botResponse) {
      const currentTime = new Date().toLocaleTimeString();
      const botMessage = {
        text: botResponse,
        user: false,
        timestamp: currentTime,
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setBotResponse("");
      setShowClearButton(true);
    }
  }, [botResponse]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleMessageSend();
    }
  };

  return (
    <div className={`chat-container ${showChat ? "chat-open" : ""}`}>
      {!showChat && (
        <div className="chat-icon" onClick={toggleChat}>
          <img
            src="https://uploads-ssl.webflow.com/5c99a2b7f7d06d83b8d7d285/5cb9655e16ec99109bf1780a_Ava%20Wave%20wink%20welcome%20to%20button.gif"
            alt="Chat Icon"
          />
        </div>
      )}
      {showChat && (
        <div className="chat-window">
          <div className="chat-header">
            <button className="close-btn" onClick={toggleChat}>
              <TiDeleteOutline />
            </button>
            {showClearButton && (
              <button className="clear-btn" onClick={clearMessages}>
                <FaTrash />
              </button>
            )}
          </div>
          <div className="chat-messages" ref={messagesContainerRef}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${
                  message.user ? "user-message" : "bot-message"
                }`}
              >
                <div className="message-content">{message.text}</div>
                <div className="message-timestamp">{message.timestamp}</div>
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Type your message"
              value={message}
              onChange={handleMessageChange}
              onKeyPress={handleKeyPress}
            />
            <button onClick={handleMessageSend}>
              <AiOutlineSend />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
