import React from "react";

const NotificationTab = ({ notifications, markAllRead }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 50,
        right: 20,
        width: "300px",
        maxHeight: "400px",
        overflowY: "auto",
        background: "#fff",
        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
        borderRadius: "5px",
        padding: "10px",
        zIndex: 1000
      }}
    >
      <h3>Notifications</h3>
      <button onClick={markAllRead} style={{ marginBottom: "10px" }}>Mark all as read</button>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {notifications.map(n => (
          <li
            key={n.id}
            style={{
              background: n.read ? "#f0f0f0" : "#e0ffe0",
              margin: "5px 0",
              padding: "8px",
              borderRadius: "5px"
            }}
          >
            {n.message} <br/>
            <small>{n.timestamp.toLocaleTimeString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationTab;
