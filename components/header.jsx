import { Link } from "react-router-dom";
import NavBar from "./page-components/NavBar";

function Header() {
	return (
		<div
			className="d-flex align-items-center container-fluid"
			style={{
				height: "100px",
                width: "100%"
			}}
		>
			<div style={{ height: "100%"}}>
				<img
					src="Logo.png"
					alt="GPBC Logo"
					style={{ objectFit: "contain", height: "100%", width: "100%" }}
				/>
			</div>
			<div
                className="container-flex"
				style={{ display: "flex", height: "40%", width:"100%" }}
			>
				<NavBar/>
			</div>
		</div>
	);
}

export default Header;
