import { Outlet, useParams } from "react-router";

import { supabase } from "../supabase";

import { CourseNavLink } from "../Components/Navlink";
import { Navbar } from "../Components/Navbar";

function CoursePage() {
  const params = useParams();

  return (
    <>
      <Navbar>
        <li className="active text-hoverBellsBlue">
          <CourseNavLink path={`/${params.code}`} label={params.code} />
        </li>
      </Navbar>

      <main className="bg-primaryBgColor row-span-2 flex flex-col items-center space-y-4 px-6 py-4">
        <div className="bg-bellsBlue space-x-5 rounded-sm px-4 py-2">
          <CourseNavLink path={"Notes"} label={"Notes"} />
          <CourseNavLink path={"Assignments"} label={"Assignments"} />
          <CourseNavLink path={"Upload"} label={"Upload"} />
        </div>

        <div className="w-full overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </>
  );
}

export default CoursePage;

export async function CourseLoader({ params }) {
  const [assignments, notes] = await Promise.all([
    await supabase.storage
      .from("Courses")
      .list(`${params.code}/assignments/uploads`, {
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      }),
    await supabase.storage.from("Courses").list(`${params.code}/notes`, {
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    }),
  ]);

  if (assignments.error?.message) throw assignments.error;
  if (notes.error?.message) throw notes.error;

  return { assignments: assignments.data, notes: notes.data };
}
