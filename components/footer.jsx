import { useEffect, useState } from "react";

import { FaFacebookSquare } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { FaInstagram } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function Footer() {
	const [clickCount, setClickCount] = useState(0);
	const [timer, setTimer] = useState(null);
	const navigate = useNavigate();

	const handleLogoClick = () => {
		if (clickCount === 0) {
			const newTimer = setTimeout(() => setClickCount(0), 2000); // 2 seconds limit
			setTimer(newTimer);
		}

		setClickCount(prev => prev + 1);

		if (clickCount + 1 === 7) {
			clearTimeout(timer);
			setClickCount(0);
			// Show admin login
			navigate("/internal-portal-KRTS21-RICEKEET65-JM17-8f2a");
		}
	};

	return (
		<footer
			className="d-flex rounded align-items-center justify-content-center"
			style={{ minHeight: "15vh", paddingTop: "10px", paddingBottom: "10px" }}
		>
			<div className="row">
				<div className="col d-flex flex-column align-items-center">
					<div className="row">
						<div className="col">
							<p>Guelph Pinoy Basketball Club</p>{" "}
						</div>
					</div>

					<div className="row">
						<div className="col">
							<Link to="mailto:thunderist17@gmail.com">
								<IoMail style={{ color: "#F25A4C", fontSize: "2em" }} />
							</Link>
						</div>
						<div className="col">
							<Link to="https://www.facebook.com/GuelphPinoyBasketballClub">
								<FaFacebookSquare
									style={{ color: "#6081C4", fontSize: "2em" }}
								/>
							</Link>
						</div>
						<div className="col">
							<Link to="https://www.instagram.com/gpbc.official/">
								<FaInstagram style={{ color: "#C41662", fontSize: "2em" }} />
							</Link>
						</div>
					</div>
				</div>
				<div className="col d-flex align-items-center justify-content-center">
					<img src="Logo.png" alt="GPBC Logo" width="50%" onClick={handleLogoClick} />
				</div>
				<div className="col d-flex align-items-center justify-content-start">
					<p>GPBC © 2025</p>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
