import React from "react";
import Routes from "./Routes";
import { ToastProvider } from "./context/ToastContext";

function App() {
  return (
    <ToastProvider>
      <Routes />
    </ToastProvider>
  );
}

export default App;
