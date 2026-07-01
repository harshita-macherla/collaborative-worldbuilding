import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    type: "character",
    content: "",
    tags: "",
    date: "",
  });
  const [worldId, setWorldId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await api.get(`/articles/${id}`);
        const a = res.data.article;
        setForm({
          title: a.title,
          type: a.type,
          content: a.content,
          tags: a.tags?.join(", ") || "",
          date: a.date || "",
        });
        setWorldId(a.world);
      } catch {
        setError("Failed to load article");
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const tagsArray = form.tags
        ? form.tags.split(",").map(t => t.trim()).filter(Boolean)
        : [];

      await api.put(`/articles/${id}`, {
        title: form.title,
        type: form.type,
        content: form.content,
        tags: tagsArray,
        date: form.date,
      });

      navigate(`/articles/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update article");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 40 }}>Loading article...</div>;

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: 32, background: "white", borderRadius: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.1)" }}>
      <h2>✏️ Edit Article</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 6, fontWeight: "bold" }}>Title</label>
        <input
          name="title"
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
          value={form.tags}
          onChange={handleChange}
          style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 16, boxSizing: "border-box" }}
        />
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={handleSubmit}
          disabled={saving}
          style={{ flex: 1, background: "#6366f1", color: "white", border: "none", padding: "12px", borderRadius: 8, cursor: "pointer", fontSize: 16, fontWeight: "bold" }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        <button
          onClick={() => navigate(`/articles/${id}`)}
          style={{ flex: 1, background: "#f3f4f6", border: "none", padding: "12px", borderRadius: 8, cursor: "pointer", fontSize: 16 }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}