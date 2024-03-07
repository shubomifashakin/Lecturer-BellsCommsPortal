import { NavLink } from "react-router-dom";

export function CourseNavLink({ path, label }) {
  return (
    <NavLink
      to={`${path}`}
      className="hover:text-hoverYellow text-white transition-all duration-300"
    >
      {label}
    </NavLink>
  );
}
