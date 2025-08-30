import { useEffect, useMemo, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import NavbarPrestador from '../components/NavbarPrestador';
import Footer from '../components/Footer';
import Sidebar from '../components/SideBar';

import type { PrestadorServicioResponseDTO } from "../types/prestadorDeServicio/PrestadorServicioResponseDTO";
import type { CentroEsteticaResponseDTO } from "../types/centroDeEstetica/CentroEsteticaResponseDTO";
import { PrestadorService } from "../services/PrestadorService";
import { CentroDeEsteticaService } from "../services/CentroDeEsteticaService";

type Domicilio = {
  calle: string;
  numero: number;
  localidad: string;
  codigoPostal: string;
};

const prestadorSchema = Yup.object({
  nombre: Yup.string().required("Requerido"),
  apellido: Yup.string().required("Requerido"),
  telefono: Yup.string().required("Requerido"),
  usuario: Yup.object({
    mail: Yup.string().email("Email inválido").required("Requerido"),
  }),
  active: Yup.boolean().required(),
});

const centroSchema = Yup.object({
  nombre: Yup.string().required("Requerido"),
  descripcion: Yup.string().required("Requerido"),
  cuit: Yup.number().typeError("Debe ser numérico").required("Requerido"),
  docValido: Yup.string().nullable(),
  imagen: Yup.string().url("URL inválida").nullable(),
  domicilio: Yup.object({
    calle: Yup.string().required("Requerido"),
    numero: Yup.number().typeError("Numérico").required("Requerido"),
    localidad: Yup.string().required("Requerido"),
    cp: Yup.string().required("Requerido"),
  }),
});

const Tab = ({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition
      ${active ? "bg-[#703F52] text-white shadow" : "bg-[#FFFBFA] text-[#703F52] border border-[#E9DDE1] hover:bg-white"}`}
  >
    {children}
  </button>
);

const FieldBox = ({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) => (
  <label className="flex flex-col gap-1">
    <span className="text-sm font-medium text-[#703F52]">{label}</span>
    <Field
      name={name}
      type={type}
      placeholder={placeholder}
      className="rounded-lg border border-[#E9DDE1] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C19BA8]/40"
    />
    <ErrorMessage name={name} component="span" className="text-xs text-red-600" />
  </label>
);

const Switch = ({ name, label }: { name: string; label: string }) => (
  <div className="flex items-center gap-3">
    <Field name={name}>
      {({ field, form }: any) => (
        <button
          type="button"
          onClick={() => form.setFieldValue(name, !field.value)}
          className={`h-6 w-11 rounded-full transition ${
            field.value ? "bg-[#C19BA8]" : "bg-gray-300"
          }`}
          aria-pressed={field.value}
        >
          <span
            className={`block h-5 w-5 translate-y-[2px] rounded-full bg-white transition ${
              field.value ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      )}
    </Field>
    <span className="text-sm text-[#703F52]">{label}</span>
    <ErrorMessage name={name} component="span" className="text-xs text-red-600" />
  </div>
);

const ConfigPrestador = () => {
  // TODO: obtené estos IDs del contexto de auth o de la ruta
  const prestadorId = 1;
  const centroId = 1;

  const prestadorService = useMemo(() => new PrestadorService(), []);
  const centroService = useMemo(() => new CentroDeEsteticaService(), []);

  const [tab, setTab] = useState<"prestador" | "centro">("prestador");
  const [prestador, setPrestador] = useState<PrestadorServicioResponseDTO | null>(null);
  const [centro, setCentro] = useState<CentroEsteticaResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [p, c] = await Promise.all([
          prestadorService.getById(prestadorId),
          centroService.getById(centroId),
        ]);
        if (!mounted) return;
        setPrestador(p);
        setCentro(c);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [prestadorService, centroService, prestadorId, centroId]);

  return (
    <>
      <NavbarPrestador />
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:block w-64 shrink-0 border-r border-[#E9DDE1] bg-[#FFFBFA] h-[calc(100vh-64px)] sticky top-[64px]">
          <Sidebar />
        </aside>

        <main className="flex-1 overflow-auto px-6 py-10 bg-[#FFFBFA] min-h-[calc(100vh-64px)]">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 py-20">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl md:text-3xl font-bold font-secondary text-[#703F52]">
                Configuración
              </h1>
              <div className="flex gap-2">
                <Tab active={tab === "prestador"} onClick={() => setTab("prestador")}>
                  Prestador
                </Tab>
                <Tab active={tab === "centro"} onClick={() => setTab("centro")}>
                  Centro de Estética
                </Tab>
              </div>
            </div>

            {loading && <p className="text-sm text-gray-500">Cargando…</p>}

            {!loading && tab === "prestador" && prestador && (
              <Formik
                enableReinitialize
                initialValues={{
                  nombre: prestador.nombre || "",
                  apellido: prestador.apellido || "",
                  telefono: prestador.telefono || "",
                  usuario: { mail: prestador.usuario?.mail || "" },
                  active: !!prestador.active,
                }}
                validationSchema={prestadorSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    await prestadorService.update(prestador.id, values);
                    alert("Prestador actualizado ✅");
                  } catch (e) {
                    console.error(e);
                    alert("Error al actualizar prestador");
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FieldBox label="Nombre" name="nombre" />
                    <FieldBox label="Apellido" name="apellido" />
                    <FieldBox label="Teléfono" name="telefono" />
                    <FieldBox label="Email (usuario)" name="usuario.mail" type="email" />
                    <div className="md:col-span-2">
                      <Switch name="active" label="Cuenta activa" />
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-full bg-[#C19BA8] px-5 py-2 text-white font-semibold hover:bg-[#b78fa0] disabled:opacity-60"
                      >
                        Guardar cambios
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            )}

            {!loading && tab === "centro" && centro && (
              <Formik
                enableReinitialize
                initialValues={{
                  nombre: centro.nombre || "",
                  descripcion: centro.descripcion || "",
                  cuit: centro.cuit || ("" as unknown as number),
                  docValido: centro.docValido || "",
                  imagen: centro.imagen || "",
                  domicilio: (centro.domicilio as Domicilio) || {
                    calle: "",
                    numero: 0,
                    localidad: "",
                    codigoPostal: "",
                  },
                }}
                validationSchema={centroSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    await centroService.update(centro.id, values);
                    alert("Centro actualizado ✅");
                  } catch (e) {
                    console.error(e);
                    alert("Error al actualizar centro");
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FieldBox label="Nombre del centro" name="nombre" />
                    <FieldBox label="CUIT" name="cuit" />
                    <div className="md:col-span-2">
                      <FieldBox label="Descripción" name="descripcion" />
                    </div>
                    <FieldBox label="Documento válido (link/ID)" name="docValido" />
                    <FieldBox label="Imagen (URL)" name="imagen" />

                    <div className="md:col-span-2 mt-2">
                      <h3 className="text-lg font-semibold text-[#703F52] mb-2">Domicilio</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FieldBox label="Calle" name="domicilio.calle" />
                        <FieldBox label="Número" name="domicilio.numero" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <FieldBox label="Localidad" name="domicilio.localidad" />
                        <FieldBox label="Código Postal" name="domicilio.codigoPostal" />
                      </div>
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-full bg-[#C19BA8] px-5 py-2 text-white font-semibold hover:bg-[#b78fa0] disabled:opacity-60"
                      >
                        Guardar cambios
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default ConfigPrestador;
