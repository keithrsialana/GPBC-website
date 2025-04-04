import NavItem from "./nav-item";

function NavBar() {
	return (
		<div className="flex-container" style={{display: 'flex', flexDirection: 'row'}}>
			<NavItem name="Home" path={"/"}/>
			<NavItem name="Schedules" path={"/schedules"}/>
			<NavItem name="Statistics" path={"/statistics"}/>
			<NavItem name="Contact Us" path={"/contact"}/>
			<NavItem name="About Us" path={"/about"}/>
		</div>
	);
}

export default NavBar;
