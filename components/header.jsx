import { Link } from "react-router-dom";
import NavBar from "./page-components/NavBar";

function Header() {
	return (
		<div
			className="d-flex align-items-center container-fluid contentmargin"
			style={{
				height: "100px",
			}}
		>
			<div style={{ height: "100%" }}>
				<Link to="/">
					<img
						src="Logo.png"
						alt="GPBC Logo"
						style={{ objectFit: "contain", height: "100%", width: "100%" }}
					/>
				</Link>
			</div>
			<div
				className="container-flex"
				style={{ display: "flex", height: "40%", width: "100%", zIndex: "1" }}
			>
				<NavBar />
			</div>
		</div>
	);
}

export default Header;
