import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const GENRE_COLORS = {
  fantasy: "#6366f1",
  "sci-fi": "#06b6d4",
  horror: "#ef4444",
  historical: "#f59e0b",
  modern: "#10b981",
  other: "#8b5cf6",
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [worlds, setWorlds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWorlds = async () => {
      try {
        const res = await api.get("/worlds");
        setWorlds(res.data.worlds);
      } catch {
        setError("Failed to load worlds");
      } finally {
        setLoading(false);
      }
    };
    fetchWorlds();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this world?")) return;
    try {
      await api.delete(`/worlds/${id}`);
      setWorlds(worlds.filter(w => w._id !== id));
    } catch {
      alert("Failed to delete world");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 32 }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ margin: 0 }}>🌍 My Worlds</h1>
          <p style={{ margin: 0, color: "#666" }}>Welcome back, {user?.username}!</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => navigate("/create-world")}
            style={{ background: "#6366f1", color: "white", border: "none", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontWeight: "bold" }}
          >
            + New World
          </button>
          <button
            onClick={handleLogout}
            style={{ background: "#f3f4f6", border: "none", padding: "10px 20px", borderRadius: 8, cursor: "pointer" }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Error */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Loading */}
      {loading && <p>Loading your worlds...</p>}

      {/* Empty state */}
      {!loading && worlds.length === 0 && (
        <div style={{ textAlign: "center", padding: 80, background: "#f9fafb", borderRadius: 16 }}>
          <p style={{ fontSize: 48 }}>🗺️</p>
          <h2>No worlds yet</h2>
          <p style={{ color: "#666" }}>Create your first world to get started!</p>
          <button
            onClick={() => navigate("/create-world")}
            style={{ background: "#6366f1", color: "white", border: "none", padding: "12px 24px", borderRadius: 8, cursor: "pointer", fontSize: 16 }}
          >
            Create World
          </button>
        </div>
      )}

      {/* Worlds Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
        {worlds.map(world => (
          <div
            key={world._id}
            style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", background: "white", cursor: "pointer" }}
          >
            {/* Color banner */}
            <div
              style={{ height: 80, background: GENRE_COLORS[world.genre] || world.coverColor }}
              onClick={() => navigate(`/worlds/${world._id}`)}
            />
            {/* Card body */}
            <div style={{ padding: 16 }}>
              <h3
                style={{ margin: "0 0 4px", cursor: "pointer" }}
                onClick={() => navigate(`/worlds/${world._id}`)}
              >
                {world.name}
              </h3>
              <span style={{ fontSize: 12, background: "#f3f4f6", padding: "2px 8px", borderRadius: 20, color: "#666" }}>
                {world.genre}
              </span>
              <p style={{ color: "#666", fontSize: 14, margin: "8px 0" }}>
                {world.description || "No description yet"}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                <span style={{ fontSize: 12, color: "#999" }}>
                  {new Date(world.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleDelete(world._id)}
                  style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 12 }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}