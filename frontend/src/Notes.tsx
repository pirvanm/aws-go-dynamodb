import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Link, useParams } from "react-router";

type Note = {
  id: number;
  userId: number;
  title: string;
  content: string;
  createdAt: number;
};

export default function Notes() {
  const { userId } = useParams<{ userId: string }>();
  const [notes, setNotes] = useState<Note[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const API_URL = import.meta.env.VITE_BACKEND_API_URL;

  // Fetch notes for this user
  const fetchNotes = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${API_URL}/${userId}/notes`);
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [userId]);

  // Add note
  const addNote = async () => {
    if (!title || !content || !userId) return;

    try {
      const res = await fetch(`${API_URL}/${userId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      const response = await res.json();

      if (response.error) {
        toast.error("Failed to add note");
        return;
      }

      setNotes([...notes, response]);
      setTitle("");
      setContent("");
      setShowModal(false);
      toast.success("Note added successfully!");
    } catch (err) {
      console.error("Failed to add note:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <div className="max-w-4xl mx-auto p-6 rounded shadow bg-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Notes for User {userId}</h1>
          <div className="flex gap-4 items-center">
            <Link to="/">Back</Link>
            <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
          >
            Add Note
          </button>
          </div>
        </div>

        <div className="">
          {notes.length === 0 && <p>No notes found.</p>}
          <ul>
            {notes.map((note) => (
              <li key={note.id} className="mb-3 border-b border-gray-700 pb-2">
                <h3 className="font-bold">{note.title}</h3>
                <p>{note.content}</p>
                <small>{new Date(note.createdAt * 1000).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded p-6 w-96 shadow-lg">
            <h2 className="text-lg font-bold mb-3">Add Note</h2>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mb-3 px-3 py-2 rounded bg-gray-700 text-white"
            />
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full mb-3 px-3 py-2 rounded bg-gray-700 text-white"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded border hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={addNote}
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
