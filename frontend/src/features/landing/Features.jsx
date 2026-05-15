import React from "react";

const features = [
  {
    icon: (
      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    bg:    "bg-blue-500/10",
    hover: "group-hover:bg-blue-500/20",
    title: "PWD Profile Management",
    desc:  "Register, update, and manage complete PWD profiles including disability type, medical condition, contact details, and emergency contacts — all in one place.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    bg:    "bg-emerald-500/10",
    hover: "group-hover:bg-emerald-500/20",
    title: "Health Monitoring",
    desc:  "Track vital signs including blood pressure, heart rate, temperature, weight, and blood sugar. Generate health status reports for each registered PWD member.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    bg:    "bg-amber-500/10",
    hover: "group-hover:bg-amber-500/20",
    title: "Event Attendance Tracking",
    desc:  "Create and manage barangay events with automatic status updates. Mark PWD attendance as Present, Absent, or Default with real-time progress tracking per event.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    bg:    "bg-violet-500/10",
    hover: "group-hover:bg-violet-500/20",
    title: "Inventory & Assistance",
    desc:  "Manage assistive devices and supplies. Record incoming donations and track assistance distributed to PWD beneficiaries with automatic stock level adjustments.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    bg:    "bg-pink-500/10",
    hover: "group-hover:bg-pink-500/20",
    title: "SMS Notifications",
    desc:  "Send individual or broadcast SMS messages to all active PWD members. Every successful SMS automatically creates a public announcement in the system.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    bg:    "bg-orange-500/10",
    hover: "group-hover:bg-orange-500/20",
    title: "Role-Based Access Control",
    desc:  "Three user roles — Admin, Staff, and PWD User — each with specific access levels. Secure JWT authentication protects all sensitive records and operations.",
  },
];

function Features() {
  return (
    <section className="py-24 bg-slate-900/50" data-purpose="features" id="features">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
            System Capabilities
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Everything You Need to Manage PWD Records
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            A complete digital solution built specifically for Barangay Trapiche — from registration to health monitoring, event tracking, and assistance distribution.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="group bg-slate-900/80 backdrop-blur-sm border border-white/10 p-7 rounded-2xl hover:-translate-y-1 transition-all duration-300 hover:border-white/20 hover:shadow-xl hover:shadow-black/20"
            >
              <div className={`w-12 h-12 rounded-xl ${f.bg} ${f.hover} flex items-center justify-center mb-5 transition-colors duration-300`}>
                {f.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;