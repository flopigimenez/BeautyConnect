// src/components/modals/AgregarProfesional.tsx
import { Formik } from "formik";
import { useEffect, useState } from "react";
import type { ProfesionalDTO } from "../../types/profesional/ProfesionalDTO";
import type { ProfesionalResponseDTO } from "../../types/profesional/ProfesionalResponseDTO";
import { ProfesionalService } from "../../services/ProfesionalService";

type Props = {
  centroId?: number; // requerido solo en alta
  profesional?: ProfesionalResponseDTO | null; // si viene, es edición
  onCreated?: (nuevo: ProfesionalResponseDTO) => void;
  onUpdated?: (actualizado: ProfesionalResponseDTO) => void;
  onClose?: () => void;
};

const profesionalService = new ProfesionalService();

export default function AgregarProfesional({ centroId, profesional, onCreated, onUpdated, onClose }: Props) {
  const [saving, setSaving] = useState(false);

  // Bloquear scroll mientras el modal está abierto
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const isEdit = !!profesional;

  const initialValues: Omit<ProfesionalDTO, "centroDeEsteticaId"> & { centroDeEsteticaId?: number } = isEdit
    ? {
        id: profesional!.id,
        nombre: profesional!.nombre,
        apellido: profesional!.apellido,
        centroDeEsteticaId: profesional!.centroDeEstetica?.id,
      }
    : {
        id: 0,
        nombre: "",
        apellido: "",
        centroDeEsteticaId: centroId,
      };

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      {/* Backdrop con blur */}
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Contenido centrado */}
      <div className="fixed inset-0 z-50 grid place-items-center p-4" onClick={onClose}>
        <div className="w-[520px] max-w-[92vw] rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
          <h2 className="text-xl font-secondary text-[#703F52] mb-4">{isEdit ? "Editar Profesional" : "Agregar Profesional"}</h2>

          {!isEdit && centroId == null && (
            <p className="text-red-600">No se encontró el centro de estética.</p>
          )}

          {(isEdit || centroId != null) && (
            <Formik
              key={isEdit ? `edit-${profesional!.id}` : "create"}
              enableReinitialize
              initialValues={initialValues}
              validate={(v) => {
                const e: Partial<Record<keyof ProfesionalDTO, string>> = {};
                if (!v.nombre?.trim()) e.nombre = "Requerido";
                if (!v.apellido?.trim()) e.apellido = "Requerido";
                return e;
              }}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                  setSaving(true);
                  const dto: ProfesionalDTO = {
                    id: isEdit ? profesional!.id : 0,
                    nombre: values.nombre.trim(),
                    apellido: values.apellido.trim(),
                    centroDeEsteticaId: (isEdit ? profesional!.centroDeEstetica?.id : centroId) as number,
                  };
                  if (isEdit && profesional) {
                    const actualizado = await profesionalService.update(profesional.id, dto);
                    onUpdated?.(actualizado);
                  } else {
                    const creado = await profesionalService.createProfesional(dto);
                    onCreated?.(creado);
                    resetForm();
                  }
                  onClose?.();
                } catch (err: unknown) {
                  alert((err as Error).message ?? (isEdit ? "Error al actualizar profesional" : "Error al crear profesional"));
                } finally {
                  setSaving(false);
                  setSubmitting(false);
                }
              }}
            >
              {({ handleChange, handleSubmit, values, errors, touched }) => (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block mb-1" htmlFor="nombre">Nombre</label>
                    <input
                      id="nombre"
                      name="nombre"
                      value={values.nombre}
                      onChange={handleChange}
                      className="border p-2 rounded-full w-full"
                    />
                    {touched.nombre && errors.nombre && <p className="text-red-600 text-sm">{errors.nombre}</p>}
                  </div>
                  <div>
                    <label className="block mb-1" htmlFor="apellido">Apellido</label>
                    <input
                      id="apellido"
                      name="apellido"
                      value={values.apellido}
                      onChange={handleChange}
                      className="border p-2 rounded-full w-full"
                    />
                    {touched.apellido && errors.apellido && <p className="text-red-600 text-sm">{errors.apellido}</p>}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-full bg-[#C19BA8] px-5 py-2 text-white font-semibold hover:bg-[#b78fa0] disabled:opacity-60"
                    >
                      {saving ? "Guardando..." : isEdit ? "Guardar Cambios" : "Agregar Profesional"}
                    </button>
                    <button type="button" onClick={onClose} className="px-5 py-2 rounded-full border hover:bg-gray-100">
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
}
