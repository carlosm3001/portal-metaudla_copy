import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function RawAuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchRawLogs = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3001/api/audit/raw", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRawLogs();
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main className="container mx-auto max-w-screen-2xl px-4 py-8 lg:px-6">
      <h1 className="text-3xl font-extrabold text-ink-primary">Raw Audit Log</h1>
      <pre>{JSON.stringify(logs, null, 2)}</pre>
    </main>
  );
}
