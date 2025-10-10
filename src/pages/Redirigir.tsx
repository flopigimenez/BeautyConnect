import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/store/hooks";
import { Estado } from "../types/enums/Estado";
import { useEffect } from "react";

const Redirigir = () => {
    const centro = useAppSelector((state) => state.miCentro.centro);
    const navigate = useNavigate();

    useEffect(() => {
        if (centro === null || centro === undefined) {
            window.location.reload();
            return;
        }
        redirigirSegunEstado();
    }, [centro, navigate]);

    const redirigirSegunEstado = () => {
        if (centro?.estado === Estado.PENDIENTE) {
            navigate("/PendienteAprobacion");
        } else if (centro?.estado === Estado.RECHAZADO) {
            navigate("/prestador/configPrestador");
            /*Swal.fire({
                icon: "error",
                title: "Lo sentimos",
                text: "Tu solicitud ha sido rechazada. Por favor, corrija la información para reenviar la solicitud.",
                confirmButtonColor: '#a27e8f',
                confirmButtonText: 'Aceptar'    
            }).then(() => {
                navigate("/prestador/configPrestador");
            });*/
        } else if (centro?.estado === Estado.ACEPTADO) {
            navigate("/prestador/panel");
            /*Swal.fire({
                icon: "success",
                title: "¡Felicidades!",
                text: "Tu solicitud ha sido aceptada. Bienvenido a BeautyConnect.",
                confirmButtonColor: '#a27e8f',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                navigate("/prestador/panel");
            });*/
        } else {
            console.warn("Estado desconocido o no manejado: ", centro?.estado);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#FFFBFA] text-[#703F52] font-secondary">
            Redirigiendo...
        </div>
    );   
}

export default Redirigir