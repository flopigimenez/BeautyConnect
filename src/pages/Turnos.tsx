import { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { TipoDeServicio } from "../types/enums/TipoDeServicio";
import type { CentroEsteticaResponseDTO } from "../types/centroDeEstetica/CentroEsteticaResponseDTO";
import { Estado } from "../types/enums/Estado";
import type { DisponibilidadResponseDTO } from "../types/disponibilidad/DisponibilidadResponseDTO";
import type { ProfesionalResponseDTO } from "../types/profesional/ProfesionalResponseDTO";
import type { ServicioResponseDTO } from "../types/servicio/ServicioResponseDTO";

const centros: CentroEsteticaResponseDTO[] = [
  {
    id: 1,
    nombre: "Centro Belleza",
    servicios: [
      { id: 1, tipoDeServicio: TipoDeServicio.DEPILACION, duracion: 30, precio: 1500, descripcion: "Depilación con cera"  },
      { id: 2, tipoDeServicio: TipoDeServicio.MANICURA, duracion: 45, precio: 2000, descripcion: "Manicura completa" },
      { id: 3, tipoDeServicio: TipoDeServicio.PEDICURA, duracion: 60, precio: 2500, descripcion: "Pedicura spa"  },
      { id: 4, tipoDeServicio: TipoDeServicio.MASAJES, duracion: 90, precio: 4000, descripcion: "Masaje relajante"  },
    ],
    profesionales: [
      {
        id: 1,
        nombre: "Ana Pérez",
        disponibilidades: [
          { id: 1, fecha: new Date("2025-07-30"), horaInicio: "9:30", horaFin: "10:00" },
          { id: 2, fecha: new Date("2025-07-30"), horaInicio: "10:00", horaFin: "10:30" },
        ],
        servicios: [
          { id: 1, tipoDeServicio: TipoDeServicio.BARBERIA, duracion: 30, precio: 1500, descripcion: "Depilación con cera" },
          { id: 2, tipoDeServicio: TipoDeServicio.MANICURA, duracion: 45, precio: 2000, descripcion: "Manicura completa" },
        ]
      },
      {
        id: 2,
        nombre: "Luis Gómez",
        disponibilidades: [
          { id: 3, fecha: new Date("2025-07-31"), horaInicio: "9:30", horaFin: "10:00" },
          { id: 4, fecha: new Date("2025-07-31"), horaInicio: "10:00", horaFin: "10:30" },
        ],
        servicios: [
          { id: 3, tipoDeServicio: TipoDeServicio.DEPILACION, duracion: 60, precio: 2500, descripcion: "Pedicura spa" },
          { id: 4, tipoDeServicio: TipoDeServicio.MASAJES, duracion: 90, precio: 4000, descripcion: "Masaje relajante" },
        ],
      },
    ],
    descripcion: "Centro de estética especializado en depilación, manicura y masajes.",
    imagen: "https://example.com/imagen.jpg",
    docValido: "https://example.com/doc_valido.pdf",
    cuit: 2131243214,
    domicilios: [],
    turnos: [],
    reseñas: [],
    estado: Estado.CONFIRMADO,
  },
   {
    id: 2,
    nombre: "Centro Belleza",
    servicios: [
      { id: 1, tipoDeServicio: TipoDeServicio.DEPILACION, duracion: 30, precio: 1500, descripcion: "Depilación con cera"  },
      { id: 2, tipoDeServicio: TipoDeServicio.MANICURA, duracion: 45, precio: 2000, descripcion: "Manicura completa" },
      { id: 3, tipoDeServicio: TipoDeServicio.PEDICURA, duracion: 60, precio: 2500, descripcion: "Pedicura spa"  },
      { id: 4, tipoDeServicio: TipoDeServicio.MASAJES, duracion: 90, precio: 4000, descripcion: "Masaje relajante"  },
    ],
    profesionales: [
      {
        id: 1,
        nombre: "Ana Pérez",
        disponibilidades: [
          { id: 1, fecha: new Date("2025-07-30"), horaInicio: "9:30", horaFin: "10:00" },
          { id: 2, fecha: new Date("2025-07-30"), horaInicio: "10:00", horaFin: "10:30" },
        ],
        servicios: [
          { id: 1, tipoDeServicio: TipoDeServicio.DEPILACION, duracion: 30, precio: 1500, descripcion: "Depilación con cera" },
          { id: 2, tipoDeServicio: TipoDeServicio.MANICURA, duracion: 45, precio: 2000, descripcion: "Manicura completa" },
        ]
      },
      {
        id: 2,
        nombre: "Luis Gómez",
        disponibilidades: [
          { id: 3, fecha: new Date("2025-07-31"), horaInicio: "9:30", horaFin: "10:00" },
          { id: 4, fecha: new Date("2025-07-31"), horaInicio: "10:00", horaFin: "10:30" },
        ],
        servicios: [
          { id: 3, tipoDeServicio: TipoDeServicio.PEDICURA, duracion: 60, precio: 2500, descripcion: "Pedicura spa" },
          { id: 4, tipoDeServicio: TipoDeServicio.MASAJES, duracion: 90, precio: 4000, descripcion: "Masaje relajante" },
        ],
      },
    ],
    descripcion: "Centro de estética especializado en depilación, manicura y masajes.",
    imagen: "https://example.com/imagen.jpg",
    docValido: "https://example.com/doc_valido.pdf",
    cuit: 2131243214,
    domicilios: [],
    turnos: [],
    reseñas: [],
    estado: Estado.CONFIRMADO,
  },
   {
    id: 3,
    nombre: "Centro Belleza",
    servicios: [
      { id: 1, tipoDeServicio: TipoDeServicio.DEPILACION, duracion: 30, precio: 1500, descripcion: "Depilación con cera"  },
      { id: 2, tipoDeServicio: TipoDeServicio.MANICURA, duracion: 45, precio: 2000, descripcion: "Manicura completa" },
      { id: 3, tipoDeServicio: TipoDeServicio.PEDICURA, duracion: 60, precio: 2500, descripcion: "Pedicura spa"  },
      { id: 4, tipoDeServicio: TipoDeServicio.MASAJES, duracion: 90, precio: 4000, descripcion: "Masaje relajante"  },
    ],
    profesionales: [
      {
        id: 1,
        nombre: "Ana Pérez",
        disponibilidades: [
          { id: 1, fecha: new Date("2025-07-30"), horaInicio: "9:30", horaFin: "10:00" },
          { id: 2, fecha: new Date("2025-07-30"), horaInicio: "10:00", horaFin: "10:30" },
        ],
        servicios: [
          { id: 1, tipoDeServicio: TipoDeServicio.DEPILACION, duracion: 30, precio: 1500, descripcion: "Depilación con cera" },
          { id: 2, tipoDeServicio: TipoDeServicio.MANICURA, duracion: 45, precio: 2000, descripcion: "Manicura completa" },
        ]
      },
      {
        id: 2,
        nombre: "Luis Gómez",
        disponibilidades: [
          { id: 3, fecha: new Date("2025-07-31"), horaInicio: "9:30", horaFin: "10:00" },
          { id: 4, fecha: new Date("2025-07-31"), horaInicio: "10:00", horaFin: "10:30" },
        ],
        servicios: [
          { id: 3, tipoDeServicio: TipoDeServicio.PEDICURA, duracion: 60, precio: 2500, descripcion: "Pedicura spa" },
          { id: 4, tipoDeServicio: TipoDeServicio.MASAJES, duracion: 90, precio: 4000, descripcion: "Masaje relajante" },
        ],
      },
    ],
    descripcion: "Centro de estética especializado en depilación, manicura y masajes.",
    imagen: "https://example.com/imagen.jpg",
    docValido: "https://example.com/doc_valido.pdf",
    cuit: 2131243214,
    domicilios: [],
    turnos: [],
    reseñas: [],
    estado: Estado.CONFIRMADO,
  },
   {
    id: 4,
    nombre: "Centro Belleza",
    servicios: [
      { id: 1, tipoDeServicio: TipoDeServicio.DEPILACION, duracion: 30, precio: 1500, descripcion: "Depilación con cera"  },
      { id: 2, tipoDeServicio: TipoDeServicio.MANICURA, duracion: 45, precio: 2000, descripcion: "Manicura completa" },
      { id: 3, tipoDeServicio: TipoDeServicio.PEDICURA, duracion: 60, precio: 2500, descripcion: "Pedicura spa"  },
      { id: 4, tipoDeServicio: TipoDeServicio.MASAJES, duracion: 90, precio: 4000, descripcion: "Masaje relajante"  },
    ],
    profesionales: [
      {
        id: 2,
        nombre: "Ana Pérez",
        disponibilidades: [
          { id: 1, fecha: new Date("2025-07-30"), horaInicio: "9:30", horaFin: "10:00" },
          { id: 2, fecha: new Date("2025-07-30"), horaInicio: "10:00", horaFin: "10:30" },
        ],
        servicios: [
          { id: 1, tipoDeServicio: TipoDeServicio.DEPILACION, duracion: 30, precio: 1500, descripcion: "Depilación con cera" },
          { id: 2, tipoDeServicio: TipoDeServicio.MANICURA, duracion: 45, precio: 2000, descripcion: "Manicura completa" },
        ]
      },
      {
        id: 2,
        nombre: "Luis Gómez",
        disponibilidades: [
          { id: 3, fecha: new Date("2025-07-31"), horaInicio: "9:30", horaFin: "10:00" },
          { id: 4, fecha: new Date("2025-07-31"), horaInicio: "10:00", horaFin: "10:30" },
        ],
        servicios: [
          { id: 3, tipoDeServicio: TipoDeServicio.PEDICURA, duracion: 60, precio: 2500, descripcion: "Pedicura spa" },
          { id: 4, tipoDeServicio: TipoDeServicio.MASAJES, duracion: 90, precio: 4000, descripcion: "Masaje relajante" },
        ],
      },
    ],
    descripcion: "Centro de estética especializado en depilación, manicura y masajes.",
    imagen: "https://example.com/imagen.jpg",
    docValido: "https://example.com/doc_valido.pdf",
    cuit: 2131243214,
    domicilios: [],
    turnos: [],
    reseñas: [],
    estado: Estado.CONFIRMADO,
  }, {
    id: 5,
    nombre: "Centro Belleza",
    servicios: [
      { id: 1, tipoDeServicio: TipoDeServicio.DEPILACION, duracion: 30, precio: 1500, descripcion: "Depilación con cera"  },
      { id: 2, tipoDeServicio: TipoDeServicio.MANICURA, duracion: 45, precio: 2000, descripcion: "Manicura completa" },
      { id: 3, tipoDeServicio: TipoDeServicio.PEDICURA, duracion: 60, precio: 2500, descripcion: "Pedicura spa"  },
      { id: 4, tipoDeServicio: TipoDeServicio.MASAJES, duracion: 90, precio: 4000, descripcion: "Masaje relajante"  },
    ],
    profesionales: [
      {
        id: 1,
        nombre: "Ana Pérez",
        disponibilidades: [
          { id: 1, fecha: new Date("2025-07-30"), horaInicio: "9:30", horaFin: "10:00" },
          { id: 2, fecha: new Date("2025-07-30"), horaInicio: "10:00", horaFin: "10:30" },
        ],
        servicios: [
          { id: 1, tipoDeServicio: TipoDeServicio.DEPILACION, duracion: 30, precio: 1500, descripcion: "Depilación con cera" },
          { id: 2, tipoDeServicio: TipoDeServicio.MANICURA, duracion: 45, precio: 2000, descripcion: "Manicura completa" },
        ]
      },
      {
        id: 2,
        nombre: "Luis Gómez",
        disponibilidades: [
          { id: 3, fecha: new Date("2025-07-31"), horaInicio: "9:30", horaFin: "10:00" },
          { id: 4, fecha: new Date("2025-07-31"), horaInicio: "10:00", horaFin: "10:30" },
        ],
        servicios: [
          { id: 3, tipoDeServicio: TipoDeServicio.PEDICURA, duracion: 60, precio: 2500, descripcion: "Pedicura spa" },
          { id: 4, tipoDeServicio: TipoDeServicio.MASAJES, duracion: 90, precio: 4000, descripcion: "Masaje relajante" },
        ],
      },
    ],
    descripcion: "Centro de estética especializado en depilación, manicura y masajes.",
    imagen: "https://example.com/imagen.jpg",
    docValido: "https://example.com/doc_valido.pdf",
    cuit: 2131243214,
    domicilios: [],
    turnos: [],
    reseñas: [],
    estado: Estado.CONFIRMADO,
  }
  // puedes agregar más centros
];

const Turnos = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Busca el centro según el id
  const centroSeleccionado = centros.find((c) => c.id === Number(id));
  if (!centroSeleccionado) return <div>Centro no encontrado</div>;

  // Estados tipados
  const [servicioSeleccionado, setServicioSeleccionado] = useState<ServicioResponseDTO | null>(null);
  const [profesionalSeleccionado, setProfesionalSeleccionado] = useState<ProfesionalResponseDTO | null>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState<string | null>(null);
  const [pasos, setPasos] = useState<number>(1);

  // Filtra profesionales según servicio
  const profesionalesFiltrados = servicioSeleccionado
    ? centroSeleccionado.profesionales.filter((p) =>
        p.servicios.some((s) => s.id === servicioSeleccionado.id)
      )
    : centroSeleccionado.profesionales;

  // Fechas disponibles para el profesional seleccionado
  const fechasDisponibles: DisponibilidadResponseDTO[] =
    profesionalSeleccionado?.disponibilidades ?? [];

  // Horas disponibles según fecha seleccionada
  const horasDisponibles: DisponibilidadResponseDTO[] = fechaSeleccionada
    ? fechasDisponibles.filter(
        (d) =>
          d.fecha.toISOString().split("T")[0] ===
          fechaSeleccionada.toISOString().split("T")[0]
      )
    : [];

  return (
    <>
      <Navbar />
      <div className="bg-primary w-screen pt-25">
        <h1 className="font-secondary text-2xl font-bold text-center"> Reserva tu turno en {centroSeleccionado.nombre} en 2 simples pasos </h1>
        <div className="px-[45vh] mt-10">
          <p className="font-primary text-left">
            {pasos === 1 ? "Paso 1 de 2" : "Paso 2 de 2"}
          </p>
          <div className="w-[50rem] h-1.5 rounded-full overflow-hidden flex mt-5">
            <div className="w-1/2 bg-secondary"></div>
            <div className={`w-1/2 ${pasos === 1 ? "bg-gray-300" : "bg-secondary"}`}></div>
          </div>

          {/* Paso 1 */}
          {pasos === 1 && (
            <>
              <h2 className="mt-13 font-secondary text-l font-bold"> Selecciona el servicio </h2>
              <select className="w-[50rem] p-2 mt-2 border border-gray-300 rounded-full"
                onChange={(e) => {
                  const s = centroSeleccionado.servicios.find(
                    (s) => s.id === Number(e.target.value)
                  );
                  setServicioSeleccionado(s ?? null);
                  setProfesionalSeleccionado(null);
                }}
                value={servicioSeleccionado ? servicioSeleccionado.id : ""}
              >
                <option value="" disabled>Seleccionar servicio</option>
                {centroSeleccionado.servicios.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.tipoDeServicio}
                  </option>
                ))}
              </select>

              <h2 className="mt-13 font-secondary text-l font-bold">Selecciona el profesional</h2>
              <select className="w-[50rem] p-2 mt-2 border border-gray-300 rounded-full"
                onChange={(e) => {
                  const p = profesionalesFiltrados.find(
                    (p) => p.id === Number(e.target.value)
                  );
                  setProfesionalSeleccionado(p ?? null);
                }}
                value={profesionalSeleccionado ? profesionalSeleccionado.id : ""}
              >
                <option value="" disabled> Seleccionar profesional </option>
                {profesionalesFiltrados.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* Paso 2 */}
          {pasos === 2 && (
            <>
              <h2 className="mt-13 font-secondary text-l font-bold"> Selecciona la fecha </h2>
              <select className="w-[50rem] p-2 mt-2 border border-gray-300 rounded-full"
                onChange={(e) => {
                  const fecha = new Date(e.target.value);
                  setFechaSeleccionada(fecha);
                  setHoraSeleccionada(null);
                }}
                value={
                  fechaSeleccionada
                    ? fechaSeleccionada.toISOString().split("T")[0]
                    : ""
                }
              >
                <option value="" disabled> Seleccionar fecha </option>
                {[...new Set(fechasDisponibles.map((d) => d.fecha.toISOString().split("T")[0]))].map(
                  (f) => (
                    <option key={f} value={f}>
                      {new Date(f).toLocaleDateString()}
                    </option>
                  )
                )}
              </select>

              <h2 className="mt-13 font-secondary text-l font-bold"> Selecciona la hora </h2>
              <select className="w-[50rem] p-2 mt-2 border border-gray-300 rounded-full"
                onChange={(e) => {
                  setHoraSeleccionada(e.target.value);
                }}
                value={horaSeleccionada ?? ""}
              >
                <option value="" disabled> Seleccionar hora </option>
                {horasDisponibles.map((d) => (
                  <option key={d.id} value={d.horaInicio}>
                    {d.horaInicio} - {d.horaFin}
                  </option>
                ))}
              </select>
            </>
          )}

          <div className="flex justify-center items-center mt-15 gap-15">
            <button className="rounded-full bg-secondary px-33 py-2 font-primary"
              onClick={() => {
                if (pasos === 1) {
                  setServicioSeleccionado(null);
                  setProfesionalSeleccionado(null);
                  setFechaSeleccionada(null);
                  setHoraSeleccionada(null);
                  alert("Turno cancelado");
                  navigate("/");
                } else {
                  setPasos(1);
                }
              }}
            >
              {pasos === 1 ? "Cancelar" : "Volver atrás"}
            </button>
            <button className="rounded-full bg-secondary px-33 py-2 font-primary"
              onClick={() => {
                if (pasos === 1) {
                  if (servicioSeleccionado && profesionalSeleccionado) {
                    setPasos(2);
                  } else {
                    alert(
                      "Por favor, selecciona un servicio y un profesional."
                    );
                  }
                } else {
                  if (fechaSeleccionada && horaSeleccionada) {
                    alert(
                      `Turno confirmado con ${profesionalSeleccionado?.nombre} para el servicio ${servicioSeleccionado?.tipoDeServicio} el ${fechaSeleccionada.toLocaleDateString()} a las ${horaSeleccionada}`
                    );
                  } else {
                    alert("Por favor, selecciona fecha y hora.");
                  }
                }
              }}
            >
              {pasos === 1 ? "Siguiente" : "Confirmar turno"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Turnos;