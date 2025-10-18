import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { db, storage } from "../../../../src/services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import Card from "react-bootstrap/Card";
import { FaUsers } from "react-icons/fa";
import { MdOutlineLeaderboard, MdLeaderboard } from "react-icons/md";
import { TfiAnnouncement } from "react-icons/tfi";
import { GrSchedule } from "react-icons/gr";
import { GiBasketballJersey } from "react-icons/gi";
import { FcCancel } from "react-icons/fc";

function EditAnnouncement() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [storagePath, setStoragePath] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch existing announcement
    useEffect(() => {
        const fetchAnnouncement = async () => {
            try {
                const docRef = doc(db, "announcements", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setTitle(data.title);
                    setBody(data.body);
                    setImageUrl(data.imageUrl || "");
                    setStoragePath(data.storagePath || "");
                } else {
                    console.log("No such announcement!");
                }
            } catch (error) {
                console.error("Error fetching announcement:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnnouncement();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let updatedImageUrl = imageUrl;
            let updatedStoragePath = storagePath;

            if (imageFile) {
                updatedStoragePath = `announcements/${Date.now()}-${imageFile.name}`;
                const storageRef = ref(storage, updatedStoragePath);
                await uploadBytes(storageRef, imageFile);
                updatedImageUrl = await getDownloadURL(storageRef);
            }

            const docRef = doc(db, "announcements", id);
            await updateDoc(docRef, {
                title,
                body,
                imageUrl: updatedImageUrl,
                storagePath: updatedStoragePath
            });

            alert("Announcement updated!");
            navigate("/admin-announcements");
        } catch (error) {
            console.error("Error updating announcement:", error);
            alert("Failed to update announcement.");
        }
    };

    if (loading) return <p>Loading announcement...</p>;

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
                                    <li className="nav-item">
                                        <Link
                                            className="nav-link custom-link text-start"
                                            style={{ backgroundColor: "#3f3954", borderRadius: "4px" }}
                                            to="/admin-announcements"
                                        >
                                            <TfiAnnouncement className="me-2 ms-2" /> Announcements
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link custom-link text-start bg-hover-light" to="/admin-schedule">
                                            <GrSchedule className="me-2 ms-2" /> Schedule
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link custom-link text-start bg-hover-light" to="/admin-teams">
                                            <GiBasketballJersey className="me-2 ms-2" /> Teams
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link custom-link text-start bg-hover-light" to="/admin-players">
                                            <FaUsers className="me-2 ms-2" /> Players
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link custom-link text-start bg-hover-light" to="/admin-standings">
                                            <MdOutlineLeaderboard className="me-2 ms-2" /> Standings
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link custom-link text-start bg-hover-light" to="/admin-leaders">
                                            <MdLeaderboard className="me-2 ms-2" /> Leaders
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-9">
                        <Card>
                            <Card.Header>
                                <h1>Announcements</h1>
                                <Link className="nav-link custom-link text-start" to="/admin-announcements">
                                    <FcCancel className="me-2 ms-2" />Cancel Announcement Edit
                                </Link>
                            </Card.Header>
                            <Card.Body>
                                <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto mt-10">
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        className="form-control mb-2"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                    <textarea
                                        placeholder="Body"
                                        className="form-control mb-2"
                                        value={body}
                                        onChange={(e) => setBody(e.target.value)}
                                        required
                                    />
                                    {imageUrl && (
                                        <img
                                            src={imageUrl}
                                            alt="Current"
                                            className="mb-3"
                                            style={{ width: "150px", height: "150px", objectFit: "cover" }}
                                        />
                                    )}
                                    <input
                                        type="file"
                                        className="form-control mb-3"
                                        onChange={(e) => setImageFile(e.target.files[0])}
                                        accept="image/*"
                                    />
                                    <button className="btn btn-success w-100">Update Announcement</button>
                                </form>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditAnnouncement;
