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
						const teamsSnapshot = await getDocs(collection(db, "divisions", divisionDoc.id, "teams"));

						const teams = await Promise.all(
							teamsSnapshot.docs.map(async (teamDoc) => {
								const playersSnapshot = await getDocs(
									collection(db, "divisions", divisionDoc.id, "teams", teamDoc.id, "players")
								);

								const players = playersSnapshot.docs.map((playerDoc) => ({
									id: playerDoc.id,
									...playerDoc.data(),
								}));

								return { id: teamDoc.id, ...teamDoc.data(), players };
							})
						);

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

	const handleDeletePlayer = async (divisionId, teamId, playerId) => {
		const confirmDelete = window.confirm("Delete this player?");
		if (!confirmDelete) return;

		try {
			const playerRef = doc(db, "divisions", divisionId, "teams", teamId, "players", playerId);
			const playerDoc = await getDoc(playerRef);

			if (playerDoc.exists()) {
				const { storagePath } = playerDoc.data();
				if (storagePath) {
					const imageRef = ref(storage, storagePath);
					await deleteObject(imageRef).catch(() => { });
				}
				await deleteDoc(playerRef);
			}

			// Update UI
			setDivisions((prev) =>
				prev.map((div) =>
					div.id === divisionId
						? {
							...div,
							teams: div.teams.map((team) =>
								team.id === teamId
									? { ...team, players: team.players.filter((p) => p.id !== playerId) }
									: team
							),
						}
						: div
				)
			);

			alert("Player deleted successfully!");
		} catch (error) {
			console.error("Error deleting player:", error);
			alert("Failed to delete player.");
		}
	};

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
							<Card.Header><h1>Players</h1></Card.Header>
							<Card.Body>
								{divisions.map((division) => (
									<div key={division.id} className="mb-4">
										<h4 className="mb-3">🏀 {division.title}</h4>

										{division.teams.map((team) => (
											<Accordion key={team.id} className="mb-1">
												<Accordion.Item eventKey="0">
													<Accordion.Header>
														<div className="d-flex align-items-center">
															{team.imageUrl ? (
																<img
																	src={team.imageUrl}
																	alt={team.name}
																	style={{
																		width: "50px",
																		height: "50px",
																		objectFit: "cover",
																		borderRadius: "6px",
																		marginRight: "10px",
																	}}
																/>
															) : (
																<div className="no-logo">No Logo</div>
															)}
															<strong>{team.name}</strong>
														</div>
													</Accordion.Header>

													<Accordion.Body>
														{/* Players List */}
														{team.players && team.players.length > 0 ? (
															<ul className="list-group mb-3">
																{team.players.map((player) => (
																	<li
																		key={player.id}
																		className="list-group-item d-flex justify-content-between align-items-center"
																	>
																		<div className="d-flex align-items-center">
																			{player.imageUrl ? (
																				<img
																					src={player.imageUrl}
																					alt={player.name}
																					style={{
																						width: "50px",
																						height: "50px",
																						borderRadius: "6px",
																						objectFit: "cover",
																						marginRight: "10px",
																					}}
																				/>
																			) : (
																				<div
																					style={{
																						width: "50px",
																						height: "50px",
																						borderRadius: "6px",
																						backgroundColor: "#eee",
																						display: "flex",
																						justifyContent: "center",
																						alignItems: "center",
																						marginRight: "10px",
																						fontSize: "12px",
																					}}
																				>
																					No Img
																				</div>
																			)}
																			<span>{player.name}</span>
																		</div>

																		<div>
																			<button
																				className="btn btn-outline-success btn-sm me-2"
																				onClick={() => navigate(`/admin-add-player-stats/${division.id}/${team.id}/${player.id}`)}
																			>
																				📊 Stats
																			</button>
																			<button
																				className="btn btn-outline-warning btn-sm me-2"
																				onClick={() => navigate(`/admin-edit-player/${division.id}/${team.id}/${player.id}`)}
																			>
																				✏️
																			</button>
																			<button
																				className="btn btn-outline-danger btn-sm"
																				onClick={() => handleDeletePlayer(division.id, team.id, player.id)}
																			>
																				🗑️
																			</button>
																		</div>
																	</li>
																))}
															</ul>
														) : (
															<p className="text-muted">No players added</p>
														)}

														{/* Add Player Button */}
														<button
															className="btn btn-outline-primary btn-sm"
															onClick={() => navigate(`/admin-add-player/${division.id}/${team.id}`)}
														>
															➕ Add Player
														</button>
													</Accordion.Body>
												</Accordion.Item>
											</Accordion>
										))}
									</div>
								))}
							</Card.Body>
						</Card>

					</div>
				</div>
			</div>
		</div>
	);
}

export default AdminPlayers;
