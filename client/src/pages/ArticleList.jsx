import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const TYPE_COLORS = {
  character: "#6366f1",
  location: "#10b981",
  faction: "#f59e0b",
  event: "#ef4444",
  item: "#06b6d4",
  other: "#8b5cf6",
};

const TYPE_ICONS = {
  character: "🧑",
  location: "📍",
  faction: "⚔️",
  event: "📜",
  item: "🗝️",
  other: "📄",
};

export default function ArticleList() {
  const { worldId } = useParams();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const url = filter === "all"
          ? `/articles/world/${worldId}`
          : `/articles/world/${worldId}?type=${filter}`;
        const res = await api.get(url);
        setArticles(res.data.articles);
      } catch {
        setError("Failed to load articles");
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [worldId, filter]);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 32 }}>

      <button
        onClick={() => navigate(`/worlds/${worldId}`)}
        style={{ background: "none", border: "none", cursor: "pointer", color: "#6366f1", marginBottom: 16, fontSize: 14 }}
      >
        ← Back to World
      </button>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>📖 Lore Articles</h1>
        <button
          onClick={() => navigate(`/worlds/${worldId}/articles/new`)}
          style={{ background: "#6366f1", color: "white", border: "none", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontWeight: "bold" }}
        >
          + New Article
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {["all", "character", "location", "faction", "event", "item", "other"].map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              border: "none",
              cursor: "pointer",
              background: filter === t ? "#6366f1" : "#f3f4f6",
              color: filter === t ? "white" : "#444",
              fontSize: 14,
              textTransform: "capitalize",
            }}
          >
            {t === "all" ? "All" : `${TYPE_ICONS[t]} ${t}`}
          </button>
        ))}
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading articles...</p>}

      {!loading && articles.length === 0 && (
        <div style={{ textAlign: "center", padding: 60, background: "#f9fafb", borderRadius: 16 }}>
          <p style={{ fontSize: 40 }}>📭</p>
          <h3>No articles yet</h3>
          <p style={{ color: "#666" }}>Start documenting your world's lore!</p>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
        {articles.map(article => (
          <div
            key={article._id}
            onClick={() => navigate(`/articles/${article._id}`)}
            style={{
              background: "white",
              borderRadius: 12,
              padding: 20,
              boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
              cursor: "pointer",
              borderLeft: `4px solid ${TYPE_COLORS[article.type]}`,
            }}
          >
            <span style={{ fontSize: 12, color: TYPE_COLORS[article.type], fontWeight: "bold", textTransform: "uppercase" }}>
              {TYPE_ICONS[article.type]} {article.type}
            </span>
            <h3 style={{ margin: "8px 0 4px" }}>{article.title}</h3>
            <p style={{ color: "#666", fontSize: 14, margin: 0, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
              {article.content || "No content yet"}
            </p>
            <p style={{ fontSize: 12, color: "#999", marginTop: 8 }}>
              By {article.createdBy?.username}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}