import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import "./chat.css"; // ✅ external CSS

let stompClient = null;

const ChatMessage = () => {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [username, setUsername] = useState("");
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    axios
      .get("http://localhost:9595/lostfound/user", { withCredentials: true })
      .then((res) => {
        const name = String(res.data || "").trim();
        setUsername(name);
        connect(name);
      })
      .catch(() => setConnecting(false));

    return () => {
      if (stompClient) {
        stompClient.deactivate();
        stompClient = null;
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const connect = (autoName = username) => {
    if (!autoName.trim()) return;

    if (stompClient && stompClient.active) return;

    const socket = new SockJS("http://localhost:9595/lostfound/ws");

    stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,

      onConnect: () => {
        setConnected(true);
        setConnecting(false);

        stompClient.subscribe("/topic/messages", (message) => {
          const body = JSON.parse(message.body);
          setMessages((prev) => [...prev, body]);
        });

        stompClient.subscribe("/topic/users", (message) => {
          const users = JSON.parse(message.body);
          setOnlineUsers(Array.from(users));
        });

        stompClient.publish({
          destination: "/app/register",
          body: JSON.stringify({
            sender: autoName,
            type: "JOIN",
            content: "",
            timestamp: new Date().toISOString(),
          }),
        });
      },

      onDisconnect: () => {
        setConnected(false);
        stompClient = null;
      },

      onStompError: () => setConnecting(false),
    });

    stompClient.activate();
  };

  const handleSend = () => {
    if (!inputValue.trim() || !connected || !stompClient) return;

    stompClient.publish({
      destination: "/app/sendMessage",
      body: JSON.stringify({
        sender: username,
        content: inputValue.trim(),
        type: "CHAT",
        timestamp: new Date().toISOString(),
      }),
    });

    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getInitial = (val) =>
    val ? val.trim().charAt(0).toUpperCase() : "?";

  const formatTime = (timestamp) =>
    timestamp
      ? new Date(timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  const statusClass = connecting
    ? "status-connecting"
    : connected
    ? "status-connected"
    : "status-disconnected";

  const statusText = connecting
    ? "⏳ Connecting..."
    : connected
    ? "🟢 Connected"
    : "🔴 Disconnected";

  return (
    <>
      {/* ❌ removed <style>{styles}</style> */}

      <div className="chat-bg" />
      <div className="chat-overlay" />

      <div className="chat-page">

        <div className="chat-header">
          <div className="chat-header-left">
            <div className="chat-eyebrow">
              <div className="chat-eyebrow-line" />
              <span className="chat-eyebrow-text">Lost & Found Portal</span>
            </div>
            <h1 className="chat-title">Live <em>Chat</em></h1>
          </div>

          {username && (
            <div className="chat-user-badge">
              <div className="chat-user-avatar">
                {getInitial(username)}
              </div>
              <div>
                <div className="chat-user-label">Logged in as</div>
                <div className="chat-user-name">{username}</div>
              </div>
            </div>
          )}
        </div>

        <div className="chat-body">

          <div className="chat-sidebar">
            <div className="chat-sidebar-header">
              <div className="chat-sidebar-title">Online Users</div>
              <div className="chat-online-count">
                <span className="chat-online-dot" />
                {onlineUsers.length} online
              </div>
            </div>

            <div className="chat-users-list">
              {onlineUsers.length === 0 ? (
                <div className="chat-no-users">No users online</div>
              ) : (
                onlineUsers.map((user, idx) => (
                  <div className="chat-user-item" key={idx}>
                    <div className="chat-user-item-avatar">
                      {getInitial(user)}
                    </div>
                    <span className="chat-user-item-name">{user}</span>
                    {user === username && (
                      <span className="chat-user-item-you">You</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="chat-main">

            <div className={`chat-status-bar ${statusClass}`}>
              {statusText}
            </div>

            <div className="chat-messages">
              {messages.length === 0 ? (
                <div className="chat-empty">
                  <div className="chat-empty-icon">💬</div>
                  <div className="chat-empty-text">
                    No messages yet.<br />Be the first!
                  </div>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  if (msg.type === "JOIN" || msg.type === "LEAVE") {
                    return (
                      <div className="chat-msg-system" key={idx}>
                        {msg.sender} {msg.type === "JOIN" ? "joined" : "left"}
                      </div>
                    );
                  }

                  const isMine = msg.sender === username;

                  return (
                    <div className={`chat-msg-row ${isMine ? "mine" : ""}`} key={idx}>
                      <div className="chat-msg-avatar">
                        {getInitial(msg.sender)}
                      </div>
                      <div className="chat-msg-content">
                        {!isMine && (
                          <div className="chat-msg-sender">{msg.sender}</div>
                        )}
                        <div className="chat-msg-bubble">{msg.content}</div>
                        <div className="chat-msg-time">
                          {formatTime(msg.timestamp)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
              <input
                type="text"
                className="chat-input"
                placeholder="Type message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!connected}
              />

              <button
                className="chat-send-btn"
                onClick={handleSend}
                disabled={!connected || !inputValue.trim()}
              >
                ➤
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default ChatMessage;
