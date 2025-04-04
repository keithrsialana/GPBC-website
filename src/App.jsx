import { useState } from "react";
import "./App.css";
import Home from "../components/pages/home";
import About from "../components/pages/about";
import Contact from "../components/pages/contact";
import Schedules from "../components/pages/schedules";
import Statistics from "../components/pages/statistics";
import { Routes, Route } from "react-router-dom";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/about" element={<About />} />
				<Route path="/contact" element={<Contact />} />
				<Route path="/schedules" element={<Schedules />} />
				<Route path="/statistics" element={<Statistics />} />
			</Routes>
		</>
	);
}

export default App;
