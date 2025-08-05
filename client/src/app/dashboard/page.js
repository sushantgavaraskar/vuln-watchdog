"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!session) return;
    const fetchProjects = async () => {
      const res = await axios.get("http://localhost:5000/api/project", {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
      setProjects(res.data);
    };
    fetchProjects();
  }, [session]);

  const handleCreate = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/project", { name, description }, {
      headers: { Authorization: `Bearer ${session?.user?.token}` }
    });
    window.location.reload();
  };

  if (!session) return <div className="p-8">Please login.</div>;

  return (
    <main className="p-8">
      <h2 className="text-2xl font-bold mb-4">Your Projects</h2>
      <form onSubmit={handleCreate} className="flex gap-2 mb-4">
        <input type="text" placeholder="Project name" value={name} onChange={e => setName(e.target.value)} className="border p-2 rounded" required />
        <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="border p-2 rounded" />
        <button type="submit" className="bg-green-600 text-white p-2 rounded">Create</button>
      </form>
      <ul>
        {projects.map(p => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </main>
  );
}