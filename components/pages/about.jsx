import { useState } from "react";

function Home() {

	return (
		<div className="contentmargin">
			<h1>About Us</h1>
			{/* TODO: Replace Inserts with actual name and year */}
			<h5>Guelph Pinoy Basketball Club began as a small basketball club located in Guelph, Ontario by (Insert name here) in (Insert year) towards the goal to move past normal pickup games, to something a little more organized and competitive. </h5>

			<h5>Currently, the club is run by JM Relampag and Kurt Sialana</h5>
			<h5>The relaunched club's first season started in (Insert Date) with great success, and the team is looking forward to more exciting seasons to come!</h5>
			<img src="about.png" alt="A photo of JM and Kurt" style={{maxWidth: "50%", marginBottom: "20px", marginTop: "20px"}} className="rounded"/>
		</div>
	);
}

export default Home;
