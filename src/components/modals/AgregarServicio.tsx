// src/components/modals/AgregarServicio.tsx
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { TipoDeServicio } from "../../types/enums/TipoDeServicio";
import type { ServicioDTO } from "../../types/servicio/ServicioDTO";
import { ServicioService } from "../../services/ServicioService";
import { CentroDeEsteticaService } from "../../services/CentroDeEsteticaService";

import type { ServicioResponseDTO } from "../../types/servicio/ServicioResponseDTO";

type Props = {
  servicio?: ServicioResponseDTO | null; // si viene, estamos editando
  onCreated?: (nuevo: ServicioResponseDTO) => void;
  onUpdated?: (actualizado: ServicioResponseDTO) => void;
  onClose?: () => void;
};

const servicioService = new ServicioService();
const centroService = new CentroDeEsteticaService();

const AgregarServicio = ({ servicio, onCreated, onUpdated, onClose }: Props) => {
  const [submitting, setSubmitting] = useState(false);
  const [centroId, setCentroId] = useState<number | null>(null);
  const [loadingCentro, setLoadingCentro] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener uid y luego centroId
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setError("No hay usuario autenticado.");
        setLoadingCentro(false);
        return;
      }
      try {
        setLoadingCentro(true);
        const id = await centroService.getMiCentroId(user.uid);
        setCentroId(id);
      } catch (e: unknown) {
        setError((e as Error).message ?? "No se pudo obtener el centro.");
      } finally {
        setLoadingCentro(false);
      }
    });
    return () => unsub();
  }, []);

  // Evitar scroll del body mientras el modal está abierto
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const isEdit = !!servicio;

  // Normaliza valores entrantes del backend para que coincidan con el enum
  const toEnumValue = (val: unknown): TipoDeServicio | "" => {
    if (val == null) return "";
    const raw = String(val)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // quita acentos
      .toUpperCase()
      .replace(/\s+/g, "_");
    const allowed = Object.values(TipoDeServicio) as string[];
    const match = allowed.find((v) => v === raw);
    return (match as TipoDeServicio) || "";
  };

  // Formik: solo los campos del DTO
  type FormValues = {
    tipoDeServicio: TipoDeServicio | "";
    titulo: string;
    descripcion: string;
    precio: number | "";
  };

  const initialValues: FormValues = isEdit
    ? {
        tipoDeServicio: toEnumValue(servicio!.tipoDeServicio),
        titulo: servicio!.titulo ?? "",
        descripcion: servicio!.descripcion ?? "",
        precio: servicio!.precio,
      }
    : {
        tipoDeServicio: "",
        titulo: "",
        descripcion: "",
        precio: "",
      };

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      {/* Backdrop con blur y oscurecimiento */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Contenedor centrado del modal */}
      <div className="fixed inset-0 z-50 grid place-items-center p-4" onClick={onClose}>
        <div
          className="w-[520px] max-w-[92vw] rounded-xl bg-white p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-secondary text-[#703F52] mb-4">{isEdit ? "Editar Servicio" : "Agregar Servicio"}</h2>

          {!isEdit && loadingCentro && <p>Cargando datos del centro...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {(isEdit || (!loadingCentro && !error && centroId != null)) && (
            <Formik<FormValues>
              key={isEdit ? `edit-${servicio!.id}` : "create"}
              enableReinitialize
              initialValues={initialValues}
              validate={(v) => {
                const errors: Partial<Record<keyof FormValues, string>> = {};
                if (!v.tipoDeServicio) errors.tipoDeServicio = "Selecciona un tipo";
                if (!v.titulo || !v.titulo.trim()) errors.titulo = "Ingresa un titulo";
                if (!v.descripcion || !v.descripcion.trim()) errors.descripcion = "Ingresa una descripcion";
                const precioNum = Number(v.precio);
                if (!v.precio || isNaN(precioNum) || precioNum <= 0) {
                  errors.precio = "Ingresa un precio mayor a 0";
                }
                return errors;
              }}
              onSubmit={async (values, { setSubmitting: setF, resetForm }) => {
                try {
                  setSubmitting(true);
                  const dto: ServicioDTO = {
                    tipoDeServicio: values.tipoDeServicio as TipoDeServicio,
                    titulo: values.titulo.trim(),
                    descripcion: values.descripcion.trim(),
                    precio: Number(values.precio),
                    centroDeEsteticaId: servicio?.centroDeEstetica?.id ?? (centroId as number),
                  };
                  if (isEdit && servicio) {
                    const actualizado = await servicioService.put(servicio.id, dto);
                    onUpdated?.(actualizado);
                  } else {
                    const creado = await servicioService.createServicio(dto);
                    onCreated?.(creado);
                    resetForm();
                  }
                  onClose?.();
                } catch (e: unknown) {
                  alert((e as Error).message ?? "Error al crear el servicio");
                } finally {
                  setSubmitting(false);
                  setF(false);
                }
              }}
            >
              {({ handleChange, handleSubmit, values, errors, touched }) => (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Tipo de servicio */}
                  <div>
                    <label htmlFor="tipoDeServicio" className="block mb-1 font-secondary">
                      Tipo de Servicio
                    </label>
                    <select
                      id="tipoDeServicio"
                      name="tipoDeServicio"
                      value={values.tipoDeServicio || ""}
                      onChange={handleChange}
                      className="border p-2 rounded-full w-full"
                    >
                      <option value="" label="Seleccione tipo de servicio" className="font-secondary" />
                      {Object.values(TipoDeServicio).map((tipo) => (
                        <option key={tipo} value={tipo}>
                          {tipo.replaceAll("_", " ")}
                        </option>
                      ))}
                    </select>
                    {touched.tipoDeServicio && errors.tipoDeServicio && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.tipoDeServicio}
                      </p>
                    )}
                  </div>

                  {/* Titulo */}
                  <div>
                    <label htmlFor="titulo" className="block mb-1 font-secondary">
                      Titulo
                    </label>
                    <input
                      type="text"
                      id="titulo"
                      name="titulo"
                      onChange={handleChange}
                      value={values.titulo}
                      className="border p-2 rounded-full w-full"
                      placeholder="Nombre del servicio"
                    />
                    {touched.titulo && errors.titulo && (
                      <p className="text-red-600 text-sm mt-1">{errors.titulo}</p>
                    )}
                  </div>

                  {/* Descripcion */}
                  <div>
                    <label htmlFor="descripcion" className="block mb-1 font-secondary">
                      Descripcion
                    </label>
                    <textarea
                      id="descripcion"
                      name="descripcion"
                      onChange={handleChange}
                      value={values.descripcion}
                      className="border p-2 rounded-lg w-full"
                      rows={3}
                      placeholder="Detalles del servicio"
                    />
                    {touched.descripcion && errors.descripcion && (
                      <p className="text-red-600 text-sm mt-1">{errors.descripcion}</p>
                    )}
                  </div>

                  {/* Precio */}
                  <div>
                    <label htmlFor="precio" className="block mb-1 font-secondary">
                      Precio
                    </label>
                    <input
                      type="number"
                      id="precio"
                      name="precio"
                      onChange={handleChange}
                      value={values.precio}
                      className="border p-2 rounded-full w-full"
                      min={0}
                      step="0.01"
                      placeholder="0.00"
                    />
                    {touched.precio && errors.precio && (
                      <p className="text-red-600 text-sm mt-1">{errors.precio}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="rounded-full bg-[#C19BA8] px-5 py-2 text-white font-semibold hover:bg-[#b78fa0] disabled:opacity-60"
                    >
                      {submitting ? "Guardando..." : isEdit ? "Guardar Cambios" : "Agregar Servicio"}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2 rounded-full border hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </Formik>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgregarServicio;
