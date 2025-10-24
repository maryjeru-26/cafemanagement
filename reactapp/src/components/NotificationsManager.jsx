import React, { useState, useEffect } from "react";

const sampleMessages = [
  "50% off on all beverages today!",
  "New menu items just added!",
  "Free delivery on orders above ₹500",
  "Limited-time dessert offer!",
  "Try our chef's special combo!",
  "Buy 1 Get 1 Free on all sandwiches 🍔",
  "Pizza party! Flat 30% off on large pizzas 🍕",
  "Surprise dessert with every order today 🎂",
  "Order now and get a free drink 🥤",
  "Happy hours: 20% off between 3-5 PM ⏰",
  "Chef's special burger is back! Get 25% off 🍔",
  "Weekend offer: Free fries with every burger 🍟",
  "Feeling hungry? Get ₹50 off on orders above ₹300",
  "Sweet tooth alert! Desserts at 15% off 🍰",
  "Limited offer: Extra cheese on your pizza for free 🧀",
  "Midnight cravings? Late night discount 10% off 🌙",
  "Order for ₹200+ and spin the wheel for surprise rewards 🎉",
  "Grab a combo meal and save ₹100 today 💰",
  "Freshly brewed coffee at 10% off ☕",
  "Daily deal: Free side with any main course 🍴",
  "Snack attack! Chips and dip combo 20% off 🥪",
];


const NotificationsManager = () => {
  const [notifications, setNotifications] = useState([]);
  const [showPanel, setShowPanel] = useState(false);

  // Generate random notifications every 10s
  useEffect(() => {
    const interval = setInterval(() => {
      const message = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
      const id = new Date().getTime();
      setNotifications((prev) => [{ id, message, read: false }, ...prev]);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setShowPanel(false); // ✅ hide the panel
  };

  return (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}>
      {/* Bell Icon */}
      <div
        onClick={() => setShowPanel(!showPanel)}
        style={{
          position: "relative",
          width: "45px",
          height: "45px",
          borderRadius: "50%",
          backgroundColor: "#ff6b6b",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "bold",
          fontSize: "20px",
          cursor: "pointer",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-5px",
              right: "-5px",
              backgroundColor: "yellow",
              color: "black",
              borderRadius: "50%",
              width: "18px",
              height: "18px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            {unreadCount}
          </span>
        )}
      </div>

      {/* Notifications Panel */}
      {showPanel && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "50px",
            width: "300px",
            maxHeight: "400px",
            overflowY: "auto",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "5px",
            padding: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          }}
        >
          <div
            style={{
              marginBottom: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <strong>Notifications</strong>
            <button
              onClick={markAllRead}
              style={{
                cursor: "pointer",
                background: "none",
                border: "none",
                color: "#2196f3",
                fontWeight: "bold",
              }}
            >
              Mark all read
            </button>
          </div>

          {notifications.length === 0 ? (
            <p>No notifications yet</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                style={{
                  padding: "8px",
                  marginBottom: "5px",
                  backgroundColor: n.read ? "#eee" : "#ffeb3b",
                  borderRadius: "4px",
                }}
              >
                {n.message}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsManager;
