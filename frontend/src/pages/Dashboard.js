import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const fmt = (d) => d ? new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—";
const initials = (name = "") => name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } finally { setLoading(false); }
    })();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center">
      <p className="font-mono text-sm text-slate-400">loading session…</p>
    </div>
  );

  const token = localStorage.getItem("token");
  const tokenPreview = token ? token.slice(0, 26) + "…" : "—";

  const securityItems = [
    { label: "Password hashing", value: "bcrypt · 10 rounds" },
    { label: "Session method", value: "JWT · HS-256" },
    { label: "OTP validity", value: "10 minutes" },
    { label: "Rate limiting", value: "50 req / 15 min" },
  ];

  const events = [
    { label: "Account created", time: fmt(user?.createdAt) },
    { label: "Email verified", time: fmt(user?.createdAt) },
    { label: "Last login", time: fmt(user?.lastLogin) },
    { label: "Active session issued", time: "Just now" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-indigo-500 flex items-center justify-center text-white font-bold text-base flex-shrink-0" style={{fontFamily:"'Space Grotesk',sans-serif"}}>
            {initials(user?.name)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900" style={{fontFamily:"'Space Grotesk',sans-serif"}}>Hey, {user?.name?.split(" ")[0]} </h2>
            <p className="text-sm text-slate-500 mt-0.5">Your session is active and verified</p>
          </div>
        </div>
        <button onClick={handleLogout} className="px-4 py-2 text-sm font-semibold border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-100 transition-all">Logout</button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="font-mono text-[11px] tracking-widest uppercase text-slate-400 mb-3">Account status</p>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span> Verified
          </span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="font-mono text-[11px] tracking-widest uppercase text-slate-400 mb-3">Member since</p>
          <p className="text-sm font-semibold text-slate-700">{fmt(user?.createdAt)}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="font-mono text-[11px] tracking-widest uppercase text-slate-400 mb-3">Last login</p>
          <p className="text-sm font-semibold text-slate-700">{fmt(user?.lastLogin)}</p>
        </div>
      </div>

      {/* Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-4 mb-4">
        {/* Profile */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-5" style={{fontFamily:"'Space Grotesk',sans-serif"}}>Profile</h3>
          {[
            { key: "Full name", val: user?.name },
            { key: "Email", val: user?.email },
            { key: "Verification", val: <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>Verified</span> },
            { key: "User ID", val: <span className="font-mono text-xs">{user?.id?.slice(-8)}</span> },
            { key: "Session token", val: <span className="font-mono text-[11px] text-slate-500">{tokenPreview}</span> },
          ].map((row, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
              <span className="text-sm text-slate-400">{row.key}</span>
              <span className="text-sm font-semibold text-slate-800">{row.val}</span>
            </div>
          ))}
        </div>

        {/* Activity */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-5" style={{fontFamily:"'Space Grotesk',sans-serif"}}>Activity</h3>
          <div className="space-y-4">
            {events.map((e, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-teal-500 mt-1.5 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{e.label}</p>
                  <span className="text-xs text-slate-400">{e.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security overview */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h3 className="font-bold text-slate-900 mb-5" style={{fontFamily:"'Space Grotesk',sans-serif"}}>Security overview</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {securityItems.map((item, i) => (
            <div key={i}>
              <p className="font-mono text-[10px] tracking-widest uppercase text-slate-400 mb-1.5">{item.label}</p>
              <p className="text-sm font-semibold text-slate-800">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
