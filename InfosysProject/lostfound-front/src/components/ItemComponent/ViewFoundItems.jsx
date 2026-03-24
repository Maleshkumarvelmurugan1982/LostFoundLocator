import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllFoundItems, deleteFoundItem } from "../../services/FoundItemService";
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
    --success: #4a7c59;
    --success-light: #7ec89a;
    --error: #b54a4a;
    --error-light: #e07a7a;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .vfi-bg {
    position: fixed;
    inset: 0;
    background-image: url('https://img.freepik.com/free-photo/international-day-literacy-concept-with-learning-tools_1150-24440.jpg?semt=ais_user_personalization&w=740&q=80');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    filter: brightness(0.28) saturate(0.55);
    transform: scale(1.05);
    animation: bgZoom 22s ease-in-out infinite alternate;
    z-index: 0;
  }

  @keyframes bgZoom {
    from { transform: scale(1.05); }
    to   { transform: scale(1.12); }
  }

  .vfi-overlay {
    position: fixed;
    inset: 0;
    background:
      linear-gradient(135deg,
        rgba(4,4,18,0.82) 0%,
        rgba(10,10,30,0.55) 50%,
        rgba(4,4,18,0.86) 100%
      ),
      radial-gradient(ellipse at 30% 40%, rgba(200,151,58,0.06) 0%, transparent 55%);
    z-index: 1;
  }

  .vfi-noise {
    position: fixed;
    inset: 0;
    z-index: 2;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 180px 180px;
    pointer-events: none;
  }

  .vfi-page {
    position: relative;
    z-index: 10;
    min-height: 100vh;
    font-family: 'Outfit', sans-serif;
    display: flex;
    flex-direction: column;
  }

  .vfi-header {
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

  .vfi-header-left { position: relative; z-index: 2; }

  .vfi-eyebrow {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
  }

  .vfi-eyebrow-line { width: 28px; height: 1px; background: var(--gold); }

  .vfi-eyebrow-text {
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--gold-light);
  }

  .vfi-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 44px;
    font-weight: 300;
    color: var(--white);
    line-height: 1.05;
    letter-spacing: -0.4px;
  }

  .vfi-title em { font-style: italic; color: var(--gold-light); }

  .vfi-subtitle {
    margin-top: 10px;
    font-size: 13px;
    color: rgba(255,255,255,0.80);
    font-weight: 300;
    letter-spacing: 0.03em;
  }

  .vfi-user-badge {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--glass);
    border: 1px solid var(--glass-border);
    border-radius: 40px;
    padding: 10px 20px 10px 12px;
    backdrop-filter: blur(12px);
    flex-shrink: 0;
  }

  .vfi-user-avatar {
    width: 38px; height: 38px;
    background: linear-gradient(135deg, var(--success) 0%, var(--success-light) 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    font-weight: 700;
    color: white;
    font-family: 'Cormorant Garamond', serif;
    flex-shrink: 0;
  }

  .vfi-user-label {
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.55);
  }

  .vfi-user-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--white);
    margin-top: 1px;
  }

  .vfi-content {
    max-width: 1300px;
    margin: 0 auto;
    padding: 48px 56px 72px;
    width: 100%;
    animation: contentIn 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s both;
  }

  @keyframes contentIn {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .vfi-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
    gap: 14px;
    flex-wrap: wrap;
  }

  .vfi-back-btn {
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
  }

  .vfi-back-btn:hover {
    background: var(--glass-strong);
    border-color: rgba(200,151,58,0.4);
    color: var(--white);
    transform: translateX(-3px);
  }

  .vfi-back-btn svg { width: 13px; height: 13px; }

  .vfi-search-wrap {
    position: relative;
    flex: 1;
    min-width: 220px;
    max-width: 400px;
  }

  .vfi-search-icon {
    position: absolute;
    left: 14px; top: 50%;
    transform: translateY(-50%);
    width: 15px; height: 15px;
    color: rgba(255,255,255,0.40);
    pointer-events: none;
  }

  .vfi-search-input {
    width: 100%;
    padding: 11px 16px 11px 40px;
    background: var(--glass);
    border: 1px solid var(--glass-border);
    border-radius: 40px;
    backdrop-filter: blur(12px);
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    color: var(--white);
    transition: all 0.2s;
    outline: none;
  }

  .vfi-search-input:focus {
    border-color: var(--gold);
    background: var(--glass-strong);
    box-shadow: 0 0 0 3px rgba(200,151,58,0.12);
  }

  .vfi-search-input::placeholder { color: rgba(255,255,255,0.30); }

  .vfi-count-text {
    font-size: 12px;
    color: rgba(255,255,255,0.65);
    font-weight: 400;
    white-space: nowrap;
  }

  .vfi-count-text strong { color: var(--gold-light); font-weight: 600; }

  .vfi-stats-row {
    display: flex;
    gap: 14px;
    margin-bottom: 28px;
    flex-wrap: wrap;
  }

  .vfi-stat-card {
    background: rgba(6,6,22,0.65);
    border: 1px solid var(--glass-border);
    border-radius: 10px;
    padding: 18px 24px;
    display: flex;
    align-items: center;
    gap: 14px;
    backdrop-filter: blur(16px);
    min-width: 160px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.25);
  }

  .vfi-stat-icon {
    width: 42px; height: 42px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }

  .vfi-stat-icon-total   { background: rgba(200,151,58,0.15); }
  .vfi-stat-icon-found   { background: rgba(74,124,89,0.15); }
  .vfi-stat-icon-claimed { background: rgba(181,74,74,0.15); }

  .vfi-stat-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px;
    font-weight: 700;
    color: var(--white);
    line-height: 1;
  }

  .vfi-stat-label {
    font-size: 10px;
    font-weight: 500;
    color: rgba(255,255,255,0.65);
    text-transform: uppercase;
    letter-spacing: 0.10em;
    margin-top: 3px;
  }

  .vfi-table-wrapper {
    background: rgba(6,6,22,0.72);
    border: 1px solid var(--glass-border);
    border-radius: 10px;
    overflow: hidden;
    backdrop-filter: blur(24px);
    box-shadow: 0 16px 48px rgba(0,0,0,0.4);
  }

  .vfi-table-accent {
    height: 3px;
    background: linear-gradient(90deg, transparent, var(--gold), var(--gold-light), var(--gold), transparent);
    background-size: 200% 100%;
    animation: shimmer 3s linear infinite;
  }

  @keyframes shimmer {
    from { background-position: 200% 0; }
    to   { background-position: -200% 0; }
  }

  .vfi-table-scroll { overflow-x: auto; }

  .vfi-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }

  .vfi-table thead {
    background: rgba(255,255,255,0.04);
    border-bottom: 1px solid rgba(200,151,58,0.25);
  }

  .vfi-table th {
    padding: 16px 14px;
    text-align: left;
    font-weight: 600;
    color: var(--gold-light);
    letter-spacing: 0.10em;
    font-size: 10px;
    text-transform: uppercase;
    white-space: nowrap;
    font-family: 'Outfit', sans-serif;
  }

  .vfi-table tbody tr {
    border-bottom: 1px solid rgba(255,255,255,0.06);
    transition: background 0.15s;
  }

  .vfi-table tbody tr:hover { background: rgba(200,151,58,0.04); }
  .vfi-table tbody tr:last-child { border-bottom: none; }

  .vfi-table td {
    padding: 16px 14px;
    color: rgba(255,255,255,0.92);
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    vertical-align: middle;
  }

  .vfi-table-img {
    width: 68px; height: 68px;
    border-radius: 8px;
    object-fit: cover;
    border: 1px solid var(--glass-border);
    transition: transform 0.2s, box-shadow 0.2s;
    display: block;
  }

  .vfi-table-img:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0,0,0,0.4);
  }

  .vfi-table-img-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 68px; height: 68px;
    background: rgba(255,255,255,0.05);
    border: 1px dashed rgba(255,255,255,0.15);
    border-radius: 8px;
    color: rgba(255,255,255,0.30);
    font-size: 10px;
  }

  .vfi-item-name { font-weight: 600; color: var(--white); font-size: 13.5px; }
  .vfi-item-brand { font-size: 11.5px; color: rgba(255,255,255,0.50); margin-top: 3px; }

  .vfi-posted-by {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 500;
    color: rgba(255,255,255,0.92);
  }

  .vfi-posted-avatar {
    width: 28px; height: 28px;
    background: linear-gradient(135deg, var(--success) 0%, var(--success-light) 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    color: white;
    font-family: 'Cormorant Garamond', serif;
    flex-shrink: 0;
  }

  /* ── STATUS TEXT (plain colored text, no badge) ── */
  .vfi-status-available {
    font-size: 13px;
    font-weight: 600;
    color: var(--success-light);
    font-family: 'Outfit', sans-serif;
  }

  .vfi-status-claimed {
    font-size: 13px;
    font-weight: 600;
    color: var(--error-light);
    font-family: 'Outfit', sans-serif;
  }

  .vfi-btn-delete {
    padding: 8px 16px;
    background: rgba(181,74,74,0.12);
    color: var(--error-light);
    border: 1px solid rgba(181,74,74,0.28);
    border-radius: 20px;
    cursor: pointer;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    transition: all 0.2s;
    font-family: 'Outfit', sans-serif;
    white-space: nowrap;
  }

  .vfi-btn-delete:hover {
    background: var(--error);
    color: white;
    border-color: var(--error);
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(181,74,74,0.35);
  }

  .vfi-state {
    background: rgba(6,6,22,0.72);
    border: 1px solid var(--glass-border);
    border-radius: 10px;
    padding: 72px 40px;
    text-align: center;
    backdrop-filter: blur(20px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  }

  .vfi-state-icon {
    width: 72px; height: 72px;
    background: var(--gold-dim);
    border: 1px solid rgba(200,151,58,0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
    font-size: 30px;
  }

  .vfi-state-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px;
    font-weight: 600;
    color: var(--white);
    margin-bottom: 10px;
  }

  .vfi-state-text {
    font-size: 13px;
    color: rgba(255,255,255,0.65);
    line-height: 1.7;
    max-width: 380px;
    margin: 0 auto;
    font-weight: 300;
  }

  .vfi-spinner-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    padding: 72px 40px;
  }

  .vfi-spinner {
    width: 32px; height: 32px;
    border: 2px solid rgba(255,255,255,0.10);
    border-top-color: var(--gold);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .vfi-spinner-text {
    font-size: 11px;
    color: rgba(255,255,255,0.50);
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  @media (max-width: 1024px) {
    .vfi-header { padding: 32px 32px 28px; }
    .vfi-content { padding: 36px 32px 56px; }
    .vfi-title { font-size: 36px; }
  }

  @media (max-width: 768px) {
    .vfi-header { padding: 24px 20px; flex-direction: column; align-items: flex-start; gap: 16px; }
    .vfi-content { padding: 24px 16px 48px; }
    .vfi-title { font-size: 30px; }
    .vfi-topbar { flex-direction: column; align-items: flex-start; }
    .vfi-search-wrap { max-width: 100%; width: 100%; }
    .vfi-table th, .vfi-table td { padding: 12px 10px; }
    .vfi-table-img, .vfi-table-img-placeholder { width: 52px; height: 52px; }
  }

  @media (max-width: 480px) {
    .vfi-header { padding: 18px 16px; }
    .vfi-content { padding: 18px 12px 40px; }
    .vfi-title { font-size: 26px; }
  }
`;

const ViewFoundItems = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:9595/lostfound/user", { withCredentials: true })
      .then((res) => {
        const username = String(res.data || "").trim();
        setCurrentUser(username);
        loadItems(username);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    filterItems(searchTerm);
  }, [items, searchTerm]);

  const loadItems = (username) => {
    getAllFoundItems()
      .then((response) => {
        const allItems = response.data || [];
        const myItems = allItems.filter(
          (item) =>
            String(item.postedBy || "")
              .trim()
              .toLowerCase() === username.toLowerCase()
        );
        setItems(myItems);
        setLoading(false);
      })
      .catch(() => {
        setItems([]);
        setLoading(false);
      });
  };

  const filterItems = (term) => {
    if (!term.trim()) {
      setFilteredItems(items);
    } else {
      const t = term.toLowerCase();
      setFilteredItems(
        items.filter(
          (item) =>
            item.itemName?.toLowerCase().includes(t) ||
            item.brand?.toLowerCase().includes(t) ||
            item.category?.toLowerCase().includes(t) ||
            item.location?.toLowerCase().includes(t) ||
            item.description?.toLowerCase().includes(t) ||
            String(item.postedBy || "").toLowerCase().includes(t)
        )
      );
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteFoundItem(id)
        .then(() => loadItems(currentUser))
        .catch(() => alert("Error deleting item"));
    }
  };

  const totalCount   = items.length;
  const foundCount   = items.filter((i) => i.status === 1 || i.status === true).length;
  const claimedCount = items.filter((i) => i.status === 0 || i.status === false).length;

  const ip = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor" };

  const getInitial = (val) => {
    const s = String(val || "").trim();
    return s.length > 0 ? s.charAt(0).toUpperCase() : "?";
  };

  const getPostedBy = (val) => {
    const s = String(val || "").trim();
    return s.length > 0 ? s : "Unknown";
  };

  return (
    <>
      <style>{styles}</style>

      <div className="vfi-bg" />
      <div className="vfi-overlay" />
      <div className="vfi-noise" />

      <div className="vfi-page">

        {/* ── HEADER ── */}
        <div className="vfi-header">
          <div className="vfi-header-left">
            <div className="vfi-eyebrow">
              <div className="vfi-eyebrow-line" />
              <span className="vfi-eyebrow-text">Found Items Portal</span>
            </div>
            <h1 className="vfi-title">My <em>Found</em> Items</h1>
            <p className="vfi-subtitle">Items you've reported as found — helping reunite owners.</p>
          </div>

          {currentUser && (
            <div className="vfi-user-badge">
              <div className="vfi-user-avatar">{getInitial(currentUser)}</div>
              <div>
                <div className="vfi-user-label">Logged in as</div>
                <div className="vfi-user-name">{currentUser}</div>
              </div>
            </div>
          )}
        </div>

        {/* ── CONTENT ── */}
        <div className="vfi-content">

          {/* Topbar */}
          <div className="vfi-topbar">
            <button className="vfi-back-btn" onClick={() => navigate("/student-menu")}>
              <svg {...ip}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            {!loading && items.length > 0 && (
              <div className="vfi-search-wrap">
                <svg className="vfi-search-icon" {...ip}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  className="vfi-search-input"
                  placeholder="Search by name, brand, location…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}

            {!loading && items.length > 0 && (
              <span className="vfi-count-text">
                Showing <strong>{filteredItems.length}</strong> of <strong>{totalCount}</strong> items
              </span>
            )}
          </div>

          {/* Stats */}
          {!loading && items.length > 0 && (
            <div className="vfi-stats-row">
              <div className="vfi-stat-card">
                <div className="vfi-stat-icon vfi-stat-icon-total">📋</div>
                <div>
                  <div className="vfi-stat-value">{totalCount}</div>
                  <div className="vfi-stat-label">Total Reported</div>
                </div>
              </div>
              <div className="vfi-stat-card">
                <div className="vfi-stat-icon vfi-stat-icon-found">🟢</div>
                <div>
                  <div className="vfi-stat-value">{foundCount}</div>
                  <div className="vfi-stat-label">Available</div>
                </div>
              </div>
              <div className="vfi-stat-card">
                <div className="vfi-stat-icon vfi-stat-icon-claimed">✅</div>
                <div>
                  <div className="vfi-stat-value">{claimedCount}</div>
                  <div className="vfi-stat-label">Claimed</div>
                </div>
              </div>
            </div>
          )}

          {/* Content area */}
          {loading ? (
            <div className="vfi-state">
              <div className="vfi-spinner-wrap">
                <div className="vfi-spinner" />
                <span className="vfi-spinner-text">Loading your items…</span>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="vfi-state">
              <div className="vfi-state-icon">📭</div>
              <div className="vfi-state-title">No Items Reported Yet</div>
              <div className="vfi-state-text">
                You haven't reported any found items yet. Use "Submit Found Item" from the menu to get started.
              </div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="vfi-state">
              <div className="vfi-state-icon">🔎</div>
              <div className="vfi-state-title">No Matching Results</div>
              <div className="vfi-state-text">
                No items match "<strong>{searchTerm}</strong>". Try a different keyword.
              </div>
            </div>
          ) : (
            <div className="vfi-table-wrapper">
              <div className="vfi-table-accent" />
              <div className="vfi-table-scroll">
                <table className="vfi-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Image</th>
                      <th>Item Details</th>
                      <th>Category</th>
                      <th>Location</th>
                      <th>Date Found</th>
                      <th>Status</th>
                      <th>Posted By</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr key={item.id}>

                        {/* ID */}
                        <td style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"16px",fontWeight:700,color:"var(--gold-light)"}}>{item.id}</td>

                        {/* Image */}
                        <td>
                          {item.imagePath ? (
                            <img
                              src={`http://localhost:9595/lostfound/uploads/${item.imagePath}`}
                              alt={item.itemName}
                              className="vfi-table-img"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/68?text=No+Img";
                              }}
                            />
                          ) : (
                            <div className="vfi-table-img-placeholder">No Image</div>
                          )}
                        </td>

                        {/* Item Details */}
                        <td>
                          <div className="vfi-item-name">{item.itemName || "N/A"}</div>
                          <div className="vfi-item-brand">{item.brand || ""}</div>
                        </td>

                        {/* Category */}
                        <td>{item.category || "N/A"}</td>

                        {/* Location */}
                        <td>{item.location || "N/A"}</td>

                        {/* Date */}
                        <td>{item.date || "N/A"}</td>

                        {/* ── STATUS — plain colored text like the image ── */}
                        <td>
                          <span className={
                            item.status === 1 || item.status === true
                              ? "vfi-status-available"
                              : "vfi-status-claimed"
                          }>
                            {item.status === 1 || item.status === true ? "Returned" : "Not Returned"}
                          </span>
                        </td>

                        {/* Posted By */}
                        <td>
                          <div className="vfi-posted-by">
                            <div className="vfi-posted-avatar">
                              {getInitial(item.postedBy)}
                            </div>
                            {getPostedBy(item.postedBy)}
                          </div>
                        </td>

                        {/* Action */}
                        <td>
                          <button
                            className="vfi-btn-delete"
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </button>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewFoundItems;
