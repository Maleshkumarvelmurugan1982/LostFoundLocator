import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/LoginService";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Outfit:wght@200;300;400;500;600&display=swap');

  :root {
    --gold: #c8973a;
    --gold-light: #e8c06a;
    --gold-dim: rgba(200, 151, 58, 0.18);
    --white: #ffffff;
    --glass: rgba(255, 255, 255, 0.07);
    --glass-strong: rgba(255, 255, 255, 0.13);
    --glass-border: rgba(255, 255, 255, 0.15);
    --success: #4a7c59;
    --error: #b54a4a;
    --ink: #1a1a2e;
    --muted: rgba(255,255,255,0.60);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── ROOT ── */
  .sm-page {
    min-height: 100vh;
    position: relative;
    font-family: 'Outfit', sans-serif;
  }

  /* ── FIXED BACKGROUND ── */
  .sm-bg {
    position: fixed;
    inset: 0;
    background-image: url('https://img.freepik.com/free-vector/gradient-international-day-education-background_23-2151120687.jpg?semt=ais_user_personalization&w=740&q=80');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    filter: brightness(0.38) saturate(0.7);
    z-index: 0;
    transform: scale(1.04);
    animation: bgZoom 22s ease-in-out infinite alternate;
  }

  @keyframes bgZoom {
    from { transform: scale(1.04); }
    to   { transform: scale(1.10); }
  }

  .sm-overlay {
    position: fixed;
    inset: 0;
    background:
      linear-gradient(135deg,
        rgba(4,4,16,0.78) 0%,
        rgba(10,10,30,0.52) 50%,
        rgba(4,4,16,0.82) 100%
      ),
      radial-gradient(ellipse at 25% 40%, rgba(200,151,58,0.07) 0%, transparent 55%);
    z-index: 1;
  }

  .sm-noise {
    position: fixed;
    inset: 0;
    z-index: 2;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 180px 180px;
    pointer-events: none;
  }

  /* ── ALL CONTENT ABOVE BG ── */
  .sm-root {
    position: relative;
    z-index: 10;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* ── HEADER ── */
  .sm-header {
    padding: 44px 56px 40px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    border-bottom: 1px solid var(--glass-border);
    backdrop-filter: blur(12px);
    background: rgba(4,4,16,0.38);
    animation: headerIn 0.7s cubic-bezier(0.16,1,0.3,1) both;
  }

  @keyframes headerIn {
    from { opacity: 0; transform: translateY(-14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .sm-header-left { position: relative; z-index: 2; }

  .sm-eyebrow {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
  }

  .sm-eyebrow-line {
    width: 28px; height: 1px;
    background: var(--gold);
  }

  .sm-eyebrow-text {
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--gold-light);
  }

  .sm-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 46px;
    font-weight: 300;
    color: var(--white);
    line-height: 1.05;
    letter-spacing: -0.5px;
  }

  .sm-title em {
    font-style: italic;
    color: var(--gold-light);
  }

  .sm-subtitle {
    margin-top: 10px;
    font-size: 13px;
    color: rgba(255,255,255,0.75);
    font-weight: 300;
    letter-spacing: 0.04em;
  }

  .sm-header-icon {
    position: relative;
    z-index: 2;
    width: 64px; height: 64px;
    border: 1.5px solid var(--gold);
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--gold-dim);
    backdrop-filter: blur(8px);
    animation: floatIcon 4s ease-in-out infinite;
  }

  .sm-header-icon::before {
    content: '';
    position: absolute;
    inset: 4px;
    border: 1px solid rgba(200,151,58,0.2);
    border-radius: 1px;
  }

  .sm-header-icon svg { width: 26px; height: 26px; color: var(--gold); }

  @keyframes floatIcon {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-7px); }
  }

  /* ── NAVBAR ── */
  .sm-nav {
    backdrop-filter: blur(20px);
    background: rgba(4,4,18,0.60);
    border-bottom: 1px solid var(--glass-border);
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 4px 24px rgba(0,0,0,0.3);
  }

  .sm-nav-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 56px;
    display: flex;
    align-items: center;
  }

  .sm-mobile-toggle {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 16px 0;
    color: var(--white);
  }

  .sm-mobile-toggle svg { width: 22px; height: 22px; }

  .sm-nav-menu {
    display: flex;
    align-items: center;
    width: 100%;
  }

  /* nav links */
  .sm-nav-link {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 18px 20px;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.65);
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s;
    text-decoration: none;
    white-space: nowrap;
    font-family: 'Outfit', sans-serif;
  }

  .sm-nav-link:hover, .sm-nav-link.active {
    color: var(--white);
    border-bottom-color: var(--gold);
  }

  .sm-nav-link svg { width: 15px; height: 15px; flex-shrink: 0; }

  .sm-arrow {
    width: 11px !important;
    height: 11px !important;
    transition: transform 0.25s;
  }

  .sm-nav-link.open .sm-arrow { transform: rotate(180deg); }

  /* dropdown */
  .sm-dropdown { position: relative; }

  .sm-dropdown-menu {
    position: absolute;
    top: calc(100% + 1px);
    left: 0;
    min-width: 210px;
    background: rgba(6,6,20,0.92);
    border: 1px solid var(--glass-border);
    border-top: 2px solid var(--gold);
    backdrop-filter: blur(24px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.5);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-8px);
    transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 200;
    border-radius: 0 0 4px 4px;
  }

  .sm-dropdown-menu.show {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  .sm-dropdown-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 13px 20px;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.70);
    border-bottom: 1px solid rgba(255,255,255,0.07);
    transition: color 0.15s, background 0.15s, padding-left 0.15s;
    cursor: pointer;
    background: none;
    border-left: none;
    border-right: none;
    border-top: none;
    width: 100%;
    text-align: left;
    font-family: 'Outfit', sans-serif;
  }

  .sm-dropdown-item:last-child { border-bottom: none; }

  .sm-dropdown-item:hover {
    color: var(--gold-light);
    background: rgba(200,151,58,0.07);
    padding-left: 26px;
  }

  .sm-dropdown-item svg { width: 14px; height: 14px; flex-shrink: 0; }

  /* logout */
  .sm-logout {
    margin-left: auto;
    color: rgba(181,74,74,0.85) !important;
  }

  .sm-logout:hover {
    color: #e07a7a !important;
    border-bottom-color: #e07a7a !important;
  }

  /* ── MAIN CONTENT ── */
  .sm-content {
    max-width: 1160px;
    margin: 0 auto;
    padding: 52px 56px 72px;
    animation: contentIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
    animation-delay: 0.15s;
    flex: 1;
  }

  @keyframes contentIn {
    from { opacity: 0; transform: translateY(22px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* ── WELCOME CARD ── */
  .sm-welcome {
    background: rgba(255,255,255,0.06);
    border: 1px solid var(--glass-border);
    border-left: 3px solid var(--gold);
    border-radius: 4px;
    padding: 28px 32px;
    display: flex;
    align-items: center;
    gap: 24px;
    margin-bottom: 44px;
    backdrop-filter: blur(16px);
    box-shadow: 0 4px 24px rgba(0,0,0,0.2);
  }

  .sm-welcome-icon {
    width: 50px; height: 50px;
    background: var(--gold-dim);
    border: 1px solid rgba(200,151,58,0.25);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .sm-welcome-icon svg { width: 22px; height: 22px; color: var(--gold); }

  .sm-welcome-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 600;
    color: var(--white);
    margin-bottom: 6px;
    letter-spacing: 0.01em;
  }

  .sm-welcome-text {
    font-size: 13px;
    color: rgba(255,255,255,0.75);
    line-height: 1.65;
    font-weight: 300;
  }

  /* ── SECTION LABEL ── */
  .sm-section-label {
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--gold-light);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .sm-section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(200,151,58,0.2);
  }

  /* ── GRID ── */
  .sm-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
    margin-bottom: 40px;
  }

  /* ── CARD ── */
  .sm-card {
    background: rgba(255,255,255,0.06);
    border: 1px solid var(--glass-border);
    border-radius: 4px;
    padding: 30px 26px;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
    position: relative;
    overflow: hidden;
    text-decoration: none;
    display: block;
    backdrop-filter: blur(16px);
    animation: cardIn 0.5s cubic-bezier(0.16,1,0.3,1) both;
  }

  .sm-card:nth-child(1) { animation-delay: 0.05s; }
  .sm-card:nth-child(2) { animation-delay: 0.10s; }
  .sm-card:nth-child(3) { animation-delay: 0.15s; }
  .sm-card:nth-child(4) { animation-delay: 0.20s; }
  .sm-card:nth-child(5) { animation-delay: 0.25s; }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(14px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* gold shimmer line on top */
  .sm-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    transform: scaleX(0);
    transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
  }

  .sm-card:hover {
    background: rgba(255,255,255,0.10);
    border-color: rgba(200,151,58,0.35);
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.35);
  }

  .sm-card:hover::before { transform: scaleX(1); }

  .sm-card-icon {
    width: 44px; height: 44px;
    background: var(--gold-dim);
    border: 1px solid rgba(200,151,58,0.22);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 18px;
    transition: background 0.2s, border-color 0.2s;
  }

  .sm-card:hover .sm-card-icon {
    background: rgba(200,151,58,0.25);
    border-color: rgba(200,151,58,0.4);
  }

  .sm-card-icon svg { width: 18px; height: 18px; color: var(--gold); }

  .sm-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    font-weight: 600;
    color: var(--white);
    margin-bottom: 8px;
    letter-spacing: 0.01em;
  }

  .sm-card-desc {
    font-size: 12px;
    color: rgba(255,255,255,0.65);
    line-height: 1.6;
    font-weight: 300;
  }

  .sm-card-arrow {
    position: absolute;
    top: 24px; right: 24px;
    width: 20px; height: 20px;
    color: rgba(255,255,255,0.18);
    transition: color 0.2s, transform 0.2s;
  }

  .sm-card:hover .sm-card-arrow {
    color: var(--gold);
    transform: translate(2px, -2px);
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 1024px) {
    .sm-header { padding: 36px 40px 32px; }
    .sm-nav-inner { padding: 0 40px; }
    .sm-content { padding: 40px 40px 60px; }
  }

  @media (max-width: 900px) {
    .sm-grid { grid-template-columns: repeat(2, 1fr); }
    .sm-header { padding: 28px 24px 24px; }
    .sm-nav-inner { padding: 0 24px; }
    .sm-content { padding: 32px 24px 48px; }
    .sm-title { font-size: 36px; }
  }

  @media (max-width: 640px) {
    .sm-grid { grid-template-columns: 1fr; }
    .sm-title { font-size: 30px; }
    .sm-header-icon { display: none; }

    .sm-mobile-toggle { display: block; }

    .sm-nav-menu {
      display: none;
      flex-direction: column;
      align-items: flex-start;
      padding: 8px 0 16px;
    }

    .sm-nav-menu.open { display: flex; }

    .sm-nav-link {
      width: 100%;
      border-bottom: none;
      border-left: 2px solid transparent;
      padding: 12px 16px;
    }

    .sm-nav-link:hover, .sm-nav-link.active {
      border-left-color: var(--gold);
      border-bottom-color: transparent;
    }

    .sm-dropdown-menu {
      position: static;
      border-top: none;
      box-shadow: none;
      margin-left: 16px;
      border-left: 2px solid var(--gold);
      border-radius: 0;
    }

    .sm-logout { margin-left: 0; }
  }
