import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function CreateArticle() {
  const { worldId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    type: "character",
    content: "",
    tags: "",
    date: "",
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
      const tagsArray = form.tags
        ? form.tags.split(",").map(t => t.trim()).filter(Boolean)
        : [];

      const res = await api.post(`/articles/world/${worldId}`, {
        title: form.title,
        type: form.type,
        content: form.content,
        tags: tagsArray,
        date: form.date,
      });

      navigate(`/articles/${res.data.article._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: 32, background: "white", borderRadius: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.1)" }}>
      <h2>📝 New Lore Article</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 6, fontWeight: "bold" }}>Title</label>
        <input
          name="title"
          placeholder="e.g. The Iron King"
          value={form.title}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 16, boxSizing: "border-box" }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 6, fontWeight: "bold" }}>Type</label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 16, boxSizing: "border-box" }}
        >
          <option value="character">🧑 Character</option>
          <option value="location">📍 Location</option>
          <option value="faction">⚔️ Faction</option>
          <option value="event">📜 Event</option>
          <option value="item">🗝️ Item</option>
          <option value="other">📄 Other</option>
        </select>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 6, fontWeight: "bold" }}>Content</label>
        <textarea
          name="content"
          placeholder="Write the lore here... mention other article titles to auto-link them!"
          value={form.content}
          onChange={handleChange}
          rows={10}
          style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 15, boxSizing: "border-box", resize: "vertical", lineHeight: 1.6 }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 6, fontWeight: "bold" }}>
          Date / Era (only matters for events)
        </label>
        <input
          name="date"
          placeholder="e.g. Year 1888, or The Third Age"
          value={form.date}
          onChange={handleChange}
          style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 16, boxSizing: "border-box" }}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={{ display: "block", marginBottom: 6, fontWeight: "bold" }}>Tags (comma separated)</label>
        <input
          name="tags"
          placeholder="e.g. royalty, villain, north kingdom"
          value={form.tags}
          onChange={handleChange}
          style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 16, boxSizing: "border-box" }}
        />
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ flex: 1, background: "#6366f1", color: "white", border: "none", padding: "12px", borderRadius: 8, cursor: "pointer", fontSize: 16, fontWeight: "bold" }}
        >
          {loading ? "Saving..." : "Create Article"}
        </button>
        <button
          onClick={() => navigate(`/worlds/${worldId}/articles`)}
          style={{ flex: 1, background: "#f3f4f6", border: "none", padding: "12px", borderRadius: 8, cursor: "pointer", fontSize: 16 }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}