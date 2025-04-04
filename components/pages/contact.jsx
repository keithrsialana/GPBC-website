import { useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebookSquare } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { FaInstagram } from "react-icons/fa";

function Contact() {
	return (
		<div className="contentmargin">
			<h1>Contact Us</h1>
			<h3>
				If you have any inqueries about how to join the club, prices, or any
				other questions, please don't hesitate to contact us.
				<br /> You can reach us through email, or send a message to our social
				media accounts
			</h3>
			<Link to="mailto:thunderist17@gmail.com">
				<IoMail style={{ color: "#F25A4C", fontSize: "7em" }} />
			</Link>
			<Link to="https://www.facebook.com/GuelphPinoyBasketballClub">
				<FaFacebookSquare style={{ color: "#6081C4", fontSize: "7em" }} />
			</Link>
			<Link to="https://www.instagram.com/gpbc.official/">
				<FaInstagram style={{ color: "#C41662", fontSize: "7em" }} />
			</Link>
		</div>
	);
}

export default Contact;
