import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import api from "../api/axios";

// Fix default marker icon issue with Vite/Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Component that listens for map clicks
function ClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => onMapClick(e.latlng),
  });
  return null;
}

export default function WorldMap() {
  const { worldId } = useParams();
  const navigate = useNavigate();
  const [world, setWorld] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingPin, setPendingPin] = useState(null); // { lat, lng } before saving
  const [pinLabel, setPinLabel] = useState("");
  const [pinArticle, setPinArticle] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [worldRes, articlesRes] = await Promise.all([
          api.get(`/worlds/${worldId}`),
          api.get(`/articles/world/${worldId}`),
        ]);
        setWorld(worldRes.data.world);
        setArticles(articlesRes.data.articles);
      } catch {
        console.error("Failed to load map data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [worldId]);

  const handleMapClick = (latlng) => {
    setPendingPin(latlng);
    setPinLabel("");
    setPinArticle("");
  };

  const handleSavePin = async () => {
    if (!pinLabel.trim()) return alert("Please enter a label for this pin");

    try {
      const res = await api.post(`/worlds/${worldId}/pins`, {
        label: pinLabel,
        lat: pendingPin.lat,
        lng: pendingPin.lng,
        article: pinArticle || null,
      });
      setWorld(res.data.world);
      setPendingPin(null);
    } catch {
      alert("Failed to save pin");
    }
  };

  const handleDeletePin = async (pinId) => {
    if (!window.confirm("Delete this pin?")) return;
    try {
      const res = await api.delete(`/worlds/${worldId}/pins/${pinId}`);
      setWorld(res.data.world);
    } catch {
      alert("Failed to delete pin");
    }
  };

  if (loading) return <div style={{ padding: 40 }}>Loading map...</div>;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 32 }}>

      <button
        onClick={() => navigate(`/worlds/${worldId}`)}
        style={{ background: "none", border: "none", cursor: "pointer", color: "#6366f1", marginBottom: 16, fontSize: 14 }}
      >
        ← Back to World
      </button>

      <h1 style={{ marginBottom: 4 }}>🗺️ Map of {world.name}</h1>
      <p style={{ color: "#666", marginBottom: 20 }}>Click anywhere on the map to drop a new pin.</p>

      <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.1)" }}>
        <MapContainer
          center={[0, 0]}
          zoom={3}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          <ClickHandler onMapClick={handleMapClick} />

          {/* Existing pins */}
          {world.mapPins?.map(pin => (
            <Marker key={pin._id} position={[pin.lat, pin.lng]}>
              <Popup>
                <strong>{pin.label}</strong>
                {pin.notes && <p style={{ margin: "4px 0" }}>{pin.notes}</p>}
                <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                  {pin.article && (
                    <button
                      onClick={() => navigate(`/articles/${pin.article}`)}
                      style={{ background: "#6366f1", color: "white", border: "none", padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}
                    >
                      View Lore
                    </button>
                  )}
                  <button
                    onClick={() => handleDeletePin(pin._id)}
                    style={{ background: "none", color: "#ef4444", border: "1px solid #ef4444", padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}
                  >
                    Delete
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Pending pin (not saved yet) */}
          {pendingPin && (
            <Marker position={[pendingPin.lat, pendingPin.lng]} opacity={0.6} />
          )}
        </MapContainer>
      </div>

      {/* New pin form */}
      {pendingPin && (
        <div style={{ marginTop: 20, background: "white", borderRadius: 12, padding: 20, boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
          <h3 style={{ marginTop: 0 }}>📍 New Pin</h3>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 6, fontWeight: "bold" }}>Label</label>
            <input
              value={pinLabel}
              onChange={(e) => setPinLabel(e.target.value)}
              placeholder="e.g. Widow's Bay"
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 6, fontWeight: "bold" }}>Link to Article (optional)</label>
            <select
              value={pinArticle}
              onChange={(e) => setPinArticle(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", boxSizing: "border-box" }}
            >
              <option value="">— None —</option>
              {articles.map(a => (
                <option key={a._id} value={a._id}>{a.title} ({a.type})</option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={handleSavePin}
              style={{ background: "#6366f1", color: "white", border: "none", padding: "10px 20px", borderRadius: 8, cursor: "pointer" }}
            >
              Save Pin
            </button>
            <button
              onClick={() => setPendingPin(null)}
              style={{ background: "#f3f4f6", border: "none", padding: "10px 20px", borderRadius: 8, cursor: "pointer" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}