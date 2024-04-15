import { useLoaderData, useParams, useLocation } from "react-router";

import toast from "react-hot-toast";

import { Navbar } from "../Components/Navbar";
import { CourseNavLink } from "../Components/Navlink";
import NoNotesOrAss from "../Components/NoNotesOrAss";

import {
  DownloadFile,
  GetListOfAllFilesInFolder,
} from "../Actions/SupabaseActions";

import {
  FormatTime,
  SortArrayBasedOnCreatedAt,
} from "../Actions/HelperActions";

import { IoCloudDownloadOutline } from "react-icons/io5";
import { FaFilePdf } from "react-icons/fa";
import Table from "../Components/Table";

function SubmissionsPage() {
  const submissions = useLoaderData();
  const { pathname } = useLocation();
  const { code, assFileName } = useParams();

  //extract the assignment name
  const assignmentName = assFileName.split("-")[0];

  //removes supabase placeholder file from array
  const allSubmissions = submissions.filter(
    (c) => c.name !== ".emptyFolderPlaceholder",
  );

  //arrange submissions by date submitted
  const sortedSubmissions = SortArrayBasedOnCreatedAt(allSubmissions);

  async function handleDownload(filename, assignment = false) {
    try {
      //if we clicked on a student submission, download the file

      //if we clicked on the assignment the lecturer uploaded, download the assignment the lecturer uploaded

      const pdfBlob = assignment
        ? await DownloadFile(`${code}/assignments/uploads/${filename}`)
        : await DownloadFile(
            `${code}/assignments/submissions/${assignmentName}/${filename}`,
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

      <main className="row-span-2 flex h-full flex-col space-y-2 bg-primaryBgColor p-4 lg:px-6  lg:py-4">
        <DownloadAssignment handleDownload={handleDownload} />

        {sortedSubmissions.length ? (
          <div className="w-full overflow-y-auto">
            <Table
              tableLabel={`All Submissions (${sortedSubmissions.length})`}
              headLabels={["S/N", "Student", "Submitted"]}
            >
              {sortedSubmissions.map((submission, index) => {
                const submissionName = submission.name.replace("-", "/");

                return (
                  <tr
                    className={`cursor-pointer divide-x divide-stone-400   transition-all duration-300 ease-in-out hover:bg-bellsBlue hover:text-white ${index % 2 ? "bg-tableEven" : "bg-tableOdd"}`}
                    key={index}
                    onClick={() => handleDownload(submission.name)}
                  >
                    <td className="py-3">{index + 1}</td>

                    <td className="hidden items-center justify-center py-3 lg:flex">
                      <span className="w-64 truncate">{submissionName}</span>

                      <span className="text-xs">[click to download]</span>
                    </td>

                    <td className="flex items-center justify-center py-3 lg:hidden">
                      <span className="w-36 truncate">{submissionName}</span>

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
            </Table>
          </div>
        ) : (
          <NoNotesOrAss label={"Submissions"} />
        )}
      </main>
    </>
  );
}

function DownloadAssignment({ handleDownload }) {
  const { assFileName } = useParams();
  const assignmentName = assFileName.split("-")[0];

  return (
    <p
      className="flex cursor-pointer items-center gap-0.5 self-start text-sm font-semibold underline transition-colors duration-300 ease-in-out hover:text-hoverYellow"
      onClick={() => handleDownload(assFileName, true)}
    >
      Download {assignmentName} <FaFilePdf />
    </p>
  );
}

export default SubmissionsPage;

export async function SubmissionsLoader({ params }) {
  const { code, assFileName } = params;
  const assignmentName = assFileName.split("-")[0];

  const path = `${code}/assignments/submissions/${assignmentName}`;
  const allSubmissions = await GetListOfAllFilesInFolder(path);

  return allSubmissions;
}
