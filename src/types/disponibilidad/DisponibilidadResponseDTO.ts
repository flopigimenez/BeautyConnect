export interface DisponibilidadResponseDTO {
    id: number;
    dia: string; // Ejemplo: "Lunes", "Martes", etc.
    horaInicio: string; // Formato "HH:mm"
    horaFinalizacion: string; // Formato "HH:mm"
}