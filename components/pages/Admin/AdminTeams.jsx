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
import { VscGraph } from "react-icons/vsc";

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
		const fetchDivisions = async () => {
			try {
				const divisionsSnapshot = await getDocs(collection(db, "divisions"));

				const divisionsData = await Promise.all(
					divisionsSnapshot.docs.map(async (divisionDoc) => {
						const teamsSnapshot = await getDocs(collection(db, "divisions", divisionDoc.id, "teams"));

						const teams = await Promise.all(
							teamsSnapshot.docs.map(async (teamDoc) => {
								// Fetch team stats
								const statsSnapshot = await getDocs(
									collection(db, "divisions", divisionDoc.id, "teams", teamDoc.id, "stats")
								);

								let avgStats = { points: "N/A", rebounds: "N/A", assists: "N/A" };
								const stats = statsSnapshot.docs.map((s) => s.data());
								if (stats.length > 0) {
									const total = stats.reduce(
										(acc, s) => ({
											points: acc.points + (s.points || 0),
											rebounds: acc.rebounds + (s.rebounds || 0),
											assists: acc.assists + (s.assists || 0),
										}),
										{ points: 0, rebounds: 0, assists: 0 }
									);

									avgStats = {
										points: (total.points / stats.length).toFixed(1),
										rebounds: (total.rebounds / stats.length).toFixed(1),
										assists: (total.assists / stats.length).toFixed(1),
									};
								}

								return { id: teamDoc.id, ...teamDoc.data(), avgStats };
							})
						);

						return { id: divisionDoc.id, ...divisionDoc.data(), teams };
					})
				);

				setDivisions(divisionsData);
			} catch (error) {
				console.error("Error fetching divisions/teams:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchDivisions();
	}, []);

	if (loading) return <p>Loading teams...</p>;

	const handleDeleteDivision = async (divisionId) => {
		const confirmDelete = window.confirm(
			"Are you sure you want to delete this division? This will also remove all its teams."
		);
		if (!confirmDelete) return;

		try {
			// Get all teams under this division
			const teamsRef = collection(db, "divisions", divisionId, "teams");
			const teamsSnapshot = await getDocs(teamsRef);

			// ✅ Loop through teams and delete each one
			for (const teamDoc of teamsSnapshot.docs) {
				const teamData = teamDoc.data();

				// Delete the team document
				await deleteDoc(doc(db, "divisions", divisionId, "teams", teamDoc.id));

				// If team has an image in storage, delete it
				if (teamData.storagePath) {
					const imageRef = ref(storage, teamData.storagePath);
					await deleteObject(imageRef).catch((err) =>
						console.log("Error deleting team image:", err)
					);
				}
			}

			// ✅ Finally, delete the division document
			await deleteDoc(doc(db, "divisions", divisionId));

			// ✅ Update local state to remove deleted division
			setDivisions((prev) => prev.filter((d) => d.id !== divisionId));

			alert("Division and its teams deleted successfully!");
		} catch (error) {
			console.error("Error deleting division:", error);
			alert("Failed to delete division.");
		}
	};

	const handleDeleteTeam = async (divisionId, teamId) => {
		const confirmDelete = window.confirm("Are you sure you want to delete this team?");
		if (!confirmDelete) return;

		try {
			// Find the team object (so we can remove its image later)
			const team = divisions
				.find((d) => d.id === divisionId)
				?.teams.find((t) => t.id === teamId);

			if (!team) {
				alert("Team not found!");
				return;
			}

			// ✅ Delete Firestore document from subcollection
			await deleteDoc(doc(db, "divisions", divisionId, "teams", teamId));

			// ✅ If there is an image, delete it from Firebase Storage
			if (team.storagePath) {
				const imageRef = ref(storage, team.storagePath);
				await deleteObject(imageRef).catch((err) =>
					console.log("Image delete error:", err)
				);
			}

			// ✅ Update local state to remove the deleted team
			setDivisions((prevDivisions) =>
				prevDivisions.map((division) =>
					division.id === divisionId
						? {
							...division,
							teams: division.teams.filter((t) => t.id !== teamId),
						}
						: division
				)
			);

			alert("Team deleted successfully!");
		} catch (error) {
			console.error("Error deleting team:", error);
			alert("Failed to delete team.");
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
															<h5 className="">{division.title}</h5>
														</div>
														<div>
															<button
																className="btn btn-outline-success btn-sm me-2"
																title="Add Team"
																onClick={() => navigate(`/admin-add-team/${division.id}`)}
															>
																<RiFileAddLine className="me-2 ms-2" />
															</button>
															<button
																className="btn btn-outline-warning btn-sm me-2"
																title="Edit Division"
																onClick={() => navigate(`/admin-edit-division/${division.id}`)}
															>
																<MdEditNote size={18} />
															</button>
															<button
																className="btn btn-outline-danger btn-sm"
																title="Delete Division"
																onClick={() => handleDeleteDivision(division.id)}
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
																	style={{ padding: "15px", borderRadius: "8px" }}
																>
																	{/* Left: Logo + Team Info */}
																	<div className="d-flex align-items-center">
																		{team.imageUrl ? (
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
																		) : (
																			<div
																				style={{
																					width: "80px",
																					height: "80px",
																					borderRadius: "6px",
																					backgroundColor: "#eee",
																					display: "flex",
																					justifyContent: "center",
																					alignItems: "center",
																					marginRight: "15px",
																					fontSize: "12px",
																					color: "#666",
																				}}
																			>
																				No Logo
																			</div>
																		)}

																		{/* Team Name + Stats */}
																		<div>
																			<h5 className="mb-1">{team.name}</h5>
																			<p className="mb-0 text-muted" style={{ fontSize: "14px" }}>
																				<strong>Avg Points:</strong> {team.avgStats?.points || "N/A"} &nbsp;|&nbsp;
																				<strong>Reb:</strong> {team.avgStats?.rebounds || "N/A"} &nbsp;|&nbsp;
																				<strong>Ast:</strong> {team.avgStats?.assists || "N/A"}
																			</p>
																		</div>
																	</div>

																	{/* Right: Action Buttons */}
																	<div>
																		<Link
																			to={`/admin-add-team-stats/${division.id}/${team.id}`}
																			className="btn btn-outline-success btn-sm me-2"
																			title="Add Stats"
																		>
																			<VscGraph size={18} />
																		</Link>
																		<Link
																			to={`/admin-edit-team/${division.id}/${team.id}`}
																			className="btn btn-outline-warning btn-sm me-2"
																			title="Edit Team"
																		>
																			<MdEditNote size={18} />
																		</Link>
																		<button
																			className="btn btn-outline-danger btn-sm"
																			title="Delete Team"
																			onClick={(e) => {
																				e.stopPropagation();
																				handleDeleteTeam(division.id, team.id);
																			}}
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
		</div >
	);
}

export default AdminTeams;
