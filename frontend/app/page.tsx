"use client";

import { useEffect, useState } from "react";

type Lead = {
  _id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
};


export default function Home() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("New");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true); // This will tell React that submission has started
    setError(""); // This will clear any previous error

    const response = await fetch("http://localhost:5000/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        name, 
        email, 
        status 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      setError(errorData.message || "Failed to create lead.");
      setLoading(false); // This will tell React that submission has ended
      return;
    }
    
    const newLead = await response.json();

    setLeads((currentLeads) => [...currentLeads, newLead]);
    setName("");
    setEmail("");
    setStatus("New");
    setLoading(false); 
  };

  useEffect(() => {
  fetch("http://localhost:5000/leads")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch leads");
      }

      return response.json();
    })
    .then((data) => setLeads(data))
    .catch((error) => {
      setError(error.message || "Failed to create lead.");
    });
}, []);

 return (
  <main className="min-h-screen bg-gray-50 p-6">
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
      Lead Management System
      </h1>

    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">
        Add New Lead
      </h2>

      {error && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block font-medium">
          Name
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="mt-1 w-full rounded-md border border-gray-300 p-2"
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="mt-1 w-full rounded-md border border-gray-300 p-2"
            />
        </label>
        <label>
          Status
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 p-2"
            >
              <option value="New">New</option>
              <option value="Engaged">Engaged</option>
              <option value="Proposal Sent">Proposal Sent</option>
              <option value="Closed-Won">Closed - Won</option>
              <option value="Closed-Lost">Closed - Lost</option>
            </select>
        </label>

        <button 
          type="submit" 
          disabled={loading} 
          className="mt-2 rounded-md bg-black px-4 py-2 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Lead"}
        </button>

      </form>
    </section>

    <section className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold mt-10 mb-4">
        Leads
      </h2>

        {leads.length === 0 && (
          <p className="text-sm text-gray-500">
            No leads have been added yet.
          </p>
        )}

      {leads.map((lead) => (
        <div 
        key={lead._id}
        className="rounded-lg border border-gray-200 bg-white p-5 mb-4 shadow-sm"
        >
          <p className="text-lg font-semibold">
            {lead.name}
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {lead.email}
          </p>
          <p className="mt-3 text-sm">
            <strong>Status:</strong> {"  "}
            <span 
            className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
              lead.status === "New"
                ? "bg-blue-100 text-blue-700"
                : lead.status === "Engaged"
                ? "bg-yellow-100 text-yellow-700"
                : lead.status === "Proposal Sent"
                ? "bg-purple-100 text-purple-700"
                : lead.status === "Closed-Won"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
        }`}>
              {lead.status}
            </span>
            </p>
          <p className="mt-2 text-xs text-gray-500"> 
            Created: {new Date(lead.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </section>
    </div>
  </main>

 );
}