import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, forgotPassword } from "../../services/LoginService";

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
  .lp-page {
    min-height: 100vh;
    width: 100vw;
    position: relative;
    display: flex;
    flex-direction: column;
    font-family: 'Outfit', sans-serif;
    overflow: hidden;
  }

  /* ── BACKGROUND IMAGE ── */
  .lp-bg {
    position: fixed;
    inset: 0;
    background-image: url('https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhO2UsIc31HFrmqG6SyW6bn0pljpk05_xD_k1RVEm_vu3hnWxcFk3G3vnJi3eelOrx6gang_sBBFvUhWkkvnlsEu_UT77x5RS07Puvba03Tn26LtMeIPeH0nGF6TmXgshDFHNtPXT8ji5qZ/s1600/Web-design.jpg');
    background-size: cover;
    background-position: center top;
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
  .lp-overlay {
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
  .lp-noise {
    position: fixed;
    inset: 0;
    z-index: 2;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 180px 180px;
    pointer-events: none;
  }

  /* ── DECORATIVE LINES ── */
  .lp-lines {
    position: fixed;
    inset: 0;
    z-index: 2;
    pointer-events: none;
    overflow: hidden;
  }

  .lp-line {
    position: absolute;
    background: linear-gradient(90deg, transparent, rgba(200,151,58,0.20), transparent);
    height: 1px;
    width: 100%;
    animation: lineFade 6s ease-in-out infinite;
  }

  .lp-line:nth-child(1) { top: 30%; animation-delay: 0s; }
  .lp-line:nth-child(2) { top: 62%; animation-delay: 2s; opacity: 0.6; }
  .lp-line:nth-child(3) { top: 85%; animation-delay: 4s; opacity: 0.3; }

  @keyframes lineFade {
    0%, 100% { opacity: 0; }
    50%       { opacity: 1; }
  }

  /* ── HEADER ── */
  .lp-header {
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

  .lp-brand {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .lp-logo-mark {
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

  .lp-logo-mark::before {
    content: '';
    position: absolute;
    inset: 3px;
    border: 1px solid rgba(200,151,58,0.35);
    border-radius: 1px;
  }

  .lp-logo-mark svg {
    width: 26px; height: 26px;
    color: var(--gold);
  }

  .lp-brand-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 34px;          /* ↑ was 28px */
    font-weight: 600;
    color: var(--white);
    letter-spacing: 0.02em;
    line-height: 1;
  }

  .lp-brand-sub {
    font-size: 15px;           /* ↑ was 12px */
    font-weight: 400;
    color: rgba(255,255,255,0.85);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    margin-top: 5px;
  }

  .lp-back {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    padding: 11px 24px;
    border: 1px solid var(--glass-border);
    border-radius: 40px;
    backdrop-filter: blur(12px);
    background: var(--glass);
    font-size: 16px;           /* ↑ was 13px */
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(255,255,255,1);
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Outfit', sans-serif;
  }

  .lp-back:hover {
    background: var(--glass-hover);
    border-color: rgba(200,151,58,0.55);
    color: var(--white);
  }

  .lp-back svg { width: 16px; height: 16px; }

  /* ── BODY ── */
  .lp-body {
    flex: 1;
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
  }

  /* ── CARD ── */
  .lp-card {
    width: 100%;
    max-width: 480px;          /* ↑ was 440px */
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
  .lp-card-accent {
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
  .lp-card-header {
    padding: 36px 40px 28px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }

  .lp-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 16px;
  }

  .lp-eyebrow-line {
    width: 48px;
    height: 1.5px;
    background: var(--gold);
  }

  .lp-eyebrow-text {
    font-size: 15px;           /* ↑ was 12px */
    font-weight: 500;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--gold-light);
  }

  .lp-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 54px;           /* ↑ was 42px */
    font-weight: 300;
    color: var(--white);
    line-height: 1.08;
    letter-spacing: -0.3px;
  }

  .lp-card-title em {
    font-style: italic;
    color: var(--gold-light);
    font-weight: 300;
  }

  .lp-card-subtitle {
    margin-top: 10px;
    font-size: 17px;           /* ↑ was 14px */
    font-weight: 300;
    color: rgba(255,255,255,0.75);
    letter-spacing: 0.02em;
  }

  /* ── CARD BODY ── */
  .lp-card-body {
    padding: 32px 40px 40px;
  }

  /* ── FIELD ── */
  .lp-field {
    margin-bottom: 20px;
  }

  .lp-label {
    display: block;
    font-size: 14px;           /* ↑ was 11px */
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.80);
    margin-bottom: 9px;
  }

  .lp-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .lp-input-icon {
    position: absolute;
    left: 16px;
    width: 18px; height: 18px;
    color: rgba(200,151,58,0.7);
    pointer-events: none;
  }

  .lp-input {
    width: 100%;
    padding: 14px 18px 14px 48px;
    background: rgba(255,255,255,0.06);
    border: 1px solid var(--glass-border);
    border-radius: 2px;
    font-family: 'Outfit', sans-serif;
    font-size: 17px;           /* ↑ was 14px */
    color: var(--white);
    transition: all 0.2s;
    outline: none;
    -webkit-appearance: none;
  }

  .lp-input:focus {
    border-color: var(--gold);
    background: rgba(255,255,255,0.09);
    box-shadow: 0 0 0 3px rgba(200,151,58,0.12);
  }

  .lp-input::placeholder { color: rgba(255,255,255,0.28); font-size: 16px; }
  .lp-input.has-error { border-color: var(--error); box-shadow: 0 0 0 3px rgba(181,74,74,0.10); }

  .lp-error {
    margin-top: 7px;
    font-size: 14px;           /* ↑ was 12px */
    color: #e07a7a;
    display: flex;
    align-items: center;
    gap: 5px;
    font-weight: 400;
  }

  /* ── FORGOT ── */
  .lp-forgot {
    display: flex;
    justify-content: flex-end;
    margin-top: -6px;
    margin-bottom: 22px;
  }

  .lp-forgot-btn {
    background: none;
    border: none;
    font-family: 'Outfit', sans-serif;
    font-size: 15px;           /* ↑ was 12px */
    font-weight: 400;
    color: rgba(255,255,255,0.65);
    cursor: pointer;
    letter-spacing: 0.04em;
    transition: color 0.15s;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .lp-forgot-btn:hover { color: var(--gold-light); }

  /* ── ALERT ── */
  .lp-alert {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
    background: rgba(181,74,74,0.12);
    border: 1px solid rgba(181,74,74,0.3);
    border-radius: 2px;
    font-size: 15px;           /* ↑ was 13px */
    color: #e07a7a;
    margin-bottom: 20px;
  }

  .lp-alert svg { width: 17px; height: 17px; flex-shrink: 0; }

  /* ── SUBMIT BUTTON ── */
  .lp-submit {
    width: 100%;
    padding: 20px 48px;
    background: var(--gold);
    color: #2a1800;
    border: none;
    border-radius: 2px;
    font-family: 'Outfit', sans-serif;
    font-size: 17px;           /* ↑ was 14px */
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

  .lp-submit::before {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.30), transparent);
    transition: left 0.45s;
  }

  .lp-submit:hover:not(:disabled) {
    background: var(--gold-light);
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(200,151,58,0.45);
  }

  .lp-submit:hover::before { left: 100%; }
  .lp-submit:active { transform: translateY(0); }
  .lp-submit:disabled { opacity: 0.55; cursor: not-allowed; }

  /* ── DIVIDER ── */
  .lp-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 24px 0;
    color: rgba(255,255,255,0.30);
    font-size: 14px;           /* ↑ was 11px */
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .lp-divider::before, .lp-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.10);
  }

  /* ── REGISTER BUTTON ── */
  .lp-register {
    width: 100%;
    padding: 19px 48px;
    background: var(--glass);
    color: var(--white);
    border: 1.5px solid var(--glass-border);
    border-radius: 2px;
    backdrop-filter: blur(12px);
    font-family: 'Outfit', sans-serif;
    font-size: 17px;           /* ↑ was 14px */
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
  }

  .lp-register:hover {
    background: var(--glass-hover);
    border-color: rgba(200,151,58,0.55);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(80,40,120,0.3);
  }

  /* ── SPINNER ── */
  .lp-spinner {
    width: 17px; height: 17px;
    border: 2px solid rgba(42,24,0,0.3);
    border-top-color: #2a1800;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  .lp-spinner-dark {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── MODAL OVERLAY ── */
  .lp-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(20,10,50,0.72);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    padding: 20px;
    animation: overlayIn 0.2s ease both;
  }

  @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }

  .lp-modal {
    width: 100%;
    max-width: 460px;          /* ↑ was 420px */
    background: rgba(20,10,50,0.90);
    border: 1px solid var(--glass-border);
    border-radius: 4px;
    backdrop-filter: blur(32px);
    box-shadow: 0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset;
    overflow: hidden;
    animation: modalIn 0.35s cubic-bezier(0.16,1,0.3,1) both;
  }

  @keyframes modalIn {
    from { opacity: 0; transform: scale(0.95) translateY(12px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  .lp-modal-accent {
    height: 3px;
    background: linear-gradient(90deg, var(--gold), var(--gold-light), var(--gold));
    background-size: 200% 100%;
    animation: shimmer 3s linear infinite;
  }

  .lp-modal-header {
    padding: 30px 34px 24px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .lp-modal-eyebrow {
    font-size: 13px;           /* ↑ was 10px */
    font-weight: 500;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--gold-light);
    display: block;
    margin-bottom: 10px;
  }

  .lp-modal-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 36px;           /* ↑ was 28px */
    font-weight: 300;
    color: var(--white);
    line-height: 1.1;
  }

  .lp-modal-subtitle {
    font-size: 16px;           /* ↑ was 13px */
    color: rgba(255,255,255,0.65);
    margin-top: 6px;
    font-weight: 300;
  }

  .lp-modal-close {
    background: var(--glass);
    border: 1px solid var(--glass-border);
    border-radius: 2px;
    padding: 8px;
    cursor: pointer;
    color: rgba(255,255,255,0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .lp-modal-close:hover { background: var(--glass-hover); color: var(--white); }
  .lp-modal-close svg { width: 16px; height: 16px; }

  .lp-modal-body { padding: 30px 34px 34px; }

  .lp-modal-field { margin-bottom: 18px; }

  .lp-modal-actions {
    display: flex;
    gap: 10px;
    margin-top: 24px;
  }

  .lp-cancel {
    flex: 1;
    padding: 14px;
    background: transparent;
    border: 1px solid var(--glass-border);
    border-radius: 2px;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;           /* ↑ was 11px */
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.65);
    cursor: pointer;
    transition: all 0.15s;
  }

  .lp-cancel:hover { border-color: rgba(255,255,255,0.3); color: var(--white); }

  .lp-reset {
    flex: 2;
    padding: 14px;
    background: var(--gold);
    color: #2a1800;
    border: none;
    border-radius: 2px;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;           /* ↑ was 11px */
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }

  .lp-reset:hover:not(:disabled) {
    background: var(--gold-light);
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(200,151,58,0.35);
  }

  .lp-reset:disabled { opacity: 0.55; cursor: not-allowed; }

  /* ── MODAL SUCCESS ── */
  .lp-modal-success {
    display: flex;
    align-items: flex-start;
    gap: 18px;
    padding: 22px;
    background: rgba(74,124,89,0.12);
    border: 1px solid rgba(74,124,89,0.3);
    border-radius: 2px;
  }

  .lp-ms-icon {
    width: 42px; height: 42px;
    background: var(--success);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .lp-ms-icon svg { width: 22px; height: 22px; color: #fff; }

  .lp-ms-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px;           /* ↑ was 22px */
    font-weight: 600;
    color: #7ec89a;
    margin-bottom: 8px;
  }

  .lp-ms-msg {
    font-size: 16px;           /* ↑ was 13px */
    color: rgba(255,255,255,0.70);
    line-height: 1.6;
    margin-bottom: 18px;
  }

  .lp-done {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 11px 24px;
    background: var(--success);
    color: #fff;
    border: none;
    border-radius: 2px;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;           /* ↑ was 11px */
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s;
  }

  .lp-done:hover { opacity: 0.85; transform: translateY(-1px); }

  .lp-modal-alert {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 13px 16px;
    background: rgba(181,74,74,0.12);
    border: 1px solid rgba(181,74,74,0.3);
    border-radius: 2px;
    font-size: 15px;           /* ↑ was 12px */
    color: #e07a7a;
    margin-top: 6px;
  }

  .lp-modal-alert svg { width: 17px; height: 17px; flex-shrink: 0; }

  /* ── PULSE DOT ── */
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.5; transform: scale(0.8); }
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 640px) {
    .lp-header { padding: 20px 24px; }
    .lp-brand-name { font-size: 26px; }
    .lp-card-header, .lp-card-body { padding-left: 24px; padding-right: 24px; }
    .lp-modal-header, .lp-modal-body { padding-left: 22px; padding-right: 22px; }
    .lp-card-title { font-size: 40px; }
    .lp-input { font-size: 15px; }
  }

  @media (max-height: 700px) {
    .lp-header { padding: 18px 56px; }
    .lp-card-header { padding: 24px 40px 20px; }
    .lp-card-body { padding: 24px 40px 32px; }
    .lp-card-title { font-size: 40px; }
    .lp-field { margin-bottom: 14px; }
    .lp-divider { margin: 14px 0; }
  }
`;

const LoginPage = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [flag, setFlag] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });

  const [showForgot, setShowForgot] = useState(false);
  const [forgotData, setForgotData] = useState({ username: "", newPassword: "" });
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotErrors, setForgotErrors] = useState({});

  const ip = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor" };

  const onChangeHandler = (e) => {
    setFlag(true);
    setLoginData(v => ({ ...v, [e.target.name]: e.target.value }));
  };

  const handleValidation = (e) => {
    e.preventDefault();
    let tempErrors = {}, isValid = true;
    if (!loginData.username.trim()) { tempErrors.username = "Username is required"; isValid = false; }
    if (!loginData.password.trim()) { tempErrors.password = "Password is required"; isValid = false; }
    setErrors(tempErrors);
    if (isValid) validateLogin(e);
  };

  const validateLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    login(loginData.username, loginData.password)
      .then((response) => {
        const role = String(response.data);
        if (role === "Admin") navigate("/admin-menu");
        else if (role === "Student") navigate("/student-menu");
        else { setFlag(false); setIsLoading(false); }
      })
      .catch(() => { setFlag(false); setIsLoading(false); });
  };

  const openForgotModal = () => {
    setShowForgot(true);
    setForgotData({ username: "", newPassword: "" });
    setForgotErrors({});
    setForgotSuccess(false);
  };

  const closeForgotModal = () => {
    setShowForgot(false);
    setForgotData({ username: "", newPassword: "" });
    setForgotErrors({});
    setForgotSuccess(false);
  };

  const handleForgotPassword = () => {
    let tempErrors = {}, isValid = true;
    if (!forgotData.username.trim()) { tempErrors.username = "Username is required"; isValid = false; }
    if (!forgotData.newPassword.trim()) { tempErrors.newPassword = "New password is required"; isValid = false; }
    else if (forgotData.newPassword.length < 5 || forgotData.newPassword.length > 10) {
      tempErrors.newPassword = "Password must be 5–10 characters"; isValid = false;
    }
    setForgotErrors(tempErrors);
    if (!isValid) return;

    setForgotLoading(true);
    forgotPassword(forgotData.username, forgotData.newPassword)
      .then(() => { setForgotLoading(false); setForgotSuccess(true); })
      .catch(() => {
        setForgotLoading(false);
        setForgotErrors({ api: "User not found or update failed. Please try again." });
      });
  };

  return (
    <>
      <style>{styles}</style>
      <div className="lp-page">

        {/* Background */}
        <div className="lp-bg" />
        <div className="lp-overlay" />
        <div className="lp-noise" />
        <div className="lp-lines">
          <div className="lp-line" />
          <div className="lp-line" />
          <div className="lp-line" />
        </div>

        {/* Header */}
        <div className="lp-header">
          <div className="lp-brand">
            <div className="lp-logo-mark">
              <svg {...ip}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <div className="lp-brand-name">LostFoundLocator</div>
              <div className="lp-brand-sub">Campus Portal</div>
            </div>
          </div>

          <button className="lp-back" onClick={() => navigate("/")}>
            <svg {...ip}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        {/* Body */}
        <div className="lp-body">
          <div className="lp-card">

            {/* Gold shimmer top bar */}
            <div className="lp-card-accent" />

            {/* Card header */}
            <div className="lp-card-header">
              <div className="lp-eyebrow">
                <div className="lp-eyebrow-line" />
                <span className="lp-eyebrow-text">Lost &amp; Found Portal</span>
              </div>
              <h1 className="lp-card-title">
                Welcome <em>Back</em>
              </h1>
              <p className="lp-card-subtitle">Sign in to access your account.</p>
            </div>

            {/* Card form body */}
            <div className="lp-card-body">
              <form onSubmit={handleValidation} noValidate>

                {/* Username */}
                <div className="lp-field">
                  <label className="lp-label">Username</label>
                  <div className="lp-input-wrap">
                    <svg className="lp-input-icon" {...ip}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <input
                      className={`lp-input ${errors.username ? "has-error" : ""}`}
                      type="text" name="username"
                      value={loginData.username}
                      onChange={onChangeHandler}
                      placeholder="Enter your username"
                    />
                  </div>
                  {errors.username && <p className="lp-error">⚠ {errors.username}</p>}
                </div>

                {/* Password */}
                <div className="lp-field">
                  <label className="lp-label">Password</label>
                  <div className="lp-input-wrap">
                    <svg className="lp-input-icon" {...ip}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <input
                      className={`lp-input ${errors.password ? "has-error" : ""}`}
                      type="password" name="password"
                      value={loginData.password}
                      onChange={onChangeHandler}
                      placeholder="Enter your password"
                    />
                  </div>
                  {errors.password && <p className="lp-error">⚠ {errors.password}</p>}
                </div>

                {/* Forgot */}
                <div className="lp-forgot">
                  <button type="button" className="lp-forgot-btn" onClick={openForgotModal}>
                    Forgot password?
                  </button>
                </div>

                {/* Error alert */}
                {!flag && (
                  <div className="lp-alert">
                    <svg viewBox="0 0 20 20" fill="currentColor" style={{width:17,height:17,flexShrink:0}}>
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>Invalid username or password. Please try again.</span>
                  </div>
                )}

                {/* Submit */}
                <button type="submit" className="lp-submit" disabled={isLoading}>
                  {isLoading
                    ? <><div className="lp-spinner" /> Signing In…</>
                    : <>Sign In →</>
                  }
                </button>
              </form>

              <div className="lp-divider">or</div>

              <button className="lp-register" onClick={() => navigate("/register")}>
                <svg style={{width:18,height:18}} {...ip}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Create New Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── FORGOT PASSWORD MODAL ── */}
      {showForgot && (
        <div className="lp-modal-overlay" onClick={closeForgotModal}>
          <div className="lp-modal" onClick={(e) => e.stopPropagation()}>

            <div className="lp-modal-accent" />

            <div className="lp-modal-header">
              <div>
                <span className="lp-modal-eyebrow">Account Recovery</span>
                <div className="lp-modal-title">Reset Password</div>
                <div className="lp-modal-subtitle">Enter your username and a new password.</div>
              </div>
              <button className="lp-modal-close" onClick={closeForgotModal}>
                <svg {...ip}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="lp-modal-body">
              {forgotSuccess ? (
                <div className="lp-modal-success">
                  <div className="lp-ms-icon">
                    <svg {...ip}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="lp-ms-title">Password Updated!</div>
                    <div className="lp-ms-msg">
                      Your password has been changed. Sign in with your new credentials.
                    </div>
                    <button className="lp-done" onClick={closeForgotModal}>Back to Login →</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="lp-modal-field">
                    <label className="lp-label">Username</label>
                    <div className="lp-input-wrap">
                      <svg className="lp-input-icon" {...ip}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <input
                        className={`lp-input ${forgotErrors.username ? "has-error" : ""}`}
                        type="text" placeholder="Your username"
                        value={forgotData.username}
                        onChange={(e) => setForgotData({ ...forgotData, username: e.target.value })}
                      />
                    </div>
                    {forgotErrors.username && <p className="lp-error">⚠ {forgotErrors.username}</p>}
                  </div>

                  <div className="lp-modal-field">
                    <label className="lp-label">New Password</label>
                    <div className="lp-input-wrap">
                      <svg className="lp-input-icon" {...ip}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <input
                        className={`lp-input ${forgotErrors.newPassword ? "has-error" : ""}`}
                        type="password" placeholder="5–10 characters"
                        value={forgotData.newPassword}
                        onChange={(e) => setForgotData({ ...forgotData, newPassword: e.target.value })}
                      />
                    </div>
                    {forgotErrors.newPassword && <p className="lp-error">⚠ {forgotErrors.newPassword}</p>}
                  </div>

                  {forgotErrors.api && (
                    <div className="lp-modal-alert">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span>{forgotErrors.api}</span>
                    </div>
                  )}

                  <div className="lp-modal-actions">
                    <button className="lp-cancel" onClick={closeForgotModal}>Cancel</button>
                    <button className="lp-reset" onClick={handleForgotPassword} disabled={forgotLoading}>
                      {forgotLoading
                        ? <><div className="lp-spinner-dark" /> Updating…</>
                        : <>Update Password</>
                      }
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPage;
