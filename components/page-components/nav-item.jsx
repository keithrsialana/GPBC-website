import { Link } from "react-router-dom";

function NavItem({ name, path }) {
	return (
		<Link to={path} className="btn btn-outline-primary hovering-animation">
			{name}
		</Link>
	);
}

export default NavItem;
