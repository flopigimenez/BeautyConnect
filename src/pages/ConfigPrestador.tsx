// pages/ConfigPrestador.tsx
import { useEffect, useMemo, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

import NavbarPrestador from '../components/NavbarPrestador';
import Footer from '../components/Footer';
import Sidebar from '../components/SideBar';

import type { PrestadorServicioResponseDTO } from "../types/prestadorDeServicio/PrestadorServicioResponseDTO";
import type { PrestadorServicioDTO } from "../types/prestadorDeServicio/PestadorServicioDTO";
import type { CentroEsteticaResponseDTO } from "../types/centroDeEstetica/CentroEsteticaResponseDTO";
import type { CentroDeEsteticaDTO } from "../types/centroDeEstetica/CentroDeEsteticaDTO";
import type { Rol } from "../types/enums/Rol";

import { PrestadorServicioService } from "../services/PrestadorServicioService";
import { CentroDeEsteticaService } from "../services/CentroDeEsteticaService";

const DEFAULT_ROL: Rol = "PRESTADOR" as Rol; // ajusta si tu enum lo requiere

const prestadorSchema = Yup.object({
  nombre: Yup.string().required("Requerido"),
  apellido: Yup.string().required("Requerido"),
  telefono: Yup.string().required("Requerido"),
  usuario: Yup.object({
    mail: Yup.string().email("Email inválido").required("Requerido"),
  }).required(),
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
    codigoPostal: Yup.string().required("Requerido"),
  }).required(),
});

