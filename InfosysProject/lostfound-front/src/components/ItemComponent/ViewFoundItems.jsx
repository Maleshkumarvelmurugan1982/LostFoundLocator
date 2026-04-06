import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllFoundItems, deleteFoundItem } from "../../services/FoundItemService";
import axios from "axios";
import "./found1.css";

const BASE_URL = "http://localhost:9595/lostfound";

const ViewFoundItems = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState(null);
  const [currentUser, setCurrentUser] = useState("");
  const [adminView, setAdminView] = useState(false);

  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
      .catch(() => setLoading(false));
  }, []);

  // ================= LOAD ITEMS (after role is known) =================
  // Backend already handles role filtering via session:
  //   Admin   → all items
  //   Student → only their own
  useEffect(() => {
    if (role === null) return; // wait until role is fetched
    loadItems();
  }, [role]);

  const loadItems = () => {
    getAllFoundItems()
      .then((response) => {
        const data = response.data || [];
        setItems(data);
        setLoading(false);
      })
      .catch(() => {
        setItems([]);
        setLoading(false);
      });
  };

  // ================= SEARCH =================
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredItems(items);
    } else {
      const t = searchTerm.toLowerCase();
      setFilteredItems(
        items.filter(
          (item) =>
            item.itemName?.toLowerCase().includes(t) ||
            item.brand?.toLowerCase().includes(t) ||
            item.category?.toLowerCase().includes(t) ||
            item.location?.toLowerCase().includes(t)
        )
      );
    }
  }, [items, searchTerm]);

  // ================= DELETE =================
  // Admin   → can delete any item
  // Student → can only delete their own
  const handleDelete = (id, postedBy) => {
    const isOwner =
      String(postedBy || "").trim().toLowerCase() === currentUser.toLowerCase();

    if (!adminView && !isOwner) {
      alert("You can only delete your own items.");
      return;
    }

    if (window.confirm("Delete this item?")) {
      deleteFoundItem(id)
        .then(() => loadItems())
        .catch(() => alert("Error deleting item"));
    }
  };

  // ================= STATS =================
  const totalCount = items.length;
  const returnedCount = items.filter((i) => i.status).length;
  const notReturnedCount = items.filter((i) => !i.status).length;

  const getInitial = (val) => val?.charAt(0)?.toUpperCase() || "?";

  return (
    <>
      <div className="vfi-bg" />
      <div className="vfi-overlay" />

      <div className="vfi-page">

        {/* HEADER */}
        <div className="vfi-header">
          <div>
            <h1 className="vfi-title">
              {adminView ? "All" : "My"} <em>Found</em> Items
            </h1>
            <p className="vfi-subtitle">
              {adminView
                ? "Admin view — managing all reported found items"
                : "Items you've reported as found — helping reunite owners."}
            </p>
          </div>

          <div className="vfi-header-right">
            <span className={adminView ? "vfi-badge-admin" : "vfi-badge-student"}>
              {role || "..."}
            </span>
            <div className="vfi-user-badge">
              <div className="vfi-user-avatar">{getInitial(currentUser)}</div>
              <div>
                <div className="vfi-user-label">Logged in as</div>
                <div className="vfi-user-name">{currentUser}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="vfi-content">

          {/* TOP BAR */}
          <div className="vfi-topbar">
            <button className="vfi-back-btn" onClick={() => navigate("/student-menu")}>
              ← Back
            </button>

            <input
              className="vfi-search-input"
              placeholder="Search by name, brand, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <span className="vfi-count-text">
              Showing <strong>{filteredItems.length}</strong> of{" "}
              <strong>{totalCount}</strong> items
            </span>
          </div>

          {/* STATS */}
          <div className="vfi-stats-row">
            <div className="vfi-stat-card">
              <div className="vfi-stat-value">{totalCount}</div>
              <div>{adminView ? "Total Items" : "My Reports"}</div>
            </div>
            <div className="vfi-stat-card">
              <div className="vfi-stat-value">{returnedCount}</div>
              <div>NOT Returned</div>
            </div>
            <div className="vfi-stat-card">
              <div className="vfi-stat-value">{notReturnedCount}</div>
              <div>Returned</div>
            </div>
          </div>

          {/* TABLE */}
          {loading ? (
            <div className="vfi-state">Loading...</div>
          ) : filteredItems.length === 0 ? (
            <div className="vfi-state">No items found.</div>
          ) : (
            <div className="vfi-table-wrapper">
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
                  {filteredItems.map((item) => {
                    const isOwner =
                      String(item.postedBy || "").trim().toLowerCase() ===
                      currentUser.toLowerCase();
                    const canDelete = adminView || isOwner;

                    return (
                      <tr key={item.id}>
                        <td className="vfi-id">{item.id}</td>

                        <td>
                          <img
                            src={`${BASE_URL}/uploads/${item.imagePath}`}
                            className="vfi-table-img"
                            alt=""
                          />
                        </td>

                        <td>
                          <div className="vfi-item-name">{item.itemName}</div>
                          <div className="vfi-item-brand">{item.brand}</div>
                        </td>

                        <td>{item.category}</td>
                        <td>{item.location}</td>
                        <td>{item.date}</td>

                        <td>
                          <span
                            className={
                              item.status
                                ? "vfi-status-claimed"
                                : "vfi-status-available"
                            }
                          >
                            {item.status ? "Not Returned" : "Returned"}
                          </span>
                        </td>

                        <td>
                          <div className="vfi-posted-by">
                            <div className="vfi-posted-avatar">
                              {getInitial(item.postedBy)}
                            </div>
                            {item.postedBy}
                          </div>
                        </td>

                        <td>
                          {canDelete ? (
                            <button
                              className="vfi-btn-delete"
                              onClick={() => handleDelete(item.id, item.postedBy)}
                            >
                              DELETE
                            </button>
                          ) : (
                            <span className="vfi-no-action">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default ViewFoundItems;
