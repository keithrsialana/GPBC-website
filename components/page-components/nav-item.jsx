import { Link } from "react-router-dom";

function NavItem({ name, path }){
    return (
        <Link to={path}>
            {name}
        </Link>
    );
}

export default NavItem;