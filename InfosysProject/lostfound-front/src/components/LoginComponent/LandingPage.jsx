import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #root {
    height: 100%;
    overflow: auto;
  }

  /* ── ROOT CONTAINER ── */
  .lp-root {
    min-height: 100vh;
    width: 100vw;
    position: relative;
    display: flex;
    flex-direction: column;
    font-family: 'Outfit', sans-serif;
    overflow: visible;
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

  /* ── CONTENT WRAPPER ── */
  .lp-content {
    position: relative;
    z-index: 10;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding: 0 80px 140px;
  }

  /* ── TOP NAV ── */
  .lp-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 36px 0 0;
    animation: navIn 0.8s cubic-bezier(0.16,1,0.3,1) both;
  }

  @keyframes navIn {
    from { opacity: 0; transform: translateY(-14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .lp-logo {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .lp-logo-mark {
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

  .lp-logo-mark::before {
    content: '';
    position: absolute;
    inset: 3px;
    border: 1px solid rgba(200,151,58,0.35);
    border-radius: 1px;
  }

  .lp-logo-mark svg {
    width: 22px; height: 22px;
    color: var(--gold);
  }

  .lp-logo-text {
    display: flex;
    flex-direction: column;
  }

  .lp-logo-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 36px;
    font-weight: 600;
    color: var(--white);
    letter-spacing: 0.02em;
    line-height: 1;
  }

  .lp-logo-sub {
    font-size: 16px;
    font-weight: 400;
    color: rgba(255,255,255,1);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    margin-top: 4px;
  }

  .lp-nav-badge {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 9px 20px;
    border: 1px solid var(--glass-border);
    border-radius: 40px;
    backdrop-filter: blur(12px);
    background: var(--glass);
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(255,255,255,1);
  }

  .lp-nav-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--gold);
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.5; transform: scale(0.8); }
  }

  /* ── HERO SECTION ── */
  .lp-hero {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px 0 80px;
    max-width: 760px;
  }

  .lp-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 30px;
    animation: heroIn 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s both;
  }

  .lp-eyebrow-line {
    width: 48px;
    height: 1.5px;
    background: var(--gold);
  }

  .lp-eyebrow-text {
    font-size: 17px;
    font-weight: 500;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--gold-light);
  }

  .lp-headline {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(80px, 10vw, 120px);
    font-weight: 300;
    color: var(--white);
    line-height: 1.04;
    letter-spacing: -0.5px;
    margin-bottom: 10px;
    animation: heroIn 0.9s cubic-bezier(0.16,1,0.3,1) 0.25s both;
  }

  .lp-headline em {
    font-style: italic;
    color: var(--gold-light);
    font-weight: 300;
  }

  .lp-headline-sub {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(58px, 7.5vw, 90px);
    font-weight: 300;
    color: rgba(255,255,255,1);
    animation: heroIn 0.9s cubic-bezier(0.16,1,0.3,1) 0.32s both;
  }

  .lp-desc {
    font-size: 23px;
    font-weight: 300;
    color: rgba(255,255,255,1);
    max-width: 520px;
    margin-bottom: 52px;
    line-height: 1.65;
    animation: heroIn 0.9s cubic-bezier(0.16,1,0.3,1) 0.4s both;
  }

  @keyframes heroIn {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── BUTTONS ── */
  .lp-buttons {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
    animation: heroIn 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s both;
  }

  .lp-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 18px 48px;
    background: var(--gold);
    color: #2a1800;
    border: none;
    border-radius: 2px;
    font-family: 'Outfit', sans-serif;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
    position: relative;
    overflow: hidden;
  }

  .lp-btn-primary::before {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.30), transparent);
    transition: left 0.45s;
  }

  .lp-btn-primary:hover {
    background: var(--gold-light);
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(200,151,58,0.45);
  }

  .lp-btn-primary:hover::before { left: 100%; }
  .lp-btn-primary:active { transform: translateY(0); }

  .lp-btn-primary svg { width: 18px; height: 18px; }

  .lp-btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 17px 48px;
    background: var(--glass);
    color: var(--white);
    border: 1.5px solid var(--glass-border);
    border-radius: 2px;
    font-family: 'Outfit', sans-serif;
    font-size: 18px;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
    backdrop-filter: blur(12px);
    transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
  }

  .lp-btn-secondary:hover {
    background: var(--glass-hover);
    border-color: rgba(200,151,58,0.55);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(80,40,120,0.3);
  }

  .lp-btn-secondary svg { width: 18px; height: 18px; opacity: 0.9; }

  /* ── BOTTOM STRIP ── */
  .lp-strip {
    position: sticky;
    bottom: 0;
    left: 0; right: 0;
    z-index: 10;
    display: flex;
    align-items: stretch;
    border-top: 1px solid var(--glass-border);
    backdrop-filter: blur(20px);
    background: rgba(20,10,50,0.60);
    animation: stripIn 0.9s cubic-bezier(0.16,1,0.3,1) 0.65s both;
  }

  @keyframes stripIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .lp-strip-item {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 22px 40px;
    border-right: 1px solid var(--glass-border);
    transition: background 0.2s;
  }

  .lp-strip-item:last-child { border-right: none; }
  .lp-strip-item:hover { background: rgba(200,151,58,0.08); }

  .lp-strip-icon {
    width: 44px; height: 44px;
    border-radius: 2px;
    background: var(--gold-dim);
    border: 1px solid rgba(200,151,58,0.30);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .lp-strip-icon svg {
    width: 20px; height: 20px;
    color: var(--gold);
  }

  .lp-strip-label {
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255,255,255,1);
    margin-bottom: 4px;
  }

  .lp-strip-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px;
    font-weight: 600;
    color: var(--white);
    letter-spacing: 0.01em;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    .lp-content { padding: 0 40px 140px; }
    .lp-strip-item { padding: 18px 24px; }
  }

  @media (max-width: 640px) {
    .lp-content { padding: 0 24px 220px; }
    .lp-hero { padding-bottom: 140px; }
    .lp-strip { flex-direction: column; }
    .lp-strip-item { border-right: none; border-bottom: 1px solid var(--glass-border); padding: 14px 24px; }
    .lp-strip-item:last-child { border-bottom: none; }
    .lp-buttons { flex-direction: column; align-items: flex-start; }
    .lp-btn-primary, .lp-btn-secondary { width: 100%; justify-content: center; }
  }

  @media (max-height: 680px) {
    .lp-nav { padding-top: 20px; }
    .lp-headline { font-size: 68px; }
    .lp-headline-sub { font-size: 50px; margin-bottom: 20px; }
    .lp-desc { margin-bottom: 28px; font-size: 19px; }
    .lp-strip-item { padding: 14px 40px; }
  }
