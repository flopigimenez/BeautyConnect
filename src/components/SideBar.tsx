import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Users2,
  Scissors,
  Settings
} from "lucide-react";

type Item = {
  to: string;
  label: string;
  icon: React.ElementType;
};

const items: Item[] = [
  { to: "/panel",       label: "Panel",        icon: LayoutDashboard },
  { to: "/calendario",  label: "Calendario",   icon: CalendarDays },
  { to: "/clientes",    label: "Clientes",     icon: Users2 },
  { to: "/servicio",   label: "Servicios",    icon: Scissors },
  { to: "/config",      label: "Configuración",icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-64 bg-[#FFFBFA] border-r border-[#E9DDE1] min-h-screen">
      <nav className="w-full p-4 space-y-2">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 px-3 py-2 rounded-full text-sm transition-colors",
                "text-[#3c2e35]",
                isActive
                  ? "bg-[#F2E8EA] shadow-sm"
                  : "hover:bg-[#F7EFF1]"
              ].join(" ")
            }
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
