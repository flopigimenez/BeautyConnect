import { useEffect, useMemo, useState, type ChangeEvent } from "react";
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
import type { CentroDeEsteticaResponseDTO } from "../types/centroDeEstetica/CentroDeEsteticaResponseDTO";
import type { CentroDeEsteticaDTO } from "../types/centroDeEstetica/CentroDeEsteticaDTO";
import type { DomicilioDTO } from "../types/domicilio/DomicilioDTO";
import type { HorarioCentroDTO } from "../types/horarioCentro/HorarioCentroDTO";
import type { Rol } from "../types/enums/Rol";

import { PrestadorServicioService } from "../services/PrestadorServicioService";
import { CentroDeEsteticaService } from "../services/CentroDeEsteticaService";
import { DomicilioService } from "../services/DomicilioService";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import { Estado } from "../types/enums/Estado";
import { setCentroSlice } from "../redux/store/miCentroSlice";
import { useNavigate } from "react-router-dom";

import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L, { type LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png?url";
import iconUrl from "leaflet/dist/images/marker-icon.png?url";
import shadowUrl from "leaflet/dist/images/marker-shadow.png?url";

L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

const DEFAULT_ROL: Rol = "PRESTADOR" as Rol;
const DEFAULT_CENTER: LatLngTuple = [-32.8908, -68.8272]; // Mendoza

const prestadorSchema = Yup.object({
  nombre: Yup.string().required("Requerido"),
  apellido: Yup.string().required("Requerido"),
  telefono: Yup.string().required("Requerido"),
  usuario: Yup.object({
    mail: Yup.string().email("Email inválido").required("Requerido"),
  }).required(),
  active: Yup.boolean().required(),
});

const DIA_OPTIONS = [
  { value: "MONDAY", label: "Lunes" },
  { value: "TUESDAY", label: "Martes" },
  { value: "WEDNESDAY", label: "Miércoles" },
  { value: "THURSDAY", label: "Jueves" },
  { value: "FRIDAY", label: "Viernes" },
  { value: "SATURDAY", label: "Sábado" },
  { value: "SUNDAY", label: "Domingo" },
];

const horarioSchema = Yup.object({
  dia: Yup.string().oneOf(DIA_OPTIONS.map(d => d.value)).required("Requerido"),
  horaMInicio: Yup.string().required("Requerido"),
  horaMFinalizacion: Yup.string().required("Requerido"),
  horaTInicio: Yup.string().required("Requerido"),
  horaTFinalizacion: Yup.string().required("Requerido"),
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
    provincia: Yup.string().required("Requerido"),
    codigoPostal: Yup.number().typeError("Numérico").required("Requerido"),
    latitud: Yup.number().typeError("Numérico").required("Requerido"),
    longitud: Yup.number().typeError("Numérico").required("Requerido"),
  }).required(),
  horariosCentro: Yup.array().of(horarioSchema)
    .min(1, "Agregá al menos un horario")
    .required("Requerido"),
}).test("rangos-horarios", "Los horarios deben tener inicio < fin", (values) => {
  if (!values || !values.horariosCentro) return true;
  const toMin = (hhmm: string) => {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  };
  for (const h of values.horariosCentro) {
    if (!h) continue;
    const mIni = toMin(h.horaMInicio);
    const mFin = toMin(h.horaMFinalizacion);
    const tIni = toMin(h.horaTInicio);
    const tFin = toMin(h.horaTFinalizacion);
    if (!(mIni < mFin && tIni < tFin)) return false;
  }
  return true;
});

