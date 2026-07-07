import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed.";
      setError(msg);
      if (msg.toLowerCase().includes("verify")) navigate("/verify-otp", { state: { email: form.email } });
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-md p-9">
        <span className="font-mono text-xs tracking-widest uppercase text-teal-700 mb-2 block">Welcome back</span>
        <h2 className="text-2xl font-bold text-slate-900 mb-1" style={{fontFamily:"'Space Grotesk',sans-serif"}}>Login to Flowgate</h2>
        <p className="text-sm text-slate-500 mb-7">Secure session issued via signed JWT.</p>

        {error && <div className="flex gap-2 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">⚠ {error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Email address", name: "email", type: "email", placeholder: "you@example.com" },
            { label: "Password", name: "password", type: "password", placeholder: "Your password" },
          ].map(f => (
            <div key={f.name}>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">{f.label}</label>
              <input name={f.name} type={f.type} placeholder={f.placeholder} value={form[f.name]} onChange={handleChange} required
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all" />
            </div>
          ))}
          <button type="submit" disabled={loading}
            className="w-full mt-1 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-all shadow-sm disabled:opacity-55 disabled:cursor-not-allowed active:scale-[0.98]">
            {loading ? "Signing in…" : "Login →"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          New here?{" "}
          <Link to="/register" className="text-teal-700 font-semibold hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
