import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import type { ProfesionalDTO } from "../../types/profesional/ProfesionalDTO";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (nuevo: ProfesionalDTO) => void;
};

const schema = Yup.object({
  nombre: Yup.string().required("El nombre es obligatorio"),
  apellido: Yup.string().required("El apellido es obligatorio"),
});

export default function AgregarProfesional({ open, onClose, onSave }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-md mx-4 rounded-2xl bg-white shadow-xl border border-[#E9DDE1]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E9DDE1]">
          <h3 className="text-lg font-semibold text-[#3c2e35]">
            Agregar profesional
          </h3>
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
            }}
            validationSchema={schema}
            onSubmit={(values, { resetForm }) => {
              const nuevoProfesional: ProfesionalDTO = {
                id: Date.now(), // temporal, el backend debe asignar el id real
                nombre: values.nombre,
                apellido: values.apellido,
                disponibilidades: [],
                servicios: [],
                centroDeEstetica: undefined, // ajusta según tu lógica
              };
              onSave(nuevoProfesional);
              resetForm();
              onClose();
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#3c2e35] mb-1">
                    Nombre
                  </label>
                  <Field
                    name="nombre"
                    className="w-full rounded-xl border border-[#E9DDE1] bg-white px-3 py-2"
                  />
                  <ErrorMessage
                    name="nombre"
                    component="p"
                    className="text-sm text-red-600 mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3c2e35] mb-1">
                    Apellido
                  </label>
                  <Field
                    name="apellido"
                    className="w-full rounded-xl border border-[#E9DDE1] bg-white px-3 py-2"
                  />
                  <ErrorMessage
                    name="apellido"
                    component="p"
                    className="text-sm text-red-600 mt-1"
                  />
                </div>
                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-full px-4 py-2 bg-[#F2E8EA] hover:bg-[#E8DADD] disabled:opacity-60"
                  >
                    Guardar
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
