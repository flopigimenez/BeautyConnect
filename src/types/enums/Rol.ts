export const Rol = {
    SUPERADMIN: "SUPERADMIN",
    PRESTADOR_DE_SERVICIO: "PRESTADOR_DE_SERVICIO",
    CLIENTE: "CLIENTE",
} as const;
export type Rol = typeof Rol[keyof typeof Rol];
