import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Link } from "react-router"

type User = {
  id: number;
  name: string;
  email: string;
};

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const API_URL = import.meta.env.VITE_BACKEND_API_URL;

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add user
  const addUser = async () => {
    if (!name || !email) return;
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const response = await res.json();

      if (response.error) {
        toast.error('Something went wrong, please provide valid data.')
        return;
      } 

      setUsers([...users, response]);
      setName("");
      setEmail("");
      setShowModal(false);
      toast.success("User saved successfully!")
    } catch (err) {
      console.error("Failed to add user:", err);
    }
  };

  // Delete user
  const deleteUser = async (id: number) => {
    try {
      await fetch(`${API_URL}/users/${id}`, { method: "DELETE" });
      setUsers(users.filter((u) => u.id !== id));
      toast.success("User removed successfully!")
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <div className="max-w-4xl mx-auto p-6 rounded shadow bg-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Users</h1>
          <div className="flex gap-2">
            <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add User
          </button>
          <Link
            to="/notifications"
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Notifications
          </Link>
          </div>
        </div>

        <table className="w-full border border-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2 border border-gray-700">ID</th>
              <th className="px-4 py-2 border border-gray-700">Name</th>
              <th className="px-4 py-2 border border-gray-700">Email</th>
              <th className="px-4 py-2 border border-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-700">
                <td className="px-4 py-2 border border-gray-700 truncate">{u.id}</td>
                <td className="px-4 py-2 border border-gray-700 truncate">{u.name}</td>
                <td className="px-4 py-2 border border-gray-700 truncate">{u.email}</td>
                <td className="px-4 py-2 border border-gray-700">
                  <button
                    onClick={() => deleteUser(u.id)}
                    className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 text-white"
                  >
                    Delete
                  </button>
                   <Link
                      to={`/notes/${u.id}`}
                    className="px-3 py-1 bg-green-500 rounded hover:bg-green-600 text-white ml-2"
                  >
                    Notes
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 text-gray-300 flex items-center justify-center">
          <div className="bg-gray-800 rounded p-6 w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add New User</h2>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-3 px-3 py-2 border rounded bg-gray-700 text-white"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-3 px-3 py-2 border rounded bg-gray-700 text-white"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded border hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={addUser}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
