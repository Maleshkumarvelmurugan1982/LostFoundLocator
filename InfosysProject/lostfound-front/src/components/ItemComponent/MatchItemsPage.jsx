import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE = "http://localhost:9595/lostfound";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Outfit:wght@200;300;400;500;600&display=swap');

  :root {
    --gold: #c8973a;
    --gold-light: #e8c06a;
    --gold-dim: rgba(200,151,58,0.18);
    --white: #ffffff;
    --glass: rgba(255,255,255,0.07);
    --glass-strong: rgba(255,255,255,0.12);
    --glass-border: rgba(255,255,255,0.15);
    --success: #4a7c59;
    --success-light: #7ec89a;
    --error: #b54a4a;
    --error-light: #e07a7a;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .mi-bg {
    position: fixed; inset: 0;
    background-image: url('https://img.freepik.com/free-photo/international-day-literacy-concept-with-learning-tools_1150-24440.jpg?semt=ais_user_personalization&w=740&q=80');
    background-size: cover; background-position: center;
    filter: brightness(0.28) saturate(0.55);
    transform: scale(1.05);
    animation: bgZoom 22s ease-in-out infinite alternate;
    z-index: 0;
  }
  @keyframes bgZoom { from { transform: scale(1.05); } to { transform: scale(1.12); } }

  .mi-overlay {
    position: fixed; inset: 0;
    background: linear-gradient(135deg, rgba(4,4,18,0.82) 0%, rgba(10,10,30,0.55) 50%, rgba(4,4,18,0.86) 100%);
    z-index: 1;
  }

  .mi-page {
    position: relative; z-index: 10;
    min-height: 100vh;
    font-family: 'Outfit', sans-serif;
    display: flex; flex-direction: column;
  }

  .mi-header {
    padding: 40px 56px 36px;
    display: flex; align-items: flex-end; justify-content: space-between;
    border-bottom: 1px solid var(--glass-border);
    backdrop-filter: blur(14px);
    background: rgba(4,4,16,0.42);
    animation: headerIn 0.7s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes headerIn { from { opacity:0; transform:translateY(-14px); } to { opacity:1; transform:translateY(0); } }

  .mi-eyebrow { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
  .mi-eyebrow-line { width: 28px; height: 1px; background: var(--gold); }
  .mi-eyebrow-text { font-size: 9px; font-weight: 500; letter-spacing: 0.25em; text-transform: uppercase; color: var(--gold-light); }

  .mi-title { font-family: 'Cormorant Garamond', serif; font-size: 44px; font-weight: 300; color: var(--white); line-height: 1.05; }
  .mi-title em { font-style: italic; color: var(--gold-light); }
  .mi-subtitle { margin-top: 10px; font-size: 13px; color: rgba(255,255,255,0.80); font-weight: 300; }

  .mi-content {
    max-width: 1300px; margin: 0 auto;
    padding: 48px 56px 72px; width: 100%;
    animation: contentIn 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s both;
  }
  @keyframes contentIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

  .mi-topbar {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 28px; gap: 14px; flex-wrap: wrap;
  }

  .mi-back-btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 10px 20px;
    background: var(--glass); border: 1px solid var(--glass-border);
    border-radius: 40px; backdrop-filter: blur(10px);
    font-family: 'Outfit', sans-serif; font-size: 11px; font-weight: 500;
    letter-spacing: 0.10em; text-transform: uppercase;
    color: rgba(255,255,255,0.90); cursor: pointer; transition: all 0.22s;
  }
  .mi-back-btn:hover { background: var(--glass-strong); border-color: rgba(200,151,58,0.4); transform: translateX(-3px); }
  .mi-back-btn svg { width: 13px; height: 13px; }

  .mi-count-text { font-size: 12px; color: rgba(255,255,255,0.65); white-space: nowrap; }
  .mi-count-text strong { color: var(--gold-light); font-weight: 600; }

  .mi-table-wrapper {
    background: rgba(6,6,22,0.72); border: 1px solid var(--glass-border);
    border-radius: 10px; overflow: hidden;
    backdrop-filter: blur(24px); box-shadow: 0 16px 48px rgba(0,0,0,0.4);
  }

  .mi-table-accent {
    height: 3px;
    background: linear-gradient(90deg, transparent, var(--gold), var(--gold-light), var(--gold), transparent);
    background-size: 200% 100%;
    animation: shimmer 3s linear infinite;
  }
  @keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }

  .mi-table-scroll { overflow-x: auto; }

  .mi-table { width: 100%; border-collapse: collapse; font-size: 13px; }

  .mi-table thead {
    background: rgba(255,255,255,0.04);
    border-bottom: 1px solid rgba(200,151,58,0.25);
  }

  .mi-table th {
    padding: 16px 14px; text-align: left;
    font-weight: 600; color: var(--gold-light);
    letter-spacing: 0.10em; font-size: 10px;
    text-transform: uppercase; white-space: nowrap;
    font-family: 'Outfit', sans-serif;
  }

  .mi-table tbody tr {
    border-bottom: 1px solid rgba(255,255,255,0.06);
    transition: background 0.15s;
  }
  .mi-table tbody tr:hover { background: rgba(200,151,58,0.04); }
  .mi-table tbody tr:last-child { border-bottom: none; }

  .mi-table td {
    padding: 16px 14px; color: rgba(255,255,255,0.92);
    font-family: 'Outfit', sans-serif; font-size: 13px; vertical-align: middle;
  }

  .mi-id-cell {
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px; font-weight: 700;
    color: var(--gold-light);
  }

  .mi-avatar {
    width: 28px; height: 28px; border-radius: 50%;
    background: linear-gradient(135deg, var(--success) 0%, var(--success-light) 100%);
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: white;
    font-family: 'Cormorant Garamond', serif; margin-right: 8px;
    vertical-align: middle;
  }

  .mi-state {
    background: rgba(6,6,22,0.72); border: 1px solid var(--glass-border);
    border-radius: 10px; padding: 72px 40px; text-align: center;
    backdrop-filter: blur(20px); box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  }
  .mi-state-icon { font-size: 36px; margin-bottom: 16px; }
  .mi-state-title { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 600; color: var(--white); margin-bottom: 10px; }
  .mi-state-text { font-size: 13px; color: rgba(255,255,255,0.65); line-height: 1.7; font-weight: 300; }

  .mi-spinner-wrap { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 72px 40px; }
  .mi-spinner { width: 32px; height: 32px; border: 2px solid rgba(255,255,255,0.10); border-top-color: var(--gold); border-radius: 50%; animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .mi-spinner-text { font-size: 11px; color: rgba(255,255,255,0.50); letter-spacing: 0.14em; text-transform: uppercase; }

  @media (max-width: 768px) {
    .mi-header { padding: 24px 20px; flex-direction: column; align-items: flex-start; gap: 16px; }
    .mi-content { padding: 24px 16px 48px; }
    .mi-title { font-size: 30px; }
  }
`;

function MatchItemsPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadMatches();
    axios.get(`${BASE}/role`, { withCredentials: true })
      .then(res => {
        const role = String(res.data || "").replace(/"/g, "").trim();
        setUserRole(role);
      })
      .catch(() => {});
  }, []);

  const loadMatches = () => {
    axios.get(`${BASE}/match`, { withCredentials: true })
      .then(res => {
        setMatches(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const getInitial = (val) => {
    const s = String(val || "").trim();
    return s.length > 0 ? s.charAt(0).toUpperCase() : "?";
  };

  const ip = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor" };

  return (
    <>
      <style>{styles}</style>
      <div className="mi-bg" />
      <div className="mi-overlay" />

      <div className="mi-page">

        {/* ── Header ── */}
        <div className="mi-header">
          <div>
            <div className="mi-eyebrow">
              <div className="mi-eyebrow-line" />
              <span className="mi-eyebrow-text">Lost &amp; Found Portal</span>
            </div>
            <h1 className="mi-title">Matched <em>Items</em></h1>
            <p className="mi-subtitle">Lost and found items that have been paired together.</p>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="mi-content">

          {/* Topbar */}
          <div className="mi-topbar">
            <button className="mi-back-btn"
              onClick={() => navigate(userRole === "Admin" ? "/admin-menu" : "/student-menu")}>
              <svg {...ip}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            {!loading && (
              <span className="mi-count-text">
                <strong>{matches.length}</strong> match{matches.length !== 1 ? "es" : ""} found
              </span>
            )}
          </div>

          {/* States */}
          {loading ? (
            <div className="mi-state">
              <div className="mi-spinner-wrap">
                <div className="mi-spinner" />
                <span className="mi-spinner-text">Loading matches…</span>
              </div>
            </div>
          ) : matches.length === 0 ? (
            <div className="mi-state">
              <div className="mi-state-icon">🔗</div>
              <div className="mi-state-title">No Matches Yet</div>
              <div className="mi-state-text">No items have been matched yet.</div>
            </div>
          ) : (
            <div className="mi-table-wrapper">
              <div className="mi-table-accent" />
              <div className="mi-table-scroll">
                <table className="mi-table">
                  <thead>
                    <tr>
                      <th>Lost Item ID</th>
                      <th>Found Item ID</th>
                      <th>Item Name</th>
                      <th>Category</th>
                      <th>Lost User</th>
                      <th>Found User</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matches.map((match, index) => (
                      <tr key={index}>

                        {/* ✅ Lost Item ID */}
                        <td className="mi-id-cell">
                          {match.lostItemId || match.lost_item_id || "—"}
                        </td>

                        {/* ✅ Found Item ID */}
                        <td className="mi-id-cell">
                          {match.foundItemId || match.found_item_id || "—"}
                        </td>

                        {/* Item Name */}
                        <td style={{ fontWeight: 600 }}>
                          {match.itemName || match.item_name || "N/A"}
                        </td>

                        {/* Category */}
                        <td>{match.category || "N/A"}</td>

                        {/* Lost User */}
                        <td>
                          <span className="mi-avatar">
                            {getInitial(match.lostUsername || match.lost_username)}
                          </span>
                          {match.lostUsername || match.lost_username || "N/A"}
                        </td>

                        {/* Found User */}
                        <td>
                          <span className="mi-avatar">
                            {getInitial(match.foundUsername || match.found_username)}
                          </span>
                          {match.foundUsername || match.found_username || "N/A"}
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
}

export default MatchItemsPage;
