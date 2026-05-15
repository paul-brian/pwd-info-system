import React from "react";
import logo from "../../assets/image/logo_trapiche.jpg";

function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/5 py-16" id="contact">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 space-y-6">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="PWD Logo"
                className="w-9 h-9 rounded-full object-contain"
              />
              <span className="text-lg sm:text-xl font-semibold tracking-tight text-white">
                PWD Information System
              </span>
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
