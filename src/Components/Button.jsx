export function Button({
  action,
  label,
  type = "small",
  fontSize = "md",
  bg = true,
  disabled = false,
  borderRadius = "sm",
  textAlign = "center",
  flash = false,
}) {
  return action ? (
    <button
      onClick={action}
      type="button"
      className={`block text-${fontSize} ${flash ? "animate-flash" : ""} self-end ${type === "full" ? "w-full p-2" : ""} rounded-${borderRadius}  ${bg ? "bg-bellsBlue hover:bg-hoverBellsBlue" : "hover:text-hoverYellow"} ${type === "small" ? "px-5  py-1.5" : ""} ${type === "text" ? "p-0" : ""} text-${textAlign}  text-white transition-all duration-300 ease-in-out disabled:cursor-not-allowed `}
      disabled={disabled}
    >
      {label}
    </button>
  ) : (
    <button
      type="submit"
      className={`block text-${fontSize} ${flash ? "animate-flash" : ""}  self-end ${type === "full" ? "w-full p-2" : ""} rounded-${borderRadius}  ${bg ? "bg-bellsBlue hover:bg-hoverBellsBlue" : "hover:text-hoverYellow"} ${type === "small" ? "px-5  py-1.5" : ""} ${type === "text" ? "p-0" : ""} text-${textAlign}  text-white transition-all duration-300 ease-in-out disabled:cursor-not-allowed `}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
