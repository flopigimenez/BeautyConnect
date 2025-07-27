export const TipoDeServicio = {
    PELUQUERIA: "PELUQUERIA",
    MANICURA: "MANICURA",
    PEDICURA: "PEDICURA",
    LIMPIEZAFACIAL: "LIMPIEZAFACIAL",
    MASAJES: "MASAJES",
    DEPILACION: "DEPILACION",
    MAQUILLAJE: "MAQUILLAJE",
    BRONCEADO: "BRONCEADO",
    BARBERIA: "BARBERIA",
} as const;
export type TipoDeServicio = typeof TipoDeServicio[keyof typeof TipoDeServicio];
