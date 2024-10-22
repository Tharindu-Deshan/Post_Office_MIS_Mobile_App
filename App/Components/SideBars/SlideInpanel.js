import React, { useState } from "react";

const SlideInPanel = () => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button
        onClick={togglePanel}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        {isOpen ? "Close Panel" : "Open Panel"}
      </button>

      <div
        style={{
          position: "fixed",
          top: 0,
          right: isOpen ? "0" : "-300px",
          width: "300px",
          height: "100%",
          backgroundColor: "#f7f7f7",
          boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.5)",
          transition: "right 0.3s ease",
        }}
      >
        <div style={{ padding: "20px" }}>
          <h2>Panel Content</h2>
          <p>
            This is a slide-in panel. You can add any content you want here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SlideInPanel;
