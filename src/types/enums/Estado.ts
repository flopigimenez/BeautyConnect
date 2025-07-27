export const Estado = {
  PENDIENTE: "PENDIENTE",
  ACEPTADO: "ACEPTADO",
  RECHAZADO: "RECHAZADO",
} as const;

export type Estado = typeof Estado[keyof typeof Estado];
