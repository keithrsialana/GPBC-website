import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../src/services/firebase";
import AnnouncementCard from "../page-components/AnnouncementCard";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function Home() {
	const [activeIndex, setActiveIndex] = useState(0);
	const [announcements, setAnnouncements] = useState([]);
	const [loading, setLoading] = useState(true);
	const [animates, setAnimates] = useState([{ id: 1, image: "Untitled_design.png", alt: "Animate 1" }, { id: 2, image: "cover2.png", alt: "Animate 2" },]);

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

	// for image carousel 
	useEffect(() => {
		const intervalId = setInterval(() => {
			setActiveIndex((prevIndex) => (prevIndex + 1) % animates.length);
		}, 3000);
		return () => clearInterval(intervalId);
	}, [animates.length]);

	const openModal = (announcement) => {
		setSelectedAnnouncement(announcement);
		setModalShow(true);
	};

	const closeModal = () => {
		setSelectedAnnouncement(null);
		setModalShow(false);
	};

	return (
		<>
			<div className="covercontainer">
				<img src={animates[activeIndex].image} alt={animates[activeIndex].alt} />
				{/* <img src="cover2.png" alt="Cover Image" /> */}
				<div className="container contentmargin overlay align-items-center">
					<h1 className="catchphrase">Join the Game. Join the Family</h1>
					<h3>Compete for medals, make new friends and rivals</h3>
				</div>
			</div>
			<div className="contentmargin">
				<h1>Announcements</h1>
				{announcements.map(announcement => (
					<AnnouncementCard
						key={announcement.id}
						announcement={announcement}
						onClick={() => openModal(announcement)}
					/>
				))}
			</div>

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
		</>
	);
}

export default Home;
