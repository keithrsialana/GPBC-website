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
import { MdOutlineLeaderboard, MdLeaderboard, MdDelete, MdEditNote } from "react-icons/md";
import { TfiAnnouncement } from "react-icons/tfi";
import { GrSchedule } from "react-icons/gr";
import { GiBasketballJersey } from "react-icons/gi";
import { RiFileAddLine } from "react-icons/ri";

function AdminTeams() {

	const [divisions, setDivisions] = useState([]);
	const [teams, setTeams] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	// Modal state
	const [modalShow, setModalShow] = useState(false);
	const [selectedTeam, setSelectedTeam] = useState(null);

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

	const handleDelete = async (teamId) => {
		const confirmDelete = window.confirm("Are you sure you want to delete this team?");
		if (!confirmDelete) return;

		try {
			// Find the announcement to get its image URL
			const team = teams.find(a => a.id === teamId);

			// Delete the Firestore document
			await deleteDoc(doc(db, "teams", teamId));

			// If there is an image, delete it from Firebase Storage
			if (team.imageUrl) {
				const imageRef = ref(storage, team.imageUrl);
				// This will work if imageUrl is the full path from storage; otherwise, store the path separately
				await deleteObject(imageRef).catch(err => console.log("Image delete error:", err));
			}

			// Remove from local state so UI updates immediately
			setTeams(prev => prev.filter(a => a.id !== teamId));

			alert("Team deleted successfully!");
		} catch (error) {
			console.error("Error deleting Team:", error);
			alert("Failed to delete Team.");
		}
	};

	const openModal = (team) => {
		setSelectedTeam(team);
		setModalShow(true);
	};

	const closeModal = () => {
		setSelectedTeam(null);
		setModalShow(false);
	};

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
										<Link className="nav-link custom-link text-start" style={{ backgroundColor: "#3f3954", borderRadius: "4px" }} to="/admin-teams">
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
								<h1>Teams</h1>
								<Link className="nav-link custom-link text-start" to="/admin-add-division">
									<RiFileAddLine className="me-2 ms-2" /> Add Division
								</Link>
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
															<h5>{division.title}</h5>
														</div>
														<div>
															<button
																className="btn btn-outline-success btn-sm me-2"
																Title="Add Team"
																onClick={() => navigate(`/admin-add-team/${division.id}`)}
															>
																<RiFileAddLine className="me-2 ms-2" />
															</button>
															<button
																className="btn btn-outline-warning btn-sm me-2"
																Title="Edit Division"
																onClick={() => navigate(`/admin-edit-division/${division.id}`)}
															>
																<MdEditNote size={18} />
															</button>
															<button
																className="btn btn-outline-danger btn-sm"
																Title="Delete Division"
																onClick={() => handleDelete(division.id)}
															>
																<MdDelete size={18} />
															</button>
														</div>
													</div>

													{/* Teams List */}
													{division.teams && division.teams.length > 0 ? (
														<ul className="list-group">
															{division.teams.map((team) => (
																<li
																	key={team.id}
																	className="list-group-item d-flex justify-content-between align-items-center"
																	onClick={openModal}
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
																			to={`/admin-edit-team/${team.id}`}
																			Title="Edit Team"
																			className="btn btn-outline-success btn-sm me-2"
																		>
																			<MdEditNote size={18} />
																		</Link>
																		<button
																			className="btn btn-outline-danger btn-sm"
																			Title="Delete Team"
																			onClick={() => handleDeleteTeam(division.id, team.id)}
																		>
																			<MdDelete size={18} />
																		</button>
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

								{/* Team Modal */}
								<Modal show={modalShow} onHide={closeModal} centered>
									<Modal.Header closeButton>
										<Modal.Title className="w-100 text-center">
											{selectedTeam?.name}
										</Modal.Title>
									</Modal.Header>
									<Modal.Body>
										{selectedTeam?.imageUrl ? (
											<img
												src={selectedTeam.imageUrl}
												alt="Team Logo"
												style={{ maxWidth: "100%", borderRadius: "8px" }}
											/>
										) : (
											<p className="text-muted text-center">No Team Logo</p>
										)}
									</Modal.Body>
									<Modal.Footer>
										<Button variant="secondary" onClick={closeModal}>
											Close
										</Button>
									</Modal.Footer>
								</Modal>
							</Card.Body>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AdminTeams;
