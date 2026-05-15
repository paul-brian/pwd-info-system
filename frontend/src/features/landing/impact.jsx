
import React from "react";

const impacts = [
  {
    title: "Accurate PWD Records",
    desc:  "Eliminate duplicate entries and manual errors. Every PWD member has a unique verified profile with a standardized PWD ID number, ensuring data integrity across all barangay records.",
  },
  {
    title: "Faster Assistance Delivery",
    desc:  "Track inventory levels in real-time and release assistive devices or supplies to PWD beneficiaries instantly — with automatic stock deduction and full distribution history.",
  },
  {
    title: "Health Monitoring",
    desc:  "Regular health checkups are recorded and monitored digitally. Critical and follow-up cases are immediately flagged so barangay health workers can respond quickly.",
  },
  {
    title: "Community Transparency",
    desc:  "PWD members can log in to view their own health records, event attendance, assistance history, and barangay announcements — promoting trust and open communication.",
  },
];

function Impact() {
  return (
    <section className="py-24 bg-slate-950" data-purpose="impact" id="about">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-16 space-y-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
              Why It Matters
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              Empowering Barangay Trapiche's<br />PWD Community
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              This system was built to improve the quality of service delivered to Persons with Disability in our community — making records accessible, accurate, and actionable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {impacts.map((item, i) => (
              <div
                key={i}
                className="group bg-slate-900/80 border border-white/10 rounded-2xl p-7 hover:border-blue-500/30 hover:bg-slate-900 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-blue-500/20 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Bottom Banner ── */}
          <div className="mt-12 bg-gradient-to-r from-blue-600/20 to-emerald-600/20 border border-white/10 rounded-2xl p-8 text-center">
            <p className="text-white font-bold text-xl mb-2">
              Built for Barangay Trapiche, Cavite
            </p>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Developed to support the barangay's commitment to inclusive governance and improved public service delivery for all PWD constituents.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Impact;