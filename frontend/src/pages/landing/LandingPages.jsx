import React from "react";
import Heros from "../../features/landing/Heros";
import Features from "../../features/landing/Features";
import DashboardPreview from "../../features/landing/DashboardPreview";
import Impact from "../../features/landing/impact";
import CTA from "../../features/landing/CTA";
import Footer from "../../components/ui/Footer";

function PagesLandingLayout() {
  return (
    <div className="bg-darkBg text-slate-200 font-sans selection:bg-primary/30">
      <Heros />
      <Features />
      <DashboardPreview />
      <Impact />
      <CTA />
      <Footer />
    </div>
  );
}

export default PagesLandingLayout;