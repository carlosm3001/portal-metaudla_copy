const BASE = import.meta.env.BASE_URL || "/";

export const PHOTOS_EXACT = {
  carlos: `${BASE}images/team/CARLOS-MARIO-VILLEGAS-A.png`,
  edwin:  `${BASE}images/team/EDWIN-EDUARDO-MILLÁN-ROJAS.png`,
  fredy:  `${BASE}images/team/FREDY-ANTONIO-VERÁSTEGUI-GONZÁLEZ.png`,
};

// Opción 2 — nombres normalizados (recomendado en prod; crear alias en /public/images/team)
export const PHOTOS = {
  carlos: `${BASE}images/team/carlos-mario-villegas-a.png`,
  edwin:  `${BASE}images/team/edwin-eduardo-millan-rojas.png`,
  fredy:  `${BASE}images/team/fredy-antonio-verastegui-gonzalez.png`,
};
