import React, { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
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

  //Paginacion
  const [paginaActual, setPaginaActual] = useState(1);
  const dataPorPagina = 10;

  const indiceUltimo= paginaActual * dataPorPagina;
  const indicePrimero= indiceUltimo - dataPorPagina;
  const dataActual = data.slice(indicePrimero, indiceUltimo);

  const totalPaginas = Math.ceil(data.length / dataPorPagina);

  useEffect(() => {
    setPaginaActual(1);
  }, []);

  return (
    <div className="p-4">
      {title && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl md:text-3xl font-bold font-secondary text-[#703F52]">{title}</h2>
          {actionButton && (
            <button
              onClick={actionButton.onClick}
              className="rounded-full bg-[#C19BA8] px-5 py-2 text-white font-semibold hover:bg-[#b78fa0] disabled:opacity-60 cursor-pointer"
            >
              {actionButton.label}
            </button>
          )}
          {borrarFiltros && filtros && (
            <div className="flex justify-center items-center gap-2 md:pr-[15vh] mt-5">
              <button className="text-tertiary cursor-pointer"
                onClick={filtros.onClick}
              >
                <IoFilterCircleOutline size={35} />
              </button>
              <button className="text-tertiary hover:underline cursor-pointer"
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
            {dataActual.map((row, i) => (
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

      <div className="flex justify-center items-center gap-4 mt-6 mb-5">
        <button
          onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
          disabled={paginaActual === 1}
          className="px-4 py-2 bg-white disabled:opacity-50 cursor-pointer"
        >
          <IoIosArrowBack className="inline-block mr-2" />
        </button>

        <span className="text-gray-700">{paginaActual} de {totalPaginas}</span>

        <button
          onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
          disabled={paginaActual === totalPaginas}
          className="px-4 py-2 bg-white disabled:opacity-50 cursor-pointer"
        >
          <IoIosArrowForward className="inline-block ml-2" />
        </button>
      </div>
    </div>
  );
}
