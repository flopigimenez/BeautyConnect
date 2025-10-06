// src/components/modals/AgregarProfesional.tsx
import { Formik } from "formik";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import type { ProfesionalDTO } from "../../types/profesional/ProfesionalDTO";
import type { ProfesionalResponseDTO } from "../../types/profesional/ProfesionalResponseDTO";
import { ProfesionalService } from "../../services/ProfesionalService";

type Props = {
  centroId?: number; // requerido solo en alta
  profesional?: ProfesionalResponseDTO | null; // si viene, es edicion
  onCreated?: (nuevo: ProfesionalResponseDTO) => void;
  onUpdated?: (actualizado: ProfesionalResponseDTO) => void;
  onClose?: () => void;
};

const profesionalService = new ProfesionalService();

export default function AgregarProfesional({ centroId, profesional, onCreated, onUpdated, onClose }: Props) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Bloquear scroll mientras el modal esta abierto
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const isEdit = !!profesional;

  type FormValues = {
    id: number;
    nombre: string;
    apellido: string;
    contacto: string;
    centroDeEsteticaId?: number;
  };

  const initialValues: FormValues = isEdit
    ? {
        id: profesional!.id,
        nombre: profesional!.nombre,
        apellido: profesional!.apellido,
        contacto: profesional!.contacto?.toString() ?? "",
        centroDeEsteticaId: profesional!.centroDeEstetica?.id ?? undefined,
      }
    : {
        id: 0,
        nombre: "",
        apellido: "",
        contacto: "",
        centroDeEsteticaId: centroId ?? undefined,
      };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-gradient-to-br from-[#FFFBFA] via-white to-[#F7EEF2] shadow-[0px_30px_80px_-40px_rgba(112,63,82,0.45)] ring-1 ring-black/5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#F0E3E7] bg-gradient-to-r from-[#F9EFF3] to-white px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#C19BA8]">
              {isEdit ? "Edicion" : "Nuevo profesional"}
            </p>
            <h2 className="mt-2 text-2xl font-secondary font-semibold text-[#703F52]">
              {isEdit ? "Editar Profesional" : "Agregar Profesional"}
            </h2>
            <p className="mt-2 text-sm text-[#856272]">
              Comparte los datos clave para que tus clientes puedan contactarlo.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E9DDE1] text-lg text-[#703F52] transition hover:bg-white hover:text-[#4A1F2F] focus:outline-none focus:ring-2 focus:ring-[#C19BA8]/50"
            aria-label="Cerrar modal"
          >
            &times;
          </button>
        </div>

        <div className="px-6 pb-6 pt-5">
          {!isEdit && centroId == null && (
            <div className="mb-4 rounded-xl border border-dashed border-[#E9DDE1] bg-white/80 px-4 py-3 text-sm text-[#856272]">
              No se encontro el centro de estetica.
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {(isEdit || centroId != null) && (
            <Formik<FormValues>
              key={isEdit ? `edit-${profesional!.id}` : "create"}
              enableReinitialize
              initialValues={initialValues}
              validate={(v) => {
                const errors: Partial<Record<keyof FormValues, string>> = {};
                if (!v.nombre?.trim()) errors.nombre = "Requerido";
                if (!v.apellido?.trim()) errors.apellido = "Requerido";
                const contacto = v.contacto?.trim() ?? "";
                if (!contacto) {
                  errors.contacto = "Requerido";
                } else if (!/^\d+$/.test(contacto)) {
                  errors.contacto = "Solo numeros";
                }
                return errors;
              }}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                  setSaving(true);
                  setError(null);
                  const contactoNormalizado = values.contacto.trim();
                  const contactoNumero = Number(contactoNormalizado);
                  const dto: ProfesionalDTO = {
                    id: isEdit ? profesional!.id : 0,
                    nombre: values.nombre.trim(),
                    apellido: values.apellido.trim(),
                    contacto: contactoNumero,
                    centroDeEsteticaId: (isEdit ? profesional!.centroDeEstetica?.id : centroId) as number,
                  };
                  if (isEdit && profesional) {
                    const actualizado = await profesionalService.update(profesional.id, dto);
                    onUpdated?.(actualizado);
                    Swal.fire({
                      icon: "success",
                      title: "Profesional actualizado",
                      text: "Los datos del profesional se actualizaron correctamente",
                      confirmButtonColor: "#a27e8f",
                    });
                  } else {
                    const creado = await profesionalService.createProfesional(dto);
                    onCreated?.(creado);
                    Swal.fire({
                      icon: "success",
                      title: "Profesional creado",
                      text: "El nuevo profesional ya esta disponible",
                      confirmButtonColor: "#a27e8f",
                    });
                    resetForm();
                  }
                  onClose?.();
                } catch (err: unknown) {
                  const message =
                    (err as Error).message ?? (isEdit ? "Error al actualizar profesional" : "Error al crear profesional");
                  setError(message);
                  Swal.fire({ icon: "error", title: "Error", text: message, confirmButtonColor: "#a27e8f" });
                } finally {
                  setSaving(false);
                  setSubmitting(false);
                }
              }}
            >
              {({ handleChange, handleSubmit, values, errors, touched }) => (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="nombre" className="mb-2 block text-sm font-medium text-[#4A1F2F]">
                        Nombre
                      </label>
                      <input
                        id="nombre"
                        name="nombre"
                        value={values.nombre}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-[#E9DDE1] bg-white/80 px-4 py-3 text-sm text-[#4A1F2F] shadow-sm transition placeholder:text-[#C19BA8] focus:border-[#C19BA8] focus:outline-none focus:ring-2 focus:ring-[#C19BA8]/40"
                        placeholder="Nombre del profesional"
                      />
                      {touched.nombre && errors.nombre && <p className="mt-2 text-sm text-red-600">{errors.nombre}</p>}
                    </div>

                    <div>
                      <label htmlFor="apellido" className="mb-2 block text-sm font-medium text-[#4A1F2F]">
                        Apellido
                      </label>
                      <input
                        id="apellido"
                        name="apellido"
                        value={values.apellido}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-[#E9DDE1] bg-white/80 px-4 py-3 text-sm text-[#4A1F2F] shadow-sm transition placeholder:text-[#C19BA8] focus:border-[#C19BA8] focus:outline-none focus:ring-2 focus:ring-[#C19BA8]/40"
                        placeholder="Apellido del profesional"
                      />
                      {touched.apellido && errors.apellido && <p className="mt-2 text-sm text-red-600">{errors.apellido}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="contacto" className="mb-2 block text-sm font-medium text-[#4A1F2F]">
                        Contacto
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-[0.2em] text-[#C19BA8]">
                          Tel
                        </span>
                        <input
                          id="contacto"
                          name="contacto"
                          value={values.contacto}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-[#E9DDE1] bg-white/80 px-4 py-3 pl-16 text-sm text-[#4A1F2F] shadow-sm transition placeholder:text-[#C19BA8] focus:border-[#C19BA8] focus:outline-none focus:ring-2 focus:ring-[#C19BA8]/40"
                          placeholder="Ingrese solo numeros"
                          inputMode="numeric"
                          pattern="[0-9]*"
                        />
                      </div>
                      {touched.contacto && errors.contacto && <p className="mt-2 text-sm text-red-600">{errors.contacto}</p>}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex w-full items-center justify-center rounded-full border border-transparent bg-white px-6 py-2.5 text-sm font-semibold text-[#703F52] shadow-sm transition hover:border-[#E9DDE1] hover:bg-[#FFFBFA] sm:w-auto"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex w-full items-center justify-center rounded-full bg-[#703F52] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5e3443] focus:outline-none focus:ring-2 focus:ring-[#C19BA8]/60 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      {saving ? "Guardando..." : isEdit ? "Guardar Cambios" : "Crear Profesional"}
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
}
