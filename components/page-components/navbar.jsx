import NavItem from "./nav-item";

function NavBar() {
	return (
		<div className="flex-container" style={{display: 'flex', flexDirection: 'row'}}>
			<NavItem name="Home" path={"/"}/>
			<NavItem name="About Us" path={"/about"}/>
			<NavItem name="Statistics" path={"/statistics"}/>
			<NavItem name="Schedules" path={"/schedules"}/>
			<NavItem name="Contact Us" path={"/contact"}/>
		</div>
	);
}

export default NavBar;
