import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import type { LatLngTuple } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png?url";
import iconUrl from "leaflet/dist/images/marker-icon.png?url";
import shadowUrl from "leaflet/dist/images/marker-shadow.png?url";
import { RxCross2 } from "react-icons/rx";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Swal from "sweetalert2";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import { fetchCentrosPorEstadoyActive } from "../redux/store/centroSlice";
import { Estado } from "../types/enums/Estado";
import type { CentroDeEsteticaResponseDTO } from "../types/centroDeEstetica/CentroDeEsteticaResponseDTO";
import { buildServiciosLabel } from "../utils/servicios";

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
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


const centroMarkerIcon = new L.Icon({
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

const DEFAULT_CENTER: LatLngTuple = [-34.6037, -58.3816];

const haversineDistance = (from: LatLngTuple, to: LatLngTuple) => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const [lat1, lon1] = from;
  const [lat2, lon2] = to;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const buildAddressLabel = (centro: CentroDeEsteticaResponseDTO) => {
  const parts: string[] = [];
  if (centro.domicilio?.calle) {
    const tieneNumero = centro.domicilio.numero !== undefined && centro.domicilio.numero !== null;
    const numero = tieneNumero ? ` ${centro.domicilio.numero}` : "";
    parts.push(`${centro.domicilio.calle}${numero}`);
  }
  if (centro.domicilio?.localidad) parts.push(centro.domicilio.localidad);
  if (centro.domicilio?.provincia) parts.push(centro.domicilio.provincia);
  parts.push("Argentina");
  return parts.join(", ");
};

const geocodeAddress = async (
  address: string,
  signal: AbortSignal,
): Promise<LatLngTuple | null> => {
  const params = new URLSearchParams({ format: "json", limit: "1", q: address });
  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
    headers: { "Accept-Language": "es" },
    signal,
  });
  if (!response.ok) return null;
  const data: Array<{ lat: string; lon: string }> = await response.json();
  if (!data.length) return null;
  return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
};

interface CentroWithCoords {
  centro: CentroDeEsteticaResponseDTO;
  coords: LatLngTuple;
  addressLabel: string;
}

