import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import type { ServicioDTO } from "../../types/servicio/ServicioDTO";
import type { TipoDeServicio } from "../../types/enums/TipoDeServicio";
import type { ProfesionalDTO } from "../../types/profesional/ProfesionalDTO";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (nuevo: ServicioDTO) => void;
  profesionales: ProfesionalDTO[];
  tiposDeServicio: TipoDeServicio[];
};

const schema = Yup.object({
  tipoDeServicio: Yup.string().required("El tipo de servicio es obligatorio"),
  descripcion: Yup.string().required("La descripción es obligatoria"),
  duracion: Yup.number().required("La duración es obligatoria").min(1, "Debe ser mayor a 0"),
  precio: Yup.number().required("El precio es obligatorio").min(0, "No puede ser negativo"),
  profesionalId: Yup.number().required("El profesional es obligatorio"),
});

export default function AgregarServicio({
  open,
  onClose,
  onSave,
  profesionales,
  tiposDeServicio,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-lg mx-4 rounded-2xl bg-[#FFFBFA] shadow-xl border border-[#E9DDE1]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E9DDE1]">
          <h3 className="text-lg font-semibold text-[#3c2e35]">Agregar servicio</h3>
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
              tipoDeServicio: "",
              descripcion: "",
              duracion: 30,
              precio: 0,
              profesionalId: profesionales[0]?.id ?? "",
            }}
            validationSchema={schema}
            onSubmit={(values, { resetForm }) => {
              const profesional = profesionales.find(p => p.id === Number(values.profesionalId));
              if (!profesional) return;
              const nuevoServicio: ServicioDTO = {
                id: Date.now(), // temporal
                tipoDeServicio: values.tipoDeServicio as TipoDeServicio,
                descripcion: values.descripcion,
                duracion: values.duracion,
                precio: values.precio,
                centroDeEsteticaDTO: profesional.centroDeEstetica,
              };
              onSave(nuevoServicio);
              resetForm();
              onClose();
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                {/* Tipo de servicio */}
                <div>
                  <label className="block text-sm font-medium text-[#3c2e35] mb-1">
                    Tipo de servicio
                  </label>
                  <Field as="select" name="tipoDeServicio" className="w-full rounded-xl border border-[#E9DDE1] bg-white px-3 py-2">
                    <option value="">Selecciona...</option>
                    {tiposDeServicio.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="tipoDeServicio" component="p" className="text-sm text-red-600 mt-1" />
                </div>
                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-[#3c2e35] mb-1">
                    Descripción
                  </label>
                  <Field name="descripcion" placeholder="Ej: Corte de cabello" className="w-full rounded-xl border border-[#E9DDE1] bg-white px-3 py-2" />
                  <ErrorMessage name="descripcion" component="p" className="text-sm text-red-600 mt-1" />
                </div>
                {/* Duración */}
                <div>
                  <label className="block text-sm font-medium text-[#3c2e35] mb-1">
                    Duración (minutos)
                  </label>
                  <Field type="number" name="duracion" min={1} className="w-full rounded-xl border border-[#E9DDE1] bg-white px-3 py-2" />
                  <ErrorMessage name="duracion" component="p" className="text-sm text-red-600 mt-1" />
                </div>
                {/* Precio */}
                <div>
                  <label className="block text-sm font-medium text-[#3c2e35] mb-1">
                    Precio
                  </label>
                  <Field type="number" name="precio" min={0} className="w-full rounded-xl border border-[#E9DDE1] bg-white px-3 py-2" />
                  <ErrorMessage name="precio" component="p" className="text-sm text-red-600 mt-1" />
                </div>
                {/* Profesional */}
                <div>
                  <label className="block text-sm font-medium text-[#3c2e35] mb-1">
                    Profesional
                  </label>
                  <Field as="select" name="profesionalId" className="w-full rounded-xl border border-[#E9DDE1] bg-white px-3 py-2">
                    {profesionales.map(p => (
                      <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="profesionalId" component="p" className="text-sm text-red-600 mt-1" />
                </div>
                {/* Acciones */}
                <div className="pt-2 flex items-center gap-3">
                  <button type="submit" disabled={isSubmitting} className="rounded-full px-4 py-2 bg-[#F2E8EA] hover:bg-[#E8DADD] disabled:opacity-60">
                    Guardar
                  </button>
                  <button type="button" onClick={onClose} className="rounded-full px-4 py-2 hover:bg-[#F7EFF1]">
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