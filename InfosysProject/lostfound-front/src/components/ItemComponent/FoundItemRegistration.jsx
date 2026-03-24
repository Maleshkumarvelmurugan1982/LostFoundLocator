import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveFoundItem } from "../../services/FoundItemService";

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
    --success-light: #7ec89a;
    --error: #b54a4a;
    --error-light: #e07a7a;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── FIXED BACKGROUND ── */
  .fir-bg {
    position: fixed;
    inset: 0;
    background-image: url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMNXDiUlAhA-gXDoiz0Ow5Z2qIIFlmMXM0JQ&s');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    filter: brightness(0.28) saturate(0.60);
    transform: scale(1.06);
    animation: bgZoom 22s ease-in-out infinite alternate;
    z-index: 0;
  }

  @keyframes bgZoom {
    from { transform: scale(1.06); }
    to   { transform: scale(1.13); }
  }

  .fir-overlay {
    position: fixed;
    inset: 0;
    background:
      linear-gradient(135deg,
        rgba(4,4,18,0.84) 0%,
        rgba(10,10,30,0.55) 50%,
        rgba(4,4,18,0.88) 100%
      ),
      radial-gradient(ellipse at 30% 40%, rgba(200,151,58,0.06) 0%, transparent 55%);
    z-index: 1;
  }

  .fir-noise {
    position: fixed;
    inset: 0;
    z-index: 2;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 180px 180px;
    pointer-events: none;
  }

  /* ── PAGE ── */
  .fir-page {
    position: relative;
    z-index: 10;
    min-height: 100vh;
    font-family: 'Outfit', sans-serif;
    display: flex;
    flex-direction: column;
  }

  /* ── HEADER ── */
  .fir-header {
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

  .fir-header-left { position: relative; z-index: 2; }

  .fir-eyebrow {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
  }

  .fir-eyebrow-line { width: 28px; height: 1px; background: var(--success-light); }

  .fir-eyebrow-text {
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--success-light);
  }

  .fir-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 44px;
    font-weight: 300;
    color: var(--white);
    line-height: 1.05;
    letter-spacing: -0.4px;
  }

  .fir-title em { font-style: italic; color: var(--success-light); }

  .fir-subtitle {
    margin-top: 10px;
    font-size: 13px;
    color: rgba(255,255,255,0.80);
    font-weight: 300;
    letter-spacing: 0.03em;
  }

  /* ── BACK BUTTON ── */
  .fir-back-btn {
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
    flex-shrink: 0;
    position: relative;
    z-index: 2;
  }

  .fir-back-btn:hover {
    background: var(--glass-strong);
    border-color: rgba(200,151,58,0.4);
    color: var(--white);
    transform: translateX(-3px);
  }

  .fir-back-btn svg { width: 13px; height: 13px; }

  /* ── CONTAINER ── */
  .fir-container {
    max-width: 740px;
    margin: 48px auto;
    padding: 0 20px;
    width: 100%;
    animation: firIn 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s both;
  }

  @keyframes firIn {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── FORM CARD ── */
  .fir-form-card {
    background: rgba(6,6,22,0.72);
    border: 1px solid var(--glass-border);
    border-radius: 6px;
    backdrop-filter: blur(28px);
    box-shadow:
      0 32px 80px rgba(0,0,0,0.5),
      0 0 0 1px rgba(255,255,255,0.04) inset;
    overflow: hidden;
  }

  /* green shimmer top — found items use green accent */
  .fir-card-accent {
    height: 3px;
    background: linear-gradient(90deg, transparent, var(--success), var(--success-light), var(--success), transparent);
    background-size: 200% 100%;
    animation: shimmer 3s linear infinite;
  }

  @keyframes shimmer {
    from { background-position: 200% 0; }
    to   { background-position: -200% 0; }
  }

  .fir-card-body {
    padding: 40px 44px 48px;
  }

  /* ── FORM GROUPS ── */
  .fir-form-group {
    margin-bottom: 26px;
    display: flex;
    flex-direction: column;
  }

  .fir-form-group:last-of-type { margin-bottom: 0; }

  .fir-label {
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

  .fir-label .required { color: var(--error-light); font-size: 14px; line-height: 1; }

  /* ── INPUTS ── */
  .fir-input,
  .fir-textarea,
  .fir-select {
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

  .fir-input:focus,
  .fir-textarea:focus,
  .fir-select:focus {
    border-color: var(--success-light);
    background: rgba(255,255,255,0.09);
    box-shadow: 0 0 0 3px rgba(74,124,89,0.18);
  }

  .fir-input::placeholder,
  .fir-textarea::placeholder { color: rgba(255,255,255,0.28); }

  .fir-select { cursor: pointer; }
  .fir-select option { background: #0e0e22; color: var(--white); }

  .fir-textarea {
    resize: vertical;
    min-height: 100px;
    font-family: 'Outfit', sans-serif;
    line-height: 1.6;
  }

  /* ── FILE UPLOAD ── */
  .fir-file-input {
    width: 100%;
    padding: 12px 16px;
    background: rgba(255,255,255,0.06);
    border: 1px dashed rgba(74,124,89,0.40);
    border-radius: 2px;
    color: rgba(255,255,255,0.70);
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
    outline: none;
  }

  .fir-file-input:hover {
    border-color: var(--success-light);
    background: rgba(74,124,89,0.06);
  }

  .fir-file-input::-webkit-file-upload-button {
    padding: 7px 14px;
    background: rgba(74,124,89,0.18);
    color: var(--success-light);
    border: 1px solid rgba(74,124,89,0.35);
    border-radius: 2px;
    cursor: pointer;
    font-weight: 500;
    font-size: 11px;
    letter-spacing: 0.08em;
    transition: all 0.2s;
    margin-right: 12px;
    font-family: 'Outfit', sans-serif;
  }

  .fir-file-input::-webkit-file-upload-button:hover {
    background: rgba(74,124,89,0.35);
    color: var(--white);
  }

  .fir-file-name {
    margin-top: 8px;
    font-size: 12px;
    color: var(--success-light);
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 400;
  }

  .fir-file-name svg { width: 13px; height: 13px; }

  /* ── ERRORS ── */
  .fir-error {
    color: var(--error-light);
    font-size: 12px;
    margin-top: 6px;
    display: flex;
    align-items: center;
    gap: 5px;
    font-weight: 400;
  }

  /* ── FORM ROW ── */
  .fir-form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  /* ── DIVIDER ── */
  .fir-divider {
    height: 1px;
    background: rgba(255,255,255,0.07);
    margin: 8px 0 26px;
  }

  /* ── BUTTON GROUP ── */
  .fir-button-group {
    display: flex;
    gap: 12px;
    margin-top: 36px;
  }

  .fir-btn {
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

  .fir-btn::before {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
    transition: left 0.4s;
  }

  .fir-btn:hover::before { left: 100%; }

  .fir-btn-submit {
    background: rgba(74,124,89,0.85);
    color: var(--white);
    flex: 2;
    border: 1px solid rgba(74,124,89,0.5);
  }

  .fir-btn-submit:hover {
    background: rgba(74,124,89,1);
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(74,124,89,0.40);
  }

  .fir-btn-reset {
    background: var(--glass);
    color: rgba(255,255,255,0.85);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(8px);
  }

  .fir-btn-reset:hover {
    background: var(--glass-strong);
    border-color: rgba(200,151,58,0.3);
    color: var(--white);
    transform: translateY(-2px);
  }

  /* ── SUCCESS CARD ── */
  .fir-success-card {
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

  .fir-success-accent {
    height: 3px;
    background: linear-gradient(90deg, transparent, var(--success), var(--success-light), var(--success), transparent);
    background-size: 200% 100%;
    animation: shimmer 3s linear infinite;
  }

  .fir-success-body { padding: 52px 48px; }

  .fir-success-icon {
    width: 80px; height: 80px;
    background: rgba(74,124,89,0.15);
    border: 2px solid rgba(74,124,89,0.35);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 28px;
  }

  .fir-success-icon svg { width: 36px; height: 36px; color: var(--success-light); }

  .fir-success-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px;
    font-weight: 600;
    color: var(--success-light);
    margin-bottom: 14px;
    letter-spacing: 0.01em;
  }

  .fir-success-text {
    font-size: 14px;
    color: rgba(255,255,255,0.70);
    line-height: 1.7;
    margin-bottom: 36px;
    max-width: 420px;
    margin-left: auto;
    margin-right: auto;
    font-weight: 300;
  }

  .fir-success-actions { display: flex; gap: 12px; justify-content: center; }

  .fir-btn-back-success {
    background: rgba(74,124,89,0.85);
    color: var(--white);
    border: 1px solid rgba(74,124,89,0.5);
    flex: unset;
    padding: 13px 36px;
  }

  .fir-btn-back-success:hover {
    background: rgba(74,124,89,1);
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(74,124,89,0.40);
  }

  .fir-btn-another {
    background: var(--glass);
    color: rgba(255,255,255,0.90);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(8px);
    flex: unset;
    padding: 13px 32px;
  }

  .fir-btn-another:hover {
    background: var(--glass-strong);
    border-color: rgba(200,151,58,0.35);
    color: var(--white);
    transform: translateY(-2px);
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .fir-header { padding: 32px 32px 28px; }
    .fir-title { font-size: 34px; }
    .fir-card-body { padding: 32px 28px 40px; }
    .fir-form-row { grid-template-columns: 1fr; }
    .fir-container { margin: 36px auto; }
  }

  @media (max-width: 480px) {
    .fir-header { padding: 24px 20px; flex-direction: column; align-items: flex-start; gap: 16px; }
    .fir-title { font-size: 28px; }
    .fir-card-body { padding: 24px 20px 32px; }
    .fir-button-group { flex-direction: column; }
    .fir-btn-submit { flex: unset; }
    .fir-success-actions { flex-direction: column; align-items: center; }
    .fir-success-body { padding: 36px 24px; }
  }
`;

const FoundItemRegistration = () => {
  const navigate = useNavigate();

  const [foundItem, setFoundItem] = useState({
    itemName: "",
    brand: "",
    category: "",
    description: "",
    location: "",
    date: "",
    imageFile: null
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [fileName, setFileName] = useState("");

  const onChangeHandler = (event) => {
    const name = event.target.name;
    if (name === "imageFile") {
      const file = event.target.files[0];
      setFoundItem(values => ({ ...values, imageFile: file }));
      setFileName(file ? file.name : "");
    } else {
      setFoundItem(values => ({ ...values, [name]: event.target.value }));
    }
  };

  const handleValidation = (event) => {
    event.preventDefault();
    let tempErrors = {};
    let isValid = true;

    if (!foundItem.itemName.trim()) { tempErrors.itemName = "Item name is required"; isValid = false; }
    if (!foundItem.brand.trim()) { tempErrors.brand = "Brand is required"; isValid = false; }
    if (!foundItem.location.trim()) { tempErrors.location = "Location is required"; isValid = false; }
    if (!foundItem.date.trim()) { tempErrors.date = "Date is required"; isValid = false; }
    if (!foundItem.imageFile) { tempErrors.imageFile = "Please upload an image"; isValid = false; }

    setErrors(tempErrors);
    if (isValid) { createFoundItem(); }
  };

  const createFoundItem = () => {
    saveFoundItem(foundItem)
      .then(() => {
        setSuccess(true);
        handleReset();
      })
      .catch(() => alert("Error saving found item"));
  };

  const handleReset = () => {
    setFoundItem({ itemName: "", brand: "", category: "", description: "", location: "", date: "", imageFile: null });
    setFileName("");
    setErrors({});
  };

  const ip = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor" };

  return (
    <>
      <style>{styles}</style>

      {/* Background layers */}
      <div className="fir-bg" />
      <div className="fir-overlay" />
      <div className="fir-noise" />

      <div className="fir-page">

        {/* ── HEADER ── */}
        <div className="fir-header">
          <div className="fir-header-left">
            <div className="fir-eyebrow">
              <div className="fir-eyebrow-line" />
              <span className="fir-eyebrow-text">Found Item Portal</span>
            </div>
            <h1 className="fir-title">Report <em>Found</em> Item</h1>
            <p className="fir-subtitle">Help someone find what they've lost. Report it here.</p>
          </div>
          <button className="fir-back-btn" type="button" onClick={() => navigate("/student-menu")}>
            <svg {...ip}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        {/* ── MAIN CONTAINER ── */}
        <div className="fir-container">
          {!success ? (
            <div className="fir-form-card">
              <div className="fir-card-accent" />
              <div className="fir-card-body">
                <form onSubmit={handleValidation}>

                  {/* Item Name & Brand */}
                  <div className="fir-form-row">
                    <div className="fir-form-group">
                      <label className="fir-label">Item Name <span className="required">*</span></label>
                      <input type="text" className="fir-input" name="itemName"
                        placeholder="e.g., Laptop, Keys, Phone"
                        value={foundItem.itemName} onChange={onChangeHandler} />
                      {errors.itemName && (
                        <p className="fir-error">
                          <svg {...ip} style={{width:12,height:12}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {errors.itemName}
                        </p>
                      )}
                    </div>

                    <div className="fir-form-group">
                      <label className="fir-label">Brand <span className="required">*</span></label>
                      <input type="text" className="fir-input" name="brand"
                        placeholder="e.g., Apple, Samsung, Dell"
                        value={foundItem.brand} onChange={onChangeHandler} />
                      {errors.brand && (
                        <p className="fir-error">
                          <svg {...ip} style={{width:12,height:12}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {errors.brand}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Category & Date */}
                  <div className="fir-form-row">
                    <div className="fir-form-group">
                      <label className="fir-label">Category</label>
                      <select className="fir-select" name="category"
                        value={foundItem.category} onChange={onChangeHandler}>
                        <option value="">Select Category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Documents">Documents</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Books">Books</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="fir-form-group">
                      <label className="fir-label">Date Found <span className="required">*</span></label>
                      <input type="date" className="fir-input" name="date"
                        value={foundItem.date} onChange={onChangeHandler} />
                      {errors.date && (
                        <p className="fir-error">
                          <svg {...ip} style={{width:12,height:12}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {errors.date}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="fir-form-group">
                    <label className="fir-label">Location <span className="required">*</span></label>
                    <input type="text" className="fir-input" name="location"
                      placeholder="Where did you find the item?"
                      value={foundItem.location} onChange={onChangeHandler} />
                    {errors.location && (
                      <p className="fir-error">
                        <svg {...ip} style={{width:12,height:12}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {errors.location}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="fir-form-group">
                    <label className="fir-label">Description</label>
                    <textarea className="fir-textarea" name="description"
                      placeholder="Provide details about the item (color, condition, any markings…)"
                      value={foundItem.description} onChange={onChangeHandler} />
                  </div>

                  <div className="fir-divider" />

                  {/* Image Upload */}
                  <div className="fir-form-group">
                    <label className="fir-label">Upload Image <span className="required">*</span></label>
                    <input type="file" className="fir-file-input" name="imageFile"
                      accept="image/*" onChange={onChangeHandler} />
                    {fileName && (
                      <p className="fir-file-name">
                        <svg {...ip}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                        {fileName}
                      </p>
                    )}
                    {errors.imageFile && (
                      <p className="fir-error">
                        <svg {...ip} style={{width:12,height:12}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {errors.imageFile}
                      </p>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="fir-button-group">
                    <button type="reset" className="fir-btn fir-btn-reset" onClick={handleReset}>
                      <svg {...ip} style={{width:14,height:14}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      Reset
                    </button>
                    <button type="submit" className="fir-btn fir-btn-submit">
                      <svg {...ip} style={{width:14,height:14}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Submit Report
                    </button>
                  </div>

                </form>
              </div>
            </div>
          ) : (
            /* ── SUCCESS STATE ── */
            <div className="fir-success-card">
              <div className="fir-success-accent" />
              <div className="fir-success-body">
                <div className="fir-success-icon">
                  <svg {...ip}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="fir-success-title">Found Item Registered!</h3>
                <p className="fir-success-text">
                  Thank you for helping the community! Your found item has been posted to the portal.
                  The owner will be notified and can contact you if they claim it.
                </p>
                <div className="fir-success-actions">
                  <button className="fir-btn fir-btn-another" onClick={() => setSuccess(false)}>
                    Submit Another
                  </button>
                  <button className="fir-btn fir-btn-back-success" onClick={() => navigate("/student-menu")}>
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

export default FoundItemRegistration;