const MapaCentros = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { centros, loading, error } = useAppSelector((state) => state.centros);
  const user = useAppSelector((state) => state.user.user);
  const [userLocation, setUserLocation] = useState<LatLngTuple | null>(null);
  const [modalCentro, setModalCentro] = useState(false);
  const [centroSeleccionado, setCentroSeleccionado] = useState<CentroDeEsteticaResponseDTO | null>(null);
  const [geolocationError, setGeolocationError] = useState<string | null>(null);
  const [centrosConCoordenadas, setCentrosConCoordenadas] = useState<CentroWithCoords[]>([]);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);
  const [geocoding, setGeocoding] = useState(false);
  const serviciosSeleccionadosLabel = buildServiciosLabel(centroSeleccionado?.servicios);

  useEffect(() => {
    dispatch(fetchCentrosPorEstadoyActive({ estado: Estado.ACEPTADO, active: true }));
  }, [dispatch]);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setGeolocationError("Tu navegador no admite geolocalizacion");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        setGeolocationError(null);
      },
      (err) => {
        setGeolocationError(err.message || "No pudimos obtener tu ubicacion");
      }
    );
  }, []);

  useEffect(() => {
    if (!centros.length) {
      setCentrosConCoordenadas([]);
      return;
    }
    let isMounted = true;
    const abortController = new AbortController();
    const fetchCoords = async () => {
      setGeocoding(true);
      setGeocodingError(null);
      try {
        const results = await Promise.all(
          centros.map(async (centro) => {
            const addressLabel = buildAddressLabel(centro);
            try {
              const coords = await geocodeAddress(addressLabel, abortController.signal);
              if (!coords) return null;
              return { centro, coords, addressLabel } as CentroWithCoords;
            } catch (geoErr) {
              if (geoErr instanceof DOMException && geoErr.name === "AbortError") {
                return null;
              }
              return null;
            }
          })
        );
        if (!isMounted) return;
        const filtered = results.filter(Boolean) as CentroWithCoords[];
        setCentrosConCoordenadas(filtered);
        if (filtered.length === 0) {
          setGeocodingError("No pudimos geolocalizar los centros");
        }
      } catch (err: unknown) {
        if (isMounted) {
          if (err instanceof Error) {
            setGeocodingError("Ocurrio un problema al localizar los centros");
          } else {
            setGeocodingError("ocurrio un problema desconocido al localizar los centros")

          }
        }

      } finally {
        if (isMounted) {
          setGeocoding(false);
        }
      }
    };

    fetchCoords();
    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [centros]);

  const nearestCentros = useMemo(() => {
    if (!userLocation) return [];
    return centrosConCoordenadas
      .map((entry) => ({
        ...entry,
        distanceKm: haversineDistance(userLocation, entry.coords),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 5);
  }, [centrosConCoordenadas, userLocation]);

  const mapCenter = useMemo(() => {
    if (userLocation) return userLocation;
    if (centrosConCoordenadas.length) return centrosConCoordenadas[0].coords;
    return DEFAULT_CENTER;
  }, [userLocation, centrosConCoordenadas]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F8]">
      <Navbar />
      <div className="flex flex-1 flex-col lg:flex-row gap-6 px-4 lg:px-12 pt-6 pb-10 mt-24 w-full max-w-7xl mx-auto">
        <div className="relative z-0 flex md:flex-1 h-[500px] lg:h-[calc(100vh-260px)] bg-white rounded-3xl shadow-lg overflow-hidden">
          <MapContainer key={`${mapCenter[0]}-${mapCenter[1]}`} center={mapCenter} zoom={12} className="h-full w-full z-0" zoomControl>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {userLocation && (
              <CircleMarker center={userLocation} radius={12} pathOptions={{ color: "#ff385c", fillColor: "#ff385c", fillOpacity: 0.5 }}>
                <Popup>
                  <div>
                    <p className="font-semibold">Estas aqui</p>
                  </div>
                </Popup>
              </CircleMarker>
            )}
            {centrosConCoordenadas.map(({ centro, coords, addressLabel }) => (
              <Marker key={centro.id} position={coords} icon={centroMarkerIcon}>
                <Popup>
                  <div className="space-y-1">
                    <p className="font-semibold text-base">{centro.nombre}</p>
                    <p className="text-sm text-gray-600">{addressLabel}</p>
                    {userLocation && (
                      <p className="text-sm font-medium">
                        A {haversineDistance(userLocation, coords).toFixed(1)} km de tu ubicacion
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        <div className="lg:w-96 bg-white rounded-3xl shadow-md p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-gray-800">Centros cercanos</h2>
            <button
              type="button"
              onClick={() => navigate('/Centros')}
              className="text-sm font-semibold text-secondary hover:text-[#a27e8f] transition cursor-pointer"
            >
              Ver todos los centros
            </button>
          </div>
          {loading && <p className="text-gray-500">Cargando centros...</p>}
          {geocoding && <p className="text-gray-500">Ubicando centros en el mapa...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {geolocationError && <p className="text-amber-600">{geolocationError}</p>}
          {geocodingError && <p className="text-red-500">{geocodingError}</p>}
          {userLocation ? (
            nearestCentros.length ? (
              <ul className="space-y-3">
                {nearestCentros.map(({ centro, distanceKm, addressLabel }) => (
                  <li
                    key={centro.id}
                    className="border border-gray-200 rounded-2xl p-4 hover:border-secondary transition cursor-pointer"
                    onClick={() => {
                      setCentroSeleccionado(centro);
                      setModalCentro(true);
                    }}
                  >
                    <p className="text-lg font-semibold text-gray-800">{centro.nombre}</p>
                    <p className="text-sm text-gray-600">{addressLabel}</p>
                    <p className="text-sm font-medium text-secondary mt-1">{distanceKm.toFixed(1)} km de distancia</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Aun no pudimos calcular los centros mas cercanos.</p>
            )
          ) : (
            <p className="text-gray-600">Para ver los centros cercanos necesitamos acceder a tu ubicacion.</p>
          )}
          {!loading && !centrosConCoordenadas.length && !geocodingError && (
            <p className="text-gray-500">No hay centros disponibles para mostrar en el mapa.</p>
          )}
        </div>
      </div>
      {modalCentro && centroSeleccionado && (
        <div className="fixed inset-0 bg-gradient-to-b from-black/50 to-black/30 backdrop-blur-md flex items-center justify-center z-[2000] animate-fadeIn">
          <div className="relative bg-white rounded-2xl shadow-2xl w-[90%] max-w-md overflow-hidden transition-all duration-300">

            <button
              onClick={() => setModalCentro(false)}
              className="absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800 transition-colors rounded-full p-1 shadow-sm z-10 cursor-pointer"
            >
              <RxCross2 size={22} />
            </button>

            <div className="relative">
              <img
                src={centroSeleccionado.imagen}
                alt={centroSeleccionado.nombre}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>

            <div className="py-3 px-5 space-y-3 font-primary text-gray-700">
              <h3 className="text-xl md:text-2xl font-bold text-center text-secondary">
                {centroSeleccionado.nombre}
              </h3>
              <p className="text-sm md:text-base"><b>Descripción:</b> {centroSeleccionado.descripcion}</p>

              {centroSeleccionado.domicilio && (
                <p className="text-sm md:text-base">
                  <b>Domicilio:</b> {centroSeleccionado.domicilio.calle}{" "}
                  {centroSeleccionado.domicilio.numero},{" "}
                  {centroSeleccionado.domicilio.localidad} –{" "}
                  CP {centroSeleccionado.domicilio.codigoPostal}
                </p>
              )}

              {serviciosSeleccionadosLabel && (
                <p className="text-sm md:text-base">
                  <b>Servicios:</b>{" "}
                  {serviciosSeleccionadosLabel}
                </p>
              )}
              {centroSeleccionado.horariosCentro && centroSeleccionado.horariosCentro.length > 0 && (
                <div>
                  <b className="text-sm md:text-base">Horarios de atención:</b>
                  <ul className="list-disc list-inside mt-1 text-sm md:text-base">
                    {centroSeleccionado.horariosCentro.map((horario, index) => (
                      <li key={index} className="text-sm md:text-base">
                        {diasEnEspanol[horario.dia]}:{" "}
                        {horario.horaMInicio?.slice(0, 5)} - {horario.horaMFinalizacion?.slice(0, 5)} /{" "}
                        {horario.horaTInicio?.slice(0, 5)} - {horario.horaTFinalizacion?.slice(0, 5)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-around mt-5">
                <button
                  className="text-sm md:text-base bg-gradient-to-r cursor-pointer from-secondary to-[#b38a9b] text-white rounded-full py-2 px-4 font-semibold shadow-md hover:opacity-90 transition-all"
                  onClick={() =>
                    navigate(`/centros/${centroSeleccionado.id}/resenias`)
                  }
                >
                  Ver reseñas
                </button>
                <button
                  className="text-sm md:text-base bg-gradient-to-r cursor-pointer from-secondary to-[#b38a9b] text-white rounded-full py-2 px-4 font-semibold shadow-md hover:opacity-90 transition-all"
                  onClick={() => {
                    if (user) {
                      navigate(`/turno/${centroSeleccionado.id}`);
                    } else {
                      navigate("/IniciarSesion");
                      Swal.fire({
                        icon: "info",
                        title: "Debes iniciar sesión para pedir un turno",
                        showConfirmButton: true,
                        confirmButtonColor: "#a27e8f",
                      });
                    }
                  }}
                >
                  Pedir turno
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default MapaCentros;



















