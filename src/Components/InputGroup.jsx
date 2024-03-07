export function InputGroup({ label, children }) {
  return (
    <div className="flex flex-col space-y-1.5">
      <label htmlFor={label} className="text-base font-normal">
        {label}
      </label>

      {children}
    </div>
  );
}

export function InputError({ errorMessage }) {
  return <p className="text-xs text-red-600">{errorMessage}</p>;
}
