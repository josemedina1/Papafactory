import { useState, type ReactNode } from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import Divider from '@mui/material/Divider'
import DarkModeRounded from '@mui/icons-material/DarkModeRounded'
import LightModeRounded from '@mui/icons-material/LightModeRounded'
import LogoutRounded from '@mui/icons-material/LogoutRounded'
import LoginRounded from '@mui/icons-material/LoginRounded'
import MenuRounded from '@mui/icons-material/MenuRounded'
import InventoryRounded from '@mui/icons-material/InventoryRounded'
import StorefrontRounded from '@mui/icons-material/StorefrontRounded'
import CheckRounded from '@mui/icons-material/CheckRounded'
import { useTema, type PreferenciaTema } from './tema'

const OPCIONES_TEMA: { valor: PreferenciaTema; texto: string; icono: ReactNode }[] = [
  { valor: 'claro', texto: 'Modo claro', icono: <LightModeRounded /> },
  { valor: 'oscuro', texto: 'Modo oscuro', icono: <DarkModeRounded /> }
]

// Íconos grandes, con alto contraste y texto de ayuda: la app la usan personas con baja visión.
export default function BarraNavegacion({ titulo, enGestor, usuarioAutenticado, onIrGestor, onVolver, onCerrarSesion, onIniciarSesion, actualizaciones }: {
  titulo: string;
  enGestor: boolean;
  usuarioAutenticado: boolean;
  onIrGestor: () => void;
  onVolver: () => void;
  onCerrarSesion: () => void;
  onIniciarSesion: () => void;
  actualizaciones?: ReactNode;
}) {
  const { preferencia, setPreferencia } = useTema()
  const [anclaMenu, setAnclaMenu] = useState<HTMLElement | null>(null)
  const cerrarMenu = () => setAnclaMenu(null)
  const ejecutar = (accion: () => void) => () => { cerrarMenu(); accion() }

  return (
    <header className={enGestor ? 'barra-nav gestor-header' : 'barra-nav app-header'}>
      <div className="barra-nav-marca">
          <Tooltip title="Menú" arrow>
            <IconButton className="barra-nav-icono" aria-label="Abrir menú" aria-haspopup="true"
              aria-controls={anclaMenu ? 'menu-barra-nav' : undefined} aria-expanded={anclaMenu ? 'true' : undefined}
              onClick={e => setAnclaMenu(e.currentTarget)}>
              <MenuRounded />
            </IconButton>
          </Tooltip>

          <Menu id="menu-barra-nav" anchorEl={anclaMenu} open={!!anclaMenu} onClose={cerrarMenu}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            slotProps={{ paper: { sx: { minWidth: 260, borderRadius: 2 } } }}>
            <ListSubheader sx={{ fontSize: '0.95rem', fontWeight: 700, lineHeight: '40px' }}>Apariencia</ListSubheader>
            {OPCIONES_TEMA.map(opcion => (
              <MenuItem key={opcion.valor} selected={preferencia === opcion.valor} onClick={ejecutar(() => setPreferencia(opcion.valor))}>
                <ListItemIcon>{opcion.icono}</ListItemIcon>
                <ListItemText primary={opcion.texto} />
                {preferencia === opcion.valor && <CheckRounded fontSize="small" aria-label="seleccionado" />}
              </MenuItem>
            ))}
            <Divider />
            {usuarioAutenticado && (enGestor ? (
              <MenuItem onClick={ejecutar(onVolver)}>
                <ListItemIcon><StorefrontRounded /></ListItemIcon>
                <ListItemText primary="Volver al menú de ventas" />
              </MenuItem>
            ) : (
              <MenuItem onClick={ejecutar(onIrGestor)}>
                <ListItemIcon><InventoryRounded /></ListItemIcon>
                <ListItemText primary="Ir al Gestor" />
              </MenuItem>
            ))}
            {usuarioAutenticado ? (
              <MenuItem onClick={ejecutar(onCerrarSesion)} sx={{ color: 'error.main' }}>
                <ListItemIcon sx={{ color: 'inherit' }}><LogoutRounded /></ListItemIcon>
                <ListItemText primary="Cerrar sesión" />
              </MenuItem>
            ) : (
              <MenuItem onClick={ejecutar(onIniciarSesion)}>
                <ListItemIcon><LoginRounded /></ListItemIcon>
                <ListItemText primary="Iniciar sesión" />
              </MenuItem>
            )}
          </Menu>
        <h1 className={enGestor ? 'gestor-title barra-nav-titulo' : 'app-title barra-nav-titulo'}>{titulo}</h1>
      </div>
      <nav className="barra-nav-acciones" aria-label="Opciones de la aplicación">
        {actualizaciones}

        {usuarioAutenticado && (enGestor ? (
          <Tooltip title="Volver al menú" arrow>
          <button type="button" className="barra-nav-boton-principal" aria-label="Volver al menú" onClick={onVolver}>
            <StorefrontRounded aria-hidden="true" />
            <span className="barra-nav-texto">Volver al menú</span>
          </button>
          </Tooltip>
        ) : (
          <Tooltip title="Ir al Gestor" arrow>
          <button type="button" className="barra-nav-boton-principal" aria-label="Ir al Gestor" onClick={onIrGestor}>
            <InventoryRounded aria-hidden="true" />
            <span className="barra-nav-texto">Ir al Gestor</span>
          </button>
          </Tooltip>
        ))}

        {!usuarioAutenticado && (
          <Tooltip title="Iniciar sesión" arrow>
          <button type="button" className="barra-nav-boton-principal" aria-label="Iniciar sesión" onClick={onIniciarSesion}>
            <LoginRounded aria-hidden="true" />
            <span className="barra-nav-texto">Iniciar sesión</span>
          </button>
          </Tooltip>
        )}

      </nav>
    </header>
  )
}
