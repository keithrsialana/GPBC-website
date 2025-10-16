function AnnouncementCard({ announcement }) {
    if (!announcement) return null;

    return (
        <div className="card mb-4 shadow-sm" style={{ maxWidth: "600px", margin: "0 auto" }}>
            {/* Header */}
            <div className="card-header bg-white d-flex align-items-center">
                <img
                    src={announcement.profileImage || "Logo.png"}
                    alt="Profile"
                    style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "10px" }}
                />
                <strong>{announcement.author || "GPBC Admin"}</strong>
                <small className="text-muted ms-auto">
                    {announcement.date
                        ? new Date(announcement.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })
                        : "Just now"}
                </small>
            </div>

            {/* Image */}
            {announcement.imageUrl && (
                <img
                    src={announcement.imageUrl}
                    alt={announcement.title}
                    className="card-img-top"
                    style={{ objectFit: "contain", maxHeight: "400px", width: "100%", backgroundColor: "#000" }}
                />
            )}

            {/* Body */}
            <div className="card-body">
                <p className="mb-1 text-dark">
                    <strong>{announcement.title}</strong>
                </p>
                <p className="mt-2 text-start text-dark">{announcement.body}</p>
            </div>
        </div>
    );
}

export default AnnouncementCard;
