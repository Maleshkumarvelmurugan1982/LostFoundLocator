import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./all.css"; // ✅ external CSS

const AllStudents = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");

  const [confirmTarget, setConfirmTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [toast, setToast] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:9595/lostfound/students", {
        withCredentials: true,
      })
      .then((res) => {
        setStudents(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load students.");
        setLoading(false);
      });
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteConfirm = () => {
    if (!confirmTarget) return;

    setDeleting(true);

    axios
      .delete(
        `http://localhost:9595/lostfound/login/${confirmTarget.username}`,
        { withCredentials: true }
      )
      .then(() => {
        setStudents((prev) =>
          prev.filter((s) => s.username !== confirmTarget.username)
        );

        showToast("Student deleted successfully");
        setConfirmTarget(null);
        setDeleting(false);
      })
      .catch(() => {
        showToast("Delete failed", "error");
        setDeleting(false);
      });
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
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
    <div className="as-page">

      {/* TOP BAR */}
      <div className="as-topbar">
        <div className="as-topbar-left">
          <button
            className="as-back-btn"
            onClick={() => navigate("/admin-menu")}
          >
            ← Back
          </button>

          <div className="as-topbar-title">
            Lost <span>&</span> Found
          </div>
        </div>

        <div className="as-admin-badge">ADMIN</div>
      </div>

      {/* CONTENT */}
      <div className="as-content">

        {/* HEADER */}
        <div className="as-toolbar">
          <div className="as-info">
            <h2>
              All Students
              {!loading && (
                <span className="as-count-pill">
                  {filtered.length}
                </span>
              )}
            </h2>
            <p>All registered users</p>
          </div>

          <input
            className="as-search"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* LOADING */}
        {loading && <div className="as-loading">Loading...</div>}

        {/* ERROR */}
        {error && <div className="as-error">{error}</div>}

        {/* GRID */}
        {!loading && !error && (
          <div className="as-grid">
            {filtered.length === 0 ? (
              <div className="as-empty">No students found</div>
            ) : (
              filtered.map((student, index) => (
                <div className="as-card" key={index}>

                  <div className="as-card-top">
                    <div className="as-avatar">
                      {getInitial(student.personalName)}
                    </div>

                    <div>
                      <div className="as-card-name">
                        {student.personalName}
                      </div>
                      <div className="as-card-username">
                        @{student.username}
                      </div>
                    </div>
                  </div>

                  <div className="as-field">
                    📧 {student.email}
                  </div>

                  <div className="as-field">
                    👤 {student.username}
                  </div>

                  <div className="as-field">
                    🔐 {student.role}
                  </div>

                  <div className="as-card-footer">
                    <span className="as-role-badge">
                      {student.role}
                    </span>

                    <button
                      className="as-delete-btn"
                      onClick={() => setConfirmTarget(student)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* DELETE MODAL */}
      {confirmTarget && (
        <div className="as-modal-overlay">
          <div className="as-modal">
            <h3>Delete Student?</h3>
            <p>{confirmTarget.personalName}</p>

            <div className="as-modal-actions">
              <button
                onClick={() => setConfirmTarget(null)}
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteConfirm}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className={`as-toast ${toast.type}`}>
          {toast.msg}
        </div>
      )}

    </div>
  );
};

export default AllStudents;
