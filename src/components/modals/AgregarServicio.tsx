// src/components/modals/AgregarServicio.tsx
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { TipoDeServicio } from "../../types/enums/TipoDeServicio";
import type { ServicioDTO } from "../../types/servicio/ServicioDTO";
import { ServicioService } from "../../services/ServicioService";
import { CentroDeEsteticaService } from "../../services/CentroDeEsteticaService";
import Swal from "sweetalert2";

import type { ServicioResponseDTO } from "../../types/servicio/ServicioResponseDTO";
import { IoIosArrowDown } from "react-icons/io";
import { normalizarClaveServicio } from "../../utils/servicios";

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

  // Evitar scroll del body mientras el modal esta abierto
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
      .replace(/[\u0300-\u036f]/g, "")
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div
        className="mt-15 relative w-full max-w-xl overflow-hidden rounded-2xl bg-gradient-to-br from-[#FFFBFA] via-white to-[#F7EEF2] shadow-[0px_30px_80px_-40px_rgba(112,63,82,0.45)] ring-1 ring-black/5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#F0E3E7] bg-gradient-to-r from-[#F9EFF3] to-white px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#C19BA8]">
              {isEdit ? "Edicion" : "Nuevo servicio"}
            </p>
            <h2 className="mt-2 text-2xl font-secondary font-semibold text-[#703F52]">
              {isEdit ? "Editar Servicio" : "Agregar Servicio"}
            </h2>
            <p className="mt-2 text-sm text-[#856272]">
              Completa la informacion para que tus clientes conozcan mejor esta propuesta.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E9DDE1] text-lg text-[#703F52] transition hover:bg-white hover:text-[#4A1F2F] focus:outline-none focus:ring-2 focus:ring-[#C19BA8]/50 cursror-pointer"
            aria-label="Cerrar modal"
          >
            &times;
          </button>
        </div>

        <div className="px-6 pb-6 pt-5">
          {!isEdit && loadingCentro && (
            <div className="mb-4 rounded-xl border border-dashed border-[#E9DDE1] bg-white/80 px-4 py-3 text-sm text-[#856272]">
              Cargando datos del centro...
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

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
                if (!v.precio || Number.isNaN(precioNum) || precioNum <= 0) {
                  errors.precio = "Ingresa un precio mayor a 0";
                }
                return errors;
              }}
              onSubmit={async (values, { resetForm, setSubmitting: setF }) => {
                try {
                  setSubmitting(true);
                  setError(null);
                  const payload: ServicioDTO = {
                    tipoDeServicio: values.tipoDeServicio as TipoDeServicio,
                    titulo: values.titulo.trim(),
                    descripcion: values.descripcion.trim(),
                    precio: Number(values.precio),
                    centroDeEsteticaId: servicio?.centroDeEstetica?.id ?? (centroId as number),
                    active: servicio?.active ?? true,
                  };

                  const res = isEdit
                    ? await servicioService.patch(servicio!.id, payload)
                    : await servicioService.createServicio(payload);

                  if (isEdit) {
                    onUpdated?.(res);
                    Swal.fire({
                      icon: "success",
                      title: "Servicio actualizado",
                      text: "Tu servicio se actualizo correctamente",
                      confirmButtonColor: "#a27e8f",
                    });
                  } else {
                    onCreated?.(res);
                    Swal.fire({
                      icon: "success",
                      title: "Servicio creado",
                      text: "El nuevo servicio ya esta disponible para tus clientes",
                      confirmButtonColor: "#a27e8f",
                    });
                    resetForm();
                  }
                  onClose?.();
                } catch (e: unknown) {
                  const mensaje = (e as Error).message || "Error al crear el servicio";
                  setError(mensaje);
                  Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: mensaje,
                    confirmButtonColor: "#a27e8f",
                  });
                } finally {
                  setSubmitting(false);
                  setF(false);
                }
              }}
            >
              {({ handleChange, handleSubmit, values, errors, touched }) => (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="tipoDeServicio" className="mb-2 block text-sm font-medium text-[#4A1F2F]">
                        Tipo de Servicio
                      </label>
                      <div className="relative">
                        <select
                          id="tipoDeServicio"
                          name="tipoDeServicio"
                          value={values.tipoDeServicio || ""}
                          onChange={handleChange}
                          className="w-full appearance-none rounded-xl border border-[#E9DDE1] bg-white/80 px-4 py-3 text-sm text-[#4A1F2F] shadow-sm transition focus:border-[#C19BA8] focus:outline-none focus:ring-2 focus:ring-[#C19BA8]/40"
                        >
                          <option value="" label="Seleccione tipo de servicio" className="font-secondary" />
                          {Object.values(TipoDeServicio).map((tipo) => (
                            <option key={tipo} value={tipo}>
                              {normalizarClaveServicio(tipo)}
                            </option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#C19BA8]">
                          <IoIosArrowDown />
                        </span>
                      </div>
                      {touched.tipoDeServicio && errors.tipoDeServicio && (
                        <p className="mt-2 text-sm text-red-600">{errors.tipoDeServicio}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="titulo" className="mb-2 block text-sm font-medium text-[#4A1F2F]">
                        Titulo
                      </label>
                      <input
                        type="text"
                        id="titulo"
                        name="titulo"
                        onChange={handleChange}
                        value={values.titulo}
                        className="w-full rounded-xl border border-[#E9DDE1] bg-white/80 px-4 py-3 text-sm text-[#4A1F2F] shadow-sm transition placeholder:text-[#C19BA8] focus:border-[#C19BA8] focus:outline-none focus:ring-2 focus:ring-[#C19BA8]/40"
                        placeholder="Nombre del servicio"
                      />
                      {touched.titulo && errors.titulo && (
                        <p className="mt-2 text-sm text-red-600">{errors.titulo}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="precio" className="mb-2 block text-sm font-medium text-[#4A1F2F]">
                        Precio
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#C19BA8]">
                          $
                        </span>
                        <input
                          type="number"
                          id="precio"
                          name="precio"
                          onChange={handleChange}
                          value={values.precio}
                          className="w-full rounded-xl border border-[#E9DDE1] bg-white/80 px-4 py-3 pl-8 text-sm text-[#4A1F2F] shadow-sm transition placeholder:text-[#C19BA8] focus:border-[#C19BA8] focus:outline-none focus:ring-2 focus:ring-[#C19BA8]/40"
                          min={0}
                          step="0.01"
                          placeholder="0.00"
                        />
                      </div>
                      {touched.precio && errors.precio && (
                        <p className="mt-2 text-sm text-red-600">{errors.precio}</p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="descripcion" className="mb-2 block text-sm font-medium text-[#4A1F2F]">
                        Descripcion
                      </label>
                      <textarea
                        id="descripcion"
                        name="descripcion"
                        onChange={handleChange}
                        value={values.descripcion}
                        className="min-h-[90px] w-full resize-none rounded-xl border border-[#E9DDE1] bg-white/80 px-4 py-3 text-sm text-[#4A1F2F] shadow-sm transition placeholder:text-[#C19BA8] focus:border-[#C19BA8] focus:outline-none focus:ring-2 focus:ring-[#C19BA8]/40"
                        rows={3}
                        placeholder="Describe los beneficios, duracion y que incluye"
                      />
                      {touched.descripcion && errors.descripcion && (
                        <p className="mt-2 text-sm text-red-600">{errors.descripcion}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex w-full items-center justify-center rounded-full border border-transparent bg-white px-6 py-2 text-sm font-semibold text-[#703F52] shadow-sm transition hover:border-[#E9DDE1] hover:bg-[#FFFBFA] sm:w-auto cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex w-full items-center justify-center rounded-full bg-[#703F52] px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5e3443] focus:outline-none focus:ring-2 focus:ring-[#C19BA8]/60 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto cursor-pointer"
                    >
                      {submitting ? "Guardando..." : isEdit ? "Guardar Cambios" : "Crear Servicio"}
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
