import NavItem from "./nav-item";

function NavBar() {
	return (
		<div className="flex-container" style={{display: 'flex', flexDirection: 'row'}}>
			<NavItem name="Home" path={"/"}/>
			<NavItem name="About Us" path={"/about"}/>
			<NavItem name="Statistics" path={"/stats"}/>
			<NavItem name="Schedules" path={"/schedules"}/>
			<NavItem name="Contact Us" path={"/contactus"}/>
		</div>
	);
}

export default NavBar;
