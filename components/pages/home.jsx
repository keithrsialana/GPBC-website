import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import AnnouncementCard from "../page-components/AnnouncementCard";

function Home() {

	// for image carousel
	const [activeIndex, setActiveIndex] = useState(0);
	const [announcements, setAnnouncements] = useState([]);
	const [loading, setLoading] = useState(true);

	const [animates, setAnimates] = useState([
		{ id: 1, image: "Untitled_design.png", alt: "Animate 1" },
		{ id: 2, image: "cover2.png", alt: "Animate 2" },
	]);

	// Fetch announcements from Firebase
	useEffect(() => {
		async function fetchAnnouncements() {
			try {
				const snapshot = await getDocs(collection(db, "announcements"));
				const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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

	return (
		<>
			<div className="covercontainer">
				<img
					src={animates[activeIndex].image}
					alt={animates[activeIndex].alt}
				/>
				{/* <img src="cover2.png" alt="Cover Image" /> */}
				<div className="container contentmargin overlay align-items-center">
					<h1 className="catchphrase">Join the Game. Join the Family</h1>
					<h3>Compete for medals, make new friends and rivals</h3>
				</div>
			</div>
			<div className="contentmargin">
				<h1>Announcements</h1>
				{announcements.map(announcement => (
					<AnnouncementCard key={announcement.id} announcement={announcement} />
				))}
			</div>
		</>
	);
}

export default Home;
