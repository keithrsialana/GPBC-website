import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./index.css";
import App from "./App.jsx";
import ReactDOM from "react-dom/client";
import Header from "../components/header";
import Footer from "../components/footer";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Header />
    <div style={{minHeight: "80vh"}}>
      <App />
    </div>
    <Footer />
  </BrowserRouter>
)
