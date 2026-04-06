import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/LoginService";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Outfit:wght@200;300;400;500;600&display=swap');

  :root {
    --gold: #c8973a;
    --gold-light: #f0c060;
    --gold-dim: rgba(200, 151, 58, 0.25);
    --white: #ffffff;
    --off-white: #f0ece4;
    --dark: rgba(30, 20, 50, 0.72);
    --darker: rgba(20, 10, 45, 0.88);
    --glass: rgba(255, 255, 255, 0.10);
    --glass-border: rgba(255, 255, 255, 0.22);
    --glass-hover: rgba(255, 255, 255, 0.16);
    --glass-strong: rgba(255, 255, 255, 0.16);
    --muted: #8a8099;
    --success: #4a7c59;
    --error: #b54a4a;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── ROOT ── */
  .sm-page {
    min-height: 100vh;
    width: 100vw;
    position: relative;
    display: flex;
    flex-direction: column;
    font-family: 'Outfit', sans-serif;
    overflow-x: hidden;
  }

  /* ── BACKGROUND IMAGE ── */
  .sm-bg {
    position: fixed;
    inset: 0;
    background-image: url('https://img.freepik.com/free-vector/gradient-international-day-education-background_23-2151120687.jpg?semt=ais_user_personalization&w=740&q=80');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    filter: brightness(0.45) saturate(0.7);
    transform: scale(1.04);
    animation: slowZoom 24s ease-in-out infinite alternate;
    z-index: 0;
  }

  @keyframes slowZoom {
    from { transform: scale(1.04); }
    to   { transform: scale(1.12); }
  }

  /* ── GRADIENT OVERLAY ── */
  .sm-overlay {
    position: fixed;
    inset: 0;
    background:
      linear-gradient(to bottom,
        rgba(20,10,50,0.72) 0%,
        rgba(30,15,60,0.50) 40%,
        rgba(15,8,45,0.85) 100%
      ),
      radial-gradient(ellipse at 70% 40%, rgba(200,151,58,0.12) 0%, transparent 60%);
    z-index: 1;
  }

  /* ── NOISE TEXTURE ── */
  .sm-noise {
    position: fixed;
    inset: 0;
    z-index: 2;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 180px 180px;
    pointer-events: none;
  }

  /* ── DECORATIVE LINES ── */
  .sm-lines {
    position: fixed;
    inset: 0;
    z-index: 2;
    pointer-events: none;
    overflow: hidden;
  }

  .sm-line {
    position: absolute;
    background: linear-gradient(90deg, transparent, rgba(200,151,58,0.20), transparent);
    height: 1px;
    width: 100%;
    animation: lineFade 6s ease-in-out infinite;
  }

  .sm-line:nth-child(1) { top: 30%; animation-delay: 0s; }
  .sm-line:nth-child(2) { top: 62%; animation-delay: 2s; opacity: 0.6; }
  .sm-line:nth-child(3) { top: 85%; animation-delay: 4s; opacity: 0.3; }

  @keyframes lineFade {
    0%, 100% { opacity: 0; }
    50%       { opacity: 1; }
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
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28px 56px;
    border-bottom: 1px solid var(--glass-border);
    backdrop-filter: blur(16px);
    background: rgba(20,10,50,0.45);
    animation: navIn 0.8s cubic-bezier(0.16,1,0.3,1) both;
  }

  @keyframes navIn {
    from { opacity: 0; transform: translateY(-14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .sm-brand {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .sm-logo-mark {
    width: 64px;
    height: 64px;
    border: 1.5px solid var(--gold);
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--gold-dim);
    backdrop-filter: blur(8px);
    position: relative;
  }

  .sm-logo-mark::before {
    content: '';
    position: absolute;
    inset: 3px;
    border: 1px solid rgba(200,151,58,0.35);
    border-radius: 1px;
  }

  .sm-logo-mark svg {
    width: 30px; height: 30px;
    color: var(--gold);
  }

  /* ── FONT SIZE UPDATED: 34px → 42px ── */
  .sm-brand-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 42px;
    font-weight: 600;
    color: var(--white);
    letter-spacing: 0.02em;
    line-height: 1;
  }

  /* ── FONT SIZE UPDATED: 15px → 20px ── */
  .sm-brand-sub {
    font-size: 20px;
    font-weight: 400;
    color: rgba(255,255,255,0.85);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    margin-top: 5px;
  }

  /* ── NAVBAR ── */
  .sm-nav {
    backdrop-filter: blur(20px);
    background: rgba(20,10,50,0.60);
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

  .sm-mobile-toggle svg { width: 26px; height: 26px; }

  .sm-nav-menu {
    display: flex;
    align-items: center;
    width: 100%;
  }

  /* ── FONT SIZE UPDATED: 14px → 18px ── */
  .sm-nav-link {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 22px 22px;
    font-size: 18px;
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

  .sm-nav-link svg { width: 18px; height: 18px; flex-shrink: 0; }

  .sm-arrow {
    width: 14px !important;
    height: 14px !important;
    transition: transform 0.25s;
  }

  .sm-nav-link.open .sm-arrow { transform: rotate(180deg); }

  /* dropdown */
  .sm-dropdown { position: relative; }

  .sm-dropdown-menu {
    position: absolute;
    top: calc(100% + 1px);
    left: 0;
    min-width: 240px;
    background: rgba(20,10,50,0.92);
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

  /* ── FONT SIZE UPDATED: 13px → 17px ── */
  .sm-dropdown-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 22px;
    font-size: 17px;
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
    padding-left: 30px;
  }

  .sm-dropdown-item svg { width: 17px; height: 17px; flex-shrink: 0; }

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
    background: rgba(20, 10, 50, 0.72);
    border: 1px solid var(--glass-border);
    border-left: 3px solid var(--gold);
    border-radius: 4px;
    padding: 32px 36px;
    display: flex;
    align-items: center;
    gap: 28px;
    margin-bottom: 44px;
    backdrop-filter: blur(28px);
    box-shadow:
      0 32px 80px rgba(0,0,0,0.5),
      0 0 0 1px rgba(255,255,255,0.04) inset,
      0 1px 0 rgba(200,151,58,0.15) inset;
  }

  .sm-welcome-icon {
    width: 60px; height: 60px;
    background: var(--gold-dim);
    border: 1px solid rgba(200,151,58,0.25);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .sm-welcome-icon svg { width: 28px; height: 28px; color: var(--gold); }

  /* ── FONT SIZE UPDATED: 28px → 38px ── */
  .sm-welcome-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: 38px;
    font-weight: 600;
    color: var(--white);
    margin-bottom: 8px;
    letter-spacing: 0.01em;
  }

  /* ── FONT SIZE UPDATED: 16px → 22px ── */
  .sm-welcome-text {
    font-size: 22px;
    color: rgba(255,255,255,0.75);
    line-height: 1.65;
    font-weight: 300;
  }

  /* ── SECTION LABEL ── */
  /* ── FONT SIZE UPDATED: 15px → 20px ── */
  .sm-section-label {
    font-size: 20px;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--gold-light);
    margin-bottom: 24px;
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
    background: rgba(20, 10, 50, 0.72);
    border: 1px solid var(--glass-border);
    border-radius: 4px;
    padding: 34px 30px;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
    position: relative;
    overflow: hidden;
    text-decoration: none;
    display: block;
    backdrop-filter: blur(28px);
    box-shadow:
      0 8px 32px rgba(0,0,0,0.3),
      0 0 0 1px rgba(255,255,255,0.04) inset;
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

  .sm-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--gold), var(--gold-light), var(--gold));
    background-size: 200% 100%;
    transform: scaleX(0);
    transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
  }

  .sm-card:hover {
    background: rgba(255,255,255,0.10);
    border-color: rgba(200,151,58,0.45);
    transform: translateY(-4px);
    box-shadow:
      0 16px 48px rgba(0,0,0,0.45),
      0 0 0 1px rgba(200,151,58,0.15) inset;
  }

  .sm-card:hover::before { transform: scaleX(1); }

  .sm-card-icon {
    width: 52px; height: 52px;
    background: var(--gold-dim);
    border: 1px solid rgba(200,151,58,0.22);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    transition: background 0.2s, border-color 0.2s;
  }

  .sm-card:hover .sm-card-icon {
    background: rgba(200,151,58,0.25);
    border-color: rgba(200,151,58,0.4);
  }

  .sm-card-icon svg { width: 22px; height: 22px; color: var(--gold); }

  /* ── FONT SIZE UPDATED: 22px → 30px ── */
  .sm-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 30px;
    font-weight: 600;
    color: var(--white);
    margin-bottom: 10px;
    letter-spacing: 0.01em;
  }

  /* ── FONT SIZE UPDATED: 15px → 20px ── */
  .sm-card-desc {
    font-size: 20px;
    color: rgba(255,255,255,0.65);
    line-height: 1.6;
    font-weight: 300;
  }

  .sm-card-arrow {
    position: absolute;
    top: 24px; right: 24px;
    width: 22px; height: 22px;
    color: rgba(255,255,255,0.18);
    transition: color 0.2s, transform 0.2s;
  }

  .sm-card:hover .sm-card-arrow {
    color: var(--gold);
    transform: translate(2px, -2px);
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 1024px) {
    .sm-header { padding: 24px 40px; }
    .sm-nav-inner { padding: 0 40px; }
    .sm-content { padding: 40px 40px 60px; }
    .sm-brand-name { font-size: 36px; }
    .sm-brand-sub { font-size: 17px; }
    .sm-nav-link { font-size: 16px; padding: 20px 18px; }
    .sm-welcome-heading { font-size: 32px; }
    .sm-welcome-text { font-size: 19px; }
    .sm-card-title { font-size: 26px; }
    .sm-card-desc { font-size: 18px; }
  }

  @media (max-width: 900px) {
    .sm-grid { grid-template-columns: repeat(2, 1fr); }
    .sm-header { padding: 20px 24px; }
    .sm-nav-inner { padding: 0 24px; }
    .sm-content { padding: 32px 24px 48px; }
    /* ── FONT SIZE UPDATED: 26px → 36px ── */
    .sm-brand-name { font-size: 36px; }
    .sm-brand-sub { font-size: 16px; }
    .sm-nav-link { font-size: 15px; }
    .sm-welcome-heading { font-size: 30px; }
    .sm-welcome-text { font-size: 18px; }
    .sm-card-title { font-size: 24px; }
    .sm-card-desc { font-size: 17px; }
  }

  @media (max-width: 640px) {
    .sm-grid { grid-template-columns: 1fr; }
    .sm-logo-mark { display: none; }
    .sm-brand-name { font-size: 28px; }
    .sm-brand-sub { font-size: 14px; }

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
      padding: 14px 16px;
      font-size: 16px;
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

    .sm-welcome-heading { font-size: 26px; }
    .sm-welcome-text { font-size: 16px; }
    .sm-card-title { font-size: 22px; }
    .sm-card-desc { font-size: 16px; }
    .sm-section-label { font-size: 17px; }
    .sm-dropdown-item { font-size: 15px; }
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
      <div className="sm-lines">
        <div className="sm-line" />
        <div className="sm-line" />
        <div className="sm-line" />
      </div>

      <div className="sm-page">
        <div className="sm-root">

          {/* ── HEADER ── */}
          <div className="sm-header">
            <div className="sm-brand">
              <div className="sm-logo-mark">
                <svg {...ip}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <div className="sm-brand-name">LostFoundLocator</div>
                <div className="sm-brand-sub">Student Portal</div>
              </div>
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
                  icon={<svg {...ip} style={{width:18,height:18}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                  activeDropdown={activeDropdown} toggleDropdown={toggleDropdown}
                  items={[{
                    label: "Personal Details",
                    onClick: () => navigate("/personal-details"),
                    icon: <svg {...ip} style={{width:17,height:17}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  }]}
                />

                <NavDropdown
                  id="lost" label="Lost Item"
                  icon={<svg {...ip} style={{width:18,height:18}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  activeDropdown={activeDropdown} toggleDropdown={toggleDropdown}
                  items={[
                    { label: "Submit Lost Item", onClick: () => navigate("/lost-item-registration"), icon: <svg {...ip} style={{width:17,height:17}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> },
                    { label: "View Lost Items", onClick: () => navigate("/view-lost-items"), icon: <svg {...ip} style={{width:17,height:17}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
                  ]}
                />

                <NavDropdown
                  id="found" label="Found Item"
                  icon={<svg {...ip} style={{width:18,height:18}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  activeDropdown={activeDropdown} toggleDropdown={toggleDropdown}
                  items={[
                    { label: "Submit Found Item", onClick: () => navigate("/found-item-registration"), icon: <svg {...ip} style={{width:17,height:17}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> },
                    { label: "View Found Items", onClick: () => navigate("/view-found-items"), icon: <svg {...ip} style={{width:17,height:17}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
                  ]}
                />

                <button className="sm-nav-link" onClick={() => navigate("/chatting")}>
                  <svg {...ip} style={{width:18,height:18}}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>Chatting</span>
                </button>

                <button className="sm-nav-link sm-logout" onClick={handleLogout}>
                  <svg {...ip} style={{width:18,height:18}}>
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
                icon={<svg {...ip} style={{width:22,height:22}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              />

              <QuickCard
                title="Browse Lost Items"
                desc="Search through all reported lost items on campus."
                onClick={() => navigate("/view-lost-items")}
                icon={<svg {...ip} style={{width:22,height:22}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
              />

              <QuickCard
                title="Submit Found Item"
                desc="Let others know you've found something left behind."
                onClick={() => navigate("/found-item-registration")}
                icon={<svg {...ip} style={{width:22,height:22}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              />

              <QuickCard
                title="Browse Found Items"
                desc="Check if something you lost has been found by someone."
                onClick={() => navigate("/view-found-items")}
                icon={<svg {...ip} style={{width:22,height:22}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
              />

              <QuickCard
                title="Open Chat"
                desc="Message other students directly about items."
                onClick={() => navigate("/chatting")}
                icon={<svg {...ip} style={{width:22,height:22}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
              />

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentMenu;
