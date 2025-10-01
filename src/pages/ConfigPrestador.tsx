import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Formik, Form, Field, ErrorMessage } from "formik";
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
import AddressFieldset, { type AddressValue } from "../components/AddressFieldset";
import { useAppSelector } from "../redux/store/hooks";

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
    provincia: Yup.string().required("Requerido"),
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
  ).default([]),
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

const formatHorarioValue = (value?: string | null) => value?.trim() || "-";

const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

type CloudinaryResourceType = "image" | "auto";
type CentroUploadField = "imagen" | "docValido";
type SetFieldValueFn = (field: string, value: unknown, shouldValidate?: boolean) => void;

const uploadFileToCloudinary = async (file: File, resourceType: CloudinaryResourceType) => {
  if (!cloudName || !uploadPreset) {
    throw new Error("Falta configuracion de Cloudinary.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
    method: "POST",
    body: formData,
  });

  let data: any = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      (data && typeof data?.error?.message === "string" ? data.error.message : undefined) ??
      "No se pudo subir el archivo a Cloudinary.";
    throw new Error(message);
  }

  if (!data || typeof data.secure_url !== "string") {
    throw new Error("Cloudinary no devolvio una URL valida.");
  }

  return data.secure_url as string;
};

type HorarioCentroFormValue = HorarioCentroDTO & { id?: number | null };
const ConfigPrestador = () => {
  const [showPwd, setShowPwd] = useState(false);
  const [tab, setTab] = useState<"prestador" | "centro">("prestador");
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string>("");
  const [mailVista, setMailVista] = useState<string>("");

  const [prestador, setPrestador] = useState<PrestadorServicioResponseDTO | null>(null);
  const [centro, setCentro] = useState<CentroEsteticaResponseDTO | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [pendingUploads, setPendingUploads] = useState<{ imagen?: string | null; docValido?: string | null }>({});

  const prestadorService = useMemo(() => new PrestadorServicioService(), []);
  const centroService = useMemo(() => new CentroDeEsteticaService(), []);
  const domicilioService = useMemo(() => new DomicilioService(), []);
  const miCentroSlice = useAppSelector((state) => state.miCentro.centro);

  const handleCloudinaryUpload = async (
    event: ChangeEvent<HTMLInputElement>,
    resourceType: CloudinaryResourceType,
    fieldName: CentroUploadField,
    setFieldValue: SetFieldValueFn,
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const setUploading = fieldName === "imagen" ? setUploadingImage : setUploadingDoc;
    setUploading(true);

    try {
      const secureUrl = await uploadFileToCloudinary(file, resourceType);
      setFieldValue(fieldName, secureUrl);
      setPendingUploads((prev) => ({ ...prev, [fieldName]: secureUrl }));
      setCentro((prev) => {
        if (!prev) {
          return prev;
        }
        return { ...prev, [fieldName]: secureUrl } as CentroEsteticaResponseDTO;
      });
    } catch (error) {
      console.error(error);
      const fallbackMessage =
        fieldName === "imagen" ? "No se pudo subir la imagen." : "No se pudo subir el documento.";
      const message = error instanceof Error ? error.message : fallbackMessage;
      Swal.fire({
        icon: "error",
        title: "Error al subir archivo",
        text: message,
        confirmButtonColor: "#C19BA8",
      });
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

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

        // Centro por UID de prestador (depende de tu API; si el Prestador viene con centro.id, podrÃ­as usar getById)
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
                  <Form className="grid grid-cols-1 md:grid-cols-2 gap-4" encType="multipart/form-data">
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
                    provincia: centro?.domicilio?.provincia ?? "",
                  },
                  horariosCentro: centro?.horariosCentro?.map((horario: any) => ({
                    id: typeof horario.id === "number" ? horario.id : undefined,
                    dia: horario.dia,
                    horaMInicio: horario.horaMInicio,
                    horaMFinalizacion: horario.horaMFinalizacion,
                    horaTInicio: horario.horaTInicio,
                    horaTFinalizacion: horario.horaTFinalizacion,
                  })) ?? [],
                }}
                validationSchema={centroSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    const prestadorId = prestador?.id ?? centro?.prestadorDeServicio?.id;
                    if (!prestadorId) {
                      throw new Error("No se encontro el prestador asociado al centro.");
                    }

                    const domicilioPayload: DomicilioDTO = {
                      calle: values.domicilio.calle,
                      numero: Number(values.domicilio.numero),
                      localidad: values.domicilio.localidad,
                      codigoPostal: Number(values.domicilio.codigoPostal),
                      provincia: values.domicilio.provincia,
                    };

                    const imagenUrl = (pendingUploads.imagen ?? values.imagen)?.trim() || centro?.imagen || "";
                    const docUrl = (pendingUploads.docValido ?? values.docValido)?.trim() || centro?.docValido || "";

                    const payload: CentroDeEsteticaDTO = {
                      nombre: values.nombre,
                      descripcion: values.descripcion,
                      cuit: Number(values.cuit),
                      docValido: docUrl,
                      imagen: imagenUrl,
                      prestadorDeServicioId: prestadorId,
                      domicilio: domicilioPayload,
                      horariosCentro: [],
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

                    const centroId = saved.id;
                    const baseCentro = updatedDomicilio ? { ...saved, domicilio: updatedDomicilio } : saved;

                    const refreshed = await centroService.getById(centroId);
                    const fallbackHorarios = centro?.horariosCentro ?? values.horariosCentro ?? [];
                    const nextCentro = refreshed
                      ? { ...refreshed, imagen: imagenUrl, docValido: docUrl }
                      : { ...baseCentro, horariosCentro: fallbackHorarios, imagen: imagenUrl, docValido: docUrl };
                    setCentro(nextCentro);
                    setPendingUploads({});
                    console.log(nextCentro);

                    Swal.fire({
                      icon: "success",
                      title: "Centro actualizado!",
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
                {({ isSubmitting, values, setFieldValue }) => (
                  <Form className="grid grid-cols-1 md:grid-cols-2 gap-4" encType="multipart/form-data">
                    <FieldBox label="Nombre del centro" name="nombre" />
                    <FieldBox label="CUIT" name="cuit" type="number" />
                    <div className="md:col-span-2">
                      <FieldBox label="Descripción" name="descripcion" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-medium text-[#703F52]">Documento valido</span>
                      <div className="flex flex-col gap-2 md:flex-row md:items-center">
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(event) => handleCloudinaryUpload(event, "auto", "docValido", setFieldValue)}
                          disabled={uploadingDoc}
                          className="w-full rounded-lg border border-[#E9DDE1] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C19BA8]/40"
                        />
                        {uploadingDoc ? (
                          <span className="text-sm text-[#703F52]">Subiendo documento...</span>
                        ) : values.docValido ? (
                          <a
                            href={values.docValido}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[#703F52] underline"
                          >
                            Ver documento actual
                          </a>
                        ) : (
                          <span className="text-sm text-gray-500">Sin documento cargado</span>
                        )}
                      </div>
                      <Field
                        name="docValido"
                        placeholder="URL del documento"
                        className="rounded-lg border border-[#E9DDE1] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C19BA8]/40"
                      />
                      <ErrorMessage name="docValido" component="span" className="text-xs text-red-600" />
                    </div>

                    <div className="md:col-span-2 flex flex-col gap-2">
                      <span className="text-sm font-medium text-[#703F52]">Imagen del centro</span>
                      <div className="flex flex-col gap-4 md:flex-row">
                        <div className="flex-1 space-y-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => handleCloudinaryUpload(event, "image", "imagen", setFieldValue)}
                            disabled={uploadingImage}
                            className="w-full rounded-lg border border-[#E9DDE1] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C19BA8]/40"
                          />
                          {uploadingImage ? (
                            <span className="text-sm text-[#703F52]">Subiendo imagen...</span>
                          ) : null}
                          <Field
                            name="imagen"
                            placeholder="URL de la imagen"
                            className="w-full rounded-lg border border-[#E9DDE1] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C19BA8]/40"
                          />
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

                    <div className="md:col-span-2 mt-2">
                      <h3 className="text-lg font-semibold text-[#703F52] mb-2">Domicilio</h3>
                      <AddressFieldset
                        value={{
                          calle: values.domicilio.calle ?? "",
                          numero: values.domicilio.numero !== undefined && values.domicilio.numero !== null && values.domicilio.numero !== ""
                            ? Number(values.domicilio.numero)
                            : undefined,
                          codigoPostal: values.domicilio.codigoPostal !== undefined && values.domicilio.codigoPostal !== null && values.domicilio.codigoPostal !== ""
                            ? Number(values.domicilio.codigoPostal)
                            : undefined,
                          provincia: values.domicilio.provincia ?? "",
                          localidad: values.domicilio.localidad ?? "",
                        }}
                        onChange={(next: AddressValue) => {
                          setFieldValue("domicilio.calle", next.calle);
                          setFieldValue("domicilio.numero", next.numero ?? "");
                          setFieldValue("domicilio.codigoPostal", next.codigoPostal ?? "");
                          setFieldValue("domicilio.localidad", next.localidad);
                          setFieldValue("domicilio.provincia", next.provincia);
                        }}
                        className="bg-gray-50 rounded-2xl p-4"
                      />
                    </div>


                    <div className="md:col-span-2 mt-4">
                      <h3 className="text-lg font-semibold text-[#703F52] mb-2">Horarios de atencion</h3>
                      {values.horariosCentro && values.horariosCentro.length > 0 ? (
                        <div className="space-y-4">
                          {values.horariosCentro.map((horario: HorarioCentroFormValue, index) => {
                            const diaLabel =
                              DIA_OPTIONS.find((option) => option.value === horario.dia)?.label ?? horario.dia ?? "-";
                            return (
                              <div key={horario.id ?? index} className="rounded-lg border border-[#E9DDE1] bg-[#FFFBFA] p-4">
                                <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                                  <span className="text-sm font-medium text-[#703F52]">Dia</span>
                                  <span className="rounded-lg border border-[#E9DDE1] bg-white px-3 py-2 text-sm text-[#703F52]">
                                    {diaLabel}
                                  </span>
                                </div>
                                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                                  <div className="flex flex-col gap-1">
                                    <span className="text-sm font-medium text-[#703F52]">Hora manana (inicio)</span>
                                    <span className="rounded-lg border border-[#E9DDE1] bg-white px-3 py-2 text-sm text-[#703F52]">
                                      {formatHorarioValue(horario.horaMInicio)}
                                    </span>
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <span className="text-sm font-medium text-[#703F52]">Hora manana (fin)</span>
                                    <span className="rounded-lg border border-[#E9DDE1] bg-white px-3 py-2 text-sm text-[#703F52]">
                                      {formatHorarioValue(horario.horaMFinalizacion)}
                                    </span>
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <span className="text-sm font-medium text-[#703F52]">Hora tarde (inicio)</span>
                                    <span className="rounded-lg border border-[#E9DDE1] bg-white px-3 py-2 text-sm text-[#703F52]">
                                      {formatHorarioValue(horario.horaTInicio)}
                                    </span>
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <span className="text-sm font-medium text-[#703F52]">Hora tarde (fin)</span>
                                    <span className="rounded-lg border border-[#E9DDE1] bg-white px-3 py-2 text-sm text-[#703F52]">
                                      {formatHorarioValue(horario.horaTFinalizacion)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">Este centro aun no tiene horarios de atencion cargados.</p>
                      )}
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


