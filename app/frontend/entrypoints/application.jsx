import React from "react";
import { createRoot } from "react-dom/client";

function App() {
  return (
    <div style={{ fontFamily: "system-ui" }}>File Vault – loading...</div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
