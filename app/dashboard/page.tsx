"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [salesUsers, setSalesUsers] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    source: "",
    assignedTo: "",
  });

  const router = useRouter();

  const fetchMe = async () => {
    const res = await fetch("/api/me");
    const data = await res.json();
    setRole(data.role);
  };

  const fetchLeads = async () => {
    const res = await fetch("/api/leads");
    const data = await res.json();
    setLeads(data);
  };

  const fetchSalesUsers = async () => {
    const res = await fetch("/api/sales-users");
    if (res.ok) {
      const data = await res.json();
      setSalesUsers(data);
    }
  };

  useEffect(() => {
    fetchMe();
    fetchLeads();
    fetchSalesUsers();
  }, []);

  const handleCreate = async () => {
  const res = await fetch("/api/leads/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Something went wrong");
    return;
  }

  alert("Lead created successfully");

  setForm({
    name: "",
    email: "",
    phone: "",
    source: "",
    assignedTo: "",
  });

  fetchLeads();
};


  const handleDelete = async (id: string) => {
    await fetch("/api/leads/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchLeads();
  };

const handleExport = async () => {
  const res = await fetch("/api/leads/export");

  if (!res.ok) {
    alert("Export failed");
    return;
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "leads.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};



  const handleStatusChange = async (id: string, status: string) => {
    await fetch("/api/leads/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchLeads();
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  if (!role) return <div className="p-10 text-lg">Loading...</div>;

  const getStatusColor = (status: string) => {
    if (status === "New") return "bg-blue-100 text-blue-800";
    if (status === "Contacted") return "bg-yellow-100 text-yellow-800";
    if (status === "Converted") return "bg-green-100 text-green-800";
    return "";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Mini CRM <span className="text-gray-500 text-lg">({role})</span>
        </h1>
        <div className="flex justify-between items-center mb-6">
  <h2 className="text-xl font-semibold">Leads</h2>

  {role === "admin" && (
    <button
      onClick={handleExport}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
    >
      Export Excel
    </button>
  )}
</div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Create Lead Card */}
      {role === "admin" && (
        <div className="bg-white p-6 rounded shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Lead</h2>

          <div className="grid grid-cols-2 gap-4">
            <input
              className="border p-2 rounded"
              placeholder="Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              className="border p-2 rounded"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              className="border p-2 rounded"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />

            <input
              className="border p-2 rounded"
              placeholder="Source"
              value={form.source}
              onChange={(e) =>
                setForm({ ...form, source: e.target.value })
              }
            />

            <select
              className="border p-2 rounded col-span-2"
              value={form.assignedTo}
              onChange={(e) =>
                setForm({ ...form, assignedTo: e.target.value })
              }
            >
              <option value="">Select Sales Executive</option>
              {salesUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.email}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleCreate}
            className="mt-4 bg-black hover:bg-gray-800 text-white px-6 py-2 rounded"
          >
            Create Lead
          </button>
        </div>
      )}

      {/* Leads Section */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Leads</h2>

        {leads.length === 0 && (
          <p className="text-gray-500">No leads found.</p>
        )}

        <div className="space-y-4">
          {leads.reverse().slice(0).map((lead) => (
            <div
              key={lead._id}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{lead.name}</p>
                <p className="text-sm text-gray-600">{lead.email}</p>
                <p className="text-sm text-gray-600">{lead.phone}</p>
                <p className="text-sm text-gray-600">
                  Source: {lead.source}
                </p>
              </div>

              <div className="flex items-center gap-4">

                {/* Status Dropdown */}
                <select
                  className={`p-2 rounded border ${getStatusColor(
                    lead.status
                  )}`}
                  value={lead.status}
                  onChange={(e) =>
                    handleStatusChange(lead._id, e.target.value)
                  }
                >
                  <option>New</option>
                  <option>Contacted</option>
                  <option>Converted</option>
                </select>

                {role === "admin" && (
                  <button
                    onClick={() => handleDelete(lead._id)}
                    className="bg-gray-800 hover:bg-black text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
