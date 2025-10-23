import { useState } from "react";
import Home from "../components/pages/home";
import Error from "../components/pages/error";
import About from "../components/pages/about";
import Contact from "../components/pages/contact";
import Schedules from "../components/pages/schedules";
import Statistics from "../components/pages/statistics";
import AdminLogin from "../components/pages/adminlogin";
import AdminAnnouncements from "../components/pages/Admin/AdminAnnouncements";
import AdminSchedule from "../components/pages/Admin/AdminSchedule";
import AdminTeams from "../components/pages/Admin/AdminTeams";
import AdminPlayers from "../components/pages/Admin/AdminPlayers";
import AdminStandings from "../components/pages/Admin/AdminStandings";
import AdminLeaders from "../components/pages/Admin/AdminLeaders";
import AddAnnouncement from "../components/pages/Admin/CRUD/AddAnnouncement";
import EditAnnouncement from "../components/pages/Admin/CRUD/EditAnnouncement";
import AddSchedule from "../components/pages/Admin/CRUD/AddSchedule";
import AddDivision from "../components/pages/Admin/CRUD/AddDivision";
import EditDivision from "../components/pages/Admin/CRUD/EditDivision";
import AddTeam from "../components/pages/Admin/CRUD/AddTeam";
import EditTeam from "../components/pages/Admin/CRUD/EditTeam";
import AddPlayer from "../components/pages/Admin/CRUD/AddPlayer";
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
				<Route path="/internal-portal-KRTS21-RICEKEET65-JM17-8f2a" element={<AdminLogin />} />
				<Route path="*" element={<Error />} />
				<Route path="/admin-announcements" element={<AdminAnnouncements />} />
				<Route path="/admin-schedule" element={<AdminSchedule />} />
				<Route path="/admin-teams" element={<AdminTeams />} />
				<Route path="/admin-players" element={<AdminPlayers />} />
				<Route path="/admin-standings" element={<AdminStandings />} />
				<Route path="/admin-leaders" element={<AdminLeaders />} />
				<Route path="/admin-add-announcement" element={<AddAnnouncement />} />
				<Route path="/admin-edit-announcement/:id" element={<EditAnnouncement />} />
				<Route path="/admin-add-schedule" element={<AddSchedule />} />
				<Route path="/admin-add-division" element={<AddDivision />} />
				<Route path="/admin-edit-division/:divisionId" element={<EditDivision />} />
				<Route path="/admin-add-team/:divisionId" element={<AddTeam />} />
				<Route path="/admin-edit-team/:divisionId/:teamId" element={<EditTeam />} />
				<Route path="/admin-add-player/:divisionId/:teamId" element={<AddPlayer />} />
			</Routes>
		</>
	);
}

export default App;
