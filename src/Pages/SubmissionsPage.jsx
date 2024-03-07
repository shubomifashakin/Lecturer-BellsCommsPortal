import { useLoaderData, useParams, useLocation } from "react-router";

import toast from "react-hot-toast";

import { IoCloudDownloadOutline } from "react-icons/io5";

import { Navbar } from "../Components/Navbar";
import { CourseNavLink } from "../Components/Navlink";
import NoNotesOrAss from "../Components/NoNotesOrAss";

import {
  DownloadFile,
  GetListOfAllFilesInFolder,
} from "../Actions/SupabaseActions";

import { FormatTime } from "../Actions/HelperActions";

function SubmissionsPage() {
  const submissions = useLoaderData();

  const { pathname } = useLocation();

  //removes supabase placeholder file from array
  const allSubmissions = submissions.filter(
    (c) => c.name !== ".emptyFolderPlaceholder",
  );

  const { code, assName } = useParams();

  async function handleDownload(filename) {
    try {
      //if we want the assignment itself, download the assignment, if not download what we submitted

      // Fetch the PDF file content
      const pdfBlob = await DownloadFile(
        `${code}/assignments/submissions/${assName}/${filename}`,
      );

      // Create a Blob URL from the Blob
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Create a temporary anchor element
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = filename;

      // trigger a click event on the anchor element
      a.click();

      // Revoke the Blob URL after the tab is closed
      //this prevents the document that was opened from being opened again
      URL.revokeObjectURL(pdfUrl);
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <>
      <Navbar>
        <li className="active text-hoverBellsBlue">
          <CourseNavLink path={`/${code}`} label={code} />
        </li>

        <li className="active text-hoverBellsBlue">
          <CourseNavLink path={pathname} label={"Submissions"} />
        </li>
      </Navbar>

      <main className="bg-primaryBgColor row-span-2 flex h-full  flex-col space-y-4 p-4 lg:px-6 lg:py-4">
        <div className="w-full overflow-y-auto">
          <h2 className="bg-bellsBlue cursor-default border border-stone-400 p-2 text-xs font-semibold uppercase text-white lg:text-left">
            All Submissions
          </h2>

          {allSubmissions.length ? (
            <table
              className={`w-full divide-y  divide-stone-400 overflow-hidden border border-stone-400 p-4 text-center `}
            >
              <thead className=" bg-bellsBlue text-white">
                <tr className="divide-x divide-stone-400">
                  <th className="py-3.5 text-sm lg:text-base">S/N</th>

                  <th className="py-3.5 text-sm lg:text-base">Title</th>

                  <th className="py-3.5 text-sm lg:text-base">Submitted</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-400">
                {allSubmissions.map((submission, index) => {
                  return (
                    <tr
                      className={`hover:bg-bellsBlue cursor-pointer divide-x   divide-stone-400 transition-all duration-300 ease-in-out hover:text-white ${index % 2 ? "bg-tableEven" : "bg-tableOdd"}`}
                      key={index}
                      onClick={() => handleDownload(submission.name)}
                    >
                      <td className="py-3">{index + 1}</td>

                      <td className="hidden py-3 lg:block">
                        {submission.name} &nbsp;
                        <span className="text-xs">[click to download]</span>
                      </td>

                      <td className="flex items-center justify-center py-3 lg:hidden">
                        {submission.name} &nbsp;
                        <span className="text-base">
                          <IoCloudDownloadOutline />
                        </span>
                      </td>

                      <td className="py-3 text-xs">
                        {FormatTime(submission.created_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <NoNotesOrAss label={"Submissions"} />
          )}
        </div>
      </main>
    </>
  );
}

export default SubmissionsPage;

export async function SubmissionsLoader({ params }) {
  const { code, assName } = params;
  const path = `${code}/assignments/submissions/${assName}`;
  const allSubmissions = await GetListOfAllFilesInFolder(path);

  return allSubmissions;
}
