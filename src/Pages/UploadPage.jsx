import { useRef, useState } from "react";
import { useNavigate, useParams, useRouteLoaderData } from "react-router-dom";
import toast from "react-hot-toast";

import { InputGroup } from "../Components/InputGroup";
import { Button } from "../Components/Button";
import { DragDrop } from "../Components/DragDrop";

import { UploadNewAssignment, UploadNewNote } from "../Actions/SupabaseActions";
import LoadingScreen from "../Components/LoadingScreen";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";

import { FormatTime } from "../Actions/HelperActions";

function UploadPage() {
  const { code: courseCode } = useParams();
  const { notes, assignments } = useRouteLoaderData("courseData");

  const noteName = "Note" + (notes.length + 1);
  const assName = "Assignment" + (assignments.length + 1);

  const [uploading, setUploading] = useState(false);
  const [selection, setSelection] = useState("");
  const [file, setFile] = useState("");
  const [submissionDate, setSubmissionDate] = useState("");

  const fileRef = useRef(null);

  const isNote = selection === "note";
  const isAssignment = selection === "assignment";

  const navigate = useNavigate();

  function storeSelectedFile(e) {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file");
      return;
    }

    if (isAssignment && !submissionDate?.$D) {
      toast.error("Please choose a date");
      return;
    }

    let newAssName;
    if (isAssignment) {
      let timeForm = FormatTime(submissionDate.$d, "medium");
      newAssName = assName + "-" + timeForm;
    }

    try {
      setUploading(true);

      //if it is a note, upload the note, if not upload the assignment
      isNote
        ? await UploadNewNote({ noteName, file, courseCode })
        : await UploadNewAssignment({ assName: newAssName, courseCode, file });

      //change to reducer function
      setUploading(false);
      setSelection("");
      setFile("");
      setSubmissionDate("");

      // dispatch({label:'reset})

      toast.success(`${isNote ? noteName : assName} Uploaded`);

      //manually refresh the loader
      navigate(".", { replace: true });
    } catch (err) {
      toast.error(err.message);

      setUploading(false);
    }
  }

  return (
    <>
      {uploading ? <LoadingScreen /> : null}

      <form onSubmit={handleSubmit} className="w-full space-y-4 p-2">
        <InputGroup label={"What do you want to upload?"}>
          <select
            className="input-style"
            onChange={(e) => setSelection(e.target.value)}
            id="type"
            name="type"
          >
            <option disabled selected>
              --Please select an option--
            </option>

            <option value={"note"}>A Note</option>

            <option value={"assignment"}>An Assignment</option>
          </select>
        </InputGroup>

        {selection ? (
          <div className="animate-flash space-y-4" key={selection}>
            <InputGroup label={"Name"}>
              <input
                className="rounded-sm px-2 py-2.5
              outline outline-1 outline-stone-400  disabled:bg-white"
                id="Name"
                disabled
                type="text"
                value={isNote ? noteName : assName}
              />
            </InputGroup>

            <InputGroup label={"File"}>
              <input
                type="file"
                className="lg:hidden"
                accept=".pdf,.ppt,.pptx"
                ref={fileRef}
                id="File"
                onChange={storeSelectedFile}
              />

              <DragDrop setFile={setFile} fileRef={fileRef} file={file} />
            </InputGroup>

            {selection === "assignment" && file ? (
              <InputGroup label={"Date of Submission"}>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="en-gb"
                >
                  <DatePicker
                    className="animate-flash"
                    value={submissionDate}
                    onChange={(newDate) => setSubmissionDate(dayjs(newDate))}
                    views={["day", "month", "year"]}
                    disablePast
                    slotProps={{
                      textField: {
                        helperText: "DD/MM/YYYY",
                      },
                      field: { clearable: true },
                    }}
                  />
                </LocalizationProvider>
              </InputGroup>
            ) : null}
          </div>
        ) : null}

        {(selection === "assignment" && submissionDate) ||
        (selection === "note" && file) ? (
          <Button
            flash={true}
            disabled={uploading}
            type="full"
            label={`Upload ${isNote ? noteName : assName}`}
          />
        ) : null}
      </form>
    </>
  );
}

export default UploadPage;
