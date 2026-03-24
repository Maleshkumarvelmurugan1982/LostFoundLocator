import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Outfit:wght@200;300;400;500;600&display=swap');

  :root {
    --gold: #c8973a;
    --gold-light: #e8c06a;
    --gold-dim: rgba(200, 151, 58, 0.18);
    --white: #ffffff;
    --glass: rgba(255, 255, 255, 0.07);
    --glass-strong: rgba(255, 255, 255, 0.12);
    --glass-border: rgba(255, 255, 255, 0.15);
    --success-light: #7ec89a;
    --match: #4a6a9c;
    --match-light: #7aaae8;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── BACKGROUND ── */
  .chat-bg {
    position: fixed; inset: 0;
    background-image: url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH7Czqxtx1fy0EWH6-we2f-5GZLpqtg5KmAw&s');
    background-size: cover; background-position: center;
    filter: brightness(0.28) saturate(0.60);
    transform: scale(1.06);
    animation: bgZoom 22s ease-in-out infinite alternate;
    z-index: 0;
  }
  @keyframes bgZoom { from { transform: scale(1.06); } to { transform: scale(1.13); } }

  .chat-overlay {
    position: fixed; inset: 0;
    background: linear-gradient(135deg, rgba(4,4,18,0.84) 0%, rgba(10,10,30,0.55) 50%, rgba(4,4,18,0.88) 100%);
    z-index: 1;
  }

  /* ── PAGE ── */
  .chat-page {
    position: relative; z-index: 10;
    min-height: 100vh;
    font-family: 'Outfit', sans-serif;
    display: flex; flex-direction: column;
  }

  /* ── HEADER ── */
  .chat-header {
    padding: 28px 40px;
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid var(--glass-border);
    backdrop-filter: blur(14px);
    background: rgba(4,4,16,0.42);
    animation: headerIn 0.7s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes headerIn { from { opacity: 0; transform: translateY(-14px); } to { opacity: 1; transform: translateY(0); } }

  .chat-header-left { display: flex; flex-direction: column; gap: 4px; }
  .chat-eyebrow { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
  .chat-eyebrow-line { width: 28px; height: 1px; background: var(--gold); }
  .chat-eyebrow-text { font-size: 9px; font-weight: 500; letter-spacing: 0.25em; text-transform: uppercase; color: var(--gold-light); }
  .chat-title { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 300; color: var(--white); }
  .chat-title em { font-style: italic; color: var(--gold-light); }

  .chat-user-badge {
    display: flex; align-items: center; gap: 10px;
    background: var(--glass); border: 1px solid var(--glass-border);
    border-radius: 40px; padding: 8px 16px 8px 10px;
    backdrop-filter: blur(12px);
  }
  .chat-user-avatar {
    width: 34px; height: 34px;
    background: linear-gradient(135deg, var(--gold), var(--gold-light));
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700; color: #0a0808;
    font-family: 'Cormorant Garamond', serif;
  }
  .chat-user-label { font-size: 9px; color: rgba(255,255,255,0.55); text-transform: uppercase; letter-spacing: 0.12em; }
  .chat-user-name  { font-size: 13px; font-weight: 500; color: var(--white); }

  /* ── BODY ── */
  .chat-body {
    flex: 1; display: flex;
    max-width: 1300px; width: 100%; margin: 0 auto;
    padding: 32px 40px;
    gap: 0;
    animation: contentIn 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s both;
  }
  @keyframes contentIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

  /* ── SIDEBAR ── */
  .chat-sidebar {
    width: 220px; flex-shrink: 0;
    background: rgba(6,6,22,0.72);
    border: 1px solid var(--glass-border);
    border-radius: 14px 0 0 14px;
    backdrop-filter: blur(24px);
    display: flex; flex-direction: column;
    overflow: hidden;
  }

  .chat-sidebar-header {
    padding: 18px 16px 14px;
    border-bottom: 1px solid var(--glass-border);
    background: rgba(255,255,255,0.03);
  }
  .chat-sidebar-title {
    font-size: 10px; font-weight: 600;
    color: var(--gold-light); letter-spacing: 0.12em; text-transform: uppercase;
  }
  .chat-online-count {
    font-size: 11px; color: rgba(255,255,255,0.50);
    margin-top: 4px; display: flex; align-items: center; gap: 6px;
  }
  .chat-online-dot {
    width: 6px; height: 6px;
    background: var(--success-light); border-radius: 50%;
    animation: pulse 2s infinite;
  }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

  .chat-users-list { flex: 1; overflow-y: auto; padding: 10px 8px; }

  .chat-no-users { padding: 12px 10px; font-size: 11px; color: rgba(255,255,255,0.25); }

  .chat-user-item {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 10px; border-radius: 8px;
    margin-bottom: 2px; transition: background 0.15s;
  }
  .chat-user-item:hover { background: var(--glass); }

  .chat-user-item-avatar {
    width: 28px; height: 28px;
    background: linear-gradient(135deg, var(--match), var(--match-light));
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: var(--white); flex-shrink: 0;
  }
  .chat-user-item-name { font-size: 12px; color: rgba(255,255,255,0.85); }
  .chat-user-item-you {
    font-size: 9px; color: var(--gold-light);
    background: var(--gold-dim); border-radius: 4px;
    padding: 1px 5px; margin-left: auto;
  }

  /* ── MAIN CHAT ── */
  .chat-main {
    flex: 1; display: flex; flex-direction: column;
    background: rgba(6,6,22,0.65);
    border: 1px solid var(--glass-border);
    border-left: none;
    border-radius: 0 14px 14px 0;
    backdrop-filter: blur(24px);
    overflow: hidden;
  }

  /* Status bar */
  .chat-status-bar {
    padding: 6px 20px;
    font-size: 10px; letter-spacing: 0.10em; text-transform: uppercase;
    border-bottom: 1px solid var(--glass-border);
  }
  .status-connected    { color: var(--success-light); background: rgba(74,124,89,0.08); }
  .status-disconnected { color: rgba(255,255,255,0.35); background: rgba(255,255,255,0.03); }
  .status-connecting   { color: var(--gold-light); background: rgba(200,151,58,0.08); }

  /* Messages */
  .chat-messages {
    flex: 1; overflow-y: auto;
    padding: 24px 20px;
    display: flex; flex-direction: column; gap: 12px;
    min-height: 400px; max-height: 520px;
  }
  .chat-messages::-webkit-scrollbar { width: 4px; }
  .chat-messages::-webkit-scrollbar-track { background: transparent; }
  .chat-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }

  .chat-msg-system {
    text-align: center; font-size: 11px;
    color: rgba(255,255,255,0.35); padding: 4px 0;
  }

  .chat-empty {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 10px; color: rgba(255,255,255,0.20); padding: 40px;
  }
  .chat-empty-icon { font-size: 36px; }
  .chat-empty-text { font-size: 13px; text-align: center; line-height: 1.6; }

  /* Message rows */
  .chat-msg-row { display: flex; gap: 10px; align-items: flex-end; }
  .chat-msg-row.mine { flex-direction: row-reverse; }

  .chat-msg-avatar {
    width: 30px; height: 30px; flex-shrink: 0;
    background: linear-gradient(135deg, var(--match), var(--match-light));
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: var(--white);
    font-family: 'Cormorant Garamond', serif;
  }
  .chat-msg-row.mine .chat-msg-avatar {
    background: linear-gradient(135deg, var(--gold), var(--gold-light));
    color: #0a0808;
  }

  .chat-msg-content { max-width: 65%; display: flex; flex-direction: column; gap: 3px; }
  .chat-msg-row.mine .chat-msg-content { align-items: flex-end; }

  .chat-msg-sender { font-size: 10px; color: rgba(255,255,255,0.45); padding: 0 4px; }

  .chat-msg-bubble {
    padding: 10px 14px; border-radius: 14px;
    font-size: 13px; line-height: 1.5;
    color: rgba(255,255,255,0.92);
    background: rgba(255,255,255,0.08);
    border: 1px solid var(--glass-border);
    word-break: break-word;
  }
  .chat-msg-row.mine .chat-msg-bubble {
    background: linear-gradient(135deg, rgba(200,151,58,0.25), rgba(200,151,58,0.15));
    border-color: rgba(200,151,58,0.30);
  }

  .chat-msg-time { font-size: 9px; color: rgba(255,255,255,0.25); padding: 0 4px; }

  /* Input area */
  .chat-input-area {
    padding: 16px 20px;
    border-top: 1px solid var(--glass-border);
    background: rgba(255,255,255,0.03);
    display: flex; gap: 10px; align-items: center;
  }

  .chat-input {
    flex: 1; padding: 12px 18px;
    background: var(--glass); border: 1px solid var(--glass-border);
    border-radius: 40px; backdrop-filter: blur(12px);
    font-family: 'Outfit', sans-serif; font-size: 13px; color: var(--white);
    outline: none; transition: all 0.2s;
  }
  .chat-input:focus { border-color: var(--gold); background: var(--glass-strong); box-shadow: 0 0 0 3px rgba(200,151,58,0.12); }
  .chat-input::placeholder { color: rgba(255,255,255,0.25); }
  .chat-input:disabled { opacity: 0.5; cursor: not-allowed; }

  .chat-send-btn {
    width: 44px; height: 44px; flex-shrink: 0;
    background: linear-gradient(135deg, var(--gold), var(--gold-light));
    border: none; border-radius: 50%; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s; box-shadow: 0 2px 12px rgba(200,151,58,0.30);
  }
  .chat-send-btn:hover { transform: scale(1.08); box-shadow: 0 4px 20px rgba(200,151,58,0.45); }
  .chat-send-btn:active { transform: scale(0.96); }
  .chat-send-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  .chat-send-btn svg { width: 18px; height: 18px; color: #0a0808; }

  /* Responsive */
  @media (max-width: 768px) {
    .chat-body { flex-direction: column; padding: 16px; }
    .chat-sidebar { width: 100%; border-radius: 14px 14px 0 0; max-height: 150px; }
    .chat-main { border-left: 1px solid var(--glass-border); border-radius: 0 0 14px 14px; }
    .chat-header { padding: 20px; }
    .chat-title { font-size: 26px; }
  }
`;

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
    // Get current logged in user
    axios
      .get("http://localhost:9595/lostfound/user", { withCredentials: true })
      .then((res) => {
        const name = String(res.data || "").trim();
        setUsername(name);
        connect(name);
      })
      .catch(() => setConnecting(false));

    // Cleanup on unmount
    return () => {
      if (stompClient) {
        stompClient.deactivate();
        stompClient = null;
      }
    };
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Connect only once and prevent duplicates
  const connect = (autoName = username) => {
    if (!autoName.trim()) return;

    // Prevent reconnect if already active
    if (stompClient && stompClient.active) {
      console.log("Already connected — skipping reconnect.");
      return;
    }

    const socket = new SockJS("http://localhost:9595/lostfound/ws");

    stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,

      onConnect: () => {
        setConnected(true);
        setConnecting(false);

        // Subscribe to messages
        stompClient.subscribe("/topic/messages", (message) => {
          const body = JSON.parse(message.body);
          setMessages((prev) => [...prev, body]);
        });

        // Subscribe to online users
        stompClient.subscribe("/topic/users", (message) => {
          const users = JSON.parse(message.body);
          setOnlineUsers(Array.from(users));
        });

        // Register user
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

      onStompError: (frame) => {
        console.error("STOMP error:", frame);
        setConnecting(false);
      },
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

  const getInitial = (val) => {
    const s = String(val || "").trim();
    return s.length > 0 ? s.charAt(0).toUpperCase() : "?";
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    try {
      return new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit", minute: "2-digit",
      });
    } catch { return ""; }
  };

  const statusClass = connecting ? "status-connecting" : connected ? "status-connected" : "status-disconnected";
  const statusText  = connecting ? "⏳ Connecting..."  : connected ? "🟢 Connected"      : "🔴 Disconnected";

  return (
    <>
      <style>{styles}</style>
      <div className="chat-bg" />
      <div className="chat-overlay" />

      <div className="chat-page">

        {/* ── Header ── */}
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
              <div className="chat-user-avatar">{getInitial(username)}</div>
              <div>
                <div className="chat-user-label">Logged in as</div>
                <div className="chat-user-name">{username}</div>
              </div>
            </div>
          )}
        </div>

        <div className="chat-body">

          {/* ── Sidebar ── */}
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
                    <div className="chat-user-item-avatar">{getInitial(user)}</div>
                    <span className="chat-user-item-name">{user}</span>
                    {user === username && (
                      <span className="chat-user-item-you">You</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ── Main Chat ── */}
          <div className="chat-main">

            {/* Status bar */}
            <div className={`chat-status-bar ${statusClass}`}>
              {statusText}
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {messages.length === 0 ? (
                <div className="chat-empty">
                  <div className="chat-empty-icon">💬</div>
                  <div className="chat-empty-text">
                    No messages yet.<br />Be the first to say something!
                  </div>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  if (msg.type === "JOIN" || msg.type === "LEAVE") {
                    return (
                      <div className="chat-msg-system" key={idx}>
                        {msg.type === "JOIN"
                          ? `${msg.sender} joined the chat`
                          : `${msg.sender} left the chat`}
                      </div>
                    );
                  }
                  const isMine = msg.sender === username;
                  return (
                    <div className={`chat-msg-row ${isMine ? "mine" : ""}`} key={idx}>
                      <div className="chat-msg-avatar">{getInitial(msg.sender)}</div>
                      <div className="chat-msg-content">
                        {!isMine && (
                          <div className="chat-msg-sender">{msg.sender}</div>
                        )}
                        <div className="chat-msg-bubble">{msg.content}</div>
                        <div className="chat-msg-time">{formatTime(msg.timestamp)}</div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="chat-input-area">
              <input
                type="text"
                className="chat-input"
                placeholder="Type a message... (Enter to send)"
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
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default ChatMessage;
