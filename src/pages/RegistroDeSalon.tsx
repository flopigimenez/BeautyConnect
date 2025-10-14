import { useState, type FormEvent } from "react";
import type { CentroDeEsteticaDTO } from "../types/centroDeEstetica/CentroDeEsteticaDTO";
import type { HorarioCentroDTO } from "../types/horarioCentro/HorarioCentroDTO";
import type { DomicilioDTO } from "../types/domicilio/DomicilioDTO";
import { CentroDeEsteticaService } from "../services/CentroDeEsteticaService";
import { useNavigate } from "react-router-dom";
import { setCentroSlice } from "../redux/store/miCentroSlice";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import Swal from "sweetalert2";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaRegTrashAlt, FaRegQuestionCircle } from "react-icons/fa";

const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const createEmptyHorario = (): HorarioCentroDTO => ({
  dia: "",
  horaMInicio: "",
  horaMFinalizacion: "",
  horaTInicio: "",
  horaTFinalizacion: "",
});

const markerIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="20" viewBox="0 0 25 41" fill="none">
        <path fill="#C4A1B5" stroke="black" stroke-width="1" d="M12.5 0C5.6 0 0 5.6 0 12.5C0 22.5 12.5 41 12.5 41C12.5 41 25 22.5 25 12.5C25 5.6 19.4 0 12.5 0ZM12.5 17.5C9.46 17.5 7 15.04 7 12C7 8.96 9.46 6.5 12.5 6.5C15.54 6.5 18 8.96 18 12C18 15.04 15.54 17.5 12.5 17.5Z"/>
      </svg>
    `),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const diasEnEspanol: Record<string, string> = {
  MONDAY: "Lunes",
  TUESDAY: "Martes",
  WEDNESDAY: "Miércoles",
  THURSDAY: "Jueves",
  FRIDAY: "Viernes",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

function LocationSelector({ onChange }: { onChange: (coords: { lat: number; lng: number }) => void }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng);
    },
  });
  return null;
}

async function reverseGeocode(lat: number, lon: number) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&accept-language=es&lat=${lat}&lon=${lon}`,
    { headers: { "User-Agent": "BeautyConnect/1.0 (contacto@example.com)" } }
  );
  if (!response.ok) return null;
  const data = await response.json();
  if (data.address && (data.address.state === "Mendoza" || data.display_name?.toLowerCase().includes("mendoza"))) {
    return data;
  } else {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "La ubicación seleccionada no corresponde a Mendoza, por favor elige otra ubicación",
    });
    return null;
  }
}