const Tab = ({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer
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

const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

type CloudinaryResourceType = "image" | "auto";
type CentroUploadField = "imagen" | "docValido";
type SetFieldValueFn = (field: string, value: unknown, shouldValidate?: boolean) => void;

const uploadFileToCloudinary = async (file: File, resourceType: CloudinaryResourceType) => {
  if (!cloudName || !uploadPreset) throw new Error("Falta configuracion de Cloudinary.");
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, { method: "POST", body: formData });
  let data: any = null;
  try { data = await response.json(); } catch { data = null; }
  if (!response.ok) {
    const message = (data && typeof data?.error?.message === "string" ? data.error.message : undefined) ?? "No se pudo subir el archivo a Cloudinary.";
    throw new Error(message);
  }
  if (!data || typeof data.secure_url !== "string") throw new Error("Cloudinary no devolvio una URL valida.");
  return data.secure_url as string;
};

// --- Nominatim helpers ---
async function reverseGeocode(lat: number, lon: number) {
  const resp = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&accept-language=es&lat=${lat}&lon=${lon}`,
    { headers: { "User-Agent": "BeautyConnect/1.0 (contacto@example.com)" } }
  );
  if (!resp.ok) return null;
  const data = await resp.json();
  return data;
}

async function geocodeDireccionTextual(d: {
  calle?: string; numero?: number | string; localidad?: string; provincia?: string; codigoPostal?: number | string;
}) {
  const direccion = `${d.calle ?? ""} ${d.numero ?? ""}, ${d.localidad ?? ""}, ${d.codigoPostal ?? ""}, ${d.provincia ?? "Mendoza"}, Argentina`;
  const resp = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&accept-language=es&q=${encodeURIComponent(direccion)}`,
    { headers: { "User-Agent": "BeautyConnect/1.0 (contacto@example.com)" } }
  );
  if (!resp.ok) return null;
  const data: Array<{ lat: string; lon: string; display_name?: string }> = await resp.json();
  if (!data.length) return null;
  const best = data[0];
  return { lat: parseFloat(best.lat), lon: parseFloat(best.lon) };
}

