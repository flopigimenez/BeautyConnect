import { useEffect, useMemo, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import CambiarPasswordModal from "../components/modals/CambiarPasswordModal";
import * as Yup from "yup";
import Swal from "sweetalert2";

import NavbarPrestador from '../components/NavbarPrestador';
import Footer from '../components/Footer';
import Sidebar from '../components/SideBar';

import type { PrestadorServicioResponseDTO } from "../types/prestadorDeServicio/PrestadorServicioResponseDTO";
import type { PrestadorServicioDTO } from "../types/prestadorDeServicio/PestadorServicioDTO";
import type { CentroEsteticaResponseDTO } from "../types/centroDeEstetica/CentroDeEsteticaResponseDTO";
import type { CentroDeEsteticaDTO } from "../types/centroDeEstetica/CentroDeEsteticaDTO";
import type { DomicilioDTO } from "../types/domicilio/DomicilioDTO";
import type { HorarioCentroDTO } from "../types/horarioCentro/HorarioCentroDTO";
import type { Rol } from "../types/enums/Rol";

import { PrestadorServicioService } from "../services/PrestadorServicioService";
import { CentroDeEsteticaService } from "../services/CentroDeEsteticaService";
import { DomicilioService } from "../services/DomicilioService";

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
  horariosCentro: Yup.array().of(
    Yup.object({
      dia: Yup.string().required("Requerido"),
      horaMInicio: Yup.string().required("Requerido"),
      horaMFinalizacion: Yup.string().required("Requerido"),
      horaTInicio: Yup.string().required("Requerido"),
      horaTFinalizacion: Yup.string().required("Requerido"),
    })
  ).min(1, "Agrega al menos un horario"),
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

const DIA_OPTIONS = [
  { value: "MONDAY", label: "Lunes" },
  { value: "TUESDAY", label: "Martes" },
  { value: "WEDNESDAY", label: "Miércoles" },
  { value: "THURSDAY", label: "Jueves" },
  { value: "FRIDAY", label: "Viernes" },
  { value: "SATURDAY", label: "Sábado" },
  { value: "SUNDAY", label: "Domingo" },
];

const ConfigPrestador = () => {
  const [showPwd, setShowPwd] = useState(false);
  const [tab, setTab] = useState<"prestador" | "centro">("prestador");
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string>("");
  const [mailVista, setMailVista] = useState<string>("");

  const [prestador, setPrestador] = useState<PrestadorServicioResponseDTO | null>(null);
  const [centro, setCentro] = useState<CentroEsteticaResponseDTO | null>(null);

  const prestadorService = useMemo(() => new PrestadorServicioService(), []);
  const centroService = useMemo(() => new CentroDeEsteticaService(), []);
  const domicilioService = useMemo(() => new DomicilioService(), []);

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
        console.log("Prestador cargado:", p);

        if (!p) {
          setPrestador(null);
          setCentro(null);
          Swal.fire({ icon: "error", title: "Prestador", text: "No se encontró el prestador" });
          setLoading(false);
          return;
        }

        setPrestador(p);

        // Centro por UID de prestador (depende de tu API; si el Prestador viene con centro.id, podrías usar getById)
        const c = await centroService.getByPrestadorId(p.id);
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
                      },
                    };

                    let saved: PrestadorServicioResponseDTO;
                    if (prestador?.id) {
                      saved = await prestadorService.actualizarPrestadorServicio(prestador.id, payload);
                    
                      
                    
                    setPrestador(saved);
                    }
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
                    <div>
                    <FieldBox label="Email (usuario)" name="usuario.mail" type="email" disabled />
                     <button
                        type="button"
                        onClick={() => setShowPwd(true)}
                        className="text-sm text-[#C19BA8] hover:underline"
                      >
                        Cambiar contraseña
                      </button>
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

                )
                }
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
                  horariosCentro: centro?.horariosCentro?.map((horario: HorarioCentroDTO) => ({ ...horario })) ?? [],
                }}
                validationSchema={centroSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    const prestadorId = prestador?.id ?? centro?.prestadorDeServicio?.id;
                    if (!prestadorId) {
                      throw new Error("No se encontró el prestador asociado al centro.");
                    }

                    const domicilioPayload: DomicilioDTO = {
                      calle: values.domicilio.calle,
                      numero: Number(values.domicilio.numero),
                      localidad: values.domicilio.localidad,
                      codigoPostal: Number(values.domicilio.codigoPostal),
                    };

                    const payload: CentroDeEsteticaDTO = {
                      nombre: values.nombre,
                      descripcion: values.descripcion,
                      cuit: Number(values.cuit),
                      docValido: values.docValido,
                      imagen: values.imagen, // si luego subís a Cloudinary, setea la URL acá
                      prestadorDeServicioId: prestadorId,
                      domicilio: domicilioPayload,
                      horariosCentro: values.horariosCentro.map((horario) => ({
                        dia: horario.dia,
                        horaMInicio: horario.horaMInicio,
                        horaMFinalizacion: horario.horaMFinalizacion,
                        horaTInicio: horario.horaTInicio,
                        horaTFinalizacion: horario.horaTFinalizacion,
                      })),
                    };

                    let saved: CentroEsteticaResponseDTO;
                    let updatedDomicilio = centro?.domicilio ?? null;

                    if (centro?.id) {
                      if (centro?.domicilio?.id) {
                        updatedDomicilio = await domicilioService.updateDomicilio(centro.domicilio.id, domicilioPayload);
                      }
                      saved = await centroService.update(centro.id, payload);
                    } else {
                      saved = await centroService.create(payload);
                      updatedDomicilio = saved.domicilio ?? updatedDomicilio;
                    }

                    const nextCentro = updatedDomicilio ? { ...saved, domicilio: updatedDomicilio } : saved;
                    setCentro(nextCentro);

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
                {({ isSubmitting, values, errors }) => (
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


                    <div className="md:col-span-2 mt-4">
                      <h3 className="text-lg font-semibold text-[#703F52] mb-2">Horarios de atención</h3>
                      <FieldArray name="horariosCentro">
                        {({ push, remove }) => (
                          <div className="space-y-4">
                            {values.horariosCentro && values.horariosCentro.length > 0 ? (
                              values.horariosCentro.map((_, index) => (
                                <div key={index} className="rounded-lg border border-[#E9DDE1] p-4">
                                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                    <label className="flex flex-col gap-1 md:w-1/3">
                                      <span className="text-sm font-medium text-[#703F52]">Día</span>
                                      <Field
                                        as="select"
                                        name={`horariosCentro[${index}].dia`}
                                        className="rounded-lg border border-[#E9DDE1] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C19BA8]/40 bg-white"
                                      >
                                        <option value="">Seleccioná un día</option>
                                        {DIA_OPTIONS.map((option) => (
                                          <option key={option.value} value={option.value}>
                                            {option.label}
                                          </option>
                                        ))}
                                      </Field>
                                      <ErrorMessage name={`horariosCentro[${index}].dia`} component="span" className="text-xs text-red-600" />
                                    </label>
                                    {values.horariosCentro.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="self-start rounded-full border border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                                      >
                                        Eliminar
                                      </button>
                                    )}
                                  </div>
                                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <FieldBox label="Hora mañana (inicio)" name={`horariosCentro[${index}].horaMInicio`} type="time" />
                                    <FieldBox label="Hora mañana (fin)" name={`horariosCentro[${index}].horaMFinalizacion`} type="time" />
                                    <FieldBox label="Hora tarde (inicio)" name={`horariosCentro[${index}].horaTInicio`} type="time" />
                                    <FieldBox label="Hora tarde (fin)" name={`horariosCentro[${index}].horaTFinalizacion`} type="time" />
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500">Agregá al menos un horario para tu centro.</p>
                            )}
                            {typeof errors.horariosCentro === "string" ? (
                              <span className="text-xs text-red-600">{errors.horariosCentro}</span>
                            ) : null}
                            <button
                              type="button"
                              onClick={() =>
                                push({
                                  dia: "",
                                  horaMInicio: "",
                                  horaMFinalizacion: "",
                                  horaTInicio: "",
                                  horaTFinalizacion: "",
                                })
                              }
                              className="rounded-full bg-[#703F52] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#5f3244]"
                            >
                              Agregar horario
                            </button>
                          </div>
                        )}
                      </FieldArray>
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
              
            )
            }
                                <CambiarPasswordModal isOpen={showPwd} onClose={() => setShowPwd(false)} />

          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default ConfigPrestador;
