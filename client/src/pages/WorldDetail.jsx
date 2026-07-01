import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function WorldDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [world, setWorld] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("contributor");
  const [inviteMsg, setInviteMsg] = useState("");

  const fetchWorld = async () => {
    try {
      const res = await api.get(`/worlds/${id}`);
      setWorld(res.data.world);
    } catch {
      setError("World not found or access denied");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorld();
  }, [id]);

  const isOwner = world && user && world.owner?._id === user.id;

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteMsg("");
    try {
      const res = await api.post(`/worlds/${id}/invite`, {
        email: inviteEmail,
        role: inviteRole,
      });
      setWorld(res.data.world);
      setInviteEmail("");
      setInviteMsg("✅ Member added!");
    } catch (err) {
      setInviteMsg("❌ " + (err.response?.data?.message || "Failed to invite"));
    }
  };

  const handleRemove = async (memberId) => {
    if (!window.confirm("Remove this member?")) return;
    try {
      const res = await api.delete(`/worlds/${id}/members/${memberId}`);
      setWorld(res.data.world);
    } catch {
      alert("Failed to remove member");
    }
  };

  if (loading) return <div style={{ padding: 40 }}>Loading world...</div>;
  if (error) return <div style={{ padding: 40, color: "red" }}>{error}</div>;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 32 }}>

      <button
        onClick={() => navigate("/dashboard")}
        style={{ background: "none", border: "none", cursor: "pointer", color: "#6366f1", marginBottom: 24, fontSize: 14 }}
      >
        ← Back to Dashboard
      </button>

      <div style={{ background: "#6366f1", borderRadius: 16, padding: 32, color: "white", marginBottom: 32 }}>
        <h1 style={{ margin: 0 }}>{world.name}</h1>
        <span style={{ background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: 20, fontSize: 14 }}>
          {world.genre}
        </span>
        <p style={{ marginTop: 12, opacity: 0.9 }}>{world.description || "No description"}</p>
        <p style={{ fontSize: 13, opacity: 0.7, margin: 0 }}>
          Created by {world.owner?.username} · {new Date(world.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>

        <div onClick={() => navigate(`/worlds/${world._id}/articles`)} style={{ background: "#f9fafb", borderRadius: 12, padding: 24, textAlign: "center", border: "2px solid #6366f1", cursor: "pointer" }}>
          <p style={{ fontSize: 24, margin: 0 }}>📖</p>
          <p style={{ fontWeight: "bold", margin: "8px 0 4px" }}>Lore Articles</p>
          <p style={{ color: "#6366f1", fontSize: 14, margin: 0 }}>View & create lore →</p>
        </div>

        <div onClick={() => navigate(`/worlds/${world._id}/map`)} style={{ background: "#f9fafb", borderRadius: 12, padding: 24, textAlign: "center", border: "2px solid #10b981", cursor: "pointer" }}>
          <p style={{ fontSize: 24, margin: 0 }}>🗺️</p>
          <p style={{ fontWeight: "bold", margin: "8px 0 4px" }}>Map</p>
          <p style={{ color: "#10b981", fontSize: 14, margin: 0 }}>Explore locations →</p>
        </div>

        <div onClick={() => navigate(`/worlds/${world._id}/characters`)} style={{ background: "#f9fafb", borderRadius: 12, padding: 24, textAlign: "center", border: "2px solid #f59e0b", cursor: "pointer" }}>
          <p style={{ fontSize: 24, margin: 0 }}>👥</p>
          <p style={{ fontWeight: "bold", margin: "8px 0 4px" }}>Characters</p>
          <p style={{ color: "#f59e0b", fontSize: 14, margin: 0 }}>Meet the cast →</p>
        </div>

        <div onClick={() => navigate(`/worlds/${world._id}/timeline`)} style={{ background: "#f9fafb", borderRadius: 12, padding: 24, textAlign: "center", border: "2px solid #ef4444", cursor: "pointer" }}>
          <p style={{ fontSize: 24, margin: 0 }}>📜</p>
          <p style={{ fontWeight: "bold", margin: "8px 0 4px" }}>Timeline</p>
          <p style={{ color: "#ef4444", fontSize: 14, margin: 0 }}>See the history →</p>
        </div>

      </div>

      {/* Members section */}
      <div style={{ background: "white", borderRadius: 12, padding: 24, boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
        <h2 style={{ marginTop: 0 }}>👥 Members</h2>

        {/* Owner */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
          <span><strong>{world.owner?.username}</strong> ({world.owner?.email})</span>
          <span style={{ background: "#6366f1", color: "white", padding: "2px 10px", borderRadius: 20, fontSize: 12 }}>owner</span>
        </div>

        {/* Members list */}
        {world.members?.map(m => (
          <div key={m.user._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
            <span>{m.user.username} ({m.user.email})</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ background: "#f3f4f6", padding: "2px 10px", borderRadius: 20, fontSize: 12 }}>{m.role}</span>
              {isOwner && (
                <button
                  onClick={() => handleRemove(m.user._id)}
                  style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 12 }}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}

        {world.members?.length === 0 && (
          <p style={{ color: "#999", fontSize: 14 }}>No other members yet.</p>
        )}

        {/* Invite form — owner only */}
        {isOwner && (
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid #f0f0f0" }}>
            <h3 style={{ margin: "0 0 12px" }}>Invite a member</h3>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <input
                type="email"
                placeholder="their@email.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                style={{ flex: 1, minWidth: 200, padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd" }}
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd" }}
              >
                <option value="lore-keeper">Lore Keeper</option>
                <option value="contributor">Contributor</option>
                <option value="reader">Reader</option>
              </select>
              <button
                onClick={handleInvite}
                style={{ background: "#6366f1", color: "white", border: "none", padding: "8px 20px", borderRadius: 8, cursor: "pointer" }}
              >
                Invite
              </button>
            </div>
            {inviteMsg && <p style={{ marginTop: 8, fontSize: 14 }}>{inviteMsg}</p>}
          </div>
        )}
      </div>
    </div>
  );
}