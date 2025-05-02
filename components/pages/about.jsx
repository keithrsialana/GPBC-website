import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

function about() {

	return (
		<div className='container-fluid p-0'>
			<div className="jumbotron text-center">
				<h1 className="">About Us</h1>
				<p className="lead">Guelph Pinoy Basketball Club</p>
			</div>

			<div className='container mt-3'>
				<hr className="my-4 border-white" />
				<div className="row align-items-md-stretch mt-5 mb-5">
					<div className="col-md-6">
						<div className="h-100 p-5 text-bg-dark rounded-3">
							<h1>GPBC</h1>
							<p>Guelph Pinoy Basketball Club began as a small basketball club located in Guelph, Ontario by (Insert name here) in (Insert year) towards the goal of bringing the Pinoy community together in Guelph and to move past normal pickup games, to something a little more organized and competitive.</p>
							<p>Currently, the club is run by Jan Michael Relampagos and Kurt Ronald Sialana</p>
							<p>The relaunched club's first season started in (Insert Date) with great success, and the team is looking forward to more exciting seasons to come!</p>
							<br />
							<br />
							<div className='row justify-content-center mt-4' style={{ gap: "20px" }}>
								<div className="col-auto text-center">
									<img
										src="KS.jpg"
										alt="picture of Kurt Ronald Sialana"
										style={{
											width: "120px",
											height: "120px",
											borderRadius: "50%",
											objectFit: "cover",
											border: "3px solid white",
											marginBottom: "10px"
										}}
									/>
									<p className="m-0">Kurt Ronald Sialana</p>
								</div>

								<div className="col-auto text-center">
									<img
										src="JM.jpg"
										alt="picture of Jan Michael Relampagos"
										style={{
											width: "120px",
											height: "120px",
											borderRadius: "50%",
											objectFit: "cover",
											border: "3px solid white",
											marginBottom: "10px"
										}}
									/>
									<p className="m-0">Jan Michael Relampagos</p>
								</div>
							</div>
						</div>
					</div>
					<div className="col-md-6">
						<div className="h-100 p-5 bg-body-tertiary border rounded-3">
							<h3 className="mb-4 text-normal">Information</h3>

							<div className="text-start text-dark">
								<div className="line-separator"></div>
								<h4 className='text-normal'><b>Jan Michael Relampagos</b></h4>
								<Link to="https://www.facebook.com/relampagos17" target="_blank" rel="noopener noreferrer">
									<FaFacebookSquare style={{ color: "#6081C4", fontSize: "2em" }} />
								</Link>
								<Link to="https://www.instagram.com/thunderist17/" target="_blank" rel="noopener noreferrer">
									<FaInstagram style={{ color: "#C41662", fontSize: "2em" }} />
								</Link>
								<p className='text-normal'><b><MdEmail /> </b>thunderist17@gmail.com</p>

								<div className="line-separator mt-5"></div>
								<h4 className='text-normal'><b>Kurt Ronald Sialana</b></h4>
								<Link to="https://www.facebook.com/ksialana/" target="_blank" rel="noopener noreferrer">
									<FaFacebookSquare style={{ color: "#6081C4", fontSize: "2em" }} />
								</Link>
								<Link to="https://www.instagram.com/_kurtsialana_/" target="_blank" rel="noopener noreferrer">
									<FaInstagram style={{ color: "#C41662", fontSize: "2em" }} />
								</Link>
								<p className='text-normal'><b><MdEmail /> </b>dodongkr21@gmail.com</p>
							</div>
						</div>
					</div>

				</div>
			</div>
		</div>
	);
}

export default about;
