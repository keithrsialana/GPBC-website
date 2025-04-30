function AnnouncementCard({ announcement }) {
    return (
        <div className="border p-4 rounded mb-4 shadow">
            <h2 className="text-xl font-semibold">{announcement.title}</h2>
            <p className="mt-2">{announcement.body}</p>
            <small className="text-gray-500">{new Date(announcement.date).toLocaleDateString()}</small>
        </div>
    );
}

export default AnnouncementCard;