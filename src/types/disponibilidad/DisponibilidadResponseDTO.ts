export interface DisponibilidadResponseDTO {
    id: number;
    fecha: string; // Formato "YYYY-MM-DD"
    horaInicio: string; // Formato "HH:mm"
    horaFinalizacion: string; // Formato "HH:mm"
    disponible: boolean;
}