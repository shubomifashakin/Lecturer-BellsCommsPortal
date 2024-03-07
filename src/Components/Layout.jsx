import { Outlet, useNavigation } from "react-router";
import LoadingScreen from "./LoadingScreen";

function Layout() {
  const { state } = useNavigation();

  return (
    <div className="grid h-dvh w-full grid-cols-1 grid-rows-[0.05fr_1fr] bg-primaryBgColor  lg:grid-cols-[0.2fr_1fr] lg:grid-rows-1 ">
      {state === "loading" ? <LoadingScreen /> : null}

      <Outlet />
    </div>
  );
}

export default Layout;
