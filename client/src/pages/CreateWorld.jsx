import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function CreateWorld() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    genre: "fantasy",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/worlds", form);
      navigate(`/worlds/${res.data.world._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create world");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 560, margin: "60px auto", padding: 32, background: "white", borderRadius: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.1)" }}>
      <h2>🌍 Create a New World</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 6, fontWeight: "bold" }}>World Name</label>
          <input
            name="name"
            placeholder="e.g. The Realm of Eldoria"
            value={form.name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 16, boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 6, fontWeight: "bold" }}>Genre</label>
          <select
            name="genre"
            value={form.genre}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 16, boxSizing: "border-box" }}
          >
            <option value="fantasy">Fantasy</option>
            <option value="sci-fi">Sci-Fi</option>
            <option value="horror">Horror</option>
            <option value="historical">Historical</option>
            <option value="modern">Modern</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", marginBottom: 6, fontWeight: "bold" }}>Description</label>
          <textarea
            name="description"
            placeholder="Describe your world..."
            value={form.description}
            onChange={handleChange}
            rows={4}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 16, boxSizing: "border-box", resize: "vertical" }}
          />
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ flex: 1, background: "#6366f1", color: "white", border: "none", padding: "12px", borderRadius: 8, cursor: "pointer", fontSize: 16, fontWeight: "bold" }}
          >
            {loading ? "Creating..." : "Create World"}
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            style={{ flex: 1, background: "#f3f4f6", border: "none", padding: "12px", borderRadius: 8, cursor: "pointer", fontSize: 16 }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}