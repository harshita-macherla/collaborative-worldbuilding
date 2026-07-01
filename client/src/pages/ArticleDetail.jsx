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

// Parses [[LINK:id:Title]] markers into clickable spans
function renderLinkedContent(content, navigate) {
  const parts = content.split(/(\[\[LINK:[^:]+:[^\]]+\]\])/g);

  return parts.map((part, i) => {
    const match = part.match(/\[\[LINK:([^:]+):([^\]]+)\]\]/);
    if (match) {
      const [, id, label] = match;
      return (
        <span
          key={i}
          onClick={() => navigate(`/articles/${id}`)}
          style={{ color: "#6366f1", fontWeight: "bold", cursor: "pointer", textDecoration: "underline" }}
        >
          {label}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await api.get(`/articles/${id}`);
        setArticle(res.data.article);
      } catch {
        setError("Article not found or access denied");
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this article?")) return;
    try {
      await api.delete(`/articles/${id}`);
      navigate(`/worlds/${article.world}/articles`);
    } catch {
      alert("Failed to delete article");
    }
  };

  if (loading) return <div style={{ padding: 40 }}>Loading article...</div>;
  if (error) return <div style={{ padding: 40, color: "red" }}>{error}</div>;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 32 }}>

      <button
        onClick={() => navigate(`/worlds/${article.world}/articles`)}
        style={{ background: "none", border: "none", cursor: "pointer", color: "#6366f1", marginBottom: 16, fontSize: 14 }}
      >
        ← Back to Articles
      </button>

      <div style={{ borderLeft: `6px solid ${TYPE_COLORS[article.type]}`, paddingLeft: 20, marginBottom: 24 }}>
        <span style={{ fontSize: 13, color: TYPE_COLORS[article.type], fontWeight: "bold", textTransform: "uppercase" }}>
          {article.type}
        </span>
        <h1 style={{ margin: "4px 0" }}>{article.title}</h1>
        <p style={{ fontSize: 13, color: "#999", margin: 0 }}>
          By {article.createdBy?.username} · Last updated {new Date(article.updatedAt).toLocaleDateString()}
        </p>
      </div>

      <div style={{ background: "white", borderRadius: 12, padding: 24, boxShadow: "0 1px 6px rgba(0,0,0,0.08)", lineHeight: 1.8, whiteSpace: "pre-wrap", marginBottom: 20 }}>
        {article.linkedContent
          ? renderLinkedContent(article.linkedContent, navigate)
          : "No content yet."}
      </div>

      {article.tags?.length > 0 && (
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {article.tags.map(tag => (
            <span key={tag} style={{ background: "#f3f4f6", padding: "4px 12px", borderRadius: 20, fontSize: 13, color: "#666" }}>
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 10 }}>
      <button
        onClick={() => navigate(`/articles/${id}/edit`)}
        style={{ background: "#6366f1", border: "none", color: "white", padding: "8px 16px", borderRadius: 8, cursor: "pointer" }}
      >
         Edit Article
      </button>
      <button
        onClick={handleDelete}
        style={{ background: "none", border: "1px solid #ef4444", color: "#ef4444", padding: "8px 16px", borderRadius: 8, cursor: "pointer" }}
      >
        Delete Article
      </button>
      </div>
      </div>
  );
}