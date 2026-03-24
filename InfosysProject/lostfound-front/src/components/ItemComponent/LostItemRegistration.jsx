import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveLostItem } from "../../services/LostItemService";

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
    --success: #4a7c59;
    --error: #b54a4a;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── FIXED BACKGROUND ── */
  .lir-bg {
    position: fixed;
    inset: 0;
    background-image: url('https://img.freepik.com/free-photo/international-day-literacy-concept-with-learning-tools_1150-24440.jpg?semt=ais_user_personalization&w=740&q=80');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    filter: brightness(0.30) saturate(0.60);
    transform: scale(1.05);
    animation: bgZoom 22s ease-in-out infinite alternate;
    z-index: 0;
  }

  @keyframes bgZoom {
    from { transform: scale(1.05); }
    to   { transform: scale(1.12); }
  }

  .lir-overlay {
    position: fixed;
    inset: 0;
    background:
      linear-gradient(135deg,
        rgba(4,4,18,0.82) 0%,
        rgba(10,10,30,0.58) 50%,
        rgba(4,4,18,0.86) 100%
      ),
      radial-gradient(ellipse at 30% 40%, rgba(200,151,58,0.07) 0%, transparent 55%);
    z-index: 1;
  }

  .lir-noise {
    position: fixed;
    inset: 0;
    z-index: 2;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 180px 180px;
    pointer-events: none;
  }

  /* ── PAGE ── */
  .lir-page {
    position: relative;
    z-index: 10;
    min-height: 100vh;
    font-family: 'Outfit', sans-serif;
    display: flex;
    flex-direction: column;
  }

  /* ── HEADER ── */
  .lir-header {
    padding: 40px 56px 36px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    border-bottom: 1px solid var(--glass-border);
    backdrop-filter: blur(14px);
    background: rgba(4,4,16,0.42);
    position: relative;
    overflow: hidden;
    animation: headerIn 0.7s cubic-bezier(0.16,1,0.3,1) both;
  }

  @keyframes headerIn {
    from { opacity: 0; transform: translateY(-14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .lir-header-left { position: relative; z-index: 2; }

  .lir-eyebrow {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
  }

  .lir-eyebrow-line {
    width: 28px; height: 1px;
    background: var(--gold);
  }

  .lir-eyebrow-text {
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--gold-light);
  }

  .lir-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 44px;
    font-weight: 300;
    color: var(--white);
    line-height: 1.05;
    letter-spacing: -0.4px;
  }

  .lir-title em {
    font-style: italic;
    color: var(--gold-light);
  }

  .lir-subtitle {
    margin-top: 10px;
    font-size: 13px;
    color: rgba(255,255,255,0.75);
    font-weight: 300;
    letter-spacing: 0.03em;
  }

  .lir-back {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 10px 20px;
    background: var(--glass);
    border: 1px solid var(--glass-border);
    border-radius: 40px;
    backdrop-filter: blur(10px);
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.90);
    cursor: pointer;
    transition: all 0.22s;
    position: relative;
    z-index: 3;
    flex-shrink: 0;
  }

  .lir-back:hover {
    background: var(--glass-strong);
    border-color: rgba(200,151,58,0.4);
    color: var(--white);
  }

  .lir-back svg { width: 13px; height: 13px; }

  /* ── CONTAINER ── */
  .lir-container {
    max-width: 740px;
    margin: 48px auto;
    padding: 0 20px;
    width: 100%;
    animation: lirIn 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s both;
  }

  @keyframes lirIn {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── FORM CARD ── */
  .lir-form-card {
    background: rgba(6,6,22,0.72);
    border: 1px solid var(--glass-border);
    border-radius: 6px;
    backdrop-filter: blur(28px);
    box-shadow:
      0 32px 80px rgba(0,0,0,0.5),
      0 0 0 1px rgba(255,255,255,0.04) inset;
    overflow: hidden;
  }

  /* gold shimmer top */
  .lir-card-accent {
    height: 3px;
    background: linear-gradient(90deg, transparent, var(--gold), var(--gold-light), var(--gold), transparent);
    background-size: 200% 100%;
    animation: shimmer 3s linear infinite;
  }

  @keyframes shimmer {
    from { background-position: 200% 0; }
    to   { background-position: -200% 0; }
  }

  .lir-card-body {
    padding: 40px 44px 48px;
  }

  /* ── FORM GROUPS ── */
  .lir-form-group {
    margin-bottom: 26px;
    display: flex;
    flex-direction: column;
  }

  .lir-form-group:last-of-type { margin-bottom: 0; }

  .lir-label {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.80);
    margin-bottom: 9px;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .lir-label .required {
    color: #e07a7a;
    font-size: 14px;
    line-height: 1;
  }

  /* ── INPUTS ── */
  .lir-input,
  .lir-textarea,
  .lir-select {
    padding: 12px 16px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 2px;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    color: var(--white);
    transition: all 0.2s;
    outline: none;
    -webkit-appearance: none;
  }

  .lir-input:focus,
  .lir-textarea:focus,
  .lir-select:focus {
    border-color: var(--gold);
    background: rgba(255,255,255,0.09);
    box-shadow: 0 0 0 3px rgba(200,151,58,0.12);
  }

  .lir-input::placeholder,
  .lir-textarea::placeholder {
    color: rgba(255,255,255,0.28);
  }

  .lir-select {
    cursor: pointer;
  }

  .lir-select option {
    background: #0e0e22;
    color: var(--white);
  }

  .lir-textarea {
    resize: vertical;
    min-height: 100px;
    font-family: 'Outfit', sans-serif;
    line-height: 1.6;
  }

  /* ── FILE UPLOAD ── */
  .lir-file-wrap {
    position: relative;
  }

  .lir-file-input {
    width: 100%;
    padding: 12px 16px;
    background: rgba(255,255,255,0.06);
    border: 1px dashed rgba(200,151,58,0.35);
    border-radius: 2px;
    color: rgba(255,255,255,0.70);
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
    outline: none;
  }

  .lir-file-input:hover {
    border-color: var(--gold);
    background: rgba(200,151,58,0.05);
  }

  .lir-file-input::-webkit-file-upload-button {
    padding: 7px 14px;
    background: var(--gold-dim);
    color: var(--gold-light);
    border: 1px solid rgba(200,151,58,0.3);
    border-radius: 2px;
    cursor: pointer;
    font-weight: 500;
    font-size: 11px;
    letter-spacing: 0.08em;
    transition: all 0.2s;
    margin-right: 12px;
    font-family: 'Outfit', sans-serif;
  }

  .lir-file-input::-webkit-file-upload-button:hover {
    background: rgba(200,151,58,0.3);
    color: var(--white);
  }

  .lir-file-name {
    margin-top: 8px;
    font-size: 12px;
    color: #7ec89a;
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 400;
  }

  .lir-file-name svg { width: 13px; height: 13px; }

  /* ── ERRORS ── */
  .lir-error {
    color: #e07a7a;
    font-size: 12px;
    margin-top: 6px;
    display: flex;
    align-items: center;
    gap: 5px;
    font-weight: 400;
  }

  /* ── FORM ROW ── */
  .lir-form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  /* ── DIVIDER ── */
  .lir-divider {
    height: 1px;
    background: rgba(255,255,255,0.07);
    margin: 8px 0 26px;
  }

  /* ── BUTTON GROUP ── */
  .lir-button-group {
    display: flex;
    gap: 12px;
    margin-top: 36px;
  }

  .lir-btn {
    flex: 1;
    padding: 14px 24px;
    border: none;
    border-radius: 2px;
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .lir-btn::before {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
    transition: left 0.4s;
  }

  .lir-btn:hover::before { left: 100%; }

  .lir-btn-submit {
    background: var(--gold);
    color: #0a0808;
    flex: 2;
  }

  .lir-btn-submit:hover {
    background: var(--gold-light);
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(200,151,58,0.35);
  }

  .lir-btn-reset {
    background: var(--glass);
    color: rgba(255,255,255,0.85);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(8px);
  }

  .lir-btn-reset:hover {
    background: var(--glass-strong);
    border-color: rgba(200,151,58,0.3);
    color: var(--white);
    transform: translateY(-2px);
  }

  /* ── SUCCESS CARD ── */
  .lir-success-card {
    background: rgba(6,6,22,0.72);
    border: 1px solid var(--glass-border);
    border-radius: 6px;
    backdrop-filter: blur(28px);
    box-shadow: 0 32px 80px rgba(0,0,0,0.5);
    overflow: hidden;
    text-align: center;
    animation: successIn 0.55s cubic-bezier(0.16,1,0.3,1) both;
  }

  @keyframes successIn {
    from { opacity: 0; transform: scale(0.96) translateY(16px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  .lir-success-accent {
    height: 3px;
    background: linear-gradient(90deg, transparent, #4a7c59, #7ec89a, #4a7c59, transparent);
    background-size: 200% 100%;
    animation: shimmer 3s linear infinite;
  }

  .lir-success-body {
    padding: 52px 48px;
  }

  .lir-success-icon {
    width: 80px; height: 80px;
    background: rgba(74,124,89,0.15);
    border: 2px solid rgba(74,124,89,0.35);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 28px;
  }

  .lir-success-icon svg { width: 36px; height: 36px; color: #7ec89a; }

  .lir-success-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px;
    font-weight: 600;
    color: #7ec89a;
    margin-bottom: 14px;
    letter-spacing: 0.01em;
  }

  .lir-success-text {
    font-size: 14px;
    color: rgba(255,255,255,0.70);
    line-height: 1.7;
    margin-bottom: 36px;
    max-width: 420px;
    margin-left: auto;
    margin-right: auto;
    font-weight: 300;
  }

  .lir-success-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
  }

  .lir-btn-back {
    background: rgba(74,124,89,0.85);
    color: var(--white);
    flex: unset;
    padding: 13px 32px;
  }

  .lir-btn-back:hover {
    background: rgba(74,124,89,1);
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(74,124,89,0.35);
  }

  .lir-btn-another {
    background: var(--glass);
    color: rgba(255,255,255,0.90);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(8px);
    flex: unset;
    padding: 13px 32px;
  }

  .lir-btn-another:hover {
    background: var(--glass-strong);
    border-color: rgba(200,151,58,0.35);
    color: var(--white);
    transform: translateY(-2px);
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .lir-header { padding: 32px 32px 28px; }
    .lir-title { font-size: 34px; }
    .lir-card-body { padding: 32px 28px 40px; }
    .lir-form-row { grid-template-columns: 1fr; }
    .lir-container { margin: 36px auto; }
  }

  @media (max-width: 480px) {
    .lir-header { padding: 24px 20px; flex-direction: column; align-items: flex-start; gap: 16px; }
    .lir-title { font-size: 28px; }
    .lir-card-body { padding: 24px 20px 32px; }
    .lir-button-group { flex-direction: column; }
    .lir-btn-submit { flex: unset; }
    .lir-success-actions { flex-direction: column; align-items: center; }
    .lir-success-body { padding: 36px 24px; }
  }
`;

const LostItemRegistration = () => {
  const navigate = useNavigate();

  const [lostItem, setLostItem] = useState({
    itemName: "",
    brand: "",
    category: "",
    description: "",
    location: "",
    date: "",
    imageFile: null
  });

  const [errors, setErrors] = useState({});
  const [flag, setFlag] = useState(false);
  const [fileName, setFileName] = useState("");

  const onChangeHandler = (event) => {
    const name = event.target.name;
    if (name === "imageFile") {
      const file = event.target.files[0];
      setLostItem(values => ({ ...values, imageFile: file }));
      setFileName(file ? file.name : "");
    } else {
      setLostItem(values => ({ ...values, [name]: event.target.value }));
    }
  };

  const handleValidation = (event) => {
    event.preventDefault();
    let tempErrors = {};
    let isValid = true;

    if (!lostItem.itemName.trim()) { tempErrors.itemName = "Item name is required"; isValid = false; }
    if (!lostItem.brand.trim()) { tempErrors.brand = "Brand is required"; isValid = false; }
    if (!lostItem.location.trim()) { tempErrors.location = "Location is required"; isValid = false; }
    if (!lostItem.date.trim()) { tempErrors.date = "Date is required"; isValid = false; }
    if (!lostItem.imageFile) { tempErrors.imageFile = "Please upload an image"; isValid = false; }

    setErrors(tempErrors);
    if (isValid) { createLostItem(); }
  };

  const createLostItem = () => {
    saveLostItem(lostItem)
      .then(() => {
        setFlag(true);
        handleReset();
      })
      .catch(() => {
        alert("Error saving lost item");
      });
  };

  const handleReset = () => {
    setLostItem({ itemName: "", brand: "", category: "", description: "", location: "", date: "", imageFile: null });
    setFileName("");
    setErrors({});
  };

  const ip = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor" };

  return (
    <>
      <style>{styles}</style>

      {/* Background layers */}
      <div className="lir-bg" />
      <div className="lir-overlay" />
      <div className="lir-noise" />

      <div className="lir-page">

        {/* ── HEADER ── */}
        <div className="lir-header">
          <div className="lir-header-left">
            <div className="lir-eyebrow">
              <div className="lir-eyebrow-line" />
              <span className="lir-eyebrow-text">Lost Item Portal</span>
            </div>
            <h1 className="lir-title">Report <em>Lost</em> Item</h1>
            <p className="lir-subtitle">Help us reconnect you with your lost belongings.</p>
          </div>
          <button className="lir-back" type="button" onClick={() => navigate("/student-menu")}>
            <svg {...ip}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        {/* ── MAIN CONTAINER ── */}
        <div className="lir-container">
          {!flag ? (
            <div className="lir-form-card">
              <div className="lir-card-accent" />
              <div className="lir-card-body">
                <form onSubmit={handleValidation}>

                  {/* Item Name & Brand */}
                  <div className="lir-form-row">
                    <div className="lir-form-group">
                      <label className="lir-label">Item Name <span className="required">*</span></label>
                      <input type="text" className="lir-input" name="itemName"
                        placeholder="e.g., Laptop, Keys, Phone"
                        value={lostItem.itemName} onChange={onChangeHandler} />
                      {errors.itemName && (
                        <p className="lir-error">
                          <svg {...ip} style={{width:12,height:12}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {errors.itemName}
                        </p>
                      )}
                    </div>

                    <div className="lir-form-group">
                      <label className="lir-label">Brand <span className="required">*</span></label>
                      <input type="text" className="lir-input" name="brand"
                        placeholder="e.g., Apple, Samsung"
                        value={lostItem.brand} onChange={onChangeHandler} />
                      {errors.brand && (
                        <p className="lir-error">
                          <svg {...ip} style={{width:12,height:12}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {errors.brand}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Category & Date */}
                  <div className="lir-form-row">
                    <div className="lir-form-group">
                      <label className="lir-label">Category</label>
                      <select className="lir-select" name="category"
                        value={lostItem.category} onChange={onChangeHandler}>
                        <option value="">Select Category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Documents">Documents</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Books">Books</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="lir-form-group">
                      <label className="lir-label">Date <span className="required">*</span></label>
                      <input type="date" className="lir-input" name="date"
                        value={lostItem.date} onChange={onChangeHandler} />
                      {errors.date && (
                        <p className="lir-error">
                          <svg {...ip} style={{width:12,height:12}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {errors.date}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="lir-form-group">
                    <label className="lir-label">Location <span className="required">*</span></label>
                    <input type="text" className="lir-input" name="location"
                      placeholder="Where was the item lost?"
                      value={lostItem.location} onChange={onChangeHandler} />
                    {errors.location && (
                      <p className="lir-error">
                        <svg {...ip} style={{width:12,height:12}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {errors.location}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="lir-form-group">
                    <label className="lir-label">Description</label>
                    <textarea className="lir-textarea" name="description"
                      placeholder="Provide additional details (color, size, condition…)"
                      value={lostItem.description} onChange={onChangeHandler} />
                  </div>

                  <div className="lir-divider" />

                  {/* Image Upload */}
                  <div className="lir-form-group">
                    <label className="lir-label">Upload Image <span className="required">*</span></label>
                    <div className="lir-file-wrap">
                      <input type="file" className="lir-file-input" name="imageFile"
                        accept="image/*" onChange={onChangeHandler} />
                    </div>
                    {fileName && (
                      <p className="lir-file-name">
                        <svg {...ip}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                        {fileName}
                      </p>
                    )}
                    {errors.imageFile && (
                      <p className="lir-error">
                        <svg {...ip} style={{width:12,height:12}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {errors.imageFile}
                      </p>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="lir-button-group">
                    <button type="reset" className="lir-btn lir-btn-reset" onClick={handleReset}>
                      <svg {...ip} style={{width:14,height:14}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      Reset
                    </button>
                    <button type="submit" className="lir-btn lir-btn-submit">
                      <svg {...ip} style={{width:14,height:14}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Submit Report
                    </button>
                  </div>

                </form>
              </div>
            </div>
          ) : (
            /* ── SUCCESS STATE ── */
            <div className="lir-success-card">
              <div className="lir-success-accent" />
              <div className="lir-success-body">
                <div className="lir-success-icon">
                  <svg {...ip}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="lir-success-title">Item Registered Successfully!</h3>
                <p className="lir-success-text">
                  Your lost item has been posted to the portal. Our community will help you find it.
                  You'll be notified if anyone reports finding your item.
                </p>
                <div className="lir-success-actions">
                  <button className="lir-btn lir-btn-another" onClick={() => setFlag(false)}>
                    Submit Another
                  </button>
                  <button className="lir-btn lir-btn-back" onClick={() => navigate("/student-menu")}>
                    Back to Menu
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LostItemRegistration;
