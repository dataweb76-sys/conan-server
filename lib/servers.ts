export type ServerSlug = "dragones" | "siptah" | "mazmorras" | "sinmods";

export const SERVERS: Record<ServerSlug, {
  title: string;
  modsCount: number;
  rewardEnter: string;
  rewardShare: string;
}> = {
  dragones: {
    title: "DRAGONES Y DINOSAURIOS",
    modsCount: 25,
    rewardEnter: "Kit inicial + monedas",
    rewardShare: "50 monedas",
  },
  siptah: {
    title: "LOS ANTIGUOS SIPTAH",
    modsCount: 20,
    rewardEnter: "Kit inicial",
    rewardShare: "50 monedas",
  },
  mazmorras: {
    title: "LOS ANTIGUOS MAZMORRAS",
    modsCount: 30,
    rewardEnter: "Kit mazmorrero",
    rewardShare: "100 monedas",
  },
  sinmods: {
    title: "LOS ANTIGUOS SIN MODS",
    modsCount: 0,
    rewardEnter: "Recompensa por entrar",
    rewardShare: "Recompensa por compartir",
  },
};
