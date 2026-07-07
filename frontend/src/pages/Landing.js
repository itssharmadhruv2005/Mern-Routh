import React from "react";
import { Link } from "react-router-dom";

const features = [
  { icon: "🔒", title: "JWT Sessions", desc: "Stateless signed tokens issued on login. Middleware validates expiry on every protected request." },
  { icon: "📧", title: "OTP Email Verification", desc: "6-digit code via Nodemailer. The code is bcrypt-hashed in DB — never stored in plain text." },
  { icon: "🛡️", title: "bcrypt Hashing", desc: "Passwords hashed with bcryptjs at 10 salt rounds before they ever touch the database." },
  { icon: "⚡", title: "Rate Limiting", desc: "express-rate-limit guards auth endpoints, slowing brute-force and OTP spray attacks." },
  { icon: "🔑", title: "Role-Ready Middleware", desc: "JWT protect middleware is extensible — add role checks to any route in one line." },
  { icon: "🧱", title: "MERN Stack", desc: "MongoDB, Express, React, Node — structured for real team workflows and Docker-ready." },
];

const steps = [
  { num: "01", label: "POST /register", title: "Register", desc: "Name, email, password validated. bcrypt hashes the password. OTP generated & emailed.", tag: "bcrypt + nodemailer" },
  { num: "02", label: "POST /verify-otp", title: "Verify email", desc: "OTP compared against hashed copy in DB. On success, account marked verified.", tag: "otp.expires < now()", active: true },
  { num: "03", label: "POST /login", title: "Login", desc: "Credentials checked. Verified accounts receive a signed JWT with configurable expiry.", tag: "JWT_SECRET" },
  { num: "04", label: "GET /me", title: "Protected data", desc: "Bearer token decoded by middleware. Invalid or expired tokens return 401.", tag: "Authorization header" },
];

const Landing = () => (
  <div className="min-h-screen">
    {/* Hero */}
    <section className="max-w-6xl mx-auto px-6 py-20 lg:py-28">
      <div className="grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <span className="font-mono text-xs tracking-widest uppercase text-teal-700 mb-3 block">Production-ready MERN Auth</span>
          <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight mb-5" style={{fontFamily:"'Space Grotesk',sans-serif"}}>
            Auth that works<br />like a <span className="text-teal-700">pipeline</span>
          </h1>
          <p className="text-lg text-slate-500 mb-8 max-w-lg leading-relaxed">
            Register → Verify → Login → Protected. Every step secured with JWT, bcrypt, and OTP email verification — ready to clone and run.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/register">
              <button className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-all shadow-md hover:shadow-lg active:scale-95">Create account</button>
            </Link>
            <Link to="/login">
              <button className="px-6 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-100 hover:border-slate-300 transition-all">Login</button>
            </Link>
          </div>
          <p className="mt-5 font-mono text-xs text-slate-400">$ npm run dev &nbsp;·&nbsp; runs in 60 seconds</p>
        </div>

        {/* Pipeline card - signature element */}
        <div className="bg-[#061e16] rounded-3xl p-8 shadow-2xl relative overflow-hidden" style={{backgroundImage:"radial-gradient(circle at 1px 1px,rgba(255,255,255,0.06) 1px,transparent 0)",backgroundSize:"18px 18px"}}>
          <p className="font-mono text-xs text-blue-300 tracking-widest uppercase mb-6">auth pipeline</p>
          <div className="space-y-0">
            {steps.map((s, i) => (
              <div key={i} className="flex gap-4 relative pb-7 last:pb-0">
                {i < steps.length - 1 && (
                  <div className="absolute left-[15px] top-8 bottom-0 w-px" style={{background:"repeating-linear-gradient(to bottom,rgba(255,255,255,0.2) 0,rgba(255,255,255,0.2) 4px,transparent 4px,transparent 9px)"}} />
                )}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono flex-shrink-0 z-10 border ${s.active ? "bg-teal-500 border-teal-500 text-white" : "bg-slate-800 border-slate-600 text-blue-200"}`}>{s.num}</div>
                <div>
                  <h4 className="text-slate-100 text-sm font-semibold mb-1">{s.title}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">{s.desc}</p>
                  <span className="inline-block mt-2 font-mono text-[10px] text-teal-300 bg-teal-900/40 border border-teal-700/50 px-2 py-0.5 rounded">{s.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="border-t border-slate-200 py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <span className="font-mono text-xs tracking-widest uppercase text-teal-700 mb-2 block">What's included</span>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-3" style={{fontFamily:"'Space Grotesk',sans-serif"}}>Everything you need, nothing you don't</h2>
          <p className="text-slate-500 max-w-xl">Built from the resume spec — dual-service awareness, Docker-ready, production security patterns.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-teal-400 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150">
              <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-slate-900 mb-2" style={{fontFamily:"'Space Grotesk',sans-serif"}}>{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA band */}
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-[#0a1120] rounded-2xl p-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2" style={{fontFamily:"'Space Grotesk',sans-serif"}}>Ready to ship secure auth?</h2>
            <p className="text-slate-400 max-w-md">Clone the repo, fill in your .env, and be live in minutes.</p>
          </div>
          <Link to="/register">
            <button className="px-7 py-3.5 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-400 transition-all shadow-lg active:scale-95">Get started free</button>
          </Link>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="border-t border-slate-200 mt-8">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-slate-400">© 2025 Flowgate · Built by Dhrupad Kapoor</p>
        <div className="flex gap-5 text-sm text-slate-500">
          <a href="#features" className="hover:text-slate-800 transition-colors">Features</a>
          <a href="https://github.com/dhrupadkapoor02" target="_blank" rel="noreferrer" className="hover:text-slate-800 transition-colors">GitHub</a>
        </div>
      </div>
    </footer>
  </div>
);

export default Landing;
