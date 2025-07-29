export interface DisponibilidadResponseDTO {
    id: number;
    dia: string; // Ejemplo: "Lunes", "Martes", etc.
    horaInicio: string; // Formato "HH:mm"
    horaFin: string; // Formato "HH:mm"
    profesionalId: number; // ID del profesional asociado
}