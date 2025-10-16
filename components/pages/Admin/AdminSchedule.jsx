import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../../../src/services/firebase";

import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import Accordion from 'react-bootstrap/Accordion';
import { FaUsers } from 'react-icons/fa';
import { MdOutlineLeaderboard, MdLeaderboard } from "react-icons/md";
import { TfiAnnouncement } from "react-icons/tfi";
import { GrSchedule } from "react-icons/gr";
import { GiBasketballJersey } from "react-icons/gi";
import { RiFileAddLine } from "react-icons/ri";

function AdminSchedule() {
	const [events, setEvents] = useState([]);

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const querySnapshot = await getDocs(collection(db, "events"));
				const fetchedEvents = querySnapshot.docs.map(doc => ({
					id: doc.id,
					...doc.data(),
					start: doc.data().start.toDate(), // Convert Firestore Timestamp to JS Date
					end: doc.data().end.toDate(),
				}));
				setEvents(fetchedEvents);
			} catch (error) {
				console.error("Error fetching events:", error);
			}
		};

		fetchEvents();
	}, []);

	return (
		<div className="container-fluid p-0">
			<div className="jumbotron text-center">
				<br />
				<h1 className="display-4">ADMINISTRATOR</h1>
				<p>Dashboard</p>
			</div>
			<div className="container mt-4">
				<hr className="my-4 border-white" />
				{/* Success & Error Messages */}
				<div className="row">
					<div className="col-md-3" style={{ borderRight: "1px solid #ddd", paddingLeft: "15px" }}>
						<div className="text-white text-center"
							style={{
								height: "40%",
								display: "flex",
								flexDirection: "column",
								padding: "5px",
							}}>
							<div className="admin-panel-section">
								{/* Static header (replaces Accordion.Header) */}
								<div className="admin-panel-header d-flex justify-content-center align-items-center mb-2 p-2">
									<span className="me-2">📋</span>
									<h5 className="m-0">Manage</h5>
								</div>

								{/* Static list (replaces Accordion.Body) */}
								<ul className="navbar-nav">
									<li className="nav-item">
										<Link className="nav-link custom-link text-start bg-hover-light" to="/admin-announcements">
											<TfiAnnouncement className="me-2 ms-2" /> Announcements
										</Link>
									</li>
									<li className="nav-item">
										<Link className="nav-link custom-link text-start" style={{ backgroundColor: "#3f3954", borderRadius: "4px" }} to="/admin-schedule">
											<GrSchedule className="me-2 ms-2" /> Schedule
										</Link>
									</li>
									<li className="nav-item">
										<Link className="nav-link custom-link text-start bg-hover-light" to="/admin-teams">
											<GiBasketballJersey className="me-2 ms-2" /> Teams
										</Link>
									</li>
									<li className="nav-item">
										<Link className="nav-link custom-link text-start bg-hover-light" to="/admin-players">
											<FaUsers className="me-2 ms-2" /> Players
										</Link>
									</li>
									<li className="nav-item">
										<Link className="nav-link custom-link text-start bg-hover-light" to="/admin-standings">
											<MdOutlineLeaderboard className="me-2 ms-2" /> Standings
										</Link>
									</li>
									<li className="nav-item">
										<Link className="nav-link custom-link text-start bg-hover-light" to="/admin-leaders">
											<MdLeaderboard className="me-2 ms-2" /> Leaders
										</Link>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div className="col-md-9" style={{ height: "100%" }}>
						<Card>
							<Card.Header>
								<h1>Schedule</h1>
								<Link className="nav-link custom-link text-start" to="/admin-add-schedule">
									<RiFileAddLine className="me-2 ms-2" /> Add Schedule
								</Link>
							</Card.Header>
							<Card.Body>
								{/* Display a list of schedule events here from firestore */}
								{events.length > 0 ? (
									<ul className="list-group">
										{events.map(event => (
											<li key={event.id} className="list-group-item d-flex justify-content-between align-items-center">
												<div>
													<strong>{event.title}</strong><br />
													<small>
														{event.start.toLocaleString()} → {event.end.toLocaleString()}
													</small>
												</div>
												<Link to={`/admin-edit-schedule/${event.id}`} className="btn btn-sm btn-outline-primary">
													Edit
												</Link>
											</li>
										))}
									</ul>
								) : (
									<p>No events found.</p>
								)}
							</Card.Body>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AdminSchedule;
