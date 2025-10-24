import React from "react";

const NotificationBell = ({ notifications, onClick }) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ position: "relative", cursor: "pointer" }} onClick={onClick}>
      <i className="fa fa-bell" style={{ fontSize: "24px" }}></i>
      {unreadCount > 0 && (
        <span
          style={{
            position: "absolute",
            top: -5,
            right: -5,
            background: "red",
            color: "white",
            borderRadius: "50%",
            padding: "2px 6px",
            fontSize: "12px",
          }}
        >
          {unreadCount}
        </span>
      )}
    </div>
  );
};

export default NotificationBell;