async function geocodeDireccion({ calle, numero, localidad, codigoPostal }: DomicilioDTO) {
  const direccion = `${calle} ${numero}, ${localidad}, ${codigoPostal || ""}, Mendoza, Argentina`;
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&accept-language=es&q=${encodeURIComponent(direccion)}`,
    { headers: { "User-Agent": "BeautyConnect/1.0 (contacto@example.com)" } }
  );
  if (!response.ok) return null;
  const data = await response.json();
  const mendozaResult = data.find(
    (d: unknown) =>
      (d as { display_name?: string }).display_name?.toLowerCase().includes("mendoza") &&
      (d as { display_name?: string }).display_name?.toLowerCase().includes("argentina")
  );
  if (mendozaResult) {
    return {
      lat: parseFloat(mendozaResult.lat),
      lng: parseFloat(mendozaResult.lon),
    };
  }
  return null;
}

const RegistroDeSalon = () => {
  const user = useAppSelector((state) => state.user.user);
  const [horariosCentro, setHorariosCentro] = useState<HorarioCentroDTO>(createEmptyHorario());
  const [direccionNueva, setDireccionNueva] = useState<DomicilioDTO>({
    calle: "",
    numero: 0,
    localidad: "",
    codigoPostal: 0,
    provincia: "Mendoza",
    latitud: -32.8908, // Mendoza centro aprox
    longitud: -68.8272,
  });

  const [registroDeSalon, setRegistroDeSalon] = useState<CentroDeEsteticaDTO>({
    nombre: "",
    descripcion: "",
    imagen: "",
    docValido: "",
    cuit: 0,
    prestadorDeServicioId: user?.id ?? 0,
    domicilio: {
      ...direccionNueva,
    },
    horariosCentro: [] as HorarioCentroDTO[],
  });

  const centroService = new CentroDeEsteticaService();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, fileType: string) => {
    const file = e.target.files?.[0];
    if (!file || !cloudName || !uploadPreset) {
      Swal.fire("Falta configuración de Cloudinary");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset!);

    const resp = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${fileType}/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await resp.json();
    if (fileType === "image") {
      setRegistroDeSalon((prev) => ({ ...prev, imagen: data.secure_url }));
    } else {
      setRegistroDeSalon((prev) => ({ ...prev, docValido: data.secure_url }));
    }
  };

  const handleEliminarHorario = (index: number) => {
    setRegistroDeSalon((prev) => ({
      ...prev,
      horariosCentro: prev.horariosCentro.filter((_, i) => i !== index),
    }));
  };

  const handleRegistrarSalon = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user?.id) {
      Swal.fire("No se encontró el usuario prestador asociado.");
      return;
    }

    // Validación con direccionNueva
    if (!direccionNueva.calle || !direccionNueva.numero || !direccionNueva.localidad) {
      Swal.fire("Completa la dirección del salón (calle, altura y localidad).");
      return;
    }

    if (!registroDeSalon.nombre || !registroDeSalon.descripcion) {
      Swal.fire("Completa los datos básicos del salón (nombre y descripción).");
      return;
    }

    if (!registroDeSalon.cuit) {
      Swal.fire("Ingresa un CUIT válido.");
      return;
    }

    if (registroDeSalon.horariosCentro.length === 0) {
      Swal.fire("Agrega al menos un horario para tu centro.");
      return;
    }

    const domicilioDTO: DomicilioDTO = {
      calle: direccionNueva.calle,
      numero: direccionNueva.numero ?? 0,
      localidad: direccionNueva.localidad,
      codigoPostal: direccionNueva.codigoPostal ?? 0,
      provincia: direccionNueva.provincia || "Mendoza",
      latitud: direccionNueva.latitud,
      longitud: direccionNueva.longitud,
    };

    const payload: CentroDeEsteticaDTO = {
      ...registroDeSalon,
      cuit: Number(registroDeSalon.cuit),
      prestadorDeServicioId: user.id,
      domicilio: domicilioDTO,
      horariosCentro: registroDeSalon.horariosCentro.map((horario) => ({ ...horario })),
    };

    try {
      const centro = await centroService.post(payload);
      dispatch(setCentroSlice(centro));
      Swal.fire("Centro registrado correctamente.");
      navigate("/PendienteAprobacion");
    } catch (error) {
      console.error("Error al registrar el centro de estética:", error);
      Swal.fire("No se pudo registrar el centro. Intentalo nuevamente.");
    }
  };

  return (
    <>
      <div className="bg-primary w-screen pt-8 flex flex-col items-center">
        <h1 className="font-secondary text-2xl font-bold">Registra tu salón</h1>
        <form className="mt-5 w-[20rem] md:w-[45rem]" onSubmit={handleRegistrarSalon}>
          <div className="mb-5">
            <label className="block text-gray-700 font-primary font-bold mb-2" htmlFor="nombre">
              Nombre del salón
            </label>
            <input
              type="text"
              id="nombre"
              className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="Ingresa el nombre del salón"
              value={registroDeSalon.nombre}
              onChange={(e) => setRegistroDeSalon((prev) => ({ ...prev, nombre: e.target.value }))}
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 font-primary font-bold mb-2" htmlFor="descripcion">
              Descripción del salón
            </label>
            <input
              type="text"
              id="descripcion"
              className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="Ingresa una descripción del salón"
              value={registroDeSalon.descripcion}
              onChange={(e) => setRegistroDeSalon((prev) => ({ ...prev, descripcion: e.target.value }))}
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 font-primary font-bold mb-2" htmlFor="image">
              Ingresa una imagen de tu salón
            </label>
            <input
              type="file"
              accept="image/*"
              id="image"
              className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              onChange={(e) => handleUpload(e, "image")}
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 font-primary font-bold mb-2">Dirección de tu salón</label>

            <div className="flex flex-col items-center w-full">
              <MapContainer
                center={[direccionNueva.latitud, direccionNueva.longitud]}
                zoom={13}
                style={{ height: "200px", width: "100%", marginBottom: "1rem", borderRadius: "10px" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationSelector
                  onChange={async ({ lat, lng }) => {
                    setDireccionNueva((prev) => ({ ...prev, latitud: lat, longitud: lng }));
                    const data = await reverseGeocode(lat, lng);
                    if (data?.address) {
                      setDireccionNueva((prev) => ({
                        ...prev,
                        calle: data.address.road || prev.calle,
                        numero: data.address.house_number ? parseInt(data.address.house_number, 10) : prev.numero,
                        localidad: (data.address.city || data.address.town || data.address.village || prev.localidad) as string,
                        codigoPostal: data.address.postcode ? parseInt(data.address.postcode, 10) : prev.codigoPostal,
                        provincia: "Mendoza",
                      }));
                    }
                  }}
                />
                <Marker position={[direccionNueva.latitud, direccionNueva.longitud]} icon={markerIcon} />
              </MapContainer>

              <input
                type="text"
                className="bg-white border-none rounded-[50px] p-2 mb-4 w-[90%]"
                placeholder="Calle"
                value={direccionNueva.calle}
                onChange={(e) => setDireccionNueva({ ...direccionNueva, calle: e.target.value })}
              />
              <input
                type="number"
                className="bg-white border-none rounded-[50px] p-2 mb-4 w-[90%]"
                placeholder="Número"
                value={direccionNueva.numero === 0 ? "" : direccionNueva.numero}
                onChange={(e) =>
                  setDireccionNueva({
                    ...direccionNueva,
                    numero: e.target.value === "" ? 0 : parseInt(e.target.value, 10),
                  })
                }
              />
              <input
                type="text"
                className="bg-white border-none rounded-[50px] p-2 mb-4 w-[90%]"
                placeholder="Localidad"
                value={direccionNueva.localidad}
                onChange={(e) => setDireccionNueva({ ...direccionNueva, localidad: e.target.value })}
              />
              <input
                type="number"
                className="bg-white border-none rounded-[50px] p-2 mb-4 w-[90%]"
                placeholder="Código Postal"
                value={direccionNueva.codigoPostal === 0 ? "" : direccionNueva.codigoPostal}
                onChange={(e) =>
                  setDireccionNueva({
                    ...direccionNueva,
                    codigoPostal: e.target.value === "" ? 0 : parseInt(e.target.value, 10),
                  })
                }
              />

              <button
                type="button"
                className="bg-secondary px-3 py-1 rounded-full mb-4 text-white"
                onClick={async () => {
                  const coords = await geocodeDireccion(direccionNueva);
                  if (coords) {
                    setDireccionNueva((prev) => ({
                      ...prev,
                      latitud: coords.lat,
                      longitud: coords.lng,
                    }));
                  } else {
                    Swal.fire("No se encontró la dirección", "Verifica los datos ingresados.", "warning");
                  }
                }}
              >
                Buscar en el mapa
              </button>
            </div>
          </div>

          <div className="mb-5">
            <label className="flex items-center gap-2 text-gray-700 font-primary font-bold mb-2" htmlFor="file">
              Documento que acredite la validez de tu salón:
              <FaRegQuestionCircle
                className="text-secondary cursor-help"
                title="Subí un documento que acredite que tu centro está habilitado (por ejemplo, constancia de AFIP o habilitación municipal)."
              />
            </label>
            <input
              type="file"
              accept="image/*,application/pdf"
              id="file"
              className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              onChange={(e) => handleUpload(e, "auto")}
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 font-primary font-bold mb-2" htmlFor="cuit">
              CUIT
            </label>
            <input
              type="number"
              id="cuit"
              className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="Ingresa el CUIT de tu negocio"
              value={registroDeSalon.cuit || ""}
              onChange={(e) =>
                setRegistroDeSalon((prev) => ({ ...prev, cuit: e.target.value ? parseInt(e.target.value, 10) : 0 }))
              }
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 font-primary font-bold mb-2">Horarios</label>

            <div className="flex gap-2 mb-3">
              <div className="w-1/2">
                <label className="block text-gray-400 font-primary text-sm mb-1 pl-1" htmlFor="dia">
                  Día
                </label>
                <select
                  id="dia"
                  className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  value={horariosCentro.dia}
                  onChange={(e) => setHorariosCentro((prev) => ({ ...prev, dia: e.target.value }))}
                >
                  <option value="">Selecciona un día</option>
                  {Object.entries(diasEnEspanol).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2 mb-2">
              <input
                type="time"
                className="w-1/4 p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Hora inicio"
                value={horariosCentro.horaMInicio}
                onChange={(e) => setHorariosCentro((prev) => ({ ...prev, horaMInicio: e.target.value }))}
              />
              <input
                type="time"
                className="w-1/4 p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Hora finalización"
                value={horariosCentro.horaMFinalizacion}
                onChange={(e) => setHorariosCentro((prev) => ({ ...prev, horaMFinalizacion: e.target.value }))}
              />
              <input
                type="time"
                className="w-1/4 p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Hora inicio tarde"
                value={horariosCentro.horaTInicio}
                onChange={(e) => setHorariosCentro((prev) => ({ ...prev, horaTInicio: e.target.value }))}
              />
              <input
                type="time"
                className="w-1/4 p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Hora finalización tarde"
                value={horariosCentro.horaTFinalizacion}
                onChange={(e) => setHorariosCentro((prev) => ({ ...prev, horaTFinalizacion: e.target.value }))}
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  const h = horariosCentro;
                  const completos =
                    h.dia && h.horaMInicio && h.horaMFinalizacion && h.horaTInicio && h.horaTFinalizacion;
                  if (!completos) return;

                  setRegistroDeSalon((prev) => {
                    // Evita duplicados por día: si ya existe, lo reemplaza.
                    const sinDia = prev.horariosCentro.filter((x) => x.dia !== h.dia);
                    return { ...prev, horariosCentro: [...sinDia, { ...h }] };
                  });
                  setHorariosCentro(createEmptyHorario());
                }}
                className="font-primary text-sm h-8 px-4 py-1 mb-5 bg-secondary text-white rounded-full hover:scale-105 transition cursor-pointer"
              >
                Agregar horario
              </button>
            </div>

            <div className="mb-5 bg-gray-100 rounded-2xl w-full p-3">
              <h3 className="font-bold mb-2 font-primary">Horarios agregados:</h3>
              <ul className="list-disc pl-5 font-primary mb-3">
                {registroDeSalon.horariosCentro.map((d, i) => (
                  <div key={`${d.dia}-${i}`} className="flex justify-between">
                    <li>
                      {diasEnEspanol[d.dia]} de {d.horaMInicio}hs - {d.horaMFinalizacion}hs y {d.horaTInicio}hs -{" "}
                      {d.horaTFinalizacion}hs
                    </li>
                    <button
                      type="button"
                      className="cursor-pointer text-tertiary md:pr-10"
                      onClick={() => handleEliminarHorario(i)}
                    >
                      <FaRegTrashAlt />
                    </button>
                  </div>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-end mb-10">
            <button
              type="submit"
              className="w-[30%] bg-secondary text-white font-bold py-2 rounded-full cursor-pointer hover:bg-[#a27e8f] transition font-secondary"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default RegistroDeSalon;
