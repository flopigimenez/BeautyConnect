import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import type { ProfesionalDTO } from "../../types/profesional/ProfesionalDTO";
import { useMemo } from "react";
import { TipoDeServicio } from "../../types/enums/TipoDeServicio"; // ajustá el path si difiere

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (nuevo: ProfesionalDTO) => void;
};

const DIAS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

const dayLabel: Record<string, string> = {
  MONDAY: "Lunes",
  TUESDAY: "Martes",
  WEDNESDAY: "Miércoles",
  THURSDAY: "Jueves",
  FRIDAY: "Viernes",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

const schema = Yup.object({
  nombre: Yup.string().required("El nombre es obligatorio"),
  apellido: Yup.string().required("El apellido es obligatorio"),
  servicios: Yup.array().of(Yup.string()).min(1, "Seleccioná al menos un servicio"),
  disponibilidades: Yup.array()
    .of(
      Yup.object({
        dia: Yup.string().oneOf([...DIAS]).required("Elegí un día"),
        horaInicio: Yup.string().required("Hora inicio"),
        horaFinalizacion: Yup.string()
          .required("Hora fin")
          .test("orden", "La hora fin debe ser mayor que inicio", function (fin) {
            const { horaInicio } = this.parent as { horaInicio: string };
            return !horaInicio || !fin || horaInicio < fin;
          }),
      })
    )
    .min(1, "Agregá al menos una franja horaria"),
});

const toHHmmss = (t: string) => (t?.length === 5 ? `${t}:00` : t || "");

export default function AgregarProfesional({ open, onClose, onSave }: Props) {
  if (!open) return null;

  // Opciones de servicios a partir del enum
  const serviciosOptions = useMemo(() => {
    // Para string enums: Object.values devuelve los valores directamente.
    return Object.values(TipoDeServicio) as string[];
  }, []);

  const crearProfesional = async (payload: Partial<ProfesionalDTO>) => {
    const res = await fetch("http://localhost:8080/api/profesional/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || "No se pudo crear el profesional");
    }
    return (await res.json()) as ProfesionalDTO;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-2xl mx-4 rounded-2xl bg-white shadow-xl border border-[#E9DDE1]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E9DDE1]">
          <h3 className="text-lg font-semibold text-[#3c2e35]">Agregar profesional</h3>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-full hover:bg-[#F7EFF1] text-[#3c2e35]"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="p-5">
          <Formik
            initialValues={{
              nombre: "",
              apellido: "",
              servicios: [] as string[],
              disponibilidades: [
                { dia: "MONDAY", horaInicio: "09:00", horaFinalizacion: "18:00" },
              ],
            }}
            validationSchema={schema}
            onSubmit={async (values, { resetForm, setSubmitting, setStatus }) => {
              setStatus(undefined);
              try {
                const payload: Partial<ProfesionalDTO> = {
                  nombre: values.nombre.trim(),
                  apellido: values.apellido.trim(),
                  servicios: values.servicios as any, // string[] (enum) → TipoDeServicio[]
                  disponibilidades: values.disponibilidades.map((d) => ({
                    dia: d.dia,
                    horaInicio: toHHmmss(d.horaInicio),
                    horaFinalizacion: toHHmmss(d.horaFinalizacion),
                  })) as any,
                };
                const created = await crearProfesional(payload);
                onSave(created);
                resetForm();
                onClose();
              } catch (e: any) {
                setStatus(e?.message || "Error al crear el profesional");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, status, values }) => (
              <Form className="space-y-6">
                {status && (
                  <div className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">
                    {status}
                  </div>
                )}

                {/* Datos básicos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#3c2e35] mb-1">
                      Nombre
                    </label>
                    <Field
                      name="nombre"
                      className="w-full rounded-xl border border-[#E9DDE1] bg-white px-3 py-2"
                    />
                    <ErrorMessage name="nombre" component="p" className="text-sm text-red-600 mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#3c2e35] mb-1">
                      Apellido
                    </label>
                    <Field
                      name="apellido"
                      className="w-full rounded-xl border border-[#E9DDE1] bg-white px-3 py-2"
                    />
                    <ErrorMessage name="apellido" component="p" className="text-sm text-red-600 mt-1" />
                  </div>
                </div>

                {/* Servicios (checkboxes) */}
                <div>
                  <label className="block text-sm font-medium text-[#3c2e35] mb-2">
                    Servicios ofrecidos
                  </label>
                  <FieldArray name="servicios">
                    {({ push, remove }) => (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {serviciosOptions.map((srv) => {
                          const checked = values.servicios.includes(srv);
                          const label = srv
                            .toString()
                            .toLowerCase()
                            .split("_")
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(" ");
                          return (
                            <label
                              key={srv}
                              className={`flex items-center gap-2 rounded-xl border px-3 py-2 cursor-pointer ${
                                checked ? "border-[#C19BA8] bg-[#F7EFF1]" : "border-[#E9DDE1]"
                              }`}
                            >
                              <input
                                type="checkbox"
                                className="accent-[#C19BA8]"
                                checked={checked}
                                onChange={(e) => {
                                  if (e.target.checked) push(srv);
                                  else {
                                    const idx = values.servicios.indexOf(srv);
                                    if (idx > -1) remove(idx);
                                  }
                                }}
                              />
                              <span className="text-sm">{label}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </FieldArray>
                  <ErrorMessage name="servicios" component="p" className="text-sm text-red-600 mt-1" />
                </div>

                {/* Disponibilidades */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-[#3c2e35]">
                      Disponibilidad
                    </label>
                    <FieldArray name="disponibilidades">
                      {({ push }) => (
                        <button
                          type="button"
                          onClick={() => push({ dia: "MONDAY", horaInicio: "09:00", horaFinalizacion: "18:00" })}
                          className="text-sm text-[#C19BA8] hover:underline"
                        >
                          + Agregar franja
                        </button>
                      )}
                    </FieldArray>
                  </div>

                  <FieldArray name="disponibilidades">
                    {({ remove }) => (
                      <div className="mt-2 space-y-2">
                        {values.disponibilidades.map((_, idx) => (
                          <div
                            key={idx}
                            className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end rounded-xl border border-[#E9DDE1] p-3"
                          >
                            <div className="md:col-span-5">
                              <label className="block text-xs text-[#3c2e35] mb-1">Día</label>
                              <Field
                                as="select"
                                name={`disponibilidades[${idx}].dia`}
                                className="w-full rounded-lg border border-[#E9DDE1] px-3 py-2 bg-white"
                              >
                                {DIAS.map((d) => (
                                  <option key={d} value={d}>
                                    {dayLabel[d]}
                                  </option>
                                ))}
                              </Field>
                              <ErrorMessage
                                name={`disponibilidades[${idx}].dia`}
                                component="p"
                                className="text-xs text-red-600 mt-1"
                              />
                            </div>

                            <div className="md:col-span-3">
                              <label className="block text-xs text-[#3c2e35] mb-1">Desde</label>
                              <Field
                                type="time"
                                step="60"
                                name={`disponibilidades[${idx}].horaInicio`}
                                className="w-full rounded-lg border border-[#E9DDE1] px-3 py-2"
                              />
                              <ErrorMessage
                                name={`disponibilidades[${idx}].horaInicio`}
                                component="p"
                                className="text-xs text-red-600 mt-1"
                              />
                            </div>

                            <div className="md:col-span-3">
                              <label className="block text-xs text-[#3c2e35] mb-1">Hasta</label>
                              <Field
                                type="time"
                                step="60"
                                name={`disponibilidades[${idx}].horaFinalizacion`}
                                className="w-full rounded-lg border border-[#E9DDE1] px-3 py-2"
                              />
                              <ErrorMessage
                                name={`disponibilidades[${idx}].horaFinalizacion`}
                                component="p"
                                className="text-xs text-red-600 mt-1"
                              />
                            </div>

                            <div className="md:col-span-1 flex md:justify-end">
                              <button
                                type="button"
                                onClick={() => remove(idx)}
                                className="rounded-full px-3 py-2 text-sm hover:bg-[#F7EFF1]"
                                aria-label="Eliminar franja"
                                title="Eliminar franja"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </FieldArray>
                  <ErrorMessage name="disponibilidades" component="p" className="text-sm text-red-600 mt-1" />
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-full px-4 py-2 bg-[#C19BA8] text-white hover:bg-[#b78fa0] disabled:opacity-60"
                  >
                    {isSubmitting ? "Guardando..." : "Guardar"}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full px-4 py-2 hover:bg-[#F7EFF1]"
                  >
                    Cancelar
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
