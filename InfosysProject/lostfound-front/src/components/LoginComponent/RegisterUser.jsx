import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerNewUser } from "../../services/LoginService";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --cream: #f5f0e8;
    --warm-white: #fefcf9;
    --charcoal: #1a1a2e;
    --ink: #2d2d44;
    --accent: #c8823a;
    --accent-light: #e8a85a;
    --muted: #8a8099;
    --border: #e2d9cc;
    --success: #4a7c59;
    --error: #b54a4a;
    --shadow: rgba(26, 26, 46, 0.08);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .ru-page {
    min-height: 100vh;
    background: var(--cream);
    background-image:
      radial-gradient(ellipse at 20% 80%, rgba(200, 130, 58, 0.07) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 20%, rgba(45, 45, 68, 0.05) 0%, transparent 50%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    font-family: 'DM Sans', sans-serif;
  }

  .ru-card {
    background: var(--warm-white);
    border: 1px solid var(--border);
    border-radius: 2px;
    width: 100%;
    max-width: 600px;
    box-shadow: 0 4px 40px var(--shadow), 0 1px 0 rgba(255,255,255,0.8) inset;
    overflow: hidden;
    animation: cardIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── HEADER ── */
  .ru-header {
    background: var(--charcoal);
    padding: 36px 44px 32px;
    position: relative;
    overflow: hidden;
  }

  .ru-header::before {
    content: '';
    position: absolute;
    top: -50px; right: -50px;
    width: 180px; height: 180px;
    border: 1px solid rgba(200, 130, 58, 0.18);
    border-radius: 50%;
    pointer-events: none;
  }

  .ru-header::after {
    content: '';
    position: absolute;
    bottom: -25px; left: 40px;
    width: 90px; height: 90px;
    border: 1px solid rgba(200, 130, 58, 0.10);
    border-radius: 50%;
    pointer-events: none;
  }

  .ru-tag {
    display: inline-block;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 10px;
    position: relative;
  }

  .ru-title {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 700;
    color: #fff;
    line-height: 1.2;
    position: relative;
  }

  .ru-subtitle {
    margin-top: 7px;
    font-size: 13px;
    color: rgba(255,255,255,0.42);
    font-weight: 300;
    letter-spacing: 0.03em;
    position: relative;
  }

  /* ── BODY ── */
  .ru-body {
    padding: 36px 44px 44px;
  }

  /* ── FIELD ── */
  .ru-field {
    margin-bottom: 20px;
    animation: fieldIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .ru-field:nth-child(1) { animation-delay: 0.05s; }
  .ru-field:nth-child(2) { animation-delay: 0.10s; }
  .ru-field:nth-child(3) { animation-delay: 0.15s; }
  .ru-field:nth-child(4) { animation-delay: 0.20s; }
  .ru-field:nth-child(5) { animation-delay: 0.25s; }
  .ru-field:nth-child(6) { animation-delay: 0.30s; }
  .ru-field:nth-child(7) { animation-delay: 0.35s; }

  @keyframes fieldIn {
    from { opacity: 0; transform: translateX(-8px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .ru-label {
    display: block;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 8px;
  }

  .ru-label .req { color: var(--accent); margin-left: 2px; }

  /* input wrapper */
  .ru-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .ru-input-icon {
    position: absolute;
    left: 14px;
    width: 15px; height: 15px;
    color: var(--muted);
    pointer-events: none;
    flex-shrink: 0;
  }

  .ru-input {
    width: 100%;
    padding: 12px 16px 12px 40px;
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 2px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--ink);
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    outline: none;
    -webkit-appearance: none;
  }

  .ru-input:focus {
    border-color: var(--accent);
    background: #fff;
    box-shadow: 0 0 0 3px rgba(200, 130, 58, 0.1);
  }

  .ru-input::placeholder { color: rgba(138, 128, 153, 0.45); }
  .ru-input.has-error { border-color: var(--error); box-shadow: 0 0 0 3px rgba(181,74,74,0.08); }

  /* select */
  .ru-select {
    cursor: pointer;
    padding-right: 36px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238a8099'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 16px;
  }

  /* password toggle */
  .ru-eye {
    position: absolute;
    right: 12px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    color: var(--muted);
    display: flex; align-items: center; justify-content: center;
    transition: color 0.15s;
  }

  .ru-eye:hover { color: var(--accent); }
  .ru-eye svg { width: 16px; height: 16px; }

  /* error */
  .ru-error {
    margin-top: 6px;
    font-size: 12px;
    color: var(--error);
    display: flex;
    align-items: center;
    gap: 4px;
  }

  /* row */
  .ru-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  /* divider */
  .ru-divider {
    height: 1px;
    background: var(--border);
    margin: 26px 0;
  }

  /* submit */
  .ru-submit {
    width: 100%;
    padding: 14px 24px;
    background: var(--charcoal);
    color: #fff;
    border: none;
    border-radius: 2px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    position: relative;
    overflow: hidden;
  }

  .ru-submit::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(200,130,58,0.15) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .ru-submit:hover:not(:disabled) {
    background: var(--ink);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(26,26,46,0.25);
  }

  .ru-submit:hover::after { opacity: 1; }
  .ru-submit:active { transform: translateY(0); }
  .ru-submit:disabled { opacity: 0.6; cursor: not-allowed; }

  /* spinner */
  .ru-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* footer link */
  .ru-footer {
    margin-top: 20px;
    text-align: center;
    font-size: 13px;
    color: var(--muted);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .ru-signin-btn {
    background: none;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: var(--accent);
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 3px;
    transition: color 0.15s;
  }

  .ru-signin-btn:hover { color: var(--accent-light); }

  /* success */
  .ru-success {
    background: rgba(74, 124, 89, 0.07);
    border: 1px solid rgba(74, 124, 89, 0.28);
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
    width: 40px; height: 40px;
    background: var(--success);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .ru-success-icon-wrap svg { width: 20px; height: 20px; color: #fff; }

  .ru-success-title {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 600;
    color: var(--success);
    margin-bottom: 6px;
  }

  .ru-success-msg {
    font-size: 13px;
    color: var(--muted);
    line-height: 1.6;
    margin-bottom: 18px;
  }

  .ru-go-login {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 20px;
    background: var(--success);
    color: #fff;
    border: none;
    border-radius: 2px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s;
  }

  .ru-go-login:hover { opacity: 0.88; transform: translateY(-1px); }

  /* password strength bar */
  .ru-strength {
    margin-top: 6px;
    height: 3px;
    background: var(--border);
    border-radius: 2px;
    overflow: hidden;
  }

  .ru-strength-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.3s, background 0.3s;
  }

  @media (max-width: 520px) {
    .ru-row { grid-template-columns: 1fr; }
    .ru-header, .ru-body { padding-left: 24px; padding-right: 24px; }
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
  if (pw.length < 6) return { width: "50%", color: "#c8823a" };
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
        <div className="ru-card">

          {/* Header */}
          <div className="ru-header">
            <span className="ru-tag">Lost &amp; Found Portal</span>
            <h1 className="ru-title">Create Your<br />Account</h1>
            <p className="ru-subtitle">Join the campus lost &amp; found network.</p>
          </div>

          {/* Body */}
          <div className="ru-body">
            {!flag ? (
              <form onSubmit={handleValidation} noValidate>

                {/* Row: Username + Full Name */}
                <div className="ru-row">
                  <div className="ru-field">
                    <label className="ru-label">Username <span className="req">*</span></label>
                    <div className="ru-input-wrap">
                      <svg className="ru-input-icon" {...ip}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
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
                      <svg className="ru-input-icon" {...ip}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
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
                    <svg className="ru-input-icon" {...ip}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
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
                    <svg className="ru-input-icon" {...ip}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
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
                      <svg className="ru-input-icon" {...ip}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      <input
                        className={`ru-input ${errors.password ? "has-error" : ""}`}
                        type={showPassword ? "text" : "password"}
                        name="password" value={lostFoundUser.password}
                        onChange={onChangeHandler} placeholder="5–10 characters"
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
                      <svg className="ru-input-icon" {...ip}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      <input
                        className={`ru-input ${errors.confirmPassword ? "has-error" : ""}`}
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                      />
                      <button type="button" className="ru-eye" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <EyeOff /> : <EyeOpen />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="ru-error">⚠ {errors.confirmPassword}</p>}
                  </div>
                </div>

                <div className="ru-divider" />

                <button type="submit" className="ru-submit" disabled={isLoading}>
                  {isLoading ? (
                    <><div className="ru-spinner" /> Creating Account…</>
                  ) : (
                    <>Create Account</>
                  )}
                </button>

                <div className="ru-footer">
                  <span>Already have an account?</span>
                  <button type="button" className="ru-signin-btn" onClick={() => navigate("/login")}>Sign In</button>
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
                  <button className="ru-go-login" onClick={() => navigate("/")}>
                    Go to Login →
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default RegisterUser;
