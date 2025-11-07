import { NavLink } from "react-router-dom";
import clsx from "clsx";

export default function NavItemGlow({ to, children, exact = false, onClick }) {
  return (
    <NavLink
      to={to}
      end={exact}
      aria-label={typeof children === "string" ? children : undefined}
      className={({ isActive }) =>
        clsx(
          "relative inline-flex items-center justify-center",
          "px-3.5 py-2 rounded-full font-semibold",
          "text-text",
          "transition-[background,transform,box-shadow,color] duration-200 ease-out",
          "hover:bg-leaf/20 dark:hover:bg-card",
          "hover:scale-[1.02] hover:shadow-navglow",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          // activo
          isActive &&
            "bg-emerald-100 text-emerald-800 dark:bg-emerald-700 dark:text-white ring-1 ring-emerald-200/60 dark:ring-emerald-500/60"
        )
      }
      onClick={onClick}
    >
      <span className="leading-none">{children}</span>
    </NavLink>
  );
}
