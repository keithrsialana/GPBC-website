import React from "react";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./index.css";
import "./animations.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import App from "./App.jsx";
import ReactDOM from "react-dom/client";
import Header from "../components/header";
import Footer from "../components/footer";
import { AuthProvider } from "./contexts/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <Header />
      <div style={{ minHeight: "80vh" }}>
        <App />
      </div>
      <Footer />
    </AuthProvider>
  </BrowserRouter>
)
