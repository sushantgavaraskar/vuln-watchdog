"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import axios from "axios";

export default function AlertsPage() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    dailyDigest: false,
    securityAlerts: true,
    alertFrequency: "immediate"
  });
  const [msg, setMsg] = useState("");

  const handleSave = async () => {
    try {
      await axios.post("http://localhost:5000/api/alerts/config", settings, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
      setMsg("Settings saved");
    } catch {
      setMsg("Failed to save settings");
    }
  };

  if (!session) return <div className="p-8">Please login.</div>;

  return (
    <main className="p-8">
      <h2 className="text-2xl font-bold mb-4">Alert Settings</h2>
      <div className="flex flex-col gap-2 max-w-sm">
        <label>
          <input type="checkbox" checked={settings.emailNotifications} onChange={e => setSettings(s => ({ ...s, emailNotifications: e.target.checked }))} /> Email Notifications
        </label>
        <label>
          <input type="checkbox" checked={settings.dailyDigest} onChange={e => setSettings(s => ({ ...s, dailyDigest: e.target.checked }))} /> Daily Digest
        </label>
        <label>
          <input type="checkbox" checked={settings.securityAlerts} onChange={e => setSettings(s => ({ ...s, securityAlerts: e.target.checked }))} /> Security Alerts
        </label>
        <select value={settings.alertFrequency} onChange={e => setSettings(s => ({ ...s, alertFrequency: e.target.value }))} className="border p-2 rounded">
          <option value="immediate">Immediate</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
        <button onClick={handleSave} className="bg-blue-600 text-white p-2 rounded">Save</button>
        {msg && <div>{msg}</div>}
      </div>
    </main>
  );
}