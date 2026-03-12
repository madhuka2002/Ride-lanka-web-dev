"use client";

import Sidebar from "../Sidebar";

export default function TripsScreen({ active, showScreen }) {
  const trips = [
    { title: "Maldives Honeymoon", img: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=300&q=80", dates: "Mar 15 – Mar 22, 2026", travelers: "2 travelers", budget: "$3,408", progress: 35, status: "upcoming", statusLabel: "Upcoming" },
    { title: "Greek Islands Tour", img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300&q=80", dates: "Feb 28 – Mar 8, 2026", travelers: "4 travelers", budget: "$5,200", progress: 80, status: "active", statusLabel: "Active" },
    { title: "Bali Family Retreat", img: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=300&q=80", dates: "Dec 20 – Dec 30, 2025", travelers: "5 travelers", budget: "$4,100", progress: 100, status: "completed", statusLabel: "Completed" },
  ];

  return (
    <div id="screen-trips" className={`screen ${active ? "active" : ""}`}>
      <div className="main-layout">
        <Sidebar activeItem="trips" logoIcon="🌍" logoText="Dream" logoEm="Trip" userName="Sithil Semitha" userRole="Explorer · Pro" onNavigate={showScreen} />
        <div className="main-content">
          <div className="topbar">
            <div><h1>My Trips ✈️</h1><div className="subtitle">Track and plan all your adventures</div></div>
            <div className="topbar-actions">
              <button type="button" className="btn-teal" style={{ width: "auto", padding: "12px 24px" }}>+ New Trip</button>
            </div>
          </div>
          <div className="trips-layout">
            <div>
              <div className="trip-steps">
                <div className="step-btn active">All Trips</div>
                <div className="step-btn">Upcoming</div>
                <div className="step-btn">Active</div>
                <div className="step-btn">Completed</div>
              </div>
              {trips.map((t, i) => (
                <div key={i} className="trip-card">
                  <div className="trip-card-img"><img src={t.img} alt={t.title} /></div>
                  <div className="trip-card-body">
                    <h4>{t.title}</h4>
                    <div className="meta">
                      <span>📅 {t.dates}</span>
                      <span>👥 {t.travelers}</span>
                      <span>💰 {t.budget} budget</span>
                    </div>
                    <div style={{ marginTop: 8, background: "var(--gray-100)", borderRadius: 50, height: 6, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${t.progress}%`, background: t.status === "completed" ? "var(--gray-400)" : t.status === "active" ? "#10b981" : "var(--teal)", borderRadius: 50 }} />
                    </div>
                    <div style={{ fontSize: 11, color: "var(--gray-400)", marginTop: 4 }}>
                      {t.status === "completed" ? "Trip completed" : `Planning: ${t.progress}% complete`}
                    </div>
                  </div>
                  <div className={`trip-status status-${t.status}`}>{t.statusLabel}</div>
                </div>
              ))}
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: "24px 0 16px" }}>Greek Islands — Day by Day</h3>
              <div className="itinerary-day">
                <div className="day-header">
                  <span className="day-badge">Day 1</span>
                  <h4>Arrival in Athens</h4>
                  <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--gray-400)" }}>Feb 28, 2026</span>
                </div>
                {[
                  { time: "09:00", title: "Athens International Airport", desc: "Arrive & collect luggage · Transfer to hotel" },
                  { time: "13:00", title: "Lunch at Monastiraki Square", desc: "Traditional Greek cuisine · Avg. €25/person" },
                  { time: "15:00", title: "Acropolis Museum Visit", desc: "Duration: 2 hours · Tickets: €20" },
                  { time: "20:00", title: "Check-in: Hotel Grande Bretagne", desc: "4 nights booked · Confirmation #HGB-4892" },
                ].map((a, i) => (
                  <div key={i} className="activity-item">
                    <div className="activity-time">{a.time}</div>
                    <div className="activity-dot" />
                    <div className="activity-info"><h5>{a.title}</h5><p>{a.desc}</p></div>
                  </div>
                ))}
              </div>
              <div className="itinerary-day">
                <div className="day-header">
                  <span className="day-badge">Day 2</span>
                  <h4>Santorini Day Trip</h4>
                  <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--gray-400)" }}>Mar 1, 2026</span>
                </div>
                {[
                  { time: "07:30", title: "Ferry to Santorini", desc: "Piraeus Port · 8hr journey · Economy class" },
                  { time: "15:30", title: "Oia Village Exploration", desc: "Blue-domed churches, white-washed alleys" },
                  { time: "19:30", title: "Sunset at Oia Castle", desc: "Most famous sunset spot in the world 🌅" },
                ].map((a, i) => (
                  <div key={i} className="activity-item">
                    <div className="activity-time">{a.time}</div>
                    <div className="activity-dot" />
                    <div className="activity-info"><h5>{a.title}</h5><p>{a.desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="map-panel">
              <div className="map-placeholder">
                <div className="icon">🗺️</div>
                <strong>Trip Map</strong>
                <span style={{ fontSize: 12 }}>Greek Islands Route</span>
                <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10, padding: "0 24px", width: "100%" }}>
                  {["Athens — Day 1–4", "Santorini — Day 2 (day trip)", "Mykonos — Day 5–8", "Rhodes — Day 9 (return)"].map((s, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.6)", borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
                      <strong>{s.split("—")[0].trim()}</strong> — {s.split("—")[1]?.trim()}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
