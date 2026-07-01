import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function TimelinePage() {
  const { worldId } = useParams();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
        try {
        const res = await api.get(`/articles/world/${worldId}?type=event`);

        // Extract first number found in the date string, sort ascending
        const sorted = [...res.data.articles].sort((a, b) => {
            const yearA = parseInt((a.date || "").match(/\d+/)?.[0] || "0", 10);
            const yearB = parseInt((b.date || "").match(/\d+/)?.[0] || "0", 10);
            return yearA - yearB;
        });

        setEvents(sorted);
        } catch {
        console.error("Failed to load timeline");
        } finally {
        setLoading(false);
        }
    };
    fetchEvents();
    }, [worldId]);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 32 }}>

      <button
        onClick={() => navigate(`/worlds/${worldId}`)}
        style={{ background: "none", border: "none", cursor: "pointer", color: "#6366f1", marginBottom: 16, fontSize: 14 }}
      >
        ← Back to World
      </button>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>📜 Timeline</h1>
        <button
          onClick={() => navigate(`/worlds/${worldId}/articles/new`)}
          style={{ background: "#6366f1", color: "white", border: "none", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontWeight: "bold" }}
        >
          + New Event
        </button>
      </div>

      {loading && <p>Loading timeline...</p>}

      {!loading && events.length === 0 && (
        <div style={{ textAlign: "center", padding: 60, background: "#f9fafb", borderRadius: 16 }}>
          <p style={{ fontSize: 40 }}>📜</p>
          <h3>No events yet</h3>
          <p style={{ color: "#666" }}>Start documenting your world's history!</p>
        </div>
      )}

      {/* Vertical timeline */}
      <div style={{ position: "relative", paddingLeft: 30 }}>
        {/* vertical line */}
        {events.length > 0 && (
          <div style={{ position: "absolute", left: 7, top: 8, bottom: 8, width: 2, background: "#e5e7eb" }} />
        )}

        {events.map(event => (
          <div
            key={event._id}
            onClick={() => navigate(`/articles/${event._id}`)}
            style={{ position: "relative", marginBottom: 24, cursor: "pointer" }}
          >
            {/* dot */}
            <div style={{
              position: "absolute", left: -30, top: 6,
              width: 16, height: 16, borderRadius: "50%",
              background: "#ef4444", border: "3px solid white", boxShadow: "0 0 0 2px #ef4444"
            }} />

            <div style={{ background: "white", borderRadius: 12, padding: 16, boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
              {event.date && (
                <span style={{ fontSize: 12, color: "#ef4444", fontWeight: "bold", textTransform: "uppercase" }}>
                  {event.date}
                </span>
              )}
              <h3 style={{ margin: "4px 0" }}>{event.title}</h3>
              <p style={{ color: "#666", fontSize: 14, margin: 0, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                {event.content || "No description"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}