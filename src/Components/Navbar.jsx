import { useNavigate } from "react-router";

import { Button } from "./Button";
import { CourseNavLink } from "./Navlink";

import { LogOutFn } from "../Actions/SupabaseActions";
import toast from "react-hot-toast";

export function Navbar({ children }) {
  const navigate = useNavigate();

  async function handleSignOut() {
    try {
      await LogOutFn();
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <nav className="row-span-1 bg-bellsBlue px-6 py-4 lg:col-span-1 lg:px-4">
      {/*navbar for small displays */}
      <ul className="flex items-center justify-between lg:hidden">
        <li>
          <CourseNavLink path={"/Home"} label={"Home"} />
        </li>

        {children}

        <li>
          <Button
            label={"Log Out"}
            action={handleSignOut}
            bg={false}
            type="text"
          ></Button>
        </li>
      </ul>

      {/**only for large displays */}
      <ul className="hidden h-full flex-col items-center gap-5 text-center text-sm lg:flex">
        <li>
          <CourseNavLink path={"/Home"} label={"Home"} />
        </li>

        {children}

        <li>
          <CourseNavLink path={"/updatePassword"} label={"Change Password"} />
        </li>

        <li>
          <Button
            label={"Log Out"}
            action={handleSignOut}
            fontSize="sm"
            bg={false}
            type="text"
          ></Button>
        </li>
      </ul>
    </nav>
  );
}
