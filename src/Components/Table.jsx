function Table({ tableLabel, headLabels, children }) {
  return (
    <>
      <h2 className="cursor-default border border-stone-400 bg-bellsBlue p-2 text-xs font-semibold uppercase text-white lg:text-left">
        {tableLabel}
      </h2>
      <table
        className={`w-full divide-y  divide-stone-400 overflow-hidden border border-stone-400 p-4 text-center `}
      >
        <thead className=" bg-bellsBlue text-white">
          <tr className="divide-x divide-stone-400">
            {headLabels.map((label, i) => {
              return (
                <th key={i} className="table-head">
                  {label}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody className="divide-y divide-stone-400">{children}</tbody>
      </table>
    </>
  );
}

export default Table;
