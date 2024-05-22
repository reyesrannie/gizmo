import React, { useEffect } from "react";

const ShortcutHandler = ({ onUpdate, onReceive, onConfirm }) => {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.ctrlKey && event.key === "u") {
        event.preventDefault();
        onUpdate();
      } else if (event.ctrlKey && event.key === "r") {
        event.preventDefault();
        onReceive();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onUpdate]);
  return null;
};

export default ShortcutHandler;
