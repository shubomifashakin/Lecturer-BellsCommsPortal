import { useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";

export function DragDrop({ setFile, fileRef, file }) {
  const [dragging, setDragging] = useState(false);

  function handleDragEnter() {
    setDragging(true);
  }

  function handleDrageLeave() {
    setDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    const selectedFile = e.dataTransfer.files[0];

    setDragging(false);
    setFile(selectedFile);
  }

  function triggerFile() {
    fileRef.current.click();
  }

  function removeFile(e) {
    e.stopPropagation();
    setFile(null);
  }
  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDrageLeave}
      onDrop={handleDrop}
      className={`relative hidden cursor-pointer rounded-sm transition-all duration-300 ease-in-out lg:flex ${file ? "" : "hover:bg-hoverYellow"} ${dragging ? "bg-hoverYellow " : " border border-dashed border-stone-400"} flex  flex-col items-center space-y-1 py-2 text-center text-black lg:py-4`}
      onClick={triggerFile}
    >
      {file ? (
        <IoMdCloseCircle
          className="absolute right-2.5 top-2.5 text-lg hover:text-hoverYellow"
          onClick={removeFile}
        />
      ) : null}

      <FaFilePdf className="text-xl lg:text-3xl" />

      <span className="text-sm ">
        {file
          ? file.name.length > 25
            ? file.name.slice(0, 25).trim() + "..."
            : file.name
          : "Click or Drag & Drop File"}
      </span>

      <span className="text-xs font-semibold lowercase">
        {" "}
        pdf/ppt files only
      </span>
    </div>
  );
}
