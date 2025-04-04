import { Link } from "react-router-dom";
import NavBar from "./page-components/NavBar";

function Header() {
	return (
		<div className="d-flex align-items-center" style={{display:"flex", height:"100px"}}>
			<div className="col-3">
				<img src="Logo.png" alt="GPBC Logo" style={{width:"45%"}}/>
			</div>
			<div className="col-2"></div>

			<div className="col-7 flex-container" style={{ display: "flex", height: "40%"}}>
				<NavBar />
			<div className="col-1"></div>
				<Link to="/login">
					<button type="button" className="btn btn-primary">
						Admin Login
					</button>
				</Link>
			</div>
		</div>
	);
}

export default Header;
