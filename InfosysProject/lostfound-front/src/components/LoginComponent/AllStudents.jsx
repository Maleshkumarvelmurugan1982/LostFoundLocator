import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .as-page {
    min-height: 100vh;
    background: #f0ebe3;
    font-family: 'Outfit', sans-serif;
  }

  .as-topbar {
    background: #1a1a2e;
    padding: 18px 36px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 2px 16px rgba(0,0,0,0.18);
  }

  .as-topbar-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .as-back-btn {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.15);
    color: #fff;
    border-radius: 8px;
    padding: 7px 14px;
    font-size: 13px;
    font-family: 'Outfit', sans-serif;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: background 0.2s;
  }
  .as-back-btn:hover { background: rgba(255,255,255,0.14); }
  .as-back-btn svg { width: 15px; height: 15px; }

  .as-topbar-title {
    font-size: 20px;
    font-weight: 600;
    color: #fff;
  }
  .as-topbar-title span { color: #c8973a; }

  .as-admin-badge {
    background: rgba(200,151,58,0.18);
    border: 1px solid rgba(200,151,58,0.35);
    color: #e8c06a;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 14px;
    border-radius: 20px;
    letter-spacing: 0.06em;
  }

  .as-content {
    padding: 36px;
    max-width: 1300px;
    margin: 0 auto;
  }

  .as-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
    flex-wrap: wrap;
    gap: 14px;
  }

  .as-info h2 {
    font-size: 24px;
    font-weight: 600;
    color: #1a1a2e;
  }

  .as-info p {
    font-size: 13px;
    color: #999;
    margin-top: 3px;
  }

  .as-count-pill {
    display: inline-block;
    background: #c8973a;
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    padding: 2px 11px;
    border-radius: 20px;
    margin-left: 10px;
    vertical-align: middle;
  }

  .as-search-wrap {
    position: relative;
  }
  .as-search-wrap svg {
    position: absolute;
    left: 13px;
    top: 50%;
    transform: translateY(-50%);
    width: 15px;
    height: 15px;
    color: #aaa;
    pointer-events: none;
  }
  .as-search {
    padding: 10px 16px 10px 38px;
    border-radius: 30px;
    border: 1.5px solid #ddd;
    font-size: 13px;
    font-family: 'Outfit', sans-serif;
    outline: none;
    width: 280px;
    background: #fff;
    transition: border 0.2s, box-shadow 0.2s;
  }
  .as-search:focus {
    border-color: #c8973a;
    box-shadow: 0 0 0 3px rgba(200,151,58,0.10);
  }

  .as-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
    gap: 22px;
  }

  .as-card {
    background: #fff;
    border-radius: 18px;
    padding: 26px 22px 20px;
    box-shadow: 0 2px 14px rgba(0,0,0,0.07);
    border: 1px solid #ece9e3;
    transition: transform 0.22s, box-shadow 0.22s;
    position: relative;
    overflow: hidden;
  }
  .as-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: linear-gradient(90deg, #c8973a, #e8c06a);
    border-radius: 18px 18px 0 0;
  }
  .as-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 28px rgba(0,0,0,0.13);
  }

  .as-card-top {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 18px;
  }

  .as-avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, #c8973a 0%, #e8c06a 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
    box-shadow: 0 3px 10px rgba(200,151,58,0.30);
  }

  .as-card-name {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a2e;
    line-height: 1.3;
  }
  .as-card-username {
    font-size: 12px;
    color: #bbb;
    margin-top: 2px;
  }

  .as-divider {
    border: none;
    border-top: 1px solid #f2ede6;
    margin-bottom: 14px;
  }

  .as-field {
    display: flex;
    align-items: center;
    gap: 9px;
    margin-bottom: 9px;
    font-size: 13px;
    color: #555;
    word-break: break-all;
  }
  .as-field svg {
    width: 14px;
    height: 14px;
    color: #c8973a;
    flex-shrink: 0;
  }

  .as-role-badge {
    display: inline-block;
    margin-top: 14px;
    padding: 4px 14px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    background: rgba(200,151,58,0.10);
    color: #c8973a;
    border: 1px solid rgba(200,151,58,0.22);
    text-transform: uppercase;
    letter-spacing: 0.09em;
  }

  .as-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 320px;
    gap: 14px;
    color: #aaa;
    font-size: 14px;
  }
  .as-spinner {
    width: 36px; height: 36px;
    border: 3px solid #e8c06a33;
    border-top-color: #c8973a;
    border-radius: 50%;
    animation: spin 0.85s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .as-error {
    background: #fff3f3;
    color: #c0392b;
    border-radius: 12px;
    padding: 16px 22px;
    font-size: 14px;
    margin-top: 20px;
    border: 1px solid #fdd;
  }

  .as-empty {
    text-align: center;
    color: #bbb;
    font-size: 14px;
    padding: 60px 0;
    grid-column: 1 / -1;
  }

  @media (max-width: 600px) {
    .as-content { padding: 18px; }
    .as-topbar { padding: 14px 18px; }
    .as-search { width: 100%; }
    .as-toolbar { flex-direction: column; align-items: flex-start; }
  }
`;

const AllStudents = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:9595/lostfound/students", { withCredentials: true })
      .then((res) => {
        setStudents(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load students. Make sure the backend is running.");
        setLoading(false);
      });
  }, []);

  const getInitial = (name) => {
    const s = String(name || "").trim();
    return s.length > 0 ? s.charAt(0).toUpperCase() : "?";
  };

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.personalName?.toLowerCase().includes(q) ||
      s.username?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <style>{styles}</style>
      <div className="as-page">

        {/* ── Top Bar ── */}
        <div className="as-topbar">
          <div className="as-topbar-left">
            <button className="as-back-btn" onClick={() => navigate("/admin-menu")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <div className="as-topbar-title">Lost <span>&amp;</span> Found</div>
          </div>
          <div className="as-admin-badge">ADMIN</div>
        </div>

        <div className="as-content">

          {/* ── Toolbar ── */}
          <div className="as-toolbar">
            <div className="as-info">
              <h2>
                All Students
                {!loading && <span className="as-count-pill">{filtered.length}</span>}
              </h2>
              <p>All registered students in the system</p>
            </div>

            <div className="as-search-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                className="as-search"
                type="text"
                placeholder="Search name, username, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* ── Loading ── */}
          {loading && (
            <div className="as-loading">
              <div className="as-spinner" />
              Loading students...
            </div>
          )}

          {/* ── Error ── */}
          {error && <div className="as-error">⚠️ {error}</div>}

          {/* ── Grid ── */}
          {!loading && !error && (
            <div className="as-grid">
              {filtered.length === 0 ? (
                <div className="as-empty">No students found.</div>
              ) : (
                filtered.map((student, idx) => (
                  <div className="as-card" key={idx}>

                    <div className="as-card-top">
                      <div className="as-avatar">{getInitial(student.personalName)}</div>
                      <div>
                        <div className="as-card-name">{student.personalName}</div>
                        <div className="as-card-username">@{student.username}</div>
                      </div>
                    </div>

                    <hr className="as-divider" />

                    <div className="as-field">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {student.email}
                    </div>

                    <div className="as-field">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {student.username}
                    </div>

                    <div className="as-field">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      {student.role}
                    </div>

                    <div className="as-role-badge">{student.role}</div>

                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default AllStudents;
