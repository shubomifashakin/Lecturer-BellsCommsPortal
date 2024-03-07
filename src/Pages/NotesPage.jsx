import { useParams, useRouteLoaderData } from "react-router";

import toast from "react-hot-toast";

import { IoCloudDownloadOutline } from "react-icons/io5";

import NoNotesOrAss from "../Components/NoNotesOrAss";

import { DownloadFile } from "../Actions/SupabaseActions";

import {
  FormatTime,
  SortArrayBasedOnCreatedAt,
} from "../Actions/HelperActions";

function NotesPage() {
  const { notes } = useRouteLoaderData("courseData");

  //removes supabase placeholder file from array
  const allNotes = notes.filter((c) => c.name !== ".emptyFolderPlaceholder");

  const sortedNotes = SortArrayBasedOnCreatedAt(allNotes);

  const { code } = useParams();

  async function handleDownload(filename) {
    try {
      // Fetch the PDF file content
      const pdfBlob = await DownloadFile(`${code}/notes/${filename}`);

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
      {allNotes.length ? (
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
            {sortedNotes.map((note, index) => {
              return (
                <tr
                  className={`cursor-pointer divide-x divide-stone-400   transition-all duration-300 ease-in-out hover:bg-bellsBlue hover:text-white ${index % 2 ? "bg-tableEven" : "bg-tableOdd"}`}
                  onClick={() => handleDownload(note.name)}
                  key={index}
                >
                  <td className="py-3">{index + 1}</td>

                  <td className="hidden py-3 lg:block">
                    {note.name.split(".")[0]} &nbsp;
                    <span className="text-xs">[click to download]</span>
                  </td>

                  <td className="flex items-center justify-center py-3 lg:hidden">
                    {note.name.split(".")[0]} &nbsp;
                    <span className="text-base">
                      <IoCloudDownloadOutline />
                    </span>
                  </td>

                  <td className="py-3 text-xs">
                    {FormatTime(note.created_at)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <NoNotesOrAss label={"Notes"} />
      )}
    </>
  );
}

export default NotesPage;
