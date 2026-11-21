import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'

import { leerPreferenciaTema, type PreferenciaTema } from './temaPreferencia'
export type { PreferenciaTema, TemaEfectivo } from './temaPreferencia'

const CLAVE = 'temaPapaFactory'

const TemaContext = createContext<{
  preferencia: PreferenciaTema;
  tema: PreferenciaTema;
  setPreferencia: (p: PreferenciaTema) => void;
}>({ preferencia: 'claro', tema: 'claro', setPreferencia: () => {} })

export function ProveedorTema({ children }: { children: ReactNode }) {
  const [preferencia, setPreferenciaEstado] = useState<PreferenciaTema>(() => {
    try { return leerPreferenciaTema(localStorage.getItem(CLAVE)) } catch { return 'claro' }
  })
  const tema = preferencia

  useEffect(() => {
    const raiz = document.documentElement
    raiz.dataset.theme = tema
    raiz.dataset.bsTheme = tema === 'oscuro' ? 'dark' : 'light'
    raiz.style.colorScheme = tema === 'oscuro' ? 'dark' : 'light'
  }, [tema])

  const setPreferencia = (p: PreferenciaTema) => {
    setPreferenciaEstado(p)
    try { localStorage.setItem(CLAVE, p) } catch { /* se aplica igual en esta sesión */ }
  }

  const temaMui = useMemo(() => createTheme({
    palette: {
      mode: tema === 'oscuro' ? 'dark' : 'light',
      primary: { main: '#FFD700', contrastText: '#000000' },
      error: { main: tema === 'oscuro' ? '#ff6b6b' : '#c62828' }
    },
    typography: { fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
    components: {
      MuiTooltip: {
        styleOverrides: {
          tooltip: { fontSize: '1rem', fontWeight: 600, padding: '8px 12px', backgroundColor: '#111', color: '#fff' },
          arrow: { color: '#111' }
        }
      },
      MuiMenuItem: { styleOverrides: { root: { fontSize: '1.05rem', minHeight: 52 } } }
    }
  }), [tema])

  return (
    <TemaContext.Provider value={{ preferencia, tema, setPreferencia }}>
      <ThemeProvider theme={temaMui}>{children}</ThemeProvider>
    </TemaContext.Provider>
  )
}

export const useTema = () => useContext(TemaContext)
