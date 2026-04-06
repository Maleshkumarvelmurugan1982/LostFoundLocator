import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../services/LoginService";

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

  /* ── FIXED BACKGROUND ── */
  .pd-bg {
    position: fixed;
    inset: 0;
    background-image: url('https://img.freepik.com/free-photo/flat-lay-composition-with-colorful-educational-supplies-blue-background_169016-37706.jpg?semt=ais_hybrid&w=740&q=80');
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
  .pd-overlay {
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
  .pd-noise {
    position: fixed;
    inset: 0;
    z-index: 2;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 180px 180px;
    pointer-events: none;
  }

  /* ── DECORATIVE LINES ── */
  .pd-lines {
    position: fixed;
    inset: 0;
    z-index: 2;
    pointer-events: none;
    overflow: hidden;
  }

  .pd-line {
    position: absolute;
    background: linear-gradient(90deg, transparent, rgba(200,151,58,0.20), transparent);
    height: 1px;
    width: 100%;
    animation: lineFade 6s ease-in-out infinite;
  }

  .pd-line:nth-child(1) { top: 30%; animation-delay: 0s; }
  .pd-line:nth-child(2) { top: 62%; animation-delay: 2s; opacity: 0.6; }
  .pd-line:nth-child(3) { top: 85%; animation-delay: 4s; opacity: 0.3; }

  @keyframes lineFade {
    0%, 100% { opacity: 0; }
    50%       { opacity: 1; }
  }

  /* ── PAGE ── */
  .pd-page {
    position: relative;
    z-index: 10;
    min-height: 100vh;
    font-family: 'Outfit', sans-serif;
    padding: 48px 44px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* ── TOP BAR ── */
  .pd-topbar {
    width: 100%;
    max-width: 600px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
    animation: contentIn 0.6s cubic-bezier(0.16,1,0.3,1) both;
  }

  @keyframes contentIn {
    from { opacity: 0; transform: translateY(22px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* ── BACK BUTTON ── */
  .pd-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: var(--glass);
    border: 1px solid var(--glass-border);
    border-radius: 40px;
    backdrop-filter: blur(12px);
    font-family: 'Outfit', sans-serif;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.90);
    cursor: pointer;
    transition: all 0.22s cubic-bezier(0.16,1,0.3,1);
  }

  .pd-back-btn:hover {
    background: var(--glass-strong);
    border-color: rgba(200,151,58,0.4);
    color: var(--white);
    transform: translateX(-3px);
  }

  .pd-back-btn svg { width: 17px; height: 17px; }

  /* ── PAGE HEADING ── */
  .pd-heading {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .pd-header-icon {
    width: 52px;
    height: 52px;
    border: 1.5px solid var(--gold);
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--gold-dim);
    backdrop-filter: blur(8px);
    position: relative;
  }

  .pd-header-icon::before {
    content: '';
    position: absolute;
    inset: 3px;
    border: 1px solid rgba(200,151,58,0.35);
    border-radius: 1px;
  }

  .pd-header-icon svg { width: 22px; height: 22px; color: var(--gold); }

  /* FONT SIZE: 30px */
  .pd-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 30px;
    font-weight: 600;
    color: var(--white);
    line-height: 1.2;
    letter-spacing: 0.01em;
  }

  /* FONT SIZE: 16px */
  .pd-subtitle {
    font-size: 16px;
    color: rgba(255,255,255,0.65);
    font-weight: 300;
    letter-spacing: 0.18em;
    margin-top: 4px;
    text-transform: uppercase;
  }

  /* ── CARD ── */
  .pd-card {
    width: 100%;
    max-width: 600px;
    background: rgba(20, 10, 50, 0.72);
    border: 1px solid var(--glass-border);
    border-radius: 4px;
    backdrop-filter: blur(28px);
    box-shadow:
      0 32px 80px rgba(0,0,0,0.5),
      0 0 0 1px rgba(255,255,255,0.04) inset;
    overflow: hidden;
    animation: contentIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both;
  }

  /* ── GOLD SHIMMER TOP BAR ── */
  .pd-card-accent {
    height: 2px;
    background: linear-gradient(90deg, var(--gold), var(--gold-light), var(--gold));
    background-size: 200% 100%;
    animation: shimmer 3s linear infinite;
  }

  @keyframes shimmer {
    from { background-position: 200% 0; }
    to   { background-position: -200% 0; }
  }

  /* ── CARD HEADER ── */
  .pd-card-header {
    padding: 32px 40px;
    display: flex;
    align-items: center;
    gap: 22px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    position: relative;
    overflow: hidden;
  }

  .pd-card-header::before {
    content: '';
    position: absolute;
    top: -50px; right: -50px;
    width: 160px; height: 160px;
    border: 1px solid rgba(200,151,58,0.12);
    border-radius: 50%;
    pointer-events: none;
  }

  /* ── AVATAR ── */
  .pd-avatar-large {
    width: 76px; height: 76px;
    background: var(--gold-dim);
    border: 2px solid var(--gold);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 36px;
    font-weight: 700;
    color: var(--gold-light);
    flex-shrink: 0;
    text-transform: uppercase;
    box-shadow: 0 0 0 4px rgba(200,151,58,0.10);
  }

  /* FONT SIZE: 30px */
  .pd-card-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 30px;
    font-weight: 600;
    color: var(--white);
    letter-spacing: 0.01em;
  }

  /* FONT SIZE: 17px */
  .pd-card-username {
    font-size: 17px;
    color: rgba(255,255,255,0.55);
    font-weight: 300;
    letter-spacing: 0.06em;
    margin-top: 5px;
  }

  /* FONT SIZE: 14px */
  .pd-role-badge {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 18px;
    background: var(--gold-dim);
    border: 1px solid rgba(200,151,58,0.3);
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--gold-light);
    flex-shrink: 0;
  }

  .pd-role-badge svg { width: 14px; height: 14px; }

  /* ── DETAIL ROWS ── */
  .pd-details { padding: 8px 0; }

  .pd-row {
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 22px 40px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    transition: background 0.15s;
    animation: rowIn 0.45s cubic-bezier(0.16,1,0.3,1) both;
  }

  .pd-row:last-child { border-bottom: none; }
  .pd-row:nth-child(1) { animation-delay: 0.14s; }
  .pd-row:nth-child(2) { animation-delay: 0.20s; }
  .pd-row:nth-child(3) { animation-delay: 0.26s; }
  .pd-row:nth-child(4) { animation-delay: 0.32s; }

  @keyframes rowIn {
    from { opacity: 0; transform: translateX(-10px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .pd-row:hover { background: rgba(200,151,58,0.04); }

  .pd-row-icon {
    width: 42px; height: 42px;
    background: var(--gold-dim);
    border: 1px solid rgba(200,151,58,0.2);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .pd-row-icon svg { width: 19px; height: 19px; color: var(--gold); }

  /* FONT SIZE: 14px */
  .pd-row-label {
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.50);
    margin-bottom: 6px;
  }

  /* FONT SIZE: 20px */
  .pd-row-value {
    font-size: 20px;
    font-weight: 400;
    color: rgba(255,255,255,0.95);
    letter-spacing: 0.01em;
  }

  /* ── LOADING ── */
  .pd-loading {
    position: relative;
    z-index: 10;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    font-family: 'Outfit', sans-serif;
  }

  .pd-spinner {
    width: 34px; height: 34px;
    border: 2px solid rgba(255,255,255,0.12);
    border-top-color: var(--gold);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* FONT SIZE: 16px */
  .pd-loading-text {
    font-size: 16px;
    color: rgba(255,255,255,0.55);
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 1024px) {
    .pd-title { font-size: 26px; }
    .pd-subtitle { font-size: 14px; }
    .pd-card-name { font-size: 26px; }
    .pd-card-username { font-size: 15px; }
    .pd-row-value { font-size: 18px; }
  }

  @media (max-width: 640px) {
    .pd-page { padding: 28px 16px; }
    .pd-card-header { padding: 24px 24px; flex-wrap: wrap; }
    .pd-role-badge { margin-left: 0; margin-top: 8px; font-size: 12px; }
    .pd-row { padding: 16px 24px; }
    .pd-topbar { flex-direction: column; align-items: flex-start; gap: 16px; }
    .pd-title { font-size: 22px; }
    .pd-subtitle { font-size: 13px; }
    .pd-card-name { font-size: 22px; }
    .pd-card-username { font-size: 14px; }
    .pd-row-label { font-size: 12px; }
    .pd-row-value { font-size: 17px; }
    .pd-back-btn { font-size: 13px; }
  }

  @media (max-height: 700px) {
    .pd-page { padding: 28px 44px; }
    .pd-card-header { padding: 22px 40px; }
    .pd-row { padding: 15px 40px; }
  }
`;

const PersonalDetails = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const ip = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor" };

  useEffect(() => {
    getCurrentUser()
      .then((response) => setUser(response.data))
      .catch((error) => console.error("Error fetching user:", error));
  }, []);

  if (!user) {
    return (
      <>
        <style>{styles}</style>
        <div className="pd-bg" />
        <div className="pd-overlay" />
        <div className="pd-noise" />
        <div className="pd-loading">
          <div className="pd-spinner" />
          <span className="pd-loading-text">Loading profile…</span>
        </div>
      </>
    );
  }

  const initial = user.personalName
    ? user.personalName.charAt(0)
    : user.username?.charAt(0) || "?";

  return (
    <>
      <style>{styles}</style>

      {/* Background layers */}
      <div className="pd-bg" />
      <div className="pd-overlay" />
      <div className="pd-noise" />
      <div className="pd-lines">
        <div className="pd-line" />
        <div className="pd-line" />
        <div className="pd-line" />
      </div>

      <div className="pd-page">

        {/* ── TOP BAR ── */}
        <div className="pd-topbar">
          <button className="pd-back-btn" onClick={() => navigate(-1)}>
            <svg {...ip}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="pd-heading">
            <div className="pd-header-icon">
              <svg {...ip}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <div className="pd-title">My Profile</div>
              <div className="pd-subtitle">Account Information</div>
            </div>
          </div>
        </div>

        {/* ── PROFILE CARD ── */}
        <div className="pd-card">

          {/* Gold shimmer top accent */}
          <div className="pd-card-accent" />

          {/* Card Header */}
          <div className="pd-card-header">
            <div className="pd-avatar-large">{initial}</div>
            <div>
              <div className="pd-card-name">{user.personalName}</div>
              <div className="pd-card-username">@{user.username}</div>
            </div>
            <div className="pd-role-badge">
              <svg {...ip}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              {user.role}
            </div>
          </div>

          {/* Detail Rows */}
          <div className="pd-details">

            {/* Username */}
            <div className="pd-row">
              <div className="pd-row-icon">
                <svg {...ip}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <div className="pd-row-label">Username</div>
                <div className="pd-row-value">{user.username}</div>
              </div>
            </div>

            {/* Full Name */}
            <div className="pd-row">
              <div className="pd-row-icon">
                <svg {...ip}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <div className="pd-row-label">Full Name</div>
                <div className="pd-row-value">{user.personalName}</div>
              </div>
            </div>

            {/* Email */}
            <div className="pd-row">
              <div className="pd-row-icon">
                <svg {...ip}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="pd-row-label">Email Address</div>
                <div className="pd-row-value">{user.email}</div>
              </div>
            </div>

            {/* Role */}
            <div className="pd-row">
              <div className="pd-row-icon">
                <svg {...ip}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="pd-row-label">Role</div>
                <div className="pd-row-value">{user.role}</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default PersonalDetails;
