import React from "react";

function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/5 py-16" id="contact">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></path>
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">PWD Digital System</span>
        </div>
            <p className="text-slate-500 text-sm">
              Empowering communities through digital innovation and efficient data management for PWD sectors.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#about" className="hover:text-primary transition-colors">About</a></li>
              <li><a href="#login" className="hover:text-primary transition-colors">Admin Login</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Barangay Info</h4>
            <p className="text-slate-500 text-sm">Barangay Hall, Digital District</p>
            <p className="text-slate-500 text-sm">support@pwd-digital.ph</p>
          </div>
        </div>
        <div className="pt-8 border-t border-white/5 text-center text-slate-600 text-xs">
          © © {new Date().getFullYear()} PWD Digital System. All rights reserved. Built for progressive governance.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
