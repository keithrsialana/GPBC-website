import NavItem from "./nav-item";
import { Link } from "react-router-dom";

function NavBar() {
	return (
		<nav
			className="navbar navbar-expand-lg navbar-dark justify-content-end"
			style={{ width: "100%" }}
		>
			<button
				className="navbar-toggler"
				type="button"
				data-bs-toggle="collapse"
				data-bs-target="#navbarSupportedContent"
				aria-controls="navbarSupportedContent"
				aria-expanded="false"
				aria-label="Toggle navigation"
			>
				<span className="navbar-toggler-icon"></span>
			</button>

			<div
				className="collapse navbar-collapse justify-content-end"
				id="navbarSupportedContent"
			>
				<ul className="navbar-nav mr-auto rounded">
					<li className="nav-item">
						<NavItem name="Home" path={"/"} />
					</li>
					<li className="nav-item">
						<NavItem name="Schedule" path={"/schedule"} />
					</li>
					<li className="nav-item">
						<NavItem name="Statistics" path={"/statistics"} />
					</li>
					<li className="nav-item">
						<NavItem name="Contact Us" path={"/contact"} />
					</li>
					<li className="nav-item">
						<NavItem name="About Us" path={"/about"} />
					</li>
					<li className="nav-item ml-1">
						<Link to="/login">
							<button type="button" className="btn btn-primary">
								Admin Login
							</button>
						</Link>
					</li>
				</ul>
			</div>
		</nav>
	);
}

export default NavBar;
