export interface DisponibilidadDTO {
    id: number;
    dia: Date; // Ejemplo: "Lunes", "Martes", etc.
    horaInicio: string; // Formato "HH:mm"
    horaFinalizacion: string; // Formato "HH:mm"
}