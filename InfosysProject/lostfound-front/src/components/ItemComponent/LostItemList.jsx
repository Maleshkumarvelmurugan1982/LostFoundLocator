import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLostItems } from "../../services/LostItemService";
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
    --match: #4a6a9c;
    --match-light: #7aaae8;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .lil-bg {
    position: fixed; inset: 0;
    background-image: url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH7Czqxtx1fy0EWH6-we2f-5GZLpqtg5KmAw&s');
    background-size: cover; background-position: center; background-repeat: no-repeat;
    filter: brightness(0.28) saturate(0.60);
    transform: scale(1.06);
    animation: bgZoom 22s ease-in-out infinite alternate;
    z-index: 0;
  }
  @keyframes bgZoom { from { transform: scale(1.06); } to { transform: scale(1.13); } }

  .lil-overlay {
    position: fixed; inset: 0;
    background: linear-gradient(135deg, rgba(4,4,18,0.84) 0%, rgba(10,10,30,0.55) 50%, rgba(4,4,18,0.88) 100%),
      radial-gradient(ellipse at 30% 40%, rgba(200,151,58,0.06) 0%, transparent 55%);
    z-index: 1;
  }

  .lil-noise {
    position: fixed; inset: 0; z-index: 2; opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 180px 180px; pointer-events: none;
  }

  .lil-page { position: relative; z-index: 10; min-height: 100vh; font-family: 'Outfit', sans-serif; display: flex; flex-direction: column; }

  .lil-header { padding: 40px 56px 36px; display: flex; align-items: flex-end; justify-content: space-between; border-bottom: 1px solid var(--glass-border); backdrop-filter: blur(14px); background: rgba(4,4,16,0.42); position: relative; overflow: hidden; animation: headerIn 0.7s cubic-bezier(0.16,1,0.3,1) both; }
  @keyframes headerIn { from { opacity: 0; transform: translateY(-14px); } to { opacity: 1; transform: translateY(0); } }

  .lil-header-left { position: relative; z-index: 2; }
  .lil-eyebrow { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
  .lil-eyebrow-line { width: 28px; height: 1px; background: var(--gold); }
  .lil-eyebrow-text { font-size: 9px; font-weight: 500; letter-spacing: 0.25em; text-transform: uppercase; color: var(--gold-light); }
  .lil-title { font-family: 'Cormorant Garamond', serif; font-size: 44px; font-weight: 300; color: var(--white); line-height: 1.05; letter-spacing: -0.4px; }
  .lil-title em { font-style: italic; color: var(--gold-light); }
  .lil-subtitle { margin-top: 10px; font-size: 13px; color: rgba(255,255,255,0.80); font-weight: 300; letter-spacing: 0.03em; }

  .lil-user-badge { position: relative; z-index: 2; display: flex; align-items: center; gap: 12px; background: var(--glass); border: 1px solid var(--glass-border); border-radius: 40px; padding: 10px 20px 10px 12px; backdrop-filter: blur(12px); flex-shrink: 0; }
  .lil-user-avatar { width: 38px; height: 38px; background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 700; color: #0a0808; font-family: 'Cormorant Garamond', serif; flex-shrink: 0; }
  .lil-user-label { font-size: 9px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.55); }
  .lil-user-name { font-size: 13px; font-weight: 500; color: var(--white); margin-top: 1px; }

  .lil-content { max-width: 1300px; margin: 0 auto; padding: 48px 56px 72px; width: 100%; animation: contentIn 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
  @keyframes contentIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

  .lil-topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; gap: 14px; flex-wrap: wrap; }
  .lil-back-btn { display: inline-flex; align-items: center; gap: 7px; padding: 10px 20px; background: var(--glass); border: 1px solid var(--glass-border); border-radius: 40px; backdrop-filter: blur(10px); font-family: 'Outfit', sans-serif; font-size: 11px; font-weight: 500; letter-spacing: 0.10em; text-transform: uppercase; color: rgba(255,255,255,0.90); cursor: pointer; transition: all 0.22s; }
  .lil-back-btn:hover { background: var(--glass-strong); border-color: rgba(200,151,58,0.4); color: var(--white); transform: translateX(-3px); }
  .lil-back-btn svg { width: 13px; height: 13px; }

  .lil-search-wrap { position: relative; flex: 1; min-width: 220px; max-width: 400px; }
  .lil-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 15px; height: 15px; color: rgba(255,255,255,0.40); pointer-events: none; }
  .lil-search-input { width: 100%; padding: 11px 16px 11px 40px; background: var(--glass); border: 1px solid var(--glass-border); border-radius: 40px; backdrop-filter: blur(12px); font-family: 'Outfit', sans-serif; font-size: 13px; color: var(--white); transition: all 0.2s; outline: none; }
  .lil-search-input:focus { border-color: var(--gold); background: var(--glass-strong); box-shadow: 0 0 0 3px rgba(200,151,58,0.12); }
  .lil-search-input::placeholder { color: rgba(255,255,255,0.30); }

  .lil-match-search-wrap { position: relative; width: 100%; max-width: 400px; margin-bottom: 16px; }
  .lil-match-search-input { width: 100%; padding: 11px 16px 11px 40px; background: var(--glass); border: 1px solid rgba(122,170,232,0.30); border-radius: 40px; backdrop-filter: blur(12px); font-family: 'Outfit', sans-serif; font-size: 13px; color: var(--white); transition: all 0.2s; outline: none; }
  .lil-match-search-input:focus { border-color: var(--match-light); background: var(--glass-strong); box-shadow: 0 0 0 3px rgba(74,106,156,0.15); }
  .lil-match-search-input::placeholder { color: rgba(255,255,255,0.30); }
  .lil-match-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 15px; height: 15px; color: rgba(122,170,232,0.60); pointer-events: none; }

  .lil-count-text { font-size: 12px; color: rgba(255,255,255,0.65); font-weight: 400; white-space: nowrap; }
  .lil-count-text strong { color: var(--gold-light); font-weight: 600; }

  .lil-stats-row { display: flex; gap: 14px; margin-bottom: 28px; flex-wrap: wrap; }
  .lil-stat-card { background: rgba(6,6,22,0.65); border: 1px solid var(--glass-border); border-radius: 10px; padding: 18px 24px; display: flex; align-items: center; gap: 14px; backdrop-filter: blur(16px); min-width: 160px; box-shadow: 0 4px 20px rgba(0,0,0,0.25); }
  .lil-stat-icon { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
  .lil-stat-icon-total { background: rgba(200,151,58,0.15); }
  .lil-stat-icon-lost  { background: rgba(181,74,74,0.15); }
  .lil-stat-icon-found { background: rgba(74,124,89,0.15); }
  .lil-stat-icon-match { background: rgba(74,106,156,0.18); }
  .lil-stat-value { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 700; color: var(--white); line-height: 1; }
  .lil-stat-label { font-size: 10px; font-weight: 500; color: rgba(255,255,255,0.65); text-transform: uppercase; letter-spacing: 0.10em; margin-top: 3px; }

  .lil-section-heading { display: flex; align-items: center; gap: 12px; margin: 44px 0 18px; }
  .lil-section-heading-line { flex: 1; height: 1px; background: var(--glass-border); }
  .lil-section-heading-text { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 600; color: var(--white); white-space: nowrap; letter-spacing: 0.01em; }
  .lil-section-heading-text em { font-style: italic; color: var(--gold-light); }
  .lil-section-badge { background: rgba(74,106,156,0.20); border: 1px solid rgba(122,170,232,0.30); border-radius: 20px; padding: 3px 10px; font-size: 10px; font-weight: 600; color: var(--match-light); letter-spacing: 0.08em; text-transform: uppercase; font-family: 'Outfit', sans-serif; }

  .lil-table-wrapper { background: rgba(6,6,22,0.72); border: 1px solid var(--glass-border); border-radius: 10px; overflow: hidden; backdrop-filter: blur(24px); box-shadow: 0 16px 48px rgba(0,0,0,0.4); }
  .lil-table-accent { height: 3px; background: linear-gradient(90deg, transparent, var(--gold), var(--gold-light), var(--gold), transparent); background-size: 200% 100%; animation: shimmer 3s linear infinite; }
  .lil-table-accent-match { height: 3px; background: linear-gradient(90deg, transparent, var(--match), var(--match-light), var(--match), transparent); background-size: 200% 100%; animation: shimmer 3s linear infinite; }
  @keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }

  .lil-table-scroll { overflow-x: auto; }
  .lil-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .lil-table thead { background: rgba(255,255,255,0.04); border-bottom: 1px solid rgba(200,151,58,0.25); }
  .lil-table-match thead { border-bottom-color: rgba(74,106,156,0.35); }
  .lil-table th { padding: 16px 14px; text-align: left; font-weight: 600; color: var(--gold-light); letter-spacing: 0.10em; font-size: 10px; text-transform: uppercase; white-space: nowrap; font-family: 'Outfit', sans-serif; }
  .lil-table-match th { color: var(--match-light); }
  .lil-table tbody tr { border-bottom: 1px solid rgba(255,255,255,0.06); transition: background 0.15s; }
  .lil-table tbody tr:hover { background: rgba(200,151,58,0.04); }
  .lil-table-match tbody tr:hover { background: rgba(74,106,156,0.06); }
  .lil-table tbody tr:last-child { border-bottom: none; }
  .lil-table td { padding: 16px 14px; color: rgba(255,255,255,0.92); font-family: 'Outfit', sans-serif; font-size: 13px; vertical-align: middle; }

  .lil-table-id { font-family: 'Cormorant Garamond', serif; font-size: 16px; font-weight: 700; color: var(--gold-light); }
  .lil-table-id-match { font-family: 'Cormorant Garamond', serif; font-size: 16px; font-weight: 700; color: var(--match-light); }

  .lil-table-img { width: 68px; height: 68px; border-radius: 8px; object-fit: cover; border: 1px solid var(--glass-border); transition: transform 0.2s, box-shadow 0.2s; display: block; }
  .lil-table-img:hover { transform: scale(1.1); box-shadow: 0 6px 20px rgba(0,0,0,0.4); }
  .lil-table-img-placeholder { display: flex; align-items: center; justify-content: center; width: 68px; height: 68px; background: rgba(255,255,255,0.05); border: 1px dashed rgba(255,255,255,0.15); border-radius: 8px; color: rgba(255,255,255,0.30); font-size: 10px; }

  .lil-item-name { font-weight: 600; color: var(--white); font-size: 13.5px; }
  .lil-item-brand { font-size: 11.5px; color: rgba(255,255,255,0.50); margin-top: 3px; }
  .lil-desc-cell { max-width: 170px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: rgba(255,255,255,0.55); font-size: 12px; }
  .lil-posted-by { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.92); }
  .lil-posted-avatar { width: 28px; height: 28px; background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #0a0808; font-family: 'Cormorant Garamond', serif; flex-shrink: 0; }

  .lil-status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 20px; font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; white-space: nowrap; font-family: 'Outfit', sans-serif; }
  .lil-status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .lil-status-active { background: rgba(181,74,74,0.15); color: var(--error-light); border: 1px solid rgba(181,74,74,0.3); }
  .lil-status-active .lil-status-dot { background: var(--error-light); }
  .lil-status-resolved { background: rgba(74,124,89,0.15); color: var(--success-light); border: 1px solid rgba(74,124,89,0.3); }
  .lil-status-resolved .lil-status-dot { background: var(--success-light); }

  .lil-state { background: rgba(6,6,22,0.72); border: 1px solid var(--glass-border); border-radius: 10px; padding: 72px 40px; text-align: center; backdrop-filter: blur(20px); box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
  .lil-state-icon { width: 72px; height: 72px; background: var(--gold-dim); border: 1px solid rgba(200,151,58,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; font-size: 30px; }
  .lil-state-title { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 600; color: var(--white); margin-bottom: 10px; }
  .lil-state-text { font-size: 13px; color: rgba(255,255,255,0.65); line-height: 1.7; max-width: 380px; margin: 0 auto; font-weight: 300; }

  .lil-spinner-wrap { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 72px 40px; }
  .lil-spinner { width: 32px; height: 32px; border: 2px solid rgba(255,255,255,0.10); border-top-color: var(--gold); border-radius: 50%; animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .lil-spinner-text { font-size: 11px; color: rgba(255,255,255,0.50); letter-spacing: 0.14em; text-transform: uppercase; }

  .lil-matches-loading { display: flex; align-items: center; gap: 10px; padding: 28px 24px; color: rgba(255,255,255,0.50); font-size: 12px; letter-spacing: 0.10em; text-transform: uppercase; }
  .lil-spinner-sm { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.10); border-top-color: var(--match-light); border-radius: 50%; animation: spin 0.7s linear infinite; }

  .lil-claim-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border: none; border-radius: 8px; cursor: pointer; font-family: 'Outfit', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.10em; text-transform: uppercase; background: linear-gradient(135deg, #f4b400 0%, #e8a000 100%); color: #1a1000; transition: all 0.2s; box-shadow: 0 2px 12px rgba(244,180,0,0.25); white-space: nowrap; }
  .lil-claim-btn:hover:not(:disabled) { background: linear-gradient(135deg, #ffc820 0%, #f4b400 100%); box-shadow: 0 4px 20px rgba(244,180,0,0.45); transform: translateY(-1px); }
  .lil-claim-btn:active:not(:disabled) { transform: translateY(0); box-shadow: 0 1px 6px rgba(244,180,0,0.2); }
  .lil-claim-btn:disabled { background: rgba(255,255,255,0.10); color: rgba(255,255,255,0.35); cursor: not-allowed; box-shadow: none; transform: none; }
  .lil-claim-spinner { width: 11px; height: 11px; border: 2px solid rgba(26,16,0,0.25); border-top-color: #1a1000; border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; }

  @media (max-width: 1024px) { .lil-header { padding: 32px 32px 28px; } .lil-content { padding: 36px 32px 56px; } .lil-title { font-size: 36px; } }
  @media (max-width: 768px) {
    .lil-header { padding: 24px 20px; flex-direction: column; align-items: flex-start; gap: 16px; }
    .lil-content { padding: 24px 16px 48px; } .lil-title { font-size: 30px; }
    .lil-topbar { flex-direction: column; align-items: flex-start; }
    .lil-search-wrap { max-width: 100%; width: 100%; }
    .lil-table th, .lil-table td { padding: 12px 10px; }
    .lil-table-img, .lil-table-img-placeholder { width: 52px; height: 52px; }
  }
  @media (max-width: 480px) { .lil-header { padding: 18px 16px; } .lil-content { padding: 18px 12px 40px; } .lil-title { font-size: 26px; } }
`;

const LostItemList = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState("");

  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]); // ✅ NEW
  const [matchSearchTerm, setMatchSearchTerm] = useState("");  // ✅ NEW
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [matchesError, setMatchesError] = useState(false);
  const [claimingId, setClaimingId] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:9595/lostfound/user", { withCredentials: true })
      .then((res) => {
        const username = String(res.data || "").trim();
        setCurrentUser(username);
        fetchItems(username);
      })
      .catch(() => setLoading(false));
  }, []);

  // ✅ Filter lost items when searchTerm changes
  useEffect(() => { filterItems(searchTerm); }, [items, searchTerm]);

  // ✅ Fetch matches when exactly 1 lost item is filtered
  useEffect(() => {
    if (filteredItems.length === 1) {
      fetchMatches(filteredItems[0].id);
    } else {
      setMatches([]);
      setFilteredMatches([]);
      setMatchesLoading(false);
    }
  }, [filteredItems]);

  // ✅ NEW - Filter matches when matchSearchTerm changes
  useEffect(() => {
    if (!matchSearchTerm.trim()) {
      setFilteredMatches(matches);
      return;
    }
    const t = matchSearchTerm.toLowerCase();
    setFilteredMatches(matches.filter((m) =>
      m.itemName?.toLowerCase().includes(t) ||
      m.category?.toLowerCase().includes(t) ||
      m.brand?.toLowerCase().includes(t) ||
      m.description?.toLowerCase().includes(t) ||
      m.location?.toLowerCase().includes(t) ||       // ✅ search by location
      m.postedBy?.toLowerCase().includes(t)
    ));
  }, [matchSearchTerm, matches]);

  const fetchItems = (username) => {
    getLostItems()
      .then((response) => {
        const allItems = response.data || [];
        const myItems = allItems.filter(
          (item) => String(item.postedBy || "").trim().toLowerCase() === username.toLowerCase()
        );
        setItems(myItems);
        setLoading(false);
      })
      .catch(() => { setItems([]); setLoading(false); });
  };

  const fetchMatches = (lostItemId) => {
    setMatchesLoading(true);
    setMatchesError(false);
    setMatchSearchTerm(""); // ✅ reset match search on new fetch
    axios
      .get(`http://localhost:9595/lostfound/match/search/${lostItemId}`, {
        withCredentials: true
      })
      .then((res) => {
        setMatches(res.data || []);
        setFilteredMatches(res.data || []);
        setMatchesLoading(false);
      })
      .catch(() => {
        setMatchesError(true);
        setMatchesLoading(false);
      });
  };

  const claimItem = async (lostItem, foundItem, matchKey) => {
    const data = {
      lostItemId:    lostItem.id,
      foundItemId:   foundItem.id,
      itemName:      foundItem.itemName,
      category:      foundItem.category,
      lostUsername:  lostItem.postedBy,
      foundUsername: foundItem.postedBy,
    };
    setClaimingId(matchKey);
    try {
      const response = await fetch("http://localhost:9595/lostfound/match", {
        method:      "POST",
        headers:     { "Content-Type": "application/json" },
        credentials: "include",
        body:        JSON.stringify(data),
      });
      if (response.ok) {
        alert("Item claimed successfully!");
        setMatches((prev) => prev.filter((m, i) => (m.id ?? i) !== matchKey));
        setFilteredMatches((prev) => prev.filter((m, i) => (m.id ?? i) !== matchKey));
      } else {
        alert("Claim failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Network error while claiming. Please try again.");
    } finally {
      setClaimingId(null);
    }
  };

  const filterItems = (term) => {
    if (!term.trim()) { setFilteredItems(items); return; }
    const t = term.toLowerCase();
    setFilteredItems(items.filter((item) =>
      item.itemName?.toLowerCase().includes(t) ||
      item.brand?.toLowerCase().includes(t) ||
      item.category?.toLowerCase().includes(t) ||
      item.location?.toLowerCase().includes(t) ||
      item.description?.toLowerCase().includes(t) ||
      String(item.postedBy || "").toLowerCase().includes(t)
    ));
  };

  const totalCount = items.length;
  const lostCount  = items.filter((i) => i.status === 1 || i.status === true).length;
  const foundCount = items.filter((i) => i.status === 0 || i.status === false).length;
  const matchCount = filteredMatches.length;

  const getInitial  = (val) => { const s = String(val || "").trim(); return s.length > 0 ? s.charAt(0).toUpperCase() : "?"; };
  const getPostedBy = (val) => { const s = String(val || "").trim(); return s.length > 0 ? s : "Unknown"; };
  const ip = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor" };

  const multipleItemsVisible = filteredItems.length > 1 || filteredItems.length === 0;

  return (
    <>
      <style>{styles}</style>
      <div className="lil-bg" />
      <div className="lil-overlay" />
      <div className="lil-noise" />

      <div className="lil-page">

        {/* ── Header ── */}
        <div className="lil-header">
          <div className="lil-header-left">
            <div className="lil-eyebrow">
              <div className="lil-eyebrow-line" />
              <span className="lil-eyebrow-text">Lost Items Portal</span>
            </div>
            <h1 className="lil-title">My <em>Lost</em> Items</h1>
            <p className="lil-subtitle">Track all the items you've reported as lost.</p>
          </div>
          {currentUser && (
            <div className="lil-user-badge">
              <div className="lil-user-avatar">{getInitial(currentUser)}</div>
              <div>
                <div className="lil-user-label">Logged in as</div>
                <div className="lil-user-name">{currentUser}</div>
              </div>
            </div>
          )}
        </div>

        <div className="lil-content">

          {/* ── Topbar ── */}
          <div className="lil-topbar">
            <button className="lil-back-btn" onClick={() => navigate(-1)}>
              <svg {...ip}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back
            </button>
            {!loading && items.length > 0 && (
              <div className="lil-search-wrap">
                <svg className="lil-search-icon" {...ip}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input
                  type="text"
                  className="lil-search-input"
                  placeholder="Search lost items by name, category…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}
            {!loading && items.length > 0 && (
              <span className="lil-count-text">Showing <strong>{filteredItems.length}</strong> of <strong>{totalCount}</strong> items</span>
            )}
          </div>

          {/* ── Stats ── */}
          {!loading && items.length > 0 && (
            <div className="lil-stats-row">
              <div className="lil-stat-card">
                <div className="lil-stat-icon lil-stat-icon-total">📋</div>
                <div><div className="lil-stat-value">{totalCount}</div><div className="lil-stat-label">Total Reported</div></div>
              </div>
              <div className="lil-stat-card">
                <div className="lil-stat-icon lil-stat-icon-lost">🔍</div>
                <div><div className="lil-stat-value">{lostCount}</div><div className="lil-stat-label">Still Lost</div></div>
              </div>
              <div className="lil-stat-card">
                <div className="lil-stat-icon lil-stat-icon-found">✅</div>
                <div><div className="lil-stat-value">{foundCount}</div><div className="lil-stat-label">Recovered</div></div>
              </div>
              <div className="lil-stat-card">
                <div className="lil-stat-icon lil-stat-icon-match">🔗</div>
                <div>
                  <div className="lil-stat-value">{matchesLoading ? "—" : matchCount}</div>
                  <div className="lil-stat-label">Potential Matches</div>
                </div>
              </div>
            </div>
          )}

          {/* ── Lost Items Table ── */}
          {loading ? (
            <div className="lil-state">
              <div className="lil-spinner-wrap"><div className="lil-spinner" /><span className="lil-spinner-text">Loading your items…</span></div>
            </div>
          ) : items.length === 0 ? (
            <div className="lil-state">
              <div className="lil-state-icon">📭</div>
              <div className="lil-state-title">No Items Reported Yet</div>
              <div className="lil-state-text">You haven't reported any lost items yet.</div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="lil-state">
              <div className="lil-state-icon">🔎</div>
              <div className="lil-state-title">No Matching Results</div>
              <div className="lil-state-text">No lost items match "{searchTerm}". Try a different keyword.</div>
            </div>
          ) : (
            <div className="lil-table-wrapper">
              <div className="lil-table-accent" />
              <div className="lil-table-scroll">
                <table className="lil-table">
                  <thead>
                    <tr><th>#</th><th>Image</th><th>Item Details</th><th>Category</th><th>Description</th><th>Location</th><th>Date</th><th>Posted By</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr key={item.id}>
                        <td className="lil-table-id">{item.id}</td>
                        <td>
                          {item.imagePath ? (
                            <img src={`http://localhost:9595/lostfound/uploads/${item.imagePath}`} alt={item.itemName} className="lil-table-img" onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/68?text=No+Img"; }} />
                          ) : (
                            <div className="lil-table-img-placeholder">No Image</div>
                          )}
                        </td>
                        <td><div className="lil-item-name">{item.itemName || "N/A"}</div><div className="lil-item-brand">{item.brand || ""}</div></td>
                        <td>{item.category || "N/A"}</td>
                        <td><div className="lil-desc-cell" title={item.description}>{item.description || "N/A"}</div></td>
                        <td>{item.location || "N/A"}</td>
                        <td>{item.date || "N/A"}</td>
                        <td>
                          <div className="lil-posted-by">
                            <div className="lil-posted-avatar">{getInitial(item.postedBy)}</div>
                            {getPostedBy(item.postedBy)}
                          </div>
                        </td>
                        <td>
                          <span className={`lil-status-badge ${item.status === 1 || item.status === true ? "lil-status-active" : "lil-status-resolved"}`}>
                            <span className="lil-status-dot" />
                            {item.status === 1 || item.status === true ? "Lost" : "Recovered"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Matches Section ── */}
          <div className="lil-section-heading">
            <div className="lil-section-heading-line" />
            <span className="lil-section-heading-text">Potential <em>Matches</em></span>
            {!matchesLoading && !matchesError && !multipleItemsVisible && (
              <span className="lil-section-badge">{matchCount} found</span>
            )}
            <div className="lil-section-heading-line" />
          </div>

          {multipleItemsVisible ? (
            <div className="lil-state">
              <div className="lil-state-icon">🔍</div>
              <div className="lil-state-title">Search for a Specific Item</div>
              <div className="lil-state-text">Type an item name above to see potential matches for that specific lost item.</div>
            </div>
          ) : matchesLoading ? (
            <div className="lil-table-wrapper">
              <div className="lil-table-accent-match" />
              <div className="lil-matches-loading"><div className="lil-spinner-sm" />Loading matches…</div>
            </div>
          ) : matchesError ? (
            <div className="lil-state">
              <div className="lil-state-icon">⚠️</div>
              <div className="lil-state-title">Could Not Load Matches</div>
              <div className="lil-state-text">
                <span style={{ color: "var(--gold-light)", cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => filteredItems.length === 1 && fetchMatches(filteredItems[0].id)}>Try again</span>
              </div>
            </div>
          ) : matches.length === 0 ? (
            <div className="lil-state">
              <div className="lil-state-icon">🔗</div>
              <div className="lil-state-title">No Matches Yet</div>
              <div className="lil-state-text">No potential matches found for this item yet.</div>
            </div>
          ) : (
            <>
              {/* ✅ NEW - Match search bar for filtering by location/name */}
              <div className="lil-match-search-wrap">
                <svg className="lil-match-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  className="lil-match-search-input"
                  placeholder="Filter matches by location, name, brand…"
                  value={matchSearchTerm}
                  onChange={(e) => setMatchSearchTerm(e.target.value)}
                />
              </div>

              <div className="lil-table-wrapper">
                <div className="lil-table-accent-match" />
                <div className="lil-table-scroll">
                  <table className="lil-table lil-table-match">
                    <thead>
                      <tr><th>#</th><th>Image</th><th>Item Details</th><th>Category</th><th>Description</th><th>Location</th><th>Date</th><th>Found By</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                      {filteredMatches.length === 0 ? (
                        <tr>
                          <td colSpan={9} style={{ textAlign: "center", padding: "32px", color: "rgba(255,255,255,0.40)", fontSize: 13 }}>
                            No matches found for "{matchSearchTerm}"
                          </td>
                        </tr>
                      ) : (
                        filteredMatches.map((match, idx) => {
                          const matchKey = match.id ?? idx;
                          const isClaiming = claimingId === matchKey;
                          const lostItem = { id: filteredItems[0]?.id, postedBy: filteredItems[0]?.postedBy };
                          const foundItem = { id: match.id, itemName: match.itemName, category: match.category, postedBy: match.postedBy };

                          return (
                            <tr key={matchKey}>
                              <td className="lil-table-id-match">{match.id}</td>
                              <td>
                                {match.imagePath ? (
                                  <img src={`http://localhost:9595/lostfound/uploads/${match.imagePath}`} alt={match.itemName} className="lil-table-img" onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/68?text=No+Img"; }} />
                                ) : (
                                  <div className="lil-table-img-placeholder">No Image</div>
                                )}
                              </td>
                              <td><div className="lil-item-name">{match.itemName || "N/A"}</div><div className="lil-item-brand">{match.brand || ""}</div></td>
                              <td>{match.category || "—"}</td>
                              <td><div className="lil-desc-cell" title={match.description}>{match.description || "—"}</div></td>
                              <td>{match.location || "—"}</td>
                              <td>{match.date || "—"}</td>
                              <td>
                                <div className="lil-posted-by">
                                  <div className="lil-posted-avatar">{getInitial(match.postedBy)}</div>
                                  {getPostedBy(match.postedBy)}
                                </div>
                              </td>
                              <td>
                                <button className="lil-claim-btn" disabled={isClaiming} onClick={() => claimItem(lostItem, foundItem, matchKey)}>
                                  {isClaiming ? <><div className="lil-claim-spinner" /> Claiming…</> : <>⚡ Claim</>}
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
};

export default LostItemList;
