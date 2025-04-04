import { useState } from "react";
import Home from "../components/pages/home";
import Error from "../components/pages/error";
import About from "../components/pages/about";
import Contact from "../components/pages/contact";
import Schedules from "../components/pages/schedules";
import Statistics from "../components/pages/statistics";
import AdminLogin from "../components/pages/adminlogin";
import { Routes, Route } from "react-router-dom";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/about" element={<About />} />
				<Route path="/contact" element={<Contact />} />
				<Route path="/schedule" element={<Schedules />} />
				<Route path="/statistics" element={<Statistics />} />
				<Route path="/login" element={<AdminLogin />} />
				<Route path="*" element={<Error />} />
				
			</Routes>
		</>
	);
}

export default App;
