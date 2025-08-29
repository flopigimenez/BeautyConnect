import React from "react";
import { CiSearch } from "react-icons/ci";
import { IoFilterCircleOutline } from "react-icons/io5";

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
  filtros?: {
    onClick: () => void;
  };
}

export function CustomTable<T extends object>({
  columns,
  data,
  title,
  actionButton,
  filtros,
}: CustomTableProps<T>) {
  return (
    <div className="p-4">
      {title && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          {actionButton && (
            <button
              onClick={actionButton.onClick}
              className="bg-[#C19BA8] px-4 py-2 rounded-full hover:bg-[#C4A1B5]"
            >
              {actionButton.label}
            </button>
          )}
          {filtros && (
            <div className="flex justify-center gap-5 md:pr-[15vh] mt-5">
              <button className="cursor-pointer text-tertiary"
              onClick={filtros.onClick}
              >
                <IoFilterCircleOutline size={25} />
              </button>
            </div>
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
