import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import type { CentroDeEsteticaResponseDTO } from "../types/centroDeEstetica/CentroDeEsteticaResponseDTO";
import { useAppSelector } from "../redux/store/hooks";
import { buildServiciosLabel } from "../utils/servicios";
import type { ClienteResponseDTO } from "../types/cliente/ClienteResponseDTO";
import { Rol } from "../types/enums/Rol";
import { useEffect, useState } from "react";
import { CentroDeEsteticaService } from "../services/CentroDeEsteticaService";
import Navbar from "../components/Navbar";

const diasEnEspanol: Record<string, string> = {
    MONDAY: "Lunes",
    TUESDAY: "Martes",
    WEDNESDAY: "Miércoles",
    THURSDAY: "Jueves",
    FRIDAY: "Viernes",
    SATURDAY: "Sábado",
    SUNDAY: "Domingo",
};

const CentroInfo = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.user.user);
    const [centroSeleccionado, setCentroSeleccionado] = useState<CentroDeEsteticaResponseDTO | null>(null);
    const serviciosSeleccionadosLabel = buildServiciosLabel(centroSeleccionado?.servicios);
    const esCliente = (maybeUser: typeof user): maybeUser is ClienteResponseDTO =>
        !!maybeUser && maybeUser.usuario?.rol === Rol.CLIENTE;
    const clienteDatosCompletos = (cliente: ClienteResponseDTO | null): boolean => {
        if (!cliente) return false;
        const campos = [cliente.nombre, cliente.apellido, cliente.telefono];
        return campos.every((valor) => typeof valor === "string" && valor.trim().length > 0);
    };
    const centroService = new CentroDeEsteticaService();

    useEffect(() => {
        const loadCentro = async () => {
            if (!id) return;
            try {
                const centroId = Number(id);
                if (Number.isNaN(centroId)) {
                    throw new Error("Identificador de centro inválido");
                }
                const centroData = await centroService.getById(centroId);
                if (!centroData) {
                    throw new Error("No se encontró el centro solicitado");
                }
                setCentroSeleccionado(centroData);
            } catch (err) {
                const message =
                    err instanceof Error ? err.message : "No se pudo cargar la información del centro.";
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: message,
                    confirmButtonColor: "#a27e8f",
                }).then(() => {
                    navigate("/Centros");
                });
            }
        }
        void loadCentro();
    }, [id, navigate, centroService])

    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 space-y-8 mt-18">
                <button
                    className="text-secondary font-semibold hover:underline mb-6"
                    onClick={() => navigate(-1)}
                >
                    &larr; Volver
                </button>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">
                    <h1 className="text-3xl font-semibold text-secondary tracking-tight">
                        {centroSeleccionado?.nombre}
                    </h1>

                    <button
                        className="self-start md:self-auto bg-secondary hover:bg-[#b38a9b] text-white rounded-lg px-6 py-2 text-sm font-medium shadow-sm transition"
                        onClick={() => {
                            if (user) {
                                if (esCliente(user)) {
                                    if (!clienteDatosCompletos(user)) {
                                        void Swal.fire({
                                            icon: "info",
                                            title: "Completa tus datos",
                                            text: "Dirigite a Mi Perfil para completar tus datos antes de solicitar un turno.",
                                            showCancelButton: true,
                                            confirmButtonText: "Ir a Mi Perfil",
                                            cancelButtonText: "Cancelar",
                                            confirmButtonColor: "#a27e8f",
                                            cancelButtonColor: "#C19BA8",
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                navigate("/Miperfil");
                                            }
                                        });
                                        return;
                                    }
                                    navigate(`/turno/${centroSeleccionado?.id}`);
                                } else {
                                    void Swal.fire({
                                        icon: "info",
                                        title: "Cuenta no habilitada",
                                        text: "Necesitás iniciar sesión como cliente para solicitar un turno.",
                                        confirmButtonColor: "#a27e8f",
                                    });
                                }
                            } else {
                                navigate("/IniciarSesion");
                                Swal.fire({
                                    icon: "info",
                                    title: "Debes iniciar sesión para pedir un turno",
                                    confirmButtonColor: "#a27e8f",
                                });
                            }
                        }}
                    >
                        Pedir turno
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="relative rounded-xl overflow-hidden shadow-md">
                        <img
                            src={centroSeleccionado?.imagen}
                            alt={centroSeleccionado?.nombre}
                            className="w-full h-120 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>

                    <div className="space-y-5 text-gray-700 text-sm leading-relaxed md:ml-10">
                        <p>
                            <span className="font-semibold text-gray-900 text-lg">Descripción</span><br />
                            {centroSeleccionado?.descripcion}
                        </p>

                        {centroSeleccionado?.domicilio && (
                            <p>
                                <span className="font-semibold text-gray-900 text-lg">Domicilio</span><br />
                                {centroSeleccionado.domicilio.calle} {centroSeleccionado.domicilio.numero},{" "}
                                {centroSeleccionado.domicilio.localidad} – CP{" "}
                                {centroSeleccionado.domicilio.codigoPostal}
                            </p>
                        )}

                        {serviciosSeleccionadosLabel && (
                            <p>
                                <span className="font-semibold text-gray-900 text-lg">Servicios</span><br />
                                {serviciosSeleccionadosLabel}
                            </p>
                        )}
                        {centroSeleccionado?.horariosCentro && centroSeleccionado.horariosCentro.length > 0 && (
                            <div>
                                <p className="font-semibold text-gray-900 mb-1 text-lg">
                                    Horarios de atención
                                </p>
                                <ul className="space-y-1">
                                    {centroSeleccionado.horariosCentro.map((horario, index) => (
                                        <li key={index}>
                                            <span className="font-medium">
                                                {diasEnEspanol[horario.dia]}:
                                            </span>{" "}
                                            {horario.horaMInicio?.slice(0, 5)} - {horario.horaMFinalizacion?.slice(0, 5)} /{" "}
                                            {horario.horaTInicio?.slice(0, 5)} - {horario.horaTFinalizacion?.slice(0, 5)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <button
                            className="mt-4 inline-flex items-center text-secondary font-medium hover:underline"
                            onClick={() =>
                                navigate(`/centros/${centroSeleccionado?.id}/resenias`)
                            }
                        >
                            Ver reseñas →
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CentroInfo