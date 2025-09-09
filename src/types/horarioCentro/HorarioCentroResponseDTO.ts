export interface HorarioCentroResponseDTO {
    id: number;
    diaDesde: string;
    diaHasta: string;
    horaInicio: string; // Formato "HH:mm"
    horaFinalizacion: string; // Formato "HH:mm"
}