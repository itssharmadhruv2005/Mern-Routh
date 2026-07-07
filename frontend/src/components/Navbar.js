import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const isDash = location.pathname === "/dashboard";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-20 bg-slate-50/85 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 font-bold text-lg text-slate-900" style={{fontFamily:"'Space Grotesk',sans-serif"}}>
          <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-indigo-500 flex items-center justify-center text-white flex-shrink-0">
            <LockIcon />
          </span>
          Flowgate
        </Link>
        <div className="flex items-center gap-2.5">
          {token ? (
            <>
              {!isDash && (
                <Link to="/dashboard">
                  <button className="px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-100 hover:border-slate-300 transition-all">Dashboard</button>
                </Link>
              )}
              <button onClick={handleLogout} className="px-4 py-2 text-sm font-semibold text-white bg rounded-lg hover:bg-slate-800 transition-all shadow-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"><button className="px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-100 transition-all">Login</button></Link>
              <Link to="/register"><button className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-all shadow-sm">Get started</button></Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
