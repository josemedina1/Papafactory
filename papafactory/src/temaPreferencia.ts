export type PreferenciaTema = 'claro' | 'oscuro'
export type TemaEfectivo = PreferenciaTema

// Por defecto, claro. Un valor antiguo como 'sistema' también se lee como claro.
export function leerPreferenciaTema(valor: string | null): PreferenciaTema {
  return valor === 'oscuro' ? 'oscuro' : 'claro'
}
