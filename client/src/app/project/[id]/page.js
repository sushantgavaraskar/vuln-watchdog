"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import FileUploader from "./FileUploader";

export default function ProjectDetailPage() {
  const { data: session } = useSession();
  const params = useParams();
  const [dependencies, setDependencies] = useState([]);

  useEffect(() => {
    if (!session) return;
    const fetchDeps = async () => {
      const res = await axios.get(`http://localhost:5000/api/scan/${params.id}`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
      setDependencies(res.data);
    };
    fetchDeps();
  }, [session, params.id]);

  if (!session) return <div className="p-8">Please login.</div>;

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("projectId", params.id);
    await axios.post("http://localhost:5000/api/scan", formData, {
      headers: { Authorization: `Bearer ${session?.user?.token}`, 'Content-Type': 'multipart/form-data' }
    });
    window.location.reload();
  };

  return (
    <main className="p-8">
      <h2 className="text-2xl font-bold mb-4">Dependencies</h2>
      <ul>
        {dependencies.map(dep => (
          <li key={dep.id}>{dep.name}@{dep.version} ({dep.risk})</li>
        ))}
      </ul>
      <FileUploader onChange={handleFileUpload} />
    </main>
  );
}