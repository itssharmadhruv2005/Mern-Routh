import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../api";

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault(); setError(""); setInfo(""); setLoading(true);
    try {
      const { data } = await api.post("/auth/verify-otp", { email, otp });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed. Check the code and try again.");
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    setError(""); setInfo("");
    try {
      await api.post("/auth/resend-otp", { email });
      setInfo("New OTP sent — check your inbox.");
    } catch (err) { setError(err.response?.data?.message || "Could not resend OTP."); }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-md p-9">
        <Link to="/register" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 mb-5 transition-colors">← Back</Link>
        <span className="font-mono text-xs tracking-widest uppercase text-teal-700 mb-2 block">Step 2 of 2</span>
        <h2 className="text-2xl font-bold text-slate-900 mb-1" style={{fontFamily:"'Space Grotesk',sans-serif"}}>Verify your email</h2>
        <p className="text-sm text-slate-500 mb-7">
          Enter the 6-digit code sent to <strong className="text-slate-700">{email || "your email"}</strong>. Expires in 10 minutes.
        </p>

        {error && <div className="flex gap-2 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">⚠ {error}</div>}
        {info  && <div className="flex gap-2 bg-green-50 text-green-700 text-sm px-4 py-3 rounded-xl mb-5">✓ {info}</div>}

        <form onSubmit={handleVerify} className="space-y-4">
          {!location.state?.email && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email address</label>
              <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all" />
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">One-time code</label>
            <input placeholder="• • • • • •" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ""))} maxLength={6} required
              className="w-full px-3.5 py-3 text-2xl font-mono tracking-[0.5em] text-center border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all" />
            <p className="text-xs text-slate-400 mt-1.5">Code is hashed in DB · expires after 10 min</p>
          </div>
          <button type="submit" disabled={loading || otp.length < 6}
            className="w-full py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-all shadow-sm disabled:opacity-55 disabled:cursor-not-allowed active:scale-[0.98]">
            {loading ? "Verifying…" : "Confirm & log in →"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">Didn't get the code?</span>
          <button onClick={handleResend} className="text-sm font-semibold text-teal-700 hover:underline">Resend OTP</button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
