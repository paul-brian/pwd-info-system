import { Outlet } from "react-router-dom";
import Navbar from "../components/ui/Navbars";


const PagesLandingLayout = () => {

  return (
    <div className="bg-darkBg text-slate-200 font-sans selection:bg-primary/30">
      
        <Navbar />
        <main>
          <Outlet />
        </main>
    </div>

  );
};

export default PagesLandingLayout;