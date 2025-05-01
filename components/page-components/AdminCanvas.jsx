import { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../src/services/firebase";

import Offcanvas from 'react-bootstrap/Offcanvas';
import Accordion from 'react-bootstrap/Accordion';
import { FaSignInAlt, FaUsers  } from 'react-icons/fa';
import { MdOutlineAdminPanelSettings, MdOutlineLeaderboard, MdLeaderboard } from "react-icons/md";
import { TfiAnnouncement } from "react-icons/tfi";
import { GrSchedule } from "react-icons/gr";
import { GiBasketballJersey } from "react-icons/gi";

function AdminCanvas() {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedEmail = localStorage.getItem("adminEmail");
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    const getUsernameFromEmail = (email) => {
        return email?.split("@")[0];
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/");
            console.log("Admin signed out.");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };
    

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Link className="nav-link" onClick={handleShow}>
                <MdOutlineAdminPanelSettings /> Admin Panel
            </Link>

            <Offcanvas show={show} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Hello, Admin {getUsernameFromEmail(email)}!</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Accordion flush>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>📋Dashboard</Accordion.Header>
                            <Accordion.Body>
                                <ul className="navbar-nav">
                                    <li className="nav-item">
                                        <Link className="nav-link custom-link text-start" to="/admin-announcements"><TfiAnnouncement/> Announcements</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link custom-link text-start" to="/admin-dashboard-tickets-purchased"><GrSchedule /> Schedule</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link custom-link text-start" to="/admin-dashboard-review-approval"><GiBasketballJersey /> Teams</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link custom-link text-start" to="/admin-dashboard-approved-reviews"><FaUsers /> Players</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link custom-link text-start" to="/admin-dashboard-approved-reviews"><MdOutlineLeaderboard /> Standings</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link custom-link text-start" to="/admin-dashboard-approved-reviews"><MdLeaderboard /> Leaders</Link>
                                    </li>
                                </ul>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                    <div className="d-flex justify-content-end mt-3 p-2">
                        <button className="btn btn-outline-danger" onClick={handleLogout}><FaSignInAlt /></button>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

export default AdminCanvas;