const Tab = ({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition
      ${active ? "bg-[#703F52] text-white shadow" : "bg-[#FFFBFA] text-[#703F52] border border-[#E9DDE1] hover:bg-white"}`}
  >
    {children}
  </button>
);

const FieldBox = ({ label, name, type = "text", placeholder, disabled = false }: {
  label: string; name: string; type?: string; placeholder?: string; disabled?: boolean;
}) => (
  <label className="flex flex-col gap-1">
    <span className="text-sm font-medium text-[#703F52]">{label}</span>
    <Field
      name={name}
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      className={`rounded-lg border border-[#E9DDE1] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C19BA8]/40 ${disabled ? "bg-gray-50 text-gray-500" : ""}`}
    />
    <ErrorMessage name={name} component="span" className="text-xs text-red-600" />
  </label>
);

const ConfigPrestador = () => {
  const [tab, setTab] = useState<"prestador" | "centro">("prestador");
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string>("");
  const [mailVista, setMailVista] = useState<string>("");

  const [prestador, setPrestador] = useState<PrestadorServicioResponseDTO | null>(null);
  const [centro, setCentro] = useState<CentroEsteticaResponseDTO | null>(null);

  const prestadorService = useMemo(() => new PrestadorServicioService(), []);
  const centroService = useMemo(() => new CentroDeEsteticaService(), []);

  // 1) Carga por UID desde Firebase y trae Prestador + Centro
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        Swal.fire({ icon: "error", title: "Sesión", text: "No hay sesión activa" });
        return;
      }
      setUid(user.uid);
      setMailVista(user.email ?? "");
      try {
        setLoading(true);
        // Prestador por UID
        const p = await prestadorService.getByUid(user.uid);
        setPrestador(p);

        // Centro por UID de prestador (depende de tu API; si el Prestador viene con centro.id, podrías usar getById)
        const c = await centroService.getByPrestadorUid(user.uid);
        setCentro(c);
      } catch (e) {
        console.error(e);
        Swal.fire({ icon: "error", title: "Error", text: "No se pudo cargar la configuración" });
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, [prestadorService, centroService]);

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
              <h1 className="text-2xl md:text-3xl font-bold font-secondary text-[#703F52]">Configuración</h1>
              <div className="flex gap-2">
                <Tab active={tab === "prestador"} onClick={() => setTab("prestador")}>Prestador</Tab>
                <Tab active={tab === "centro"} onClick={() => setTab("centro")}>Centro de Estética</Tab>
              </div>
            </div>

            {loading && <p className="text-sm text-gray-500">Cargando…</p>}

            {/* --------- TAB: PRESTADOR --------- */}
            {!loading && tab === "prestador" && (
              <Formik
                enableReinitialize
                initialValues={{
                  nombre: prestador?.nombre ?? "",
                  apellido: prestador?.apellido ?? "",
                  telefono: prestador?.telefono ?? "",
                  usuario: { mail: prestador?.usuario?.mail ?? mailVista },
                  active: !!prestador?.active,
                }}
                validationSchema={prestadorSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    const payload: PrestadorServicioDTO = {
                      ...values,
                      usuario: {
                        ...values.usuario,
                        uid,
                        rol: (prestador?.usuario?.rol ?? DEFAULT_ROL) as Rol,
                        // si tu backend ignora contraseña acá, déjalo vacío:
                        contraseña: prestador?.usuario?.contraseña ?? "",
                      },
                    };

                    let saved: PrestadorServicioResponseDTO;
                    if (prestador?.id) {
                      saved = await prestadorService.update(prestador.id, payload);
                    } else {
                      saved = await prestadorService.create(payload);
                    }
                    setPrestador(saved);

                    Swal.fire({
                      icon: "success",
                      title: "¡Prestador actualizado!",
                      text: "Tus datos se guardaron correctamente.",
                      confirmButtonColor: "#C19BA8",
                    });
                  } catch (e) {
                    console.error(e);
                    Swal.fire({
                      icon: "error",
                      title: "Error",
                      text: "No se pudo guardar los datos del prestador.",
                      confirmButtonColor: "#C19BA8",
                    });
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
                    <FieldBox label="Email (usuario)" name="usuario.mail" type="email" disabled />

                    <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting || !uid}
                        className="rounded-full bg-[#C19BA8] px-5 py-2 text-white font-semibold hover:bg-[#b78fa0] disabled:opacity-60"
                      >
                        {isSubmitting ? "Guardando..." : "Guardar cambios"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            )}

            {/* --------- TAB: CENTRO --------- */}
            {!loading && tab === "centro" && (
              <Formik
                enableReinitialize
                initialValues={{
                  nombre: centro?.nombre ?? "",
                  descripcion: centro?.descripcion ?? "",
                  cuit: centro?.cuit ?? ("" as unknown as number),
                  docValido: centro?.docValido ?? "",
                  imagen: centro?.imagen ?? "",
                  domicilio: {
                    calle: centro?.domicilio?.calle ?? "",
                    numero: centro?.domicilio?.numero ?? 0,
                    localidad: centro?.domicilio?.localidad ?? "",
                    codigoPostal: (centro?.domicilio)?.codigoPostal ?? 0,
                  },
                }}
                validationSchema={centroSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
            const payload: CentroDeEsteticaDTO = {
              nombre: values.nombre,
              descripcion: values.descripcion,
              cuit: Number(values.cuit),
              docValido: values.docValido,
              imagen: values.imagen, // si luego subís a Cloudinary, setea la URL acá
              domicilio: {
                calle: values.domicilio.calle,
                numero: Number(values.domicilio.numero),
                localidad: values.domicilio.localidad,
                codigoPostal: values.domicilio.codigoPostal,
              },
      
            };

if (centro?.id) {
  await centroService.update(centro.id, payload);          // PUT /update/{id}
} else {
  await centroService.create(payload);                     // POST /
}

                    let saved: CentroEsteticaResponseDTO;
                    if (centro?.id) {
                      saved = await centroService.update(centro.id, payload);
                    } else {
                      saved = await centroService.create(payload);
                    }
                    setCentro(saved);

                    Swal.fire({
                      icon: "success",
                      title: "¡Centro actualizado!",
                      text: "Los datos del centro se guardaron correctamente.",
                      confirmButtonColor: "#C19BA8",
                    });
                  } catch (e) {
                    console.error(e);
                    Swal.fire({
                      icon: "error",
                      title: "Error",
                      text: "No se pudo guardar los datos del centro.",
                      confirmButtonColor: "#C19BA8",
                    });
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FieldBox label="Nombre del centro" name="nombre" />
                    <FieldBox label="CUIT" name="cuit" type="number" />
                    <div className="md:col-span-2">
                      <FieldBox label="Descripción" name="descripcion" />
                    </div>
                    <FieldBox label="Documento válido (link/ID)" name="docValido" />
                    <FieldBox label="Imagen (URL)" name="imagen" />

                    <div className="md:col-span-2 mt-2">
                      <h3 className="text-lg font-semibold text-[#703F52] mb-2">Domicilio</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FieldBox label="Calle" name="domicilio.calle" />
                        <FieldBox label="Número" name="domicilio.numero" type="number" />
                        <FieldBox label="Código Postal" name="domicilio.codigoPostal" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <FieldBox label="Localidad" name="domicilio.localidad" />
                      </div>
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting || !uid}
                        className="rounded-full bg-[#C19BA8] px-5 py-2 text-white font-semibold hover:bg-[#b78fa0] disabled:opacity-60"
                      >
                        {isSubmitting ? "Guardando..." : "Guardar cambios"}
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
