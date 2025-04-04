import { useState } from "react";
import "./App.css";
import Home from "../components/pages/home";
import About from "../components/pages/about";
import { Routes, Route } from "react-router-dom";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/about" element={<About />} />
			</Routes>
		</>
	);
}

export default App;
