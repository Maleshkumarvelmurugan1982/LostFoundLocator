import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerNewUser } from "../../services/LoginService";

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

  html, body, #root {
    height: 100%;
    overflow: hidden;
  }

  /* ── ROOT CONTAINER ── */
  .ru-page {
    min-height: 100vh;
    width: 100vw;
    position: relative;
    display: flex;
    flex-direction: column;
    font-family: 'Outfit', sans-serif;
    overflow: hidden;
  }

  /* ── BACKGROUND IMAGE ── */
  .ru-bg {
    position: fixed;
    inset: 0;
    background-image: url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80');
    background-size: cover;
    background-position: center center;
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
  .ru-overlay {
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
  .ru-noise {
    position: fixed;
    inset: 0;
    z-index: 2;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 180px 180px;
    pointer-events: none;
  }

  /* ── DECORATIVE LINES ── */
  .ru-lines {
    position: fixed;
    inset: 0;
    z-index: 2;
    pointer-events: none;
    overflow: hidden;
  }

  .ru-line {
    position: absolute;
    background: linear-gradient(90deg, transparent, rgba(200,151,58,0.20), transparent);
    height: 1px;
    width: 100%;
    animation: lineFade 6s ease-in-out infinite;
  }

  .ru-line:nth-child(1) { top: 30%; animation-delay: 0s; }
  .ru-line:nth-child(2) { top: 62%; animation-delay: 2s; opacity: 0.6; }
  .ru-line:nth-child(3) { top: 85%; animation-delay: 4s; opacity: 0.3; }

  @keyframes lineFade {
    0%, 100% { opacity: 0; }
    50%       { opacity: 1; }
  }

  /* ── HEADER ── */
  .ru-header {
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
    flex-shrink: 0;
  }

  @keyframes navIn {
    from { opacity: 0; transform: translateY(-14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .ru-brand {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .ru-logo-mark {
    width: 58px;
    height: 58px;
    border: 1.5px solid var(--gold);
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--gold-dim);
    backdrop-filter: blur(8px);
    position: relative;
  }

  .ru-logo-mark::before {
    content: '';
    position: absolute;
    inset: 3px;
    border: 1px solid rgba(200,151,58,0.35);
    border-radius: 1px;
  }

  .ru-logo-mark svg {
    width: 26px; height: 26px;
    color: var(--gold);
  }

  .ru-brand-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 34px;
    font-weight: 600;
    color: var(--white);
    letter-spacing: 0.02em;
    line-height: 1;
  }

  .ru-brand-sub {
    font-size: 15px;
    font-weight: 400;
    color: rgba(255,255,255,0.85);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    margin-top: 5px;
  }

  .ru-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    padding: 11px 24px;
    border: 1px solid var(--glass-border);
    border-radius: 40px;
    backdrop-filter: blur(12px);
    background: var(--glass);
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(255,255,255,1);
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Outfit', sans-serif;
  }

  .ru-back-btn:hover {
    background: var(--glass-hover);
    border-color: rgba(200,151,58,0.55);
    color: var(--white);
  }

  .ru-back-btn svg { width: 16px; height: 16px; }

  /* ── BODY WRAPPER ── */
  .ru-body-wrap {
    flex: 1;
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px 20px;
    overflow-y: auto;
  }

  /* ── CARD ── */
  .ru-card {
    width: 100%;
    max-width: 560px;
    background: rgba(20, 10, 50, 0.72);
    border: 1px solid var(--glass-border);
    border-radius: 4px;
    backdrop-filter: blur(28px);
    box-shadow:
      0 32px 80px rgba(0,0,0,0.5),
      0 0 0 1px rgba(255,255,255,0.04) inset,
      0 1px 0 rgba(200,151,58,0.15) inset;
    overflow: hidden;
    animation: cardIn 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s both;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(28px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* ── CARD TOP ACCENT ── */
  .ru-card-accent {
    height: 3px;
    background: linear-gradient(90deg, var(--gold), var(--gold-light), var(--gold));
    background-size: 200% 100%;
    animation: shimmer 3s linear infinite;
  }

  @keyframes shimmer {
    from { background-position: 200% 0; }
    to   { background-position: -200% 0; }
  }

  /* ── CARD HEADER ── */
  .ru-card-header {
    padding: 36px 40px 28px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }

  .ru-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 16px;
  }

  .ru-eyebrow-line {
    width: 48px;
    height: 1.5px;
    background: var(--gold);
  }

  .ru-eyebrow-text {
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--gold-light);
  }

  .ru-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 48px;
    font-weight: 300;
    color: var(--white);
    line-height: 1.08;
    letter-spacing: -0.3px;
  }

  .ru-card-title em {
    font-style: italic;
    color: var(--gold-light);
    font-weight: 300;
  }

  .ru-card-subtitle {
    margin-top: 10px;
    font-size: 17px;
    font-weight: 300;
    color: rgba(255,255,255,0.75);
    letter-spacing: 0.02em;
  }

  /* ── CARD BODY ── */
  .ru-card-body {
    padding: 32px 40px 40px;
  }

  /* ── FIELD ── */
  .ru-field {
    margin-bottom: 18px;
  }

  .ru-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.80);
    margin-bottom: 9px;
  }

  .ru-label .req { color: var(--gold-light); margin-left: 3px; }

  .ru-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .ru-input-icon {
    position: absolute;
    left: 16px;
    width: 18px; height: 18px;
    color: rgba(200,151,58,0.7);
    pointer-events: none;
  }

  .ru-input {
    width: 100%;
    padding: 14px 18px 14px 48px;
    background: rgba(255,255,255,0.06);
    border: 1px solid var(--glass-border);
    border-radius: 2px;
    font-family: 'Outfit', sans-serif;
    font-size: 16px;
    color: var(--white);
    transition: all 0.2s;
    outline: none;
    -webkit-appearance: none;
  }

  .ru-input:focus {
    border-color: var(--gold);
    background: rgba(255,255,255,0.09);
    box-shadow: 0 0 0 3px rgba(200,151,58,0.12);
  }

  .ru-input::placeholder { color: rgba(255,255,255,0.28); font-size: 15px; }
  .ru-input.has-error { border-color: var(--error); box-shadow: 0 0 0 3px rgba(181,74,74,0.10); }

  /* select */
  .ru-select {
    cursor: pointer;
    padding-right: 36px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23c8973a'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 16px;
  }

  .ru-select option {
    background: rgba(20, 10, 50, 1);
    color: var(--white);
  }

  /* password toggle */
  .ru-eye {
    position: absolute;
    right: 12px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    color: rgba(200,151,58,0.6);
    display: flex; align-items: center; justify-content: center;
    transition: color 0.15s;
  }

  .ru-eye:hover { color: var(--gold-light); }
  .ru-eye svg { width: 17px; height: 17px; }

  /* error */
  .ru-error {
    margin-top: 7px;
    font-size: 14px;
    color: #e07a7a;
    display: flex;
    align-items: center;
    gap: 5px;
    font-weight: 400;
  }

  /* row */
  .ru-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  /* divider */
  .ru-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 22px 0;
    color: rgba(255,255,255,0.30);
    font-size: 13px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .ru-divider::before, .ru-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.10);
  }

  /* submit */
  .ru-submit {
    width: 100%;
    padding: 18px 48px;
    background: var(--gold);
    color: #2a1800;
    border: none;
    border-radius: 2px;
    font-family: 'Outfit', sans-serif;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
    position: relative;
    overflow: hidden;
  }

  .ru-submit::before {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.30), transparent);
    transition: left 0.45s;
  }

  .ru-submit:hover:not(:disabled) {
    background: var(--gold-light);
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(200,151,58,0.45);
  }

  .ru-submit:hover::before { left: 100%; }
  .ru-submit:active { transform: translateY(0); }
  .ru-submit:disabled { opacity: 0.55; cursor: not-allowed; }

  /* spinner */
  .ru-spinner {
    width: 17px; height: 17px;
    border: 2px solid rgba(42,24,0,0.3);
    border-top-color: #2a1800;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* footer link */
  .ru-footer {
    margin-top: 20px;
    text-align: center;
    font-size: 15px;
    color: rgba(255,255,255,0.50);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .ru-signin-btn {
    background: none;
    border: none;
    font-family: 'Outfit', sans-serif;
    font-size: 15px;
    font-weight: 500;
    color: var(--gold-light);
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 3px;
    transition: color 0.15s;
  }

  .ru-signin-btn:hover { color: var(--gold); }

  /* password strength bar */
  .ru-strength {
    margin-top: 6px;
    height: 3px;
    background: rgba(255,255,255,0.10);
    border-radius: 2px;
    overflow: hidden;
  }

  .ru-strength-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.3s, background 0.3s;
  }

  /* success */
  .ru-success {
    background: rgba(74, 124, 89, 0.12);
    border: 1px solid rgba(74, 124, 89, 0.30);
    border-radius: 2px;
    padding: 28px;
    display: flex;
    align-items: flex-start;
    gap: 18px;
    animation: successIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes successIn {
    from { opacity: 0; transform: scale(0.96); }
    to   { opacity: 1; transform: scale(1); }
  }

  .ru-success-icon-wrap {
    width: 44px; height: 44px;
    background: var(--success);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .ru-success-icon-wrap svg { width: 22px; height: 22px; color: #fff; }

  .ru-success-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px;
    font-weight: 600;
    color: #7ec89a;
    margin-bottom: 8px;
  }

  .ru-success-msg {
    font-size: 16px;
    color: rgba(255,255,255,0.65);
    line-height: 1.6;
    margin-bottom: 18px;
    font-weight: 300;
  }

  .ru-go-login {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 11px 24px;
    background: var(--success);
    color: #fff;
    border: none;
    border-radius: 2px;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s;
  }

  .ru-go-login:hover { opacity: 0.85; transform: translateY(-1px); }

  /* ── RESPONSIVE ── */
  @media (max-width: 640px) {
    .ru-header { padding: 20px 24px; }
    .ru-brand-name { font-size: 26px; }
    .ru-card-header, .ru-card-body { padding-left: 24px; padding-right: 24px; }
    .ru-card-title { font-size: 36px; }
    .ru-input { font-size: 15px; }
    .ru-row { grid-template-columns: 1fr; }
  }

  @media (max-height: 700px) {
    .ru-header { padding: 16px 56px; }
    .ru-card-header { padding: 22px 40px 18px; }
    .ru-card-body { padding: 22px 40px 28px; }
    .ru-card-title { font-size: 36px; }
    .ru-field { margin-bottom: 12px; }
  }
`;

const EyeOpen = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOff = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const getStrength = (pw) => {
  if (!pw) return { width: "0%", color: "transparent" };
  if (pw.length < 4) return { width: "25%", color: "#b54a4a" };
  if (pw.length < 6) return { width: "50%", color: "#c8973a" };
  if (pw.length < 9) return { width: "75%", color: "#c8b23a" };
  return { width: "100%", color: "#4a7c59" };
};

const RegisterUser = () => {
  const navigate = useNavigate();

  const [lostFoundUser, setLostFoundUser] = useState({
    username: "", password: "", personalName: "", email: "", role: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [flag, setFlag] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => { setFlag(false); }, []);

  const onChangeHandler = (e) => {
    setFlag(false);
    setLostFoundUser(v => ({ ...v, [e.target.name]: e.target.value }));
  };

  const handleValidation = (e) => {
    e.preventDefault();
    let tempErrors = {}, isValid = true;

    if (!lostFoundUser.username.trim()) { tempErrors.username = "Username is required"; isValid = false; }
    if (!lostFoundUser.personalName.trim()) { tempErrors.personalName = "Full name is required"; isValid = false; }
    if (!lostFoundUser.email.trim()) { tempErrors.email = "Email is required"; isValid = false; }
    else if (!emailPattern.test(lostFoundUser.email)) { tempErrors.email = "Invalid email format"; isValid = false; }
    if (!lostFoundUser.role) { tempErrors.role = "Please select a role"; isValid = false; }
    if (!lostFoundUser.password.trim()) { tempErrors.password = "Password is required"; isValid = false; }
    else if (lostFoundUser.password.length < 5 || lostFoundUser.password.length > 10) { tempErrors.password = "Password must be 5–10 characters"; isValid = false; }
    else if (lostFoundUser.password !== confirmPassword) { tempErrors.password = "Passwords do not match"; isValid = false; }
    if (!confirmPassword.trim()) { tempErrors.confirmPassword = "Please confirm your password"; isValid = false; }

    setErrors(tempErrors);
    if (isValid) createNewUser(e);
  };

  const createNewUser = (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (lostFoundUser.password === confirmPassword) {
      registerNewUser(lostFoundUser)
        .then(() => { setFlag(true); setIsLoading(false); })
        .catch(() => setIsLoading(false));
    }
  };

  const strength = getStrength(lostFoundUser.password);

  const ip = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor" };

  return (
    <>
      <style>{styles}</style>
      <div className="ru-page">

        {/* Background */}
        <div className="ru-bg" />
        <div className="ru-overlay" />
        <div className="ru-noise" />
        <div className="ru-lines">
          <div className="ru-line" />
          <div className="ru-line" />
          <div className="ru-line" />
        </div>

        {/* Header */}
        <div className="ru-header">
          <div className="ru-brand">
            <div className="ru-logo-mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <div className="ru-brand-name">LostFoundLocator</div>
              <div className="ru-brand-sub">Campus Portal</div>
            </div>
          </div>

          <button className="ru-back-btn" onClick={() => navigate("/login")}>
            <svg {...ip}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="ru-body-wrap">
          <div className="ru-card">

            {/* Gold shimmer top bar */}
            <div className="ru-card-accent" />

            {/* Card Header */}
            <div className="ru-card-header">
              <div className="ru-eyebrow">
                <div className="ru-eyebrow-line" />
                <span className="ru-eyebrow-text">Lost &amp; Found Portal</span>
              </div>
              <h1 className="ru-card-title">Create <em>Account</em></h1>
              <p className="ru-card-subtitle">Join the campus lost &amp; found network.</p>
            </div>

            {/* Card Body */}
            <div className="ru-card-body">
              {!flag ? (
                <form onSubmit={handleValidation} noValidate>

                  {/* Row: Username + Full Name */}
                  <div className="ru-row">
                    <div className="ru-field">
                      <label className="ru-label">Username <span className="req">*</span></label>
                      <div className="ru-input-wrap">
                        <svg className="ru-input-icon" {...ip}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <input
                          className={`ru-input ${errors.username ? "has-error" : ""}`}
                          name="username" value={lostFoundUser.username}
                          onChange={onChangeHandler} placeholder="Choose a username"
                        />
                      </div>
                      {errors.username && <p className="ru-error">⚠ {errors.username}</p>}
                    </div>

                    <div className="ru-field">
                      <label className="ru-label">Full Name <span className="req">*</span></label>
                      <div className="ru-input-wrap">
                        <svg className="ru-input-icon" {...ip}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <input
                          className={`ru-input ${errors.personalName ? "has-error" : ""}`}
                          name="personalName" value={lostFoundUser.personalName}
                          onChange={onChangeHandler} placeholder="Your full name"
                        />
                      </div>
                      {errors.personalName && <p className="ru-error">⚠ {errors.personalName}</p>}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="ru-field">
                    <label className="ru-label">Email Address <span className="req">*</span></label>
                    <div className="ru-input-wrap">
                      <svg className="ru-input-icon" {...ip}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <input
                        className={`ru-input ${errors.email ? "has-error" : ""}`}
                        type="email" name="email" value={lostFoundUser.email}
                        onChange={onChangeHandler} placeholder="you@example.com"
                      />
                    </div>
                    {errors.email && <p className="ru-error">⚠ {errors.email}</p>}
                  </div>

                  {/* Role */}
                  <div className="ru-field">
                    <label className="ru-label">Role <span className="req">*</span></label>
                    <div className="ru-input-wrap">
                      <svg className="ru-input-icon" {...ip}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <select
                        className={`ru-input ru-select ${errors.role ? "has-error" : ""}`}
                        name="role" value={lostFoundUser.role} onChange={onChangeHandler}
                      >
                        <option value="">Select your role</option>
                        <option value="Student">Student</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>
                    {errors.role && <p className="ru-error">⚠ {errors.role}</p>}
                  </div>

                  {/* Row: Password + Confirm */}
                  <div className="ru-row">
                    <div className="ru-field">
                      <label className="ru-label">Password <span className="req">*</span></label>
                      <div className="ru-input-wrap">
                        <svg className="ru-input-icon" {...ip}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <input
                          className={`ru-input ${errors.password ? "has-error" : ""}`}
                          type={showPassword ? "text" : "password"}
                          name="password" value={lostFoundUser.password}
                          onChange={onChangeHandler} placeholder="5–10 characters"
                          style={{ paddingRight: "44px" }}
                        />
                        <button type="button" className="ru-eye" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff /> : <EyeOpen />}
                        </button>
                      </div>
                      {lostFoundUser.password && (
                        <div className="ru-strength">
                          <div className="ru-strength-fill" style={{ width: strength.width, background: strength.color }} />
                        </div>
                      )}
                      {errors.password && <p className="ru-error">⚠ {errors.password}</p>}
                    </div>

                    <div className="ru-field">
                      <label className="ru-label">Confirm Password <span className="req">*</span></label>
                      <div className="ru-input-wrap">
                        <svg className="ru-input-icon" {...ip}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <input
                          className={`ru-input ${errors.confirmPassword ? "has-error" : ""}`}
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          style={{ paddingRight: "44px" }}
                        />
                        <button type="button" className="ru-eye" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                          {showConfirmPassword ? <EyeOff /> : <EyeOpen />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="ru-error">⚠ {errors.confirmPassword}</p>}
                    </div>
                  </div>

                  <div className="ru-divider">or</div>

                  <button type="submit" className="ru-submit" disabled={isLoading}>
                    {isLoading ? (
                      <><div className="ru-spinner" /> Creating Account…</>
                    ) : (
                      <>Create Account →</>
                    )}
                  </button>

                  <div className="ru-footer">
                    <span>Already have an account?</span>
                    <button type="button" className="ru-signin-btn" onClick={() => navigate("/login")}>
                      Sign In
                    </button>
                  </div>

                </form>
              ) : (
                <div className="ru-success">
                  <div className="ru-success-icon-wrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="ru-success-title">Account Created!</div>
                    <div className="ru-success-msg">
                      Welcome aboard. Your account is ready — you can now sign in and start using the Lost &amp; Found portal.
                    </div>
                    <button className="ru-go-login" onClick={() => navigate("/login")}>
                      Go to Login →
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterUser;
