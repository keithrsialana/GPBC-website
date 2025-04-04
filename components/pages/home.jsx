import { useState } from "react";

function Home() {
	return (
		<>
			<div className="covercontainer">
				<img
					src="cover2.png"
					alt="Cover Image"
				/>
				<div className="container contentmargin overlay align-items-center">
					<h1 className="catchphrase">Join the Game. Join the Family.</h1>
					<h3>Join us to have fun and compete with friends and family.</h3>
				</div>
			</div>
			<div className="contentmargin">
				<h1>Announcements</h1>
			</div>
		</>
	);
}

export default Home;
