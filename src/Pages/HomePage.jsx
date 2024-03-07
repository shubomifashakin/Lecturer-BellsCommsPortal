import { useLoaderData, useNavigate } from "react-router";

import { FaEye } from "react-icons/fa";

import { Navbar } from "../Components/Navbar";

import { GetLecturersData } from "../Actions/SupabaseActions";

import { SortArrayBasedOnLetters } from "../Actions/HelperActions";

function HomePage() {
  const { courses, name, college, dept } = useLoaderData();

  const navigate = useNavigate();

  const courses2 = SortArrayBasedOnLetters(JSON.parse(courses));

  return (
    <>
      <Navbar />

      <main className="row-span-2 flex flex-col space-y-4  bg-primaryBgColor  px-6 py-4 lg:py-2 ">
        <div className="flex cursor-default flex-col space-y-2  text-xs text-white lg:flex-row lg:items-center lg:justify-between">
          <p className=" rounded-sm bg-bellsBlue px-2 py-2 shadow-sm">
            Name: <span className="font-semibold">{name}</span>
          </p>

          <p className=" rounded-sm bg-bellsBlue px-2 py-2 shadow-sm">
            College: <span className="font-semibold">{college}</span>
          </p>

          <p className=" rounded-sm bg-bellsBlue px-2 py-2 shadow-sm">
            Department: <span className="font-semibold">{dept}</span>
          </p>
        </div>

        <div className="w-full overflow-y-auto">
          <h2 className="cursor-default border border-stone-400 bg-bellsBlue p-2 text-xs font-semibold uppercase text-white lg:text-left">
            Courses Offered
          </h2>

          <table className=" w-full  divide-y divide-stone-400 rounded-sm border border-t-0 border-stone-400 p-4 text-center ">
            <thead className="bg-bellsBlue text-white">
              <tr className="divide-x divide-stone-400">
                <th className="py-3.5">S/N</th>
                <th className="py-3.5">Course</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-400">
              {courses2.map((course, index) => {
                return (
                  <tr
                    className={`cursor-pointer divide-x divide-stone-400   transition-all duration-300 ease-in-out hover:bg-bellsBlue hover:text-white ${index % 2 ? "bg-tableEven" : "bg-tableOdd"}`}
                    onClick={() => navigate(`/${course}`)}
                    key={index}
                  >
                    <td className="py-3">{index + 1}</td>

                    <td className="hidden py-3 lg:block">
                      {course}&nbsp;
                      <span className="text-xs">[click to view]</span>
                    </td>

                    <td className="flex items-center justify-center py-3 lg:hidden">
                      {course} &nbsp;
                      <span className="text-base">
                        <FaEye />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}

export async function HomeLoader() {
  const lectData = await GetLecturersData();
  return lectData[0] ? lectData[0] : null;
}

export default HomePage;
