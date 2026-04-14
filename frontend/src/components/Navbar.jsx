import { Link, NavLink } from "react-router-dom";
import { BrainCircuit, FolderKanban, LayoutDashboard, Sparkles } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/60 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link to={isAuthenticated ? "/dashboard" : "/login"} className="flex items-center gap-2">
          <span className="rounded-lg bg-cyan-400/20 p-2 text-cyan-300">
            <BrainCircuit size={18} />
          </span>
          <div>
            <p className="text-sm font-semibold leading-none">AI Project Mentor</p>
            <p className="text-xs text-slate-300">Personalized SaaS Coach</p>
          </div>
        </Link>

        {isAuthenticated ? (
          <nav className="flex items-center gap-2 text-sm">
            <NavLink to="/dashboard" className="btn-ghost inline-flex items-center gap-2">
              <LayoutDashboard size={15} /> Dashboard
            </NavLink>
            <NavLink to="/recommendations" className="btn-ghost inline-flex items-center gap-2">
              <Sparkles size={15} /> Recommendations
            </NavLink>
            <NavLink to="/projects" className="btn-ghost inline-flex items-center gap-2">
              <FolderKanban size={15} /> Tracker
            </NavLink>
            {user?.role === "admin" ? (
              <NavLink to="/admin" className="btn-ghost">
                Admin
              </NavLink>
            ) : null}
            <button type="button" onClick={logout} className="btn-primary">
              Logout
            </button>
          </nav>
        ) : (
          <div className="flex items-center gap-2 text-sm">
            <Link to="/login" className="btn-ghost">
              Login
            </Link>
            <Link to="/signup" className="btn-primary">
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