`;

const LandingPage = () => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const ip = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor" };

  return (
    <>
      <style>{styles}</style>
      <div className="lp-root">

        {/* Background */}
        <div className="lp-bg" />
        <div className="lp-overlay" />
        <div className="lp-noise" />
        <div className="lp-lines">
          <div className="lp-line" />
          <div className="lp-line" />
          <div className="lp-line" />
        </div>

        {/* Content */}
        <div className="lp-content">

          {/* Nav */}
          <nav className="lp-nav">
            <div className="lp-logo">
              <div className="lp-logo-mark">
                <svg {...ip}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="lp-logo-text">
                <span className="lp-logo-name">LostFoundLocator</span>
                <span className="lp-logo-sub">Campus Portal</span>
              </div>
            </div>

            <div className="lp-nav-badge">
              <div className="lp-nav-dot" />
              Live System
            </div>
          </nav>

          {/* Hero */}
          <section className="lp-hero">
            <div className="lp-eyebrow">
              <div className="lp-eyebrow-line" />
              <span className="lp-eyebrow-text">Lost & Found Management</span>
            </div>

            <h1 className="lp-headline">
              Find What's <em>Lost,</em>
            </h1>
            <h2 className="lp-headline-sub">
              Return What's Found.
            </h2>

            <p className="lp-desc">
              A smart campus portal that connects people with their missing belongings.
              Report, search, and reunite — all in one place.
            </p>

            <div className="lp-buttons">
              <button className="lp-btn-primary" onClick={() => navigate("/login")}>
                <svg {...ip}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login to Portal
              </button>

              <button className="lp-btn-secondary" onClick={() => navigate("/register")}>
                <svg {...ip}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Create Account
              </button>
            </div>
          </section>
        </div>

        {/* Bottom Feature Strip */}
        <div className="lp-strip">
          <div className="lp-strip-item">
            <div className="lp-strip-icon">
              <svg {...ip}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="lp-strip-label">Report</div>
              <div className="lp-strip-value">Lost Items</div>
            </div>
          </div>

          <div className="lp-strip-item">
            <div className="lp-strip-icon">
              <svg {...ip}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="lp-strip-label">Submit</div>
              <div className="lp-strip-value">Found Items</div>
            </div>
          </div>

          <div className="lp-strip-item">
            <div className="lp-strip-icon">
              <svg {...ip}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div>
              <div className="lp-strip-label">Smart</div>
              <div className="lp-strip-value">Matching</div>
            </div>
          </div>

          <div className="lp-strip-item">
            <div className="lp-strip-icon">
              <svg {...ip}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <div className="lp-strip-label">Trusted</div>
              <div className="lp-strip-value">Secure System</div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default LandingPage;
