import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getLostItems, deleteLostItem } from "../../services/LostItemService";
import axios from "axios";
import Fuse from "fuse.js";
import "./lost.css";

const BASE_URL = "http://localhost:9595/lostfound";

const FUSE_OPTIONS = {
  keys: [
    { name: "itemName", weight: 0.5 },
    { name: "category", weight: 0.3 },
    { name: "location", weight: 0.2 },
  ],
  threshold: 0.4,
  distance: 100,
  minMatchCharLength: 2,
  includeScore: true,
};

const FUSE_MATCH_OPTIONS = {
  keys: [
    { name: "itemName", weight: 0.6 },
    { name: "category", weight: 0.3 },
    { name: "location", weight: 0.1 },
  ],
  threshold: 0.2,
  distance: 100,
  minMatchCharLength: 2,
  includeScore: true,
};

const LostItemList = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState(null);
  const [currentUser, setCurrentUser] = useState("");
  const [adminView, setAdminView] = useState(false);

  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [allMatches, setAllMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [matchSearchTerm, setMatchSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [claimingIndex, setClaimingIndex] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fuseRef = useRef(null);
  const fuseMatchRef = useRef(null);

  // ================= FETCH ROLE & USER FROM SESSION =================
  useEffect(() => {
    Promise.all([
      axios.get(`${BASE_URL}/role`, { withCredentials: true }),
      axios.get(`${BASE_URL}/user`, { withCredentials: true }),
    ])
      .then(([roleRes, userRes]) => {
        const fetchedRole = String(roleRes.data || "").replace(/"/g, "").trim();
        const fetchedUser = String(userRes.data || "").replace(/"/g, "").trim();
        setRole(fetchedRole);
        setCurrentUser(fetchedUser);
        setAdminView(fetchedRole.toLowerCase() === "admin");
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // ================= LOAD ITEMS (after role is known) =================
  useEffect(() => {
    if (role === null) return;
    getLostItems()
      .then((res) => {
        const data = res.data || [];
        setItems(data);
        setFilteredItems(data);
        fuseRef.current = new Fuse(data, FUSE_OPTIONS);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [role]);

  // ================= REBUILD FUSE INDEX ON ITEMS CHANGE =================
  useEffect(() => {
    fuseRef.current = new Fuse(items, FUSE_OPTIONS);
  }, [items]);

  // ================= FUZZY SEARCH — LOST ITEMS =================
  useEffect(() => {
    if (!fuseRef.current) return;
    const trimmed = searchTerm.trim();
    if (trimmed === "") {
      setFilteredItems(items);
    } else {
      const results = fuseRef.current.search(trimmed);
      setFilteredItems(results.map((r) => r.item));
    }
  }, [searchTerm, items]);

  // ================= FUZZY SEARCH — MATCHES =================
  useEffect(() => {
    if (!fuseMatchRef.current) return;
    const trimmed = matchSearchTerm.trim();
    if (trimmed === "") {
      setFilteredMatches(allMatches);
    } else {
      const results = fuseMatchRef.current.search(trimmed);
      setFilteredMatches(results.map((r) => r.item));
    }
  }, [matchSearchTerm, allMatches]);

  // ================= FETCH MATCHES =================
  useEffect(() => {
    if (selectedItem) fetchMatches(selectedItem.id);
  }, [selectedItem]);

  const fetchMatches = (id) => {
    setMatchesLoading(true);
    setMatchSearchTerm("");
    axios
      .get(`${BASE_URL}/match/search/${id}`, { withCredentials: true })
      .then((res) => {
        const data = res.data || [];
        setAllMatches(data);
        setFilteredMatches(data);
        fuseMatchRef.current = new Fuse(data, FUSE_MATCH_OPTIONS);
        setMatchesLoading(false);
      })
      .catch(() => setMatchesLoading(false));
  };

  // ================= CLAIM (STUDENT ONLY) =================
  const claimItem = async (lostItem, match, index) => {
    const data = {
      lostItemId: lostItem.id,
      foundItemId: match.id,
      itemName: match.itemName,
      category: match.category,
      lostUsername: lostItem.postedBy,
      foundUsername: match.postedBy,
    };
    setClaimingIndex(index);
    try {
      const res = await fetch(`${BASE_URL}/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (res.ok) {
        alert("Claimed successfully!");
        fetchMatches(lostItem.id);
      } else {
        alert("Claim failed!");
      }
    } catch (err) {
      console.error(err);
    }
    setClaimingIndex(null);
  };

  // ================= DELETE (ADMIN ONLY) =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lost item?")) return;
    setDeletingId(id);
    try {
      await deleteLostItem(id);
      const updated = items.filter((i) => i.id !== id);
      setItems(updated);
      if (selectedItem?.id === id) {
        setSelectedItem(null);
        setAllMatches([]);
        setFilteredMatches([]);
      }
    } catch {
      alert("Error deleting item.");
    }
    setDeletingId(null);
  };

  // ================= IMAGE =================
  const getImage = (img) =>
    img ? `${BASE_URL}/uploads/${img}` : "https://via.placeholder.com/60";

  return (
    <>
      <div className="lil-bg"></div>
      <div className="lil-overlay"></div>

      <div className="lil-page">

        {/* HEADER */}
        <div className="lil-header">
          <h1 className="lil-title">
            {adminView ? "All" : "My"} <em>Lost</em> Items
          </h1>
          <div className="lil-header-right">
            <span className={adminView ? "lil-badge-admin" : "lil-badge-student"}>
              {role || "..."}
            </span>
            <span className="lil-username">{currentUser}</span>
            <button onClick={() => navigate(-1)}>← Back</button>
          </div>
        </div>

        <div className="lil-content">

          {/* LOST ITEMS FUZZY SEARCH */}
          <div style={{ position: "relative" }}>
            <input
              className="lil-search-input"
              placeholder="Fuzzy search by name, category, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <span style={{
                position: "absolute", right: 12, top: "50%",
                transform: "translateY(-50%)", fontSize: 12,
                color: "#888", pointerEvents: "none"
              }}>
                {filteredItems.length} result{filteredItems.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* ===== LOST ITEMS TABLE ===== */}
          {loading ? (
            <p>Loading...</p>
          ) : filteredItems.length === 0 ? (
            <div className="lil-match-box">
              No items found{searchTerm ? ` for "${searchTerm}"` : ""}.
            </div>
          ) : (
            <div className="lil-table-wrapper">
              <table className="lil-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>User</th>
                    <th>Status</th>
                    {!adminView && <th>Matches</th>}
                    {adminView && <th>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className={selectedItem?.id === item.id ? "lil-row-selected" : ""}
                    >
                      <td>{item.id}</td>
                      <td>
                        <img
                          src={getImage(item.imagePath)}
                          className="lil-table-img"
                          alt=""
                        />
                      </td>
                      <td>
                        <strong>{item.itemName}</strong>
                        <br />
                        <span>{item.brand}</span>
                      </td>
                      <td>{item.category}</td>
                      <td>{item.description}</td>
                      <td>{item.location}</td>
                      <td>{item.date}</td>
                      <td>{item.postedBy}</td>
                      <td>
                        {item.status ? (
                          <span className="lil-status-active">Lost</span>
                        ) : (
                          <span className="lil-status-recovered">Recovered</span>
                        )}
                      </td>

                      {/* ✅ FIXED — hide View Matches button when item is Recovered */}
                      {!adminView && (
                        <td>
                          {item.status ? (
                            <button
                              className={
                                selectedItem?.id === item.id
                                  ? "lil-claim-btn lil-claim-btn-active"
                                  : "lil-claim-btn"
                              }
                              onClick={() => setSelectedItem(item)}
                            >
                              {selectedItem?.id === item.id ? "Viewing ✓" : "View Matches"}
                            </button>
                          ) : (
                            <span style={{ color: "#888", fontSize: 13 }}>—</span>
                          )}
                        </td>
                      )}

                      {adminView && (
                        <td>
                          <button
                            className="lil-delete-btn"
                            disabled={deletingId === item.id}
                            onClick={() => handleDelete(item.id)}
                          >
                            {deletingId === item.id ? "Deleting..." : "DELETE"}
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ===== MATCHES — STUDENT ONLY ===== */}
          {!adminView && (
            <>
              <h2 className="lil-match-title">
                Potential <em>Matches</em>
              </h2>

              {selectedItem && (
                <div style={{ position: "relative", marginBottom: 12 }}>
                  <input
                    className="lil-search-input"
                    placeholder="Filter matches by name, category, location..."
                    value={matchSearchTerm}
                    onChange={(e) => setMatchSearchTerm(e.target.value)}
                  />
                  {matchSearchTerm && (
                    <span style={{
                      position: "absolute", right: 12, top: "50%",
                      transform: "translateY(-50%)", fontSize: 12,
                      color: "#888", pointerEvents: "none"
                    }}>
                      {filteredMatches.length} result{filteredMatches.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              )}

              {!selectedItem ? (
                <div className="lil-match-box">
                  Click "View Matches" on a lost item above to see potential matches
                </div>
              ) : matchesLoading ? (
                <div>Loading matches...</div>
              ) : filteredMatches.length === 0 ? (
                <div className="lil-match-box">
                  No matches found
                  {matchSearchTerm
                    ? ` for "${matchSearchTerm}"`
                    : ` for `}
                  {!matchSearchTerm && <strong>{selectedItem.itemName}</strong>}
                </div>
              ) : (
                <div className="lil-table-wrapper">
                  <table className="lil-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Image</th>
                        <th>Item</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Location</th>
                        <th>Date</th>
                        <th>User</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMatches.map((m, index) => (
                        <tr key={index}>
                          <td>{m.id}</td>
                          <td>
                            <img
                              src={getImage(m.imagePath)}
                              className="lil-table-img"
                              alt=""
                            />
                          </td>
                          <td>
                            <strong>{m.itemName}</strong>
                            <br />
                            <span>{m.brand}</span>
                          </td>
                          <td>{m.category}</td>
                          <td>{m.description}</td>
                          <td>{m.location}</td>
                          <td>{m.date}</td>
                          <td>{m.postedBy}</td>
                          <td>
                            <button
                              className="lil-claim-btn"
                              disabled={claimingIndex === index}
                              onClick={() => claimItem(selectedItem, m, index)}
                            >
                              {claimingIndex === index ? "Claiming..." : "Claim"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </>
  );
};

export default LostItemList;
