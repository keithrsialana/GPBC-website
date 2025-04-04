import { Link } from "react-router-dom";
import NavBar from "./page-components/NavBar";

function Header() {
	return (
		<div
			className="d-flex align-items-center"
			style={{
				display: "flex",
				height: "100px",
				width: "auto",
			}}
		>
			<div className="col-5" style={{ height: "100%" }}>
				<img
					src="Logo.png"
					alt="GPBC Logo"
					style={{ objectFit: "contain", height: "100%", width: "100%" }}
				/>
			</div>
			<div className="col-1"></div>
			<div
				className="col-6 flex-container"
				style={{ display: "flex", height: "40%" }}
			>
				<NavBar />
			</div>
		</div>
	);
}

export default Header;
