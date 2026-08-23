import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Diagnose", icon: "📷" },
  { to: "/balkon", label: "Balkonpflanzen", icon: "🪴" },
  { to: "/garten", label: "Gartenpflanzen", icon: "🌳" },
  { to: "/pflege", label: "Pflegeaufwand", icon: "🧰" },
  { to: "/tiere", label: "Tiersicherheit", icon: "🐾" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-20 border-b border-leaf-200 bg-leaf-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-leaf-800">
          <span className="text-2xl">🌿</span>
          <span className="font-display text-lg font-semibold tracking-tight">
            Pflanzenkompass
          </span>
        </div>
        <nav className="flex flex-wrap gap-1.5">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-leaf-600 text-white shadow-sm"
                    : "text-leaf-800 hover:bg-leaf-100"
                }`
              }
            >
              <span aria-hidden>{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
