import React, { useState } from "react";

const BottomDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button
        onClick={toggleDrawer}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        {isOpen ? "Close Drawer" : "Open Drawer"}
      </button>

      <div
        style={{
          position: "fixed",
          bottom: isOpen ? "0" : "-300px",
          left: 0,
          width: "100%",
          height: "300px",
          backgroundColor: "#f7f7f7",
          boxShadow: "0 -2px 5px rgba(0, 0, 0, 0.5)",
          transition: "bottom 0.3s ease",
        }}
      >
        <div style={{ padding: "20px" }}>
          <h2>Drawer Content</h2>
          <p>
            This is a slide-up bottom drawer. You can add any content you want
            here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BottomDrawer;
