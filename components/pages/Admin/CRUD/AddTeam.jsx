import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { db } from "../../../../src/services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import Card from 'react-bootstrap/Card';
import { FaUsers } from 'react-icons/fa';
import { MdOutlineLeaderboard, MdLeaderboard } from "react-icons/md";
import { TfiAnnouncement } from "react-icons/tfi";
import { GrSchedule } from "react-icons/gr";
import { GiBasketballJersey } from "react-icons/gi";
import { FcCancel } from "react-icons/fc";

function AddTeam() {
    const [name, setName] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const storage = getStorage();
    const navigate = useNavigate();
    const { divisionId } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let imageUrl = "";
            let storagePath = "";

            if (imageFile) {
                storagePath = `teams/${Date.now()}-${imageFile.name}`;
                const storageRef = ref(storage, storagePath);
                await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(storageRef);
            }

            // ✅ Save team under the correct division
            const divisionTeamsRef = collection(db, "divisions", divisionId, "teams");
            await addDoc(divisionTeamsRef, {
                name,
                imageUrl,
                storagePath,
                createdAt: serverTimestamp(),
            });

            setName("");
            setImageFile(null);
            alert("Team added!");
            navigate("/admin-teams");
        } catch (error) {
            alert("Error: " + error.message);
        }
    };

    return (
        <div className="container-fluid p-0">
            <div className="jumbotron text-center">
                <br />
                <h1 className="display-4">ADMINISTRATOR</h1>
                <p>Dashboard</p>
            </div>
            <div className="container mt-4">
                <hr className="my-4 border-white" />
                <div className="row">
                    <div className="col-md-3" style={{ borderRight: "1px solid #ddd" }}>
                        <div className="text-white text-center" style={{ padding: "5px" }}>
                            <div className="admin-panel-section">
                                <div className="admin-panel-header d-flex justify-content-center align-items-center mb-2 p-2">
                                    <span className="me-2">📋</span>
                                    <h5 className="m-0">Manage</h5>
                                </div>
                                <ul className="navbar-nav">
                                    <li className="nav-item"><Link className="nav-link custom-link text-start" to="/admin-announcements"><TfiAnnouncement className="me-2 ms-2" /> Announcements</Link></li>
                                    <li className="nav-item"><Link className="nav-link custom-link text-start bg-hover-light" to="/admin-schedule"><GrSchedule className="me-2 ms-2" /> Schedule</Link></li>
                                    <li className="nav-item"><Link className="nav-link custom-link text-start bg-hover-light" style={{ backgroundColor: "#3f3954", borderRadius: "4px" }} to="/admin-teams"><GiBasketballJersey className="me-2 ms-2" /> Teams</Link></li>
                                    <li className="nav-item"><Link className="nav-link custom-link text-start bg-hover-light" to="/admin-players"><FaUsers className="me-2 ms-2" /> Players</Link></li>
                                    <li className="nav-item"><Link className="nav-link custom-link text-start bg-hover-light" to="/admin-standings"><MdOutlineLeaderboard className="me-2 ms-2" /> Standings</Link></li>
                                    <li className="nav-item"><Link className="nav-link custom-link text-start bg-hover-light" to="/admin-leaders"><MdLeaderboard className="me-2 ms-2" /> Leaders</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-9">
                        <Card>
                            <Card.Header>
                                <h1>Teams</h1>
                                <Link className="nav-link custom-link text-start" to="/admin-teams">
                                    <FcCancel className="me-2 ms-2" />Cancel Add Team
                                </Link>
                            </Card.Header>
                            <Card.Body>
                                <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto mt-10">
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        className="form-control mb-2"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                    <input
                                        type="file"
                                        className="form-control mb-3"
                                        onChange={(e) => setImageFile(e.target.files[0])}
                                        accept="image/*"
                                    />
                                    <button className="btn btn-success w-100">
                                        Add Team
                                    </button>
                                </form>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddTeam;
