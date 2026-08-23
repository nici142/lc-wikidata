import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Diagnose", icon: "📷" },
  { to: "/suche", label: "Suche", icon: "🔍" },
  { to: "/balkon", label: "Balkon", icon: "🪴" },
  { to: "/garten", label: "Garten", icon: "🌳" },
  { to: "/gemuese", label: "Gemüse", icon: "🥕" },
  { to: "/zimmer", label: "Zimmer", icon: "🏠" },
  { to: "/pflege", label: "Pflegeaufwand", icon: "🧰" },
  { to: "/tiere", label: "Tiersicherheit", icon: "🐾" },
];

function Logo() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden>
      <circle cx="17" cy="17" r="17" fill="url(#nav-logo-gradient)" />
      <path
        d="M17 25.5c-4.5 0-8-3.5-8-8.6C9 11.6 13.2 8 17 6.5c3.8 1.5 8 5.1 8 10.4 0 5.1-3.5 8.6-8 8.6Z"
        fill="none"
        stroke="white"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M17 25v-15" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M17 14.5c-1.6-1.3-3-1.5-4.3-1M17 19c1.8-1.1 3.3-1.2 4.6-.7" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      <defs>
        <linearGradient id="nav-logo-gradient" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--color-leaf-400)" />
          <stop offset="1" stopColor="var(--color-leaf-700)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Nav() {
  return (
    <header className="sticky top-0 z-20 border-b border-bark-200/70 bg-bark-50/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <Logo />
          <span className="font-display text-xl font-semibold tracking-tight text-leaf-900">
            Pflanzenkompass
          </span>
        </div>
        <nav className="-mx-1 flex flex-wrap gap-1 overflow-x-auto sm:mx-0">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
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
