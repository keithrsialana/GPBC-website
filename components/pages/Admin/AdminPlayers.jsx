import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db, storage } from "../../../src/services/firebase";
import { ref, deleteObject } from "firebase/storage";
import { collection, getDocs, doc, deleteDoc, query, orderBy } from "firebase/firestore";

import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { FaUsers } from 'react-icons/fa';
import { MdOutlineLeaderboard, MdLeaderboard } from "react-icons/md";
import { TfiAnnouncement } from "react-icons/tfi";
import { GrSchedule } from "react-icons/gr";
import { GiBasketballJersey } from "react-icons/gi";
import { RiFileAddLine } from "react-icons/ri";

function AdminPlayers() {
	const [divisions, setDivisions] = useState([]);
	const [teams, setTeams] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	// ✅ Fetch all divisions and their teams
	useEffect(() => {
		async function fetchDivisions() {
			try {
				const divisionsSnapshot = await getDocs(collection(db, "divisions"));

				if (divisionsSnapshot.empty) {
					setDivisions([]); // Explicitly set to empty if no divisions exist
					return;
				}

				const divisionsData = await Promise.all(
					divisionsSnapshot.docs.map(async (divisionDoc) => {
						const teamsSnapshot = await getDocs(
							collection(db, "divisions", divisionDoc.id, "teams")
						);

						const teams = teamsSnapshot.docs.map((doc) => ({
							id: doc.id,
							...doc.data(),
						}));

						return { id: divisionDoc.id, ...divisionDoc.data(), teams };
					})
				);

				setDivisions(divisionsData);
			} catch (error) {
				console.error("Error fetching divisions and teams:", error);
				setDivisions([]); // Prevent infinite loading on error
			} finally {
				setLoading(false); // ✅ Always stop loading
			}
		}

		fetchDivisions();
	}, []);

	if (loading) return <p>Loading teams...</p>;

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
										<Link className="nav-link custom-link text-start bg-hover-light" to="/admin-schedule">
											<GrSchedule className="me-2 ms-2" /> Schedule
										</Link>
									</li>
									<li className="nav-item">
										<Link className="nav-link custom-link text-start bg-hover-light" to="/admin-teams">
											<GiBasketballJersey className="me-2 ms-2" /> Teams
										</Link>
									</li>
									<li className="nav-item">
										<Link className="nav-link custom-link text-start" style={{ backgroundColor: "#3f3954", borderRadius: "4px" }} to="/admin-players">
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
								<h1>Players</h1>
							</Card.Header>
							<Card.Body className="text-start">
								{/* ✅ Handle loading state */}
								{loading ? (
									<p className="text-center text-muted">Loading teams...</p>
								) : divisions.length === 0 ? (
									<p className="text-muted text-center">No divisions or teams found</p>
								) : (
									<Accordion alwaysOpen flush>
										{divisions.map((division, index) => (
											<Accordion.Item eventKey={index.toString()} key={division.id}>
												<Accordion.Header>🏀 {division.title}</Accordion.Header>
												<Accordion.Body>
													<div className="d-flex justify-content-between align-items-center mb-3">
														<div>
															<h5 className="">{division.title}</h5>
														</div>
													</div>

													{/* Teams List */}
													{division.teams && division.teams.length > 0 ? (
														<ul className="list-group">
															{division.teams.map((team) => (
																<li
																	key={team.id}
																	className="list-group-item d-flex justify-content-between align-items-center"
																	onClick={() => openModal(team)}
																>
																	<div className="d-flex align-items-center">
																		{team.imageUrl && (
																			<img
																				src={team.imageUrl}
																				alt={team.name}
																				style={{
																					width: "80px",
																					height: "80px",
																					objectFit: "cover",
																					borderRadius: "6px",
																					marginRight: "15px",
																				}}
																			/>
																		)}
																		<span>{team.name}</span>
																	</div>

																	<div>
																		<Link
																			to={`/admin-edit-team/${division.id}/${team.id}`}
																			title="Edit Team"
																			className="btn btn-outline-warning btn-sm me-2"
																		>
																			<RiFileAddLine size={18} />
																		</Link>
																	</div>
																</li>
															))}
														</ul>
													) : (
														<p className="text-muted text-center mt-3">No teams in this division</p>
													)}
												</Accordion.Body>
											</Accordion.Item>
										))}
									</Accordion>
								)}
							</Card.Body>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AdminPlayers;