function LocationSelector({ onPick }: { onPick: (lat: number, lon: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

type HorarioCentroFormValue = HorarioCentroDTO & { id?: number | null };

const ConfigPrestador = () => {
  const [showPwd, setShowPwd] = useState(false);
  const [tab, setTab] = useState<"prestador" | "centro">("prestador");
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string>("");
  const [mailVista, setMailVista] = useState<string>("");

  const [prestador, setPrestador] = useState<PrestadorServicioResponseDTO | null>(null);
  const [centro, setCentro] = useState<CentroDeEsteticaResponseDTO | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [pendingUploads, setPendingUploads] = useState<{ imagen?: string | null; docValido?: string | null }>({});
  const [togglingCentro, setTogglingCentro] = useState(false);

  const prestadorService = useMemo(() => new PrestadorServicioService(), []);
  const centroService = useMemo(() => new CentroDeEsteticaService(), []);
  const domicilioService = useMemo(() => new DomicilioService(), []);
  const miCentroSlice = useAppSelector((state) => state.miCentro.centro);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleCloudinaryUpload = async (
    event: ChangeEvent<HTMLInputElement>,
    resourceType: CloudinaryResourceType,
    fieldName: CentroUploadField,
    setFieldValue: SetFieldValueFn,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const setUploading = fieldName === "imagen" ? setUploadingImage : setUploadingDoc;
    setUploading(true);
    try {
      const secureUrl = await uploadFileToCloudinary(file, resourceType);
      setFieldValue(fieldName, secureUrl);
      setPendingUploads((prev) => ({ ...prev, [fieldName]: secureUrl }));
      setCentro((prev) => (prev ? { ...prev, [fieldName]: secureUrl } as CentroDeEsteticaResponseDTO : prev));
    } catch (error) {
      console.error(error);
      const fallbackMessage = fieldName === "imagen" ? "No se pudo subir la imagen." : "No se pudo subir el documento.";
      const message = error instanceof Error ? error.message : fallbackMessage;
      Swal.fire({ icon: "error", title: "Error al subir archivo", text: message, confirmButtonColor: "#C19BA8" });
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleToggleCentroActivo = async () => {
    if (!centro || !centro.id || togglingCentro) return;

    const accion = centro.active ? "desactivar" : "activar";
    const confirm = await Swal.fire({
      icon: "question",
      title: `${centro.active ? "Desactivar" : "Activar"} centro`,
      text: `Seguro que queres ${accion} el centro?`,
      showCancelButton: true,
      confirmButtonText: `Si, ${accion}`,
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#703F52",
      cancelButtonColor: "#C19BA8",
    });
    if (!confirm.isConfirmed) return;

    setTogglingCentro(true);
    try {
      const updated = await centroService.activar_desactivar(centro.id);
      setCentro((prev) => (prev ? { ...prev, active: updated.active } : updated));
      Swal.fire({
        icon: "success",
        title: "Estado actualizado",
        text: updated.active ? "El centro se activo correctamente." : "El centro se desactivo correctamente.",
        confirmButtonColor: "#C19BA8",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo cambiar el estado del centro.";
      Swal.fire({ icon: "error", title: "Error", text: message, confirmButtonColor: "#C19BA8" });
    } finally {
      setTogglingCentro(false);
    }
  };

  // Carga por UID
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
        const p = await prestadorService.getByUid(user.uid);
        if (!p) {
          setPrestador(null);
          setCentro(null);
          Swal.fire({ icon: "error", title: "Prestador", text: "No se encontró el prestador" });
          setLoading(false);
          return;
        }
        setPrestador(p);
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

  const handleReenviarSolicitud = async () => {
    try {
      if (!centro?.id) throw new Error("No se encontró el centro para reenviar la solicitud.");
      const updatedCentro = await centroService.cambiarEstado(centro.id, Estado.PENDIENTE);
      setCentro(updatedCentro);
      dispatch(setCentroSlice(updatedCentro));
      Swal.fire({
        icon: "success",
        title: "¡Solicitud reenviada!",
        text: "El estado del centro ha sido actualizado a pendiente.",
        confirmButtonColor: "#C19BA8",
      }).then(() => {
        navigate("/redirigir");
      });
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo reenviar la solicitud.", confirmButtonColor: "#C19BA8" });
    }
  };

  return (
    <>
      <NavbarPrestador />
      <div className="flex flex-1 overflow-hidden">
        {miCentroSlice?.estado === "ACEPTADO" && (
          <aside className="hidden md:block w-64 shrink-0 border-r border-[#E9DDE1] bg-[#FFFBFA] h-[calc(100vh-64px)] sticky top-[64px]">
            <Sidebar />
          </aside>
        )}

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
                      },
                    };
                    if (prestador?.id) {
                      const saved = await prestadorService.actualizarPrestadorServicio(prestador.id, payload);
                      setPrestador(saved);
                    }
                    Swal.fire({ icon: "success", title: "¡Prestador actualizado!", text: "Tus datos se guardaron correctamente.", confirmButtonColor: "#C19BA8" });
                  } catch (e) {
                    console.error(e);
                    Swal.fire({ icon: "error", title: "Error", text: "No se pudo guardar los datos del prestador.", confirmButtonColor: "#C19BA8" });
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="grid grid-cols-1 md:grid-cols-2 gap-4" encType="multipart/form-data">
                    <FieldBox label="Nombre" name="nombre" />
                    <FieldBox label="Apellido" name="apellido" />
                    <FieldBox label="Teléfono" name="telefono" />
                    <div>
                      <FieldBox label="Email (usuario)" name="usuario.mail" type="email" disabled />
                      <button
                        type="button"
                        onClick={() => setShowPwd(true)}
                        className="text-sm text-[#C19BA8] hover:underline cursor-pointer"
                      >
                        Cambiar contraseña
                      </button>
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting || !uid}
                        className="rounded-full bg-[#C19BA8] px-5 py-2 text-white font-semibold hover:bg-[#b78fa0] disabled:opacity-60 cursor-pointer"
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
                    codigoPostal: centro?.domicilio?.codigoPostal ?? 0,
                    provincia: centro?.domicilio?.provincia ?? "Mendoza",
                    latitud: typeof centro?.domicilio?.latitud === "number" ? centro!.domicilio!.latitud : DEFAULT_CENTER[0],
                    longitud: typeof centro?.domicilio?.longitud === "number" ? centro!.domicilio!.longitud : DEFAULT_CENTER[1],
                  },
                  horariosCentro: centro?.horariosCentro?.map((h: any) => ({
                    id: typeof h.id === "number" ? h.id : undefined,
                    dia: h.dia,
                    horaMInicio: h.horaMInicio,
                    horaMFinalizacion: h.horaMFinalizacion,
                    horaTInicio: h.horaTInicio,
                    horaTFinalizacion: h.horaTFinalizacion,
                  })) ?? [],
                }}
                validationSchema={centroSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    const prestadorId = prestador?.id ?? centro?.prestadorDeServicio?.id;
                    if (!prestadorId) throw new Error("No se encontro el prestador asociado al centro.");

                    const domicilioPayload: DomicilioDTO = {
                      calle: values.domicilio.calle,
                      numero: Number(values.domicilio.numero),
                      localidad: values.domicilio.localidad,
                      codigoPostal: Number(values.domicilio.codigoPostal),
                      provincia: values.domicilio.provincia,
                      latitud: Number(values.domicilio.latitud),
                      longitud: Number(values.domicilio.longitud),
                    };

                    const imagenUrl = (pendingUploads.imagen ?? values.imagen)?.trim() || centro?.imagen || "";
                    const docUrl = (pendingUploads.docValido ?? values.docValido)?.trim() || centro?.docValido || "";

                    // Enviamos horarios editados
                    const horariosPayload: HorarioCentroDTO[] = values.horariosCentro.map(h => ({
                      dia: h.dia,
                      horaMInicio: h.horaMInicio,
                      horaMFinalizacion: h.horaMFinalizacion,
                      horaTInicio: h.horaTInicio,
                      horaTFinalizacion: h.horaTFinalizacion,
                    }));

                    const payload: CentroDeEsteticaDTO = {
                      nombre: values.nombre,
                      descripcion: values.descripcion,
                      cuit: Number(values.cuit),
                      docValido: docUrl,
                      imagen: imagenUrl,
                      prestadorDeServicioId: prestadorId,
                      domicilio: domicilioPayload,
                      horariosCentro: horariosPayload,
                    };

                    let saved: CentroDeEsteticaResponseDTO;
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

                    const refrescado = await centroService.getById(saved.id);
                    const nextCentro = refrescado
                      ? { ...refrescado, imagen: imagenUrl, docValido: docUrl }
                      : { ...saved, imagen: imagenUrl, docValido: docUrl };

                    setCentro(nextCentro);
                    setPendingUploads({});
                    Swal.fire({ icon: "success", title: "Centro actualizado!", text: "Los datos del centro se guardaron correctamente.", confirmButtonColor: "#C19BA8" });
                  } catch (e) {
                    console.error(e);
                    Swal.fire({ icon: "error", title: "Error", text: "No se pudo guardar los datos del centro.", confirmButtonColor: "#C19BA8" });
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting, values, setFieldValue }) => {
                  const centerMap: LatLngTuple = [
                    Number(values.domicilio.latitud) || DEFAULT_CENTER[0],
                    Number(values.domicilio.longitud) || DEFAULT_CENTER[1],
                  ];

                  return (
                    <Form className="grid grid-cols-1 md:grid-cols-2 gap-4" encType="multipart/form-data">
                      {centro && centro.id ? (
                        <div className="md:col-span-2 flex flex-col gap-3 rounded-xl border border-[#E9DDE1] bg-[#FFFBFA] p-4 md:flex-row md:items-center md:justify-between">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-[#703F52]">Estado del centro</span>
                            <span className={`text-base font-semibold ${centro?.active ? "text-emerald-600" : "text-red-500"}`}>
                              {centro?.active ? "Activo" : "Inactivo"}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={handleToggleCentroActivo}
                            disabled={togglingCentro}
                            className={`inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold text-white transition cursor-pointer ${
                              centro?.active ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"
                            } ${togglingCentro ? "opacity-60 cursor-not-allowed" : ""}`}
                          >
                            {togglingCentro ? "Procesando..." : centro?.active ? "Desactivar centro" : "Activar centro"}
                          </button>
                        </div>
                      ) : null}

                      <FieldBox label="Nombre del centro" name="nombre" />
                      <FieldBox label="CUIT" name="cuit" type="number" />
                      <div className="md:col-span-2">
                        <FieldBox label="Descripción" name="descripcion" />
                      </div>

                      {/* Archivos */}
                      <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-[#703F52]">Documento válido</span>
                        <div className="flex flex-col gap-3 md:flex-row md:items-center">
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) => handleCloudinaryUpload(e, "auto", "docValido", setFieldValue)}
                            disabled={uploadingDoc}
                            className="w-full rounded-lg border border-[#E9DDE1] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C19BA8]/40"
                          />
                          {uploadingDoc ? (
                            <span className="text-sm text-[#703F52]">Subiendo documento...</span>
                          ) : values.docValido ? (
                            <button
                              type="button"
                              onClick={() => window.open(values.docValido, "_blank", "noopener,noreferrer")}
                              className="inline-flex items-center justify-center rounded-full bg-[#703F52] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#5e3443] cursor-pointer"
                            >
                              Ver documento actual
                            </button>
                          ) : (
                            <span className="text-sm text-gray-500">Sin documento cargado</span>
                          )}
                        </div>
                        <Field type="hidden" name="docValido" />
                        <ErrorMessage name="docValido" component="span" className="text-xs text-red-600" />
                      </div>

                      <div className="md:col-span-2 flex flex-col gap-2">
                        <span className="text-sm font-medium text-[#703F52]">Imagen del centro</span>
                        <div className="flex flex-col gap-4 md:flex-row">
                          <div className="flex-1 space-y-3">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleCloudinaryUpload(e, "image", "imagen", setFieldValue)}
                              disabled={uploadingImage}
                              className="w-full rounded-lg border border-[#E9DDE1] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C19BA8]/40"
                            />
                            {uploadingImage ? (
                              <span className="text-sm text-[#703F52]">Subiendo imagen...</span>
                            ) : values.imagen ? (
                              <button
                                type="button"
                                onClick={() => window.open(values.imagen, "_blank", "noopener,noreferrer")}
                                className="inline-flex items-center justify-center rounded-full bg-[#703F52] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#5e3443] cursor-pointer"
                              >
                                Ver imagen en nueva ventana
                              </button>
                            ) : (
                              <span className="text-sm text-gray-500">Sin imagen cargada</span>
                            )}
                            <Field type="hidden" name="imagen" />
                            <ErrorMessage name="imagen" component="span" className="text-xs text-red-600" />
                          </div>
                          <div className="flex w-full max-w-xs items-center justify-center">
                            {values.imagen ? (
                              <img
                                src={values.imagen}
                                alt="Vista previa del centro"
                                className="h-40 w-full rounded-2xl border border-[#E9DDE1] object-cover shadow-sm"
                              />
                            ) : (
                              <div className="flex h-40 w-full items-center justify-center rounded-2xl border border-dashed border-[#E9DDE1] bg-[#FFFBFA] text-center text-sm text-gray-500">
                                Sin imagen cargada
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* --- DOMICILIO (sin inputs de lat/lng) --- */}
                      <div className="md:col-span-2 mt-2">
                        <h3 className="text-lg font-semibold text-[#703F52] mb-2">Domicilio</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <FieldBox label="Calle" name="domicilio.calle" />
                          <FieldBox label="Número" name="domicilio.numero" type="number" />
                          <FieldBox label="Código Postal" name="domicilio.codigoPostal" type="number" />
                          <FieldBox label="Localidad" name="domicilio.localidad" />
                          <FieldBox label="Provincia" name="domicilio.provincia" />
                        </div>
                      </div>

                      {/* --- UBICACIÓN EN MAPA --- */}
                      <div className="md:col-span-2 mt-2">
                        <h3 className="text-lg font-semibold text-[#703F52] mb-2">Ubicación en mapa</h3>

                        <div className="flex items-center gap-3 mb-3">
                          <button
                            type="button"
                            className="rounded-full bg-[#C19BA8] px-5 py-2 text-white font-semibold hover:bg-[#b78fa0] cursor-pointer"
                            onClick={async () => {
                              const res = await geocodeDireccionTextual({
                                calle: values.domicilio.calle,
                                numero: values.domicilio.numero,
                                localidad: values.domicilio.localidad,
                                provincia: values.domicilio.provincia,
                                codigoPostal: values.domicilio.codigoPostal,
                              });
                              if (res) {
                                setFieldValue("domicilio.latitud", res.lat);
                                setFieldValue("domicilio.longitud", res.lon);
                                Swal.fire({ icon: "success", title: "Ubicación actualizada", text: "Se posicionó el marcador.", confirmButtonColor: "#C19BA8" });
                              } else {
                                Swal.fire({ icon: "warning", title: "No se encontró la dirección", text: "Verifica los datos.", confirmButtonColor: "#C19BA8" });
                              }
                            }}
                          >
                            Buscar en el mapa
                          </button>
                          <p className="text-xs text-gray-600">También podés mover el marcador con un click.</p>
                        </div>

                        <MapContainer
                          key={`${centerMap[0]}-${centerMap[1]}`}
                          center={centerMap}
                          zoom={14}
                          style={{ height: 260, width: "100%", borderRadius: 12 }}
                        >
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <LocationSelector
                            onPick={async (lat, lon) => {
                              setFieldValue("domicilio.latitud", lat);
                              setFieldValue("domicilio.longitud", lon);
                              const data = await reverseGeocode(lat, lon);
                              if (data?.address) {
                                setFieldValue("domicilio.calle", data.address.road ?? values.domicilio.calle);
                                setFieldValue("domicilio.numero", data.address.house_number ? Number(data.address.house_number) : values.domicilio.numero);
                                setFieldValue("domicilio.localidad", (data.address.city || data.address.town || data.address.village || values.domicilio.localidad) as string);
                                setFieldValue("domicilio.codigoPostal", data.address.postcode ? Number(data.address.postcode) : values.domicilio.codigoPostal);
                                setFieldValue("domicilio.provincia", data.address.state ?? values.domicilio.provincia);
                              }
                            }}
                          />
                          <Marker position={centerMap} />
                        </MapContainer>

                        {/* Campos ocultos para validación/envío */}
                        <Field type="hidden" name="domicilio.latitud" />
                        <Field type="hidden" name="domicilio.longitud" />

                        <p className="text-xs text-gray-500 mt-1">
                          Hacé click en el mapa para mover el marcador. La latitud/longitud se guardan automáticamente.
                        </p>
                      </div>

                      {/* --- HORARIOS (editable + agregar/eliminar) --- */}
                      <div className="md:col-span-2 mt-6">
                        <h3 className="text-lg font-semibold text-[#703F52] mb-3">Horarios de atención</h3>

                        <FieldArray name="horariosCentro">
                          {({ remove, push }) => (
                            <div className="space-y-3">
                              {/* Lista editable */}
                              {values.horariosCentro.length > 0 ? (
                                values.horariosCentro.map((h: HorarioCentroFormValue, idx: number) => (
                                  <div key={h.id ?? idx} className="rounded-xl border border-[#E9DDE1] bg-[#FFFBFA] p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
                                      <label className="flex flex-col">
                                        <span className="text-sm font-medium text-[#703F52]">Día</span>
                                        <Field as="select" name={`horariosCentro.${idx}.dia`} className="rounded-lg border border-[#E9DDE1] px-3 py-2">
                                          <option value="">Seleccioná…</option>
                                          {DIA_OPTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                                        </Field>
                                        <ErrorMessage name={`horariosCentro.${idx}.dia`} component="span" className="text-xs text-red-600" />
                                      </label>
                                      <label className="flex flex-col">
                                        <span className="text-sm font-medium text-[#703F52]">Mañana (inicio)</span>
                                        <Field type="time" name={`horariosCentro.${idx}.horaMInicio`} className="rounded-lg border border-[#E9DDE1] px-3 py-2" />
                                        <ErrorMessage name={`horariosCentro.${idx}.horaMInicio`} component="span" className="text-xs text-red-600" />
                                      </label>
                                      <label className="flex flex-col">
                                        <span className="text-sm font-medium text-[#703F52]">Mañana (fin)</span>
                                        <Field type="time" name={`horariosCentro.${idx}.horaMFinalizacion`} className="rounded-lg border border-[#E9DDE1] px-3 py-2" />
                                        <ErrorMessage name={`horariosCentro.${idx}.horaMFinalizacion`} component="span" className="text-xs text-red-600" />
                                      </label>
                                      <label className="flex flex-col">
                                        <span className="text-sm font-medium text-[#703F52]">Tarde (inicio)</span>
                                        <Field type="time" name={`horariosCentro.${idx}.horaTInicio`} className="rounded-lg border border-[#E9DDE1] px-3 py-2" />
                                        <ErrorMessage name={`horariosCentro.${idx}.horaTInicio`} component="span" className="text-xs text-red-600" />
                                      </label>
                                      <label className="flex flex-col">
                                        <span className="text-sm font-medium text-[#703F52]">Tarde (fin)</span>
                                        <Field type="time" name={`horariosCentro.${idx}.horaTFinalizacion`} className="rounded-lg border border-[#E9DDE1] px-3 py-2" />
                                        <ErrorMessage name={`horariosCentro.${idx}.horaTFinalizacion`} component="span" className="text-xs text-red-600" />
                                      </label>
                                      <div className="flex md:justify-end">
                                        <button
                                          type="button"
                                          onClick={() => remove(idx)}
                                          className="self-end rounded-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-sm font-semibold cursor-pointer"
                                        >
                                          Eliminar
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-gray-500">No hay horarios cargados.</p>
                              )}

                              {/* Agregar nuevo */}
                              <div className="rounded-xl border border-dashed border-[#E9DDE1] p-4 bg-white">
                                <h4 className="text-sm font-semibold text-[#703F52] mb-3">Agregar horario</h4>
                                <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
                                  <Field as="select" name="__tmp.dia" className="rounded-lg border border-[#E9DDE1] px-3 py-2">
                                    <option value="">Seleccioná…</option>
                                    {DIA_OPTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                                  </Field>
                                  <Field type="time" name="__tmp.horaMInicio" className="rounded-lg border border-[#E9DDE1] px-3 py-2" />
                                  <Field type="time" name="__tmp.horaMFinalizacion" className="rounded-lg border border-[#E9DDE1] px-3 py-2" />
                                  <Field type="time" name="__tmp.horaTInicio" className="rounded-lg border border-[#E9DDE1] px-3 py-2" />
                                  <Field type="time" name="__tmp.horaTFinalizacion" className="rounded-lg border border-[#E9DDE1] px-3 py-2" />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      // Tomamos los valores temporales desde Formik (usamos getFieldProps via document? mejor con setFieldValue/getters)
                                      // Como no tenemos getFieldProps acá, usamos una estrategia: leemos del DOM (simple y efectivo)
                                      const getVal = (name: string) => (document.querySelector<HTMLInputElement>(`[name="${name}"]`)?.value ?? "").trim();
                                      const dia = getVal("__tmp.dia");
                                      const horaMInicio = getVal("__tmp.horaMInicio");
                                      const horaMFinalizacion = getVal("__tmp.horaMFinalizacion");
                                      const horaTInicio = getVal("__tmp.horaTInicio");
                                      const horaTFinalizacion = getVal("__tmp.horaTFinalizacion");

                                      if (!dia || !horaMInicio || !horaMFinalizacion || !horaTInicio || !horaTFinalizacion) {
                                        Swal.fire({ icon: "warning", title: "Completá los campos", text: "Todos los campos del horario son obligatorios.", confirmButtonColor: "#C19BA8" });
                                        return;
                                      }
                                      const toMin = (hhmm: string) => {
                                        const [h, m] = hhmm.split(":").map(Number);
                                        return h * 60 + m;
                                      };
                                      if (!(toMin(horaMInicio) < toMin(horaMFinalizacion) && toMin(horaTInicio) < toMin(horaTFinalizacion))) {
                                        Swal.fire({ icon: "warning", title: "Revisá los rangos", text: "El inicio debe ser menor al fin en mañana y tarde.", confirmButtonColor: "#C19BA8" });
                                        return;
                                      }

                                      push({ dia, horaMInicio, horaMFinalizacion, horaTInicio, horaTFinalizacion });

                                      // limpiar inputs temporales
                                      (document.querySelector(`[name="__tmp.dia"]`) as HTMLSelectElement | null)?.value && ((document.querySelector(`[name="__tmp.dia"]`) as HTMLSelectElement).value = "");
                                      ["__tmp.horaMInicio","__tmp.horaMFinalizacion","__tmp.horaTInicio","__tmp.horaTFinalizacion"].forEach(n => {
                                        const el = document.querySelector<HTMLInputElement>(`[name="${n}"]`);
                                        if (el) el.value = "";
                                      });
                                    }}
                                    className="rounded-full bg-[#703F52] hover:bg-[#5e3443] text-white px-4 py-2 text-sm font-semibold cursor-pointer"
                                  >
                                    Agregar
                                  </button>
                                </div>
                              </div>

                              <ErrorMessage name="horariosCentro" component="div" className="text-xs text-red-600" />
                            </div>
                          )}
                        </FieldArray>
                      </div>

                      <div className="md:col-span-2 flex justify-end gap-2 mt-6">
                        <button
                          type="submit"
                          disabled={isSubmitting || !uid}
                          className="rounded-full bg-[#C19BA8] px-5 py-2 text-white font-semibold hover:bg-[#b78fa0] disabled:opacity-60 cursor-pointer"
                        >
                          {isSubmitting ? "Guardando..." : "Guardar cambios"}
                        </button>
                        {centro?.estado === "RECHAZADO" && (
                          <button
                            type="button"
                            disabled={isSubmitting || !uid}
                            onClick={handleReenviarSolicitud}
                            className="rounded-full bg-[#C19BA8] px-5 py-2 text-white font-semibold hover:bg-[#b78fa0] disabled:opacity-60"
                          >
                            {isSubmitting ? "Reenviando..." : "Reenviar solicitud"}
                          </button>
                        )}
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            )}

            <CambiarPasswordModal isOpen={showPwd} onClose={() => setShowPwd(false)} />

            {centro?.estado === "RECHAZADO" && tab === "centro" && (
              <span className="self-center text-sm text-red-600">
                El centro fue rechazado. Por favor, actualiza los datos y vuelve a enviar la solicitud.
              </span>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default ConfigPrestador;
