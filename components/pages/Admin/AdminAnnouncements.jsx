import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db, storage } from "../../../src/services/firebase";
import { ref, deleteObject } from "firebase/storage";
import { collection, getDocs, doc, deleteDoc, query, orderBy } from "firebase/firestore";

import Card from 'react-bootstrap/Card';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { FaUsers } from 'react-icons/fa';
import { MdOutlineLeaderboard, MdLeaderboard, MdDelete, MdEditNote } from "react-icons/md";
import { TfiAnnouncement } from "react-icons/tfi";
import { GrSchedule } from "react-icons/gr";
import { GiBasketballJersey } from "react-icons/gi";
import { RiFileAddLine } from "react-icons/ri";

function AdminAnnouncements() {

	const [announcements, setAnnouncements] = useState([]);
	const [loading, setLoading] = useState(true);

	// Modal state
	const [modalShow, setModalShow] = useState(false);
	const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

	useEffect(() => {
		async function fetchAnnouncements() {
			try {
				const announcementsQuery = query(
					collection(db, "announcements"),
					orderBy("createdAt", "desc") // ✅ Sort by date (newest first)
				);

				const snapshot = await getDocs(announcementsQuery);
				const data = snapshot.docs.map(doc => ({
					id: doc.id,
					...doc.data(),
				}));
				setAnnouncements(data);
			} catch (error) {
				console.error("Error fetching announcements:", error);
			} finally {
				setLoading(false);
			}
		}

		fetchAnnouncements();
	}, []);

	if (loading) return <p>Loading announcements...</p>;

	const handleDelete = async (announcementId) => {
		const confirmDelete = window.confirm("Are you sure you want to delete this announcement?");
		if (!confirmDelete) return;

		try {
			// Find the announcement to get its image URL
			const announcement = announcements.find(a => a.id === announcementId);

			// Delete the Firestore document
			await deleteDoc(doc(db, "announcements", announcementId));

			// If there is an image, delete it from Firebase Storage
			if (announcement.imageUrl) {
				const imageRef = ref(storage, announcement.imageUrl);
				// This will work if imageUrl is the full path from storage; otherwise, store the path separately
				await deleteObject(imageRef).catch(err => console.log("Image delete error:", err));
			}

			// Remove from local state so UI updates immediately
			setAnnouncements(prev => prev.filter(a => a.id !== announcementId));

			alert("Announcement deleted successfully!");
		} catch (error) {
			console.error("Error deleting announcement:", error);
			alert("Failed to delete announcement.");
		}
	};

	const openModal = (announcement) => {
		setSelectedAnnouncement(announcement);
		setModalShow(true);
	};

	const closeModal = () => {
		setSelectedAnnouncement(null);
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
										<Link className="nav-link custom-link text-start" style={{ backgroundColor: "#3f3954", borderRadius: "4px" }} to="/admin-announcements">
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
								<h1>Announcements</h1>
								<Link className="nav-link custom-link text-start" to="/admin-add-announcement">
									<RiFileAddLine className="me-2 ms-2" /> Add Announcement
								</Link>
							</Card.Header>
							<Card.Body className="text-start">
								{announcements.length === 0 ? (
									<p className="text-muted text-center">No announcements found</p>
								) : (
									<div className="list-group">
										{announcements.map((announcement) => (
											<div
												key={announcement.id}
												className="list-group-item d-flex align-items-start justify-content-between"
												onClick={() => openModal(announcement)}
											>
												{/* LEFT SIDE - Image + Text */}
												<div className="d-flex align-items-center flex-grow-1">
													{announcement.imageUrl && (
														<img
															src={announcement.imageUrl}
															alt={announcement.title}
															style={{
																width: "80px",
																height: "80px",
																objectFit: "cover",
																borderRadius: "6px",
																marginRight: "15px",
															}}
														/>
													)}

													{/* TEXT CONTENT */}
													<div className="flex-grow-1">
														<h5 className="mb-1 fw-bold text-dark">{announcement.title}</h5>
														<p className="mb-2 text-muted" style={{ maxWidth: "600px" }}>
															{announcement.body.length > 150
																? `${announcement.body.substring(0, 150)}...`
																: announcement.body}
														</p>
														<small className="text-muted ms-auto">
															{announcement.date
																? new Date(announcement.date).toLocaleDateString("en-US", {
																	year: "numeric",
																	month: "short",
																	day: "numeric",
																})
																: "Just now"}
														</small>
													</div>
												</div>

												{/* RIGHT SIDE - ACTION BUTTONS */}
												<div className="d-flex align-items-center gap-2">
													<Link
														to={`/admin-edit-announcement/${announcement.id}`}
														className="btn btn-outline-success btn-sm"
														title="Edit"
													>
														<MdEditNote size={20} />
													</Link>

													<button
														className="btn btn-outline-danger btn-sm"
														title="Delete"
														onClick={() => handleDelete(announcement.id)}
													>
														<MdDelete size={20} />
													</button>
												</div>
											</div>
										))}
									</div>
								)}

								{/* Modal */}
								<Modal show={modalShow} onHide={closeModal} centered>
									<Modal.Header closeButton>
										<Modal.Title>{selectedAnnouncement?.title}</Modal.Title>
									</Modal.Header>
									<Modal.Body>
										<p className="text-dark">{selectedAnnouncement?.body}</p>
										{selectedAnnouncement?.imageUrl && (
											<img
												src={selectedAnnouncement.imageUrl}
												alt="Announcement"
												style={{ maxWidth: "100%", borderRadius: "8px" }}
											/>
										)}
									</Modal.Body>
									<Modal.Footer>
										<Button variant="secondary" onClick={closeModal}>Close</Button>
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

export default AdminAnnouncements;
