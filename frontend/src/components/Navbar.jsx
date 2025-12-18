import React from "react";
import { useLocation } from "react-router-dom";
import {
  Gamepad2,
  LayoutDashboard,
  Leaf,
  Presentation,
  Trophy,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const keyframe = `
    @keyframes logoGlow {
      0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.3); }
      50% { box-shadow: 0 0 30px rgba(34, 197, 94, 0.5); }
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .nav-link:hover {
      background: rgba(34, 197, 94, 0.1);
      color: #22C55E;
    }
    .nav-link-active {
      background: rgba(34, 197, 94, 0.15);
      color: #22C55E;
    }
  `;

  const mainNavLinks = [
    { path: "/scanner", label: "Scanner", icon: LayoutDashboard },
    { path: "/recommendations", label: "Eco Products", icon: Gamepad2 },
    { path: "/chat", label: "EcoBot", icon: Trophy },
    { path: "/routes", label: "Routes", icon: Presentation },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[rgba(10,15,13,0.8)] backdrop-blur-[20px] border-b border-green-500/20 animate-[logoGlow_3s_ease-in-out_infinite] transition-transform duration-300 ease-in-out">
      <style>{keyframe}</style>

      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex justify-center items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-[linear-gradient(135deg,#22C55E,#14B8A6,#3B82F6)] flex justify-center items-center animate-[logoGlow_3s_ease-in-out_infinite] transition-transform duration-300 ease-in-out">
              <Leaf className="w-5 h-5 text-[#0a0f0d]" />
            </div>

            <span className="font-bold text-xl bg-gradient-to-br from-green-500 via-teal-500 to-blue-500 bg-clip-text text-transparent font-space-grotesk">
              EcoSense
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {mainNavLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <Button
                  className={`
                    flex items-center gap-1.5 px-3 py-2 rounded-md border-none
                    text-sm font-medium cursor-pointer transition-all duration-300 ease-in-out
                    ${isActive(link.path) ? "bg-green-500/15 text-green-500" : "bg-transparent text-gray-400"}
                  `}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
