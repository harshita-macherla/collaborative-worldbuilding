import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function CharactersPage() {
  const { worldId } = useParams();
  const navigate = useNavigate();
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const res = await api.get(`/articles/world/${worldId}?type=character`);
        setCharacters(res.data.articles);
      } catch {
        console.error("Failed to load characters");
      } finally {
        setLoading(false);
      }
    };
    fetchCharacters();
  }, [worldId]);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 32 }}>

      <button
        onClick={() => navigate(`/worlds/${worldId}`)}
        style={{ background: "none", border: "none", cursor: "pointer", color: "#6366f1", marginBottom: 16, fontSize: 14 }}
      >
        ← Back to World
      </button>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>👥 Characters</h1>
        <button
          onClick={() => navigate(`/worlds/${worldId}/articles/new`)}
          style={{ background: "#6366f1", color: "white", border: "none", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontWeight: "bold" }}
        >
          + New Character
        </button>
      </div>

      {loading && <p>Loading characters...</p>}

      {!loading && characters.length === 0 && (
        <div style={{ textAlign: "center", padding: 60, background: "#f9fafb", borderRadius: 16 }}>
          <p style={{ fontSize: 40 }}>🧑</p>
          <h3>No characters yet</h3>
          <p style={{ color: "#666" }}>Add the people who live in this world!</p>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
        {characters.map(char => (
          <div
            key={char._id}
            onClick={() => navigate(`/articles/${char._id}`)}
            style={{
              background: "white",
              borderRadius: 12,
              padding: 20,
              boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            <div style={{
              width: 60, height: 60, borderRadius: "50%", background: "#6366f1",
              color: "white", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, fontWeight: "bold", margin: "0 auto 12px"
            }}>
              {char.title.charAt(0).toUpperCase()}
            </div>
            <h3 style={{ margin: "0 0 4px" }}>{char.title}</h3>
            <p style={{ color: "#666", fontSize: 13, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {char.content || "No bio yet"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}