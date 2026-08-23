import { NavLink } from "react-router-dom";
import Logo from "./Logo";

const links = [
  { to: "/", label: "Diagnose", icon: "📷" },
  { to: "/pflanzen", label: "Pflanzenfinder", icon: "🌿" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-20 border-b border-bark-200/70 bg-bark-50/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <Logo size={34} />
          <span className="font-display text-xl font-semibold tracking-tight text-leaf-900">
            PlantBuddy
          </span>
        </div>
        <nav className="flex flex-wrap gap-1.5">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-leaf-800 text-white shadow-sm shadow-leaf-900/20"
                    : "text-bark-700 hover:bg-leaf-100 hover:text-leaf-800"
                }`
              }
            >
              <span aria-hidden className="text-[15px] leading-none">
                {link.icon}
              </span>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
