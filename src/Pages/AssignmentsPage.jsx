import { useNavigate, useParams, useRouteLoaderData } from "react-router";

import { FaEye } from "react-icons/fa";

import { FormatTime } from "../Actions/HelperActions";
import NoNotesOrAss from "../Components/NoNotesOrAss";

function AssignmentsPage() {
  const { assignments } = useRouteLoaderData("courseData");

  //removes supabase placeholder file from array
  const allAssignments = assignments.filter(
    (c) => c.name !== ".emptyFolderPlaceholder",
  );

  const navigate = useNavigate();
  const { code } = useParams();

  function handleNavigate({ courseCode, assName }) {
    navigate(`/submissions/${courseCode}/${assName}`);
  }

  return (
    <>
      {allAssignments.length ? (
        <table
          className={`w-full divide-y  divide-stone-400 overflow-hidden border border-stone-400 p-4 text-center `}
        >
          <thead className=" bg-bellsBlue text-white">
            <tr className="divide-x divide-stone-400">
              <th className="py-3.5 text-sm lg:text-base">S/N</th>

              <th className="py-3.5 text-sm lg:text-base">Title</th>

              <th className="py-3.5 text-sm lg:text-base">Uploaded</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-stone-400">
            {allAssignments.map((assignment, index) => {
              return (
                <tr
                  className={`cursor-pointer divide-x divide-stone-400   transition-all duration-300 ease-in-out hover:bg-bellsBlue hover:text-white ${index % 2 ? "bg-tableEven" : "bg-tableOdd"}`}
                  key={index}
                  onClick={() =>
                    handleNavigate({
                      courseCode: code,
                      assName: assignment.name,
                    })
                  }
                >
                  <td className="py-3">{index + 1}</td>

                  <td className="hidden py-3 lg:block">
                    {assignment.name} &nbsp;
                    <span className="text-xs">[click to view]</span>
                  </td>

                  <td className="flex items-center justify-center py-3 lg:hidden">
                    {assignment.name} &nbsp;
                    <span className="text-base">
                      <FaEye />
                    </span>
                  </td>

                  <td className="py-3 text-xs">
                    {FormatTime(assignment.created_at)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <NoNotesOrAss label={"Assignments"} />
      )}
    </>
  );
}

export default AssignmentsPage;
