"use client";

import Sidebar from "../Sidebar";

export default function WishlistScreen({ active, showScreen }) {
  const items = [
    { title: "Maldives Resort", location: "📍 Maldives", img: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=400&q=80", rating: "4.9", price: "$299" },
    { title: "Santorini Villa", location: "📍 Greece", img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80", rating: "4.8", price: "$189" },
    { title: "Swiss Alps Chalet", location: "📍 Switzerland", img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80", rating: "4.9", price: "$420" },
    { title: "Bali Jungle Retreat", location: "📍 Indonesia", img: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=400&q=80", rating: "4.7", price: "$145" },
    { title: "The Grand Colombo", location: "📍 Sri Lanka", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80", rating: "4.6", price: "$89" },
    { title: "Negombo Beach Resort", location: "📍 Sri Lanka", img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80", rating: "4.8", price: "$120" },
  ];

  return (
    <div id="screen-wishlist" className={`screen ${active ? "active" : ""}`}>
      <div className="main-layout">
        <Sidebar activeItem="wishlist" logoIcon="🌍" logoText="Dream" logoEm="Trip" userName="Sithil Semitha" userRole="Explorer · Pro" onNavigate={showScreen} />
        <div className="main-content">
          <div className="topbar">
            <div><h1>My Wishlist ❤️</h1><div className="subtitle">12 saved destinations</div></div>
          </div>
          <div className="wishlist-grid">
            {items.map((item, i) => (
              <div key={i} className="dest-card" onClick={() => showScreen("screen-detail")} role="button" tabIndex={0}>
                <div className="card-img">
                  <img src={item.img} alt={item.title} />
                  <div className="card-fav">❤️</div>
                </div>
                <div className="card-body">
                  <h4>{item.title}</h4>
                  <div className="card-location">{item.location}</div>
                  <div className="card-footer">
                    <span className="card-rating">⭐ {item.rating}</span>
                    <span className="card-price">{item.price}<span>/night</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
