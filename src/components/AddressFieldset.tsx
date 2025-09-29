// src/components/AddressFieldset.tsx
import { useEffect, useMemo, useState } from "react";
import { getProvincias, getLocalidadesByProvincia } from "../services/Georef";

export type AddressValue = {
  calle: string;
  numero: number | undefined;
  codigoPostal: number | undefined;
  provincia: string;
  localidad: string;
};

export default function AddressFieldset(props: {
  value: AddressValue;
  onChange: (next: AddressValue) => void;
  className?: string;
}) {
  const { value, onChange, className } = props;

  const [provincias, setProvincias] = useState<{ id: string; nombre: string }[]>([]);
  const [localidades, setLocalidades] = useState<{ id: string; nombre: string }[]>([]);
  const provinciaSeleccionada = useMemo(() => value.provincia, [value.provincia]);

  useEffect(() => {
    getProvincias().then(setProvincias).catch(console.error);
  }, []);

  useEffect(() => {
    if (provinciaSeleccionada) {
      getLocalidadesByProvincia(provinciaSeleccionada).then(setLocalidades).catch(console.error);
    } else {
      setLocalidades([]);
    }
  }, [provinciaSeleccionada]);

  return (
    <fieldset className={className}>
      <label className="block text-gray-700 font-primary font-bold mb-2">Dirección</label>

      <div className="flex gap-2 mb-3">
        <div className="w-1/2">
          <label className="block text-gray-400 text-sm mb-1 pl-1">Calle</label>
          <input
            type="text"
            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
            value={value.calle}
            onChange={(e) => onChange({ ...value, calle: e.target.value })}
            placeholder="Ej: San Martín"
            required
          />
        </div>
        <div className="w-1/2">
          <label className="block text-gray-400 text-sm mb-1 pl-1">Número</label>
          <input
            type="number"
            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
            value={value.numero ?? ""}
            onChange={(e) => onChange({ ...value, numero: e.target.value ? parseInt(e.target.value, 10) : undefined })}
            placeholder="Ej: 123"
            required
          />
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        <div className="w-1/2">
          <label className="block text-gray-400 text-sm mb-1 pl-1">Provincia</label>
          <select
            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
            value={value.provincia}
            onChange={(e) => onChange({ ...value, provincia: e.target.value, localidad: "" })}
            required
          >
            <option value="">Seleccioná…</option>
            {provincias.map((p) => (
              <option key={p.id} value={p.nombre}>{p.nombre}</option>
            ))}
          </select>
        </div>
        <div className="w-1/2">
          <label className="block text-gray-400 text-sm mb-1 pl-1">Localidad</label>
          <select
            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
            value={value.localidad}
            onChange={(e) => onChange({ ...value, localidad: e.target.value })}
            disabled={!value.provincia}
            required
          >
            <option value="">{value.provincia ? "Seleccioná…" : "Elegí provincia primero"}</option>
            {localidades.map((l) => (
              <option key={l.id} value={l.nombre}>{l.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        <div className="w-1/2">
          <label className="block text-gray-400 text-sm mb-1 pl-1">Código Postal (opcional)</label>
          <input
            type="number"
            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
            value={value.codigoPostal ?? ""}
            onChange={(e) => onChange({ ...value, codigoPostal: e.target.value ? parseInt(e.target.value, 10) : undefined })}
            placeholder="Ej: 5501"
          />
        </div>
      </div>
    </fieldset>
  );
}
