function Footer() {
	return (
		<footer
			className="d-flex rounded align-items-center justify-content-center"
			style={{ minHeight: "15vh" }}
		>
			<div className="row">
				<div className="col d-flex align-items-center justify-content-end">
					<p>Guelph Pinoy Basketball Club</p>
				</div>
				<div className="col d-flex align-items-center justify-content-center">
					<img
						src="Logo.png"
						alt="GPBC Logo"
						width="50%"
					/>
				</div>
				<div className="col d-flex align-items-center justify-content-start">
					<p>GPBC © 2025</p>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
