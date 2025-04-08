import { useState, useEffect } from "react";

function Home() {

	// for image carousel
	const [activeIndex, setActiveIndex] = useState(0);
	const [animates, setAnimates] = useState([
		{ id: 1, image: "Untitled_design.png", alt: "Animate 1" },
		{ id: 2, image: "cover2.png", alt: "Animate 2" },
		{ id: 3, image: "jm_kurt.png", alt: "Animate 3" },
	]);
	
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
			</div>
		</>
	);
}

export default Home;
