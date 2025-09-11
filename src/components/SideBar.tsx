import { NavLink } from "react-router-dom";
import { CiCalendarDate } from "react-icons/ci";
import { LuPanelsLeftBottom } from "react-icons/lu";
import { PiUsers } from "react-icons/pi";
import { RiScissorsLine } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
type Item = {
  to: string;
  label: string;
  icon: React.ElementType;
};

const items: Item[] = [
  { to: "/panel",       label: "Panel", icon: LuPanelsLeftBottom },
  { to: "/calendario",  label: "Calendario", icon: CiCalendarDate },
  { to: "/clientes",    label: "Clientes", icon: PiUsers },
  { to: "/servicio",   label: "Servicios", icon: RiScissorsLine },
  { to: "/profesionales", label: "Profesionales", icon: CiUser },
  { to: "/config",      label: "Configuración", icon: IoSettingsOutline },
  
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
