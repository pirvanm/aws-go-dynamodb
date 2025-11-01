import { useEffect, useState } from "react";
import { Link } from "react-router"

type Notification = {
  id: number;
  user_id: number;
  type: string;
  payload: string;
  created_at: number;
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_BACKEND_API_URL;

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API_URL}/notifications`);
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <div className="max-w-5xl mx-auto p-6 rounded shadow bg-gray-800">
        <div className="flex justify-between">
            <h1 className="text-2xl font-bold mb-4">Notifications</h1>
            <div className="flex">
                <Link to="/">Back</Link>
            </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : notifications.length === 0 ? (
          <p>No notifications found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-2 border border-gray-700">ID</th>
                  <th className="px-4 py-2 border border-gray-700">User ID</th>
                  <th className="px-4 py-2 border border-gray-700">Type</th>
                  <th className="px-4 py-2 border border-gray-700">Payload</th>
                  <th className="px-4 py-2 border border-gray-700">Created At</th>
                </tr>
              </thead>
              <tbody>
                {notifications?.map((n) => (
                  <tr key={n.id} className="hover:bg-gray-700">
                    <td className="px-4 py-2 border border-gray-700 truncate">{n.id}</td>
                    <td className="px-4 py-2 border border-gray-700 truncate">{n.user_id}</td>
                    <td className="px-4 py-2 border border-gray-700 truncate">{n.type}</td>
                    <td className="px-4 py-2 border border-gray-700 truncate">{n.payload}</td>
                    <td className="px-4 py-2 border border-gray-700 truncate">
                      {new Date(n.created_at * 1000).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
