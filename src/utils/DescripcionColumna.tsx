import { useState } from "react";

interface DescripcionColumnaProps {
  descripcion?: string;
  limite?: number; // opcional, por si querés cambiar la cantidad de caracteres visibles
}

const DescripcionColumna: React.FC<DescripcionColumnaProps> = ({ descripcion, limite = 40 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!descripcion) return <span>Sin descripción</span>;

  const textoCorto = descripcion.length > limite ? descripcion.slice(0, limite) + "..." : descripcion;

  return (
    <div>
      <span>{isExpanded ? descripcion : textoCorto}</span>
      {descripcion.length > limite && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-2 text-[#C19BA8] font-semibold hover:underline"
        >
          {isExpanded ? "Ocultar" : "Ver más"}
        </button>
      )}
    </div>
  );
};

export default DescripcionColumna;