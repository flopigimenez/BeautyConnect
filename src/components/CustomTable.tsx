import React from "react";

interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (row: T) => React.ReactNode; 
}

interface CustomTableProps<T> {
  columns: Column<T>[];
  data: T[];
  title?: string;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

export function CustomTable<T extends object>({
  columns,
  data,
  title,
  actionButton,
}: CustomTableProps<T>) {
  return (
    <div className="p-4">
      {title && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl md:text-3xl font-bold font-secondary text-[#703F52]">{title}</h2>
          {actionButton && (
            <button
              onClick={actionButton.onClick}
              className="rounded-full bg-[#C19BA8] px-5 py-2 text-white font-semibold hover:bg-[#b78fa0] disabled:opacity-60"
            >
              {actionButton.label}
            </button>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-[#FFFBFA]">
            <tr className="border-b border-gray-200">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="px-6 py-3 text-left text-sm font-medium text-gray-700"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-t  border-gray-200 hover:bg-gray-50">
                {columns.map((col, idx) => (
                  <td key={idx} className="px-6 py-3 text-sm text-gray-600">
                    {col.render
                      ? col.render(row)
                      : col.accessor
                      ? (row[col.accessor] as React.ReactNode)
                      : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