`;

const NavDropdown = ({ label, icon, id, activeDropdown, toggleDropdown, items }) => {
  const isOpen = activeDropdown === id;
  return (
    <div className="sm-dropdown">
      <button
        className={`sm-nav-link ${isOpen ? "open active" : ""}`}
        onClick={() => toggleDropdown(id)}
      >
        {icon}
        <span>{label}</span>
        <svg className="sm-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`sm-dropdown-menu ${isOpen ? "show" : ""}`}>
        {items.map((item, i) => (
          <button key={i} className="sm-dropdown-item" onClick={item.onClick}>
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const QuickCard = ({ title, desc, icon, onClick }) => (
  <div className="sm-card" onClick={onClick} role="button" tabIndex={0}>
    <svg className="sm-card-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
    <div className="sm-card-icon">{icon}</div>
    <div className="sm-card-title">{title}</div>
    <div className="sm-card-desc">{desc}</div>
  </div>
);

const StudentMenu = () => {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout().then(() => {
      localStorage.clear();
      sessionStorage.clear();
      navigate("/");
    });
  };

  const toggleDropdown = (id) => setActiveDropdown(activeDropdown === id ? null : id);

  const ip = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor" };

  return (
    <>
      <style>{styles}</style>

      {/* Fixed background layers */}
      <div className="sm-bg" />
      <div className="sm-overlay" />
      <div className="sm-noise" />

      <div className="sm-page">
        <div className="sm-root">

          {/* ── HEADER ── */}
          <div className="sm-header">
            <div className="sm-header-left">
              <div className="sm-eyebrow">
                <div className="sm-eyebrow-line" />
                <span className="sm-eyebrow-text">Student Portal</span>
              </div>
              <h1 className="sm-title">Lost &amp; <em>Found</em></h1>
              <p className="sm-subtitle">Reconnecting people with what matters most.</p>
            </div>
            <div className="sm-header-icon">
              <svg {...ip}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* ── NAVBAR ── */}
          <nav className="sm-nav">
            <div className="sm-nav-inner">
              <button className="sm-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
                <svg {...ip}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div className={`sm-nav-menu ${mobileOpen ? "open" : ""}`}>

                <NavDropdown
                  id="personal" label="Personal"
                  icon={<svg {...ip} style={{width:15,height:15}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                  activeDropdown={activeDropdown} toggleDropdown={toggleDropdown}
                  items={[{
                    label: "Personal Details",
                    onClick: () => navigate("/personal-details"),
                    icon: <svg {...ip} style={{width:14,height:14}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  }]}
                />

                <NavDropdown
                  id="lost" label="Lost Item"
                  icon={<svg {...ip} style={{width:15,height:15}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  activeDropdown={activeDropdown} toggleDropdown={toggleDropdown}
                  items={[
                    { label: "Submit Lost Item", onClick: () => navigate("/lost-item-registration"), icon: <svg {...ip} style={{width:14,height:14}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> },
                    { label: "View Lost Items", onClick: () => navigate("/view-lost-items"), icon: <svg {...ip} style={{width:14,height:14}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
                  ]}
                />

                <NavDropdown
                  id="found" label="Found Item"
                  icon={<svg {...ip} style={{width:15,height:15}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  activeDropdown={activeDropdown} toggleDropdown={toggleDropdown}
                  items={[
                    { label: "Submit Found Item", onClick: () => navigate("/found-item-registration"), icon: <svg {...ip} style={{width:14,height:14}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> },
                    { label: "View Found Items", onClick: () => navigate("/view-found-items"), icon: <svg {...ip} style={{width:14,height:14}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
                  ]}
                />

                <button className="sm-nav-link" onClick={() => navigate("/chatting")}>
                  <svg {...ip} style={{width:15,height:15}}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>Chatting</span>
                </button>

                <button className="sm-nav-link sm-logout" onClick={handleLogout}>
                  <svg {...ip} style={{width:15,height:15}}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </nav>

          {/* ── MAIN CONTENT ── */}
          <div className="sm-content">

            {/* Welcome */}
            <div className="sm-welcome">
              <div className="sm-welcome-icon">
                <svg {...ip}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="sm-welcome-heading">Welcome to Your Dashboard</div>
                <div className="sm-welcome-text">
                  Manage your lost and found reports, browse listings, and connect with others through our campus portal.
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="sm-section-label">Quick Actions</div>
            <div className="sm-grid">

              <QuickCard
                title="Report Lost Item"
                desc="Register something you've lost with photo and location details."
                onClick={() => navigate("/lost-item-registration")}
                icon={<svg {...ip} style={{width:18,height:18}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              />

              <QuickCard
                title="Browse Lost Items"
                desc="Search through all reported lost items on campus."
                onClick={() => navigate("/view-lost-items")}
                icon={<svg {...ip} style={{width:18,height:18}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
              />

              <QuickCard
                title="Submit Found Item"
                desc="Let others know you've found something left behind."
                onClick={() => navigate("/found-item-registration")}
                icon={<svg {...ip} style={{width:18,height:18}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              />

              <QuickCard
                title="Browse Found Items"
                desc="Check if something you lost has been found by someone."
                onClick={() => navigate("/view-found-items")}
                icon={<svg {...ip} style={{width:18,height:18}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
              />

              <QuickCard
                title="Open Chat"
                desc="Message other students directly about items."
                onClick={() => navigate("/chatting")}
                icon={<svg {...ip} style={{width:18,height:18}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
              />

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentMenu;
