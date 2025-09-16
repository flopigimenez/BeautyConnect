import React from "react";
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
  borrarFiltros?: {
    onClick: () => void;
  };
  busqueda?: {
    onChange: (value: string) => void;
    placeholder?: string;
  };
}

export function CustomTable<T extends object>({
  columns,
  data,
  title,
  actionButton,
  borrarFiltros,
  filtros,
  busqueda,
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
          {borrarFiltros && filtros && (
            <div className="flex justify-center items-center gap-2 md:pr-[15vh] mt-5">
              <button className="cursor-pointer text-tertiary"
                onClick={filtros.onClick}
              >
                <IoFilterCircleOutline size={35} />
              </button>
              <button className="cursor-pointer text-tertiary hover:underline"
                onClick={borrarFiltros.onClick}
              >
                Borrar Filtros
              </button>
            </div>
          )}
          {busqueda && (
            <input
              type="text"
              onChange={(e) => busqueda.onChange(e.target.value)}
              placeholder={busqueda.placeholder || "Buscar..."}
              className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#C19BA8]"
            />
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
