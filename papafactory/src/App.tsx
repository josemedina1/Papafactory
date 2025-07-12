import { useState, useEffect } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import productos from './productos.json'

// Componente Modal para agregados
function ModalAgregados({ 
  show, 
  onClose, 
  producto, 
  onAgregarAgregado,
  onDecrementarAgregado,
  agregadosExistentes = []
}: { 
  show: boolean; 
  onClose: () => void; 
  producto: Producto | null;
  onAgregarAgregado: (agregado: Agregado) => void;
  onDecrementarAgregado: (nombreAgregado: string) => void;
  agregadosExistentes?: AgregadoEnPedido[];
}) {
  if (!show || !producto) return null;

  const [gramajeSelecionado, setGramajeSelecionado] = useState<string>(producto.tamaño || 'Pequeño');

  const formatearPrecio = (precio: number): string => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio)
  }

  const handleGramajeClick = (gramaje: string) => {
    setGramajeSelecionado(gramaje);
  };

  const handleAgregadoClick = (nombre: string, precio: number, tipo: 'basico' | 'premium') => {
    onAgregarAgregado({
      nombre: nombre,
      precio,
      tipo,
      tamaño: gramajeSelecionado
    });
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCambiarCantidadAgregado = (nombreAgregado: string, cambio: number, tipo: 'basico' | 'premium') => {
    if (cambio > 0) {
      // Incrementar: agregar el agregado
      let precio = 0
      if (tipo === 'basico') {
        precio = productos.productos.agregados_basicos.precios_por_tamaño[gramajeSelecionado as keyof typeof productos.productos.agregados_basicos.precios_por_tamaño]
      } else {
        precio = productos.productos.agregados_premium.precios_por_tamaño[gramajeSelecionado as keyof typeof productos.productos.agregados_premium.precios_por_tamaño]
      }
      
      onAgregarAgregado({
        nombre: nombreAgregado,
        precio,
        tipo,
        tamaño: gramajeSelecionado
      })
    } else if (cambio < 0) {
      // Decrementar: usar la función de decremento
      onDecrementarAgregado(nombreAgregado)
    }
  };

  const getTamañoNombre = (tamaño: string): string => {
    switch (tamaño) {
      case 'Pequeño':
        return 'PEQUEÑAS'
      case 'Mediano':
        return 'MEDIANAS'
      case 'Grande':
        return 'GRANDES'
      default:
        return tamaño
    }
  }

  const gramajes = ['Pequeño', 'Mediano', 'Grande'];

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Agregados Disponibles</h2>
          <button className="btn-cerrar" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="gramajes-section">
            {gramajes.map((gramaje) => (
              <button
                key={gramaje}
                className={`gramaje-btn ${gramajeSelecionado === gramaje ? 'active' : ''}`}
                onClick={() => handleGramajeClick(gramaje)}
              >
                {getTamañoNombre(gramaje)}
              </button>
            ))}
          </div>
          
          <div className="agregados-container">
            <div className="agregados-section">
              <h3>Agregados Básicos</h3>
              <div className="agregados-grid">
                {productos.productos.agregados_basicos.items.map((agregado, index) => {
                  const precio = productos.productos.agregados_basicos.precios_por_tamaño[gramajeSelecionado as keyof typeof productos.productos.agregados_basicos.precios_por_tamaño];
                  const agregadoExistente = agregadosExistentes.find(a => a.nombre === agregado);
                  return (
                                         <div 
                       key={index} 
                       className={`agregado-item ${agregadoExistente ? 'active' : ''}`}
                     >
                       <div className="agregado-info" onClick={() => handleAgregadoClick(agregado, precio, 'basico')}>
                         <span className="agregado-nombre">{agregado}</span>
                         <span className="agregado-precio">{formatearPrecio(precio)}</span>
                       </div>
                       {agregadoExistente && (
                         <div className="agregado-contador">
                           <button 
                             className="btn-contador"
                             onClick={(e) => {
                               e.stopPropagation();
                               handleCambiarCantidadAgregado(agregado, -1, 'basico');
                             }}
                           >
                             -
                           </button>
                           <span className="cantidad-display">{agregadoExistente.cantidad}</span>
                           <button 
                             className="btn-contador"
                             onClick={(e) => {
                               e.stopPropagation();
                               handleCambiarCantidadAgregado(agregado, 1, 'basico');
                             }}
                           >
                             +
                           </button>
                         </div>
                       )}
                     </div>
                  );
                })}
              </div>
            </div>

            <div className="agregados-section">
              <h3>Agregados Premium</h3>
              <div className="agregados-grid">
                {productos.productos.agregados_premium.items.map((agregado, index) => {
                  const precio = productos.productos.agregados_premium.precios_por_tamaño[gramajeSelecionado as keyof typeof productos.productos.agregados_premium.precios_por_tamaño];
                  const agregadoExistente = agregadosExistentes.find(a => a.nombre === agregado);
                  return (
                                         <div 
                       key={index} 
                       className={`agregado-item ${agregadoExistente ? 'active' : ''}`}
                     >
                       <div className="agregado-info" onClick={() => handleAgregadoClick(agregado, precio, 'premium')}>
                         <span className="agregado-nombre">{agregado}</span>
                         <span className="agregado-precio">{formatearPrecio(precio)}</span>
                       </div>
                       {agregadoExistente && (
                         <div className="agregado-contador">
                           <button 
                             className="btn-contador"
                             onClick={(e) => {
                               e.stopPropagation();
                               handleCambiarCantidadAgregado(agregado, -1, 'premium');
                             }}
                           >
                             -
                           </button>
                           <span className="cantidad-display">{agregadoExistente.cantidad}</span>
                           <button 
                             className="btn-contador"
                             onClick={(e) => {
                               e.stopPropagation();
                               handleCambiarCantidadAgregado(agregado, 1, 'premium');
                             }}
                           >
                             +
                           </button>
                         </div>
                       )}
                     </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PedidoGuardado {
  numeroOrden: string;
  fecha: string;
  timestamp: string;
  items: ItemPedido[];
  total: number;
  estado: 'completado' | 'pendiente' | 'cancelado';
}

interface Producto {
  id: string;
  nombre: string;
  tamaño: string;
  precio: number;
  moneda: string;
  descripcion?: string;
}

interface Agregado {
  nombre: string;
  precio: number;
  tamaño: string;
  tipo: 'basico' | 'premium';
}

interface AgregadoEnPedido {
  nombre: string;
  precio: number;
  tamaño: string;
  tipo: 'basico' | 'premium';
  cantidad: number;
}

interface ItemPedido {
  id: string;
  tipo: 'papa' | 'bebida' | 'extra';
  producto: Producto;
  agregados: AgregadoEnPedido[];
  cantidad: number;
  subtotal: number;
}

function App() {
  // Estados para funcionalidades futuras del sistema
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('')
  const [productosActuales, setProductosActuales] = useState<Producto[]>([])
  const [agregadosActuales, setAgregadosActuales] = useState<Agregado[]>([])
  const [tamañoSeleccionado, setTamañoSeleccionado] = useState<string>('')
  const [mostrarTamaños, setMostrarTamaños] = useState<boolean>(false)
  const [mostrarAgregados, setMostrarAgregados] = useState<boolean>(false)
  const [pedidoActual, setPedidoActual] = useState<ItemPedido[]>([])
  const [papaActual, setPapaActual] = useState<Producto | null>(null)

  const [historialPedidos, setHistorialPedidos] = useState<PedidoGuardado[]>([])
  const [mostrarHistorial, setMostrarHistorial] = useState<boolean>(false)
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<PedidoGuardado | null>(null)
  const [showModalAgregados, setShowModalAgregados] = useState<boolean>(false)
  const [productoParaAgregados, setProductoParaAgregados] = useState<Producto | null>(null)
  const [itemEditandoId, setItemEditandoId] = useState<string | null>(null)
  const [mostrarModalAgregadosIndependientes, setMostrarModalAgregadosIndependientes] = useState<boolean>(false)

  // Cargar el último número de orden al iniciar la aplicación
  useEffect(() => {
    cargarHistorialPedidos()
  }, [])



  const cargarHistorialPedidos = async () => {
    try {
      // Intentar cargar desde localStorage
      const historialGuardado = localStorage.getItem('historialPedidosPapaFactory')
      if (historialGuardado) {
        setHistorialPedidos(JSON.parse(historialGuardado))
        console.log('Historial de pedidos cargado exitosamente')
      } else {
        console.log('No hay historial de pedidos guardados')
      }
    } catch (error) {
      console.error('Error al cargar el historial de pedidos:', error)
    }
  }

  const generarNumeroOrden = (): string => {
    const hoy = new Date()
    const diaSemana = hoy.getDay() // 0=Domingo, 1=Lunes, 2=Martes, etc.
    
    // Obtener inicial del día
    let inicialDia = ''
    switch(diaSemana) {
      case 1: inicialDia = 'L'; break // Lunes
      case 2: inicialDia = 'M'; break // Martes  
      case 3: inicialDia = 'W'; break // Miércoles (W para evitar confusión con Martes)
      case 4: inicialDia = 'J'; break // Jueves
      case 5: inicialDia = 'V'; break // Viernes
      case 6: inicialDia = 'S'; break // Sábado
      case 0: inicialDia = 'D'; break // Domingo
      default: inicialDia = 'X'; break
    }
    
    // Obtener fecha en formato YYYY-MM-DD para usar como clave
    const fechaHoy = hoy.toISOString().split('T')[0]
    
    // Cargar contador del día actual
    const claveContador = `contadorOrden_${fechaHoy}`
    let contadorDia = parseInt(localStorage.getItem(claveContador) || '0')
    
    // Incrementar contador
    contadorDia += 1
    
    // Guardar contador actualizado
    localStorage.setItem(claveContador, contadorDia.toString())
    
    // Generar número de orden: L001, M002, etc.
    const numeroOrden = `${inicialDia}${contadorDia.toString().padStart(3, '0')}`
    
    return numeroOrden
  }

  const guardarPedidoEnSistema = async (numeroOrden: string, pedido: ItemPedido[], total: number) => {
    try {
      const fechaActual = new Date()
      const fechaFormateada = fechaActual.toLocaleDateString('es-CL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })

      // Crear el pedido guardado
      const pedidoGuardado: PedidoGuardado = {
        numeroOrden: numeroOrden,
        fecha: fechaFormateada,
        timestamp: fechaActual.toISOString(),
        items: [...pedido], // Copia profunda de los items
        total: total,
        estado: 'completado'
      }

      // Agregar al historial
      const nuevoHistorial = [...historialPedidos, pedidoGuardado]
      setHistorialPedidos(nuevoHistorial)

      // Guardar en localStorage
      localStorage.setItem('historialPedidosPapaFactory', JSON.stringify(nuevoHistorial))

      console.log(`Pedido ${numeroOrden} guardado exitosamente en el sistema`)
      
    } catch (error) {
      console.error('Error al guardar el pedido en el sistema:', error)
      alert('Error al guardar el pedido en el sistema.')
    }
  }

  const obtenerPedidosDelDia = (fecha?: Date): PedidoGuardado[] => {
    const fechaBusqueda = fecha || new Date()
    const fechaStr = fechaBusqueda.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
    
    return historialPedidos.filter(pedido => 
      pedido.fecha.includes(fechaStr.split(',')[0])
    )
  }

  const obtenerEstadisticasDelDia = () => {
    const pedidosHoy = obtenerPedidosDelDia()
    const totalVentas = pedidosHoy.reduce((sum, pedido) => sum + pedido.total, 0)
    const cantidadPedidos = pedidosHoy.length
    
    return {
      cantidadPedidos,
      totalVentas,
      promedioVenta: cantidadPedidos > 0 ? totalVentas / cantidadPedidos : 0
    }
  }

  // Función preparada para selección de categoría papas fritas
  const seleccionarPapasFritas = () => {
    setCategoriaSeleccionada('Papas Fritas')
    setMostrarTamaños(true)
    setMostrarAgregados(false)
    setProductosActuales([])
    setAgregadosActuales([])
    setTamañoSeleccionado('')
    setPapaActual(null)
  }

  // Función preparada para selección de tamaño de papa
  const seleccionarTamañoPapa = (tamaño: string) => {
    setTamañoSeleccionado(tamaño)
    
    // Mostrar la papa del tamaño seleccionado
    const papaSeleccionada = productos.productos.papas_fritas.items.find(
      item => item.tamaño === tamaño
    )
    
    if (papaSeleccionada) {
      setProductosActuales([papaSeleccionada as Producto])
      setPapaActual(papaSeleccionada as Producto)
    }
    
    // Mostrar opciones de agregados
    setMostrarAgregados(true)
    
    // Limpiar agregados actuales
    setAgregadosActuales([])
  }

  // Función preparada para mostrar agregados por tipo
  const mostrarAgregadosPorTipo = (tipo: 'basico' | 'premium') => {
    if (!tamañoSeleccionado) return

    const tipoKey = tipo === 'basico' ? 'agregados_basicos' : 'agregados_premium'
    const agregadosData = productos.productos[tipoKey]
    const precio = agregadosData.precios_por_tamaño[tamañoSeleccionado as keyof typeof agregadosData.precios_por_tamaño]
    
    const agregados: Agregado[] = agregadosData.items.map((item: string) => ({
      nombre: item,
      precio: precio,
      tamaño: tamañoSeleccionado,
      tipo: tipo
    }))
    
    setAgregadosActuales(agregados)
  }

  // Función preparada para mostrar categoría bebidas
  const mostrarBebidas = () => {
    setCategoriaSeleccionada('Bebidas')
    setProductosActuales(productos.productos.bebidas.items as Producto[])
    setAgregadosActuales([])
    setMostrarTamaños(false)
    setMostrarAgregados(false)
    setTamañoSeleccionado('')
    setPapaActual(null)
  }

  // Función preparada para mostrar categoría extras
  const mostrarExtras = () => {
    setCategoriaSeleccionada('Extras')
    setProductosActuales(productos.productos.extras.items as Producto[])
    setAgregadosActuales([])
    setMostrarTamaños(false)
    setMostrarAgregados(false)
    setTamañoSeleccionado('')
    setPapaActual(null)
  }

  const calcularSubtotalItem = (item: ItemPedido): number => {
    const precioAgregados = item.agregados.reduce((total, agregado) => 
      total + (agregado.precio * agregado.cantidad), 0
    )
    return item.producto.precio + precioAgregados
  }

  // Función preparada para agregar papa específica al pedido
  const agregarPapaAlPedido = (producto: Producto) => {
    const nuevoItem: ItemPedido = {
      id: `papa-${Date.now()}`,
      tipo: 'papa',
      producto: producto,
      agregados: [],
      cantidad: 1,
      subtotal: producto.precio
    }
    
    setPedidoActual([...pedidoActual, nuevoItem])
  }

  // Función preparada para agregar agregado a papa específica
  const agregarAgregadoAlPedido = (agregado: Agregado) => {
    if (!papaActual) return

    // Buscar si ya existe una papa del mismo tamaño en el pedido
    const indicePapa = pedidoActual.findIndex(item => 
      item.tipo === 'papa' && 
      item.producto.tamaño === agregado.tamaño &&
      item.agregados.length < 15 // Límite de tipos de agregados por papa
    )

    if (indicePapa !== -1) {
      // Verificar si el agregado ya existe en esta papa
      const pedidoActualizado = [...pedidoActual]
      const indiceAgregado = pedidoActualizado[indicePapa].agregados.findIndex(
        a => a.nombre === agregado.nombre
      )

      if (indiceAgregado !== -1) {
        // Si ya existe, aumentar la cantidad
        pedidoActualizado[indicePapa].agregados[indiceAgregado].cantidad += 1
      } else {
        // Si no existe, agregarlo con cantidad 1
        const nuevoAgregado: AgregadoEnPedido = {
          ...agregado,
          cantidad: 1
        }
        pedidoActualizado[indicePapa].agregados.push(nuevoAgregado)
      }

      // Recalcular subtotal
      pedidoActualizado[indicePapa].subtotal = calcularSubtotalItem(pedidoActualizado[indicePapa])
      setPedidoActual(pedidoActualizado)
    } else {
      // Crear nueva papa con el agregado
      const nuevoAgregado: AgregadoEnPedido = {
        ...agregado,
        cantidad: 1
      }
      const nuevoItem: ItemPedido = {
        id: `papa-${Date.now()}`,
        tipo: 'papa',
        producto: papaActual,
        agregados: [nuevoAgregado],
        cantidad: 1,
        subtotal: papaActual.precio + agregado.precio
      }
      setPedidoActual([...pedidoActual, nuevoItem])
    }
  }

  // Función preparada para modificar cantidad de agregados
  const modificarCantidadAgregado = (itemId: string, nombreAgregado: string, cambio: number) => {
    const pedidoActualizado = pedidoActual.map(item => {
      if (item.id === itemId) {
        const agregadosActualizados = item.agregados.map(agregado => {
          if (agregado.nombre === nombreAgregado) {
            const nuevaCantidad = Math.max(0, agregado.cantidad + cambio)
            return { ...agregado, cantidad: nuevaCantidad }
          }
          return agregado
        }).filter(agregado => agregado.cantidad > 0) // Eliminar agregados con cantidad 0

        const itemActualizado = {
          ...item,
          agregados: agregadosActualizados
        }
        
        // Recalcular subtotal
        itemActualizado.subtotal = calcularSubtotalItem(itemActualizado)
        return itemActualizado
      }
      return item
    })

    setPedidoActual(pedidoActualizado)
  }

  const agregarProductoAlPedido = (producto: Producto) => {
    // Si es una papa frita, abrir modal de agregados
    if (producto.id.includes('papas_')) {
      // Crear el item inmediatamente en el pedido
      const nuevoItem: ItemPedido = {
        id: `${producto.id}-${Date.now()}`,
        tipo: 'papa',
        producto: producto,
        agregados: [],
        cantidad: 1,
        subtotal: producto.precio
      }
      
      setPedidoActual([...pedidoActual, nuevoItem])
      setProductoParaAgregados(producto)
      setItemEditandoId(nuevoItem.id)
      setShowModalAgregados(true)
      return
    }

    // Para bebestibles y extras, agregar directamente
    const nuevoItem: ItemPedido = {
      id: `${producto.id}-${Date.now()}`,
      tipo: producto.id.includes('agua_') || producto.id.includes('bebida_') || producto.id.includes('red_bull') || producto.id.includes('score_') || producto.id.includes('jugo_') ? 'bebida' : 'extra',
      producto: producto,
      agregados: [],
      cantidad: 1,
      subtotal: producto.precio
    }
    
    setPedidoActual([...pedidoActual, nuevoItem])
  }

  const handleAgregarAgregado = (agregado: Agregado) => {
    if (!itemEditandoId) return

    const pedidoActualizado = pedidoActual.map(item => {
      if (item.id === itemEditandoId) {
        // Verificar si el agregado ya existe
        const indiceAgregado = item.agregados.findIndex(a => a.nombre === agregado.nombre)

        if (indiceAgregado !== -1) {
          // Si ya existe, aumentar la cantidad
          const agregadosActualizados = [...item.agregados]
          agregadosActualizados[indiceAgregado] = {
            ...agregadosActualizados[indiceAgregado],
            cantidad: agregadosActualizados[indiceAgregado].cantidad + 1
          }
          
          const itemActualizado = {
            ...item,
            agregados: agregadosActualizados
          }
          
          itemActualizado.subtotal = calcularSubtotalItem(itemActualizado)
          return itemActualizado
        } else {
          // Si no existe, agregarlo con cantidad 1
          const nuevoAgregado: AgregadoEnPedido = {
            ...agregado,
            cantidad: 1
          }
          
          const itemActualizado = {
            ...item,
            agregados: [...item.agregados, nuevoAgregado]
          }
          
          itemActualizado.subtotal = calcularSubtotalItem(itemActualizado)
          return itemActualizado
        }
      }
      return item
    })

    setPedidoActual(pedidoActualizado)
  }

  const handleItemClick = (item: ItemPedido) => {
    // Solo mostrar modal para papas fritas
    if (item.producto.id.includes('papas_')) {
      setProductoParaAgregados(item.producto)
      setItemEditandoId(item.id)
      setShowModalAgregados(true)
    }
  }

  const handleDecrementarAgregado = (nombreAgregado: string) => {
    if (!itemEditandoId) return

    const pedidoActualizado = pedidoActual.map(item => {
      if (item.id === itemEditandoId) {
        const agregadosActualizados = item.agregados.map(agregado => {
          if (agregado.nombre === nombreAgregado) {
            const nuevaCantidad = Math.max(0, agregado.cantidad - 1)
            return { ...agregado, cantidad: nuevaCantidad }
          }
          return agregado
        }).filter(agregado => agregado.cantidad > 0) // Eliminar agregados con cantidad 0

        const itemActualizado = {
          ...item,
          agregados: agregadosActualizados
        }
        
        // Recalcular subtotal
        itemActualizado.subtotal = calcularSubtotalItem(itemActualizado)
        return itemActualizado
      }
      return item
    })

    setPedidoActual(pedidoActualizado)
  }

  const eliminarDelPedido = (id: string) => {
    setPedidoActual(pedidoActual.filter(item => item.id !== id))
  }

  const calcularTotal = (): number => {
    return pedidoActual.reduce((total, item) => total + item.subtotal, 0)
  }

  const formatearPrecio = (precio: number): string => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio)
  }

  // Función preparada para limpiar selección
  const limpiarSeleccion = () => {
    setCategoriaSeleccionada('')
    setProductosActuales([])
    setAgregadosActuales([])
    setTamañoSeleccionado('')
    setMostrarTamaños(false)
    setMostrarAgregados(false)
    setPapaActual(null)
  }

  // Función preparada para limpiar pedido
  const limpiarPedido = () => {
    setPedidoActual([])
  }

  const procesarPedido = () => {
    if (pedidoActual.length === 0) {
      alert('No hay productos en el pedido para procesar')
      return
    }
    
    const nuevaOrden = generarNumeroOrden()
    
    // Guardar el pedido en el sistema
    guardarPedidoEnSistema(nuevaOrden, pedidoActual, calcularTotal())
    
    // Imprimir directamente
    imprimirOrdenDirecta(nuevaOrden)
    
    // Limpiar el pedido después de un breve delay
    setTimeout(() => {
      setPedidoActual([])
    }, 1000)
  }



  const imprimirOrdenDirecta = (ordenNumero: string) => {
    if (pedidoActual.length === 0) {
      alert('No hay orden para imprimir')
      return
    }

    // Generar documento con 2 páginas
    imprimirDocumentoCompleto(ordenNumero, pedidoActual, calcularTotal())
  }

  const imprimirDocumentoCompleto = (ordenNumero: string, items: ItemPedido[], total: number) => {
    const fechaActual = new Date()
    const fechaFormateada = fechaActual.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })

    let documentoCompleto = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Orden Papa Factory - ${ordenNumero}</title>
    <style>
        @media print {
            body { margin: 0; padding: 0; }
            .no-print { display: none; }
            @page { 
                margin: 0; 
                size: 80mm auto; 
            }
        }
        body {
            font-family: 'Courier New', monospace;
            margin: 0;
            padding: 0;
            width: 80mm;
            font-weight: bold;
        }
        
        /* PÁGINA 1 - COPIA CLIENTE (MÍNIMA) */
        .pagina-cliente {
            page-break-after: always;
            width: 80mm;
            text-align: center;
            padding: 10mm 5mm;
            font-size: 16px;
            min-height: 40mm;
            font-weight: bold;
        }
        .numero-ticket {
            font-size: 24px;
            font-weight: bold;
            border: 3px solid #000;
            padding: 10mm;
            margin: 5mm 0;
            background-color: #f0f0f0;
        }
        
        /* PÁGINA 2 - COPIA COMERCIO (DETALLADA) */
        .pagina-comercio {
            width: 80mm;
            padding: 3mm;
            font-size: 10px;
            line-height: 1.2;
            font-weight: bold;
        }
        .header-comercio {
            text-align: center;
            border-bottom: 1px solid #000;
            padding-bottom: 2mm;
            margin-bottom: 3mm;
            font-weight: bold;
        }
        .logo-comercio {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 1mm;
        }
        .info-empresa {
            font-size: 8px;
            margin-bottom: 1mm;
            font-weight: bold;
        }
        .tipo-copia-comercio {
            background-color: #000;
            color: white;
            padding: 2mm;
            margin: 3mm 0;
            font-weight: bold;
            font-size: 10px;
            text-align: center;
        }
        .orden-info-comercio {
            background-color: #f0f0f0;
            text-align: center;
            font-weight: bold;
            padding: 2mm;
            margin: 2mm 0;
            border: 1px solid #000;
            font-size: 12px;
        }
        .fecha-comercio {
            text-align: center;
            font-size: 8px;
            margin-bottom: 3mm;
            font-weight: bold;
        }
        .item {
            margin-bottom: 2mm;
            border-bottom: 1px dotted #999;
            padding-bottom: 1mm;
            font-weight: bold;
        }
        .item-principal {
            font-weight: bold;
            font-size: 9px;
            display: flex;
            justify-content: space-between;
            margin-bottom: 1mm;
        }
        .agregado {
            font-size: 8px;
            margin-left: 3mm;
            display: flex;
            justify-content: space-between;
            color: #000;
            margin-bottom: 1mm;
            font-weight: bold;
        }
        .total-section {
            border-top: 2px solid #000;
            margin-top: 3mm;
            padding-top: 2mm;
            font-weight: bold;
        }
        .total {
            font-size: 12px;
            font-weight: bold;
            text-align: center;
            background-color: #f0f0f0;
            color: #000;
            border: 2px solid #000;
            padding: 2mm;
            margin: 2mm 0;
        }
        .footer {
            text-align: center;
            font-size: 8px;
            margin-top: 3mm;
            border-top: 1px solid #999;
            padding-top: 2mm;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <!-- PÁGINA 1: COPIA CLIENTE (SOLO NÚMERO) -->
    <div class="pagina-cliente">
        <div class="numero-ticket">
            ${ordenNumero}
        </div>
    </div>

    <!-- PÁGINA 2: COPIA COMERCIO (DETALLADA) -->
    <div class="pagina-comercio">
        <div class="header-comercio">
            <div class="logo-comercio">PAPA FACTORY</div>
        </div>
        
        <div class="tipo-copia-comercio">
            COPIA COMERCIO
        </div>
        
        <div class="orden-info-comercio">
            ORDEN N° ${ordenNumero}
        </div>
        
        <div class="fecha-comercio">${fechaFormateada}</div>
        
        <div class="items">
`

    // Agregar cada item del pedido en la página del comercio
    items.forEach((item) => {
      documentoCompleto += `
        <div class="item">
            <div class="item-principal">
                <span>${item.producto.nombre}</span>
                <span>${formatearPrecio(item.producto.precio)}</span>
            </div>
`
      
      // Agregar agregados si los hay
      if (item.agregados.length > 0) {
        item.agregados.forEach(agregado => {
          const subtotalAgregado = agregado.precio * agregado.cantidad
          documentoCompleto += `
            <div class="agregado">
                <span>${agregado.nombre} x${agregado.cantidad}</span>
                <span>${formatearPrecio(subtotalAgregado)}</span>
            </div>
`
        })
      }
      
      documentoCompleto += `
        </div>
`
    })

    // Agregar total y footer
    documentoCompleto += `
        </div>
        
        <div class="total-section">
            <div class="total">
                TOTAL: ${formatearPrecio(total)}
            </div>
        </div>
    </div>
</body>
</html>
`

    // Crear nueva ventana e imprimir documento completo
    const ventanaImpresion = window.open('', '_blank', 'width=400,height=600')
    if (ventanaImpresion) {
      ventanaImpresion.document.write(documentoCompleto)
      ventanaImpresion.document.close()
      
      ventanaImpresion.onload = () => {
        ventanaImpresion.print()
        ventanaImpresion.close()
      }
    }
  }





  // Función preparada para abrir historial (funcionalidad futura)
  const abrirHistorial = () => {
    setMostrarHistorial(true)
  }

  const cerrarHistorial = () => {
    setMostrarHistorial(false)
    setPedidoSeleccionado(null)
  }

  const verDetallePedidoHistorial = (pedido: PedidoGuardado) => {
    setPedidoSeleccionado(pedido)
  }

  const cerrarDetallePedidoHistorial = () => {
    setPedidoSeleccionado(null)
  }

  const imprimirPedidoHistorial = () => {
    if (!pedidoSeleccionado) {
      alert('No hay pedido seleccionado para imprimir')
      return
    }

    // Generar documento con 2 páginas desde historial
    imprimirDocumentoCompletoHistorial(pedidoSeleccionado)
  }

  const imprimirDocumentoCompletoHistorial = (pedido: PedidoGuardado) => {
    const fechaFormateada = new Date(pedido.timestamp).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })

    let documentoCompleto = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reimpresión - ${pedido.numeroOrden}</title>
    <style>
        @media print {
            body { margin: 0; padding: 0; }
            .no-print { display: none; }
            @page { 
                margin: 0; 
                size: 80mm auto; 
            }
        }
        body {
            font-family: 'Courier New', monospace;
            margin: 0;
            padding: 0;
            width: 80mm;
            font-weight: bold;
        }
        
        /* PÁGINA 1 - COPIA CLIENTE (MÍNIMA) */
        .pagina-cliente {
            page-break-after: always;
            width: 80mm;
            text-align: center;
            padding: 10mm 5mm;
            font-size: 16px;
            min-height: 40mm;
            font-weight: bold;
        }
        .numero-ticket {
            font-size: 24px;
            font-weight: bold;
            border: 3px solid #000;
            padding: 10mm;
            margin: 5mm 0;
            background-color: #f0f0f0;
        }
        .reimpresion-marca {
            font-size: 10px;
            margin-top: 5mm;
            color: #666;
            font-weight: bold;
        }
        
        /* PÁGINA 2 - COPIA COMERCIO (DETALLADA) */
        .pagina-comercio {
            width: 80mm;
            padding: 3mm;
            font-size: 10px;
            line-height: 1.2;
            font-weight: bold;
        }
        .header-comercio {
            text-align: center;
            border-bottom: 1px solid #000;
            padding-bottom: 2mm;
            margin-bottom: 3mm;
            font-weight: bold;
        }
        .logo-comercio {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 1mm;
        }
        .info-empresa {
            font-size: 8px;
            margin-bottom: 1mm;
            font-weight: bold;
        }
        .tipo-copia-comercio {
            background-color: #000;
            color: white;
            padding: 2mm;
            margin: 3mm 0;
            font-weight: bold;
            font-size: 10px;
            text-align: center;
        }
        .orden-info-comercio {
            background-color: #f0f0f0;
            text-align: center;
            font-weight: bold;
            padding: 2mm;
            margin: 2mm 0;
            border: 1px solid #000;
            font-size: 12px;
        }
        .fecha-comercio {
            text-align: center;
            font-size: 8px;
            margin-bottom: 3mm;
            font-weight: bold;
        }
        .item {
            margin-bottom: 2mm;
            border-bottom: 1px dotted #999;
            padding-bottom: 1mm;
            font-weight: bold;
        }
        .item-principal {
            font-weight: bold;
            font-size: 9px;
            display: flex;
            justify-content: space-between;
            margin-bottom: 1mm;
        }
        .agregado {
            font-size: 8px;
            margin-left: 3mm;
            display: flex;
            justify-content: space-between;
            color: #000;
            margin-bottom: 1mm;
            font-weight: bold;
        }
        .total-section {
            border-top: 2px solid #000;
            margin-top: 3mm;
            padding-top: 2mm;
            font-weight: bold;
        }
        .total {
            font-size: 12px;
            font-weight: bold;
            text-align: center;
            background-color: #f0f0f0;
            color: #000;
            border: 2px solid #000;
            padding: 2mm;
            margin: 2mm 0;
        }
        .footer {
            text-align: center;
            font-size: 8px;
            margin-top: 3mm;
            border-top: 1px solid #999;
            padding-top: 2mm;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <!-- PÁGINA 1: COPIA CLIENTE (SOLO NÚMERO) -->
    <div class="pagina-cliente">
        <div class="numero-ticket">
            ${pedido.numeroOrden}
        </div>
        <div class="reimpresion-marca">REIMPRESIÓN</div>
    </div>

    <!-- PÁGINA 2: COPIA COMERCIO (DETALLADA) -->
    <div class="pagina-comercio">
        <div class="header-comercio">
            <div class="logo-comercio">PAPA FACTORY</div>
            <div class="info-empresa">Las mejores papas fritas</div>
            <div class="info-empresa">Tel: (56) 9 1234 5678</div>
        </div>
        
        <div class="tipo-copia-comercio">
            COPIA COMERCIO (REIMPRESIÓN)
        </div>
        
        <div class="orden-info-comercio">
            ORDEN N° ${pedido.numeroOrden}
        </div>
        
        <div class="fecha-comercio">${fechaFormateada}</div>
        
        <div class="items">
`

    // Agregar cada item del pedido en la página del comercio
    pedido.items.forEach((item) => {
      documentoCompleto += `
        <div class="item">
            <div class="item-principal">
                <span>${item.producto.nombre}</span>
                <span>${formatearPrecio(item.producto.precio)}</span>
            </div>
`
      
      // Agregar agregados si los hay
      if (item.agregados.length > 0) {
        item.agregados.forEach(agregado => {
          const subtotalAgregado = agregado.precio * agregado.cantidad
          documentoCompleto += `
            <div class="agregado">
                <span>${agregado.nombre} x${agregado.cantidad}</span>
                <span>${formatearPrecio(subtotalAgregado)}</span>
            </div>
`
        })
      }
      
      documentoCompleto += `
        </div>
`
    })

    // Agregar total y footer
    documentoCompleto += `
        </div>
        
        <div class="total-section">
            <div class="total">
                TOTAL: ${formatearPrecio(pedido.total)}
            </div>
        </div>
        
        <div class="footer">
            <div>¡Gracias por su preferencia!</div>
            <div>Síguenos en nuestras redes sociales</div>
            <div>@papafactory</div>
        </div>
    </div>
</body>
</html>
`

    // Crear nueva ventana e imprimir documento completo
    const ventanaImpresion = window.open('', '_blank', 'width=400,height=600')
    if (ventanaImpresion) {
      ventanaImpresion.document.write(documentoCompleto)
      ventanaImpresion.document.close()
      
      ventanaImpresion.onload = () => {
        ventanaImpresion.print()
        ventanaImpresion.close()
      }
    }
  }

  const getImagenPapa = (tamaño: string) => {
    switch(tamaño) {
      case 'Pequeño':
        return 'https://www.lavanguardia.com/files/og_thumbnail/uploads/2020/08/19/5f3d3a3f2bea3.jpeg'
      case 'Mediano':
        return 'https://buendia-pro-app.s3.eu-west-3.amazonaws.com/s3fs-public/styles/highlight_large/public/2020-05/bruselas-guia-comer-dormir-comer-patatas-fritas-cono_0.jpg.webp?VersionId=V3iFMz8GEYQEXbD38DcnP_HYcICagaoO&itok=xGh7mylF'
      case 'Grande':
        return 'https://i0.wp.com/foodandpleasure.com/wp-content/uploads/2022/06/papas-fritas-cdmx-frituurmx-1-e1656219926660.jpg?fit=1080%2C901&ssl=1'
      default:
        return 'https://www.lavanguardia.com/files/og_thumbnail/uploads/2020/08/19/5f3d3a3f2bea3.jpeg'
    }
  }

  const getImagenBebida = (id: string) => {
    switch(id) {
      case 'agua_mineral_500ml':
        return 'https://www.meshi.cl/wp-content/uploads/2024/07/como-e-feito-o-envase-de-agua-mineral.jpg'
      case 'bebida_lata_350ml':
        return 'https://delivery.pwcc.cl/wp-content/uploads/2020/08/Bebidas.png'
      case 'red_bull_250ml':
        return 'https://santaisabel.vtexassets.com/arquivos/ids/496384/Bebida-Energetica-Red-Bull-Tradicional-Lata-355-ml.jpg?v=638814648562030000'
      case 'bebida_botella_591ml':
        return 'https://socomepcl.cl/wp-content/uploads/2022/10/CCU-ZERO-PET-500CC-VARIEDADES.jpg'
      case 'score_energetica_500ml':
        return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr9OhfgjLzBt0ercTKtGdYAao1_Io7vIXWkg&s'
      case 'jugo_botella_300ml':
        return 'https://d1ks0wbvjr3pux.cloudfront.net/4dfd13fa-8b39-4b79-9fe5-ff4d72fd04f1-md.jpg'
      default:
        return 'https://www.meshi.cl/wp-content/uploads/2024/07/como-e-feito-o-envase-de-agua-mineral.jpg'
    }
  }

  const getImagenExtra = (id: string) => {
    switch(id) {
      case 'caja':
        return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7TpCbCf3S-e2DFn14ASq3GjD_5-5WMVQx6g&s'
      case 'bolsa_papel':
        return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDZk377PpbrQ0YgpwMFx0VgDpOoeu3UM0Pzg&s'
      case 'pocillo_plastico':
        return 'https://cdnx.jumpseller.com/empak2/image/50073130/resize/500/500?1719263649'
      case 'pack_delivery':
        return 'https://cdnx.jumpseller.com/insumitus/image/36827194/resize/540/540?1708521257'
      default:
        return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7TpCbCf3S-e2DFn14ASq3GjD_5-5WMVQx6g&s'
    }
  }

  // Función preparada para convertir tamaño a nombre (funcionalidad futura)
  const getTamañoNombre = (tamaño: string): string => {
    switch (tamaño) {
      case 'Pequeño':
        return 'PEQUEÑAS'
      case 'Mediano':
        return 'MEDIANAS'
      case 'Grande':
        return 'GRANDES'
      default:
        return tamaño
    }
  }

  const getTamañoParaPedido = (tamaño: string): string => {
    switch (tamaño) {
      case 'Pequeño':
        return 'PEQUEÑAS'
      case 'Mediano':
        return 'MEDIANAS'
      case 'Grande':
        return 'GRANDES'
      default:
        return tamaño
    }
  }

  // Funciones para manejar agregados independientes
  const abrirModalAgregadosIndependientes = () => {
    setMostrarModalAgregadosIndependientes(true)
  }

  const cerrarModalAgregadosIndependientes = () => {
    setMostrarModalAgregadosIndependientes(false)
  }

  const agregarAgregadoIndependiente = (agregado: Agregado) => {
    // Crear un producto temporal para el agregado independiente
    const productoAgregado: Producto = {
      id: `agregado_independiente_${Date.now()}`,
      nombre: agregado.nombre,
      tamaño: agregado.tamaño,
      precio: agregado.precio,
      moneda: 'CLP'
    }

    // Crear el item del pedido para el agregado independiente
    const nuevoItem: ItemPedido = {
      id: `item_${Date.now()}_${Math.random()}`,
      tipo: 'extra',
      producto: productoAgregado,
      agregados: [],
      cantidad: 1,
      subtotal: agregado.precio
    }

    // Agregar al pedido actual
    setPedidoActual(prevPedido => [...prevPedido, nuevoItem])
  }

  // Funciones y variables preparadas para uso futuro - evitar errores de TypeScript
  const _unused = {
    categoriaSeleccionada,
    productosActuales,
    agregadosActuales,
    mostrarTamaños,
    mostrarAgregados,
    seleccionarPapasFritas,
    seleccionarTamañoPapa,
    mostrarAgregadosPorTipo,
    mostrarBebidas,
    mostrarExtras,
    agregarPapaAlPedido,
    agregarAgregadoAlPedido,
    modificarCantidadAgregado,
    limpiarSeleccion,
    limpiarPedido,
    abrirHistorial,
    getTamañoNombre
  }
  void _unused // Suprimir warning de variable no utilizada

  return (
    <>
      {/* Header simple */}
      <div className="app-header">
        <h1 className="app-title">PAPA FACTORY</h1>
      </div>

      {/* Layout principal de 2 columnas */}
      <div className="main-layout">
        {/* Columna del menú (izquierda) */}
        <div className="menu-column">
          {/* Sección Papas Fritas */}
          <div className="section-title">PAPAS FRITAS</div>
          <div className="papas-grid">
            {productos.productos.papas_fritas.items.map((papa) => (
              <div 
                key={papa.id} 
                className="papa-card"
                onClick={() => agregarProductoAlPedido(papa as Producto)}
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${getImagenPapa(papa.tamaño)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  color: 'white'
                }}
              >
                <h5>{papa.nombre.toUpperCase()}</h5>
                <div className="size" style={{
                  backgroundColor: 'rgba(255, 215, 0, 0.9)',
                  color: '#000',
                  padding: '3px 6px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '11px',
                  display: 'inline-block',
                  textShadow: 'none',
                  border: '1px solid rgba(0,0,0,0.2)'
                }}>{getTamañoParaPedido(papa.tamaño || '')}</div>
                <div className="price">{formatearPrecio(papa.precio)}</div>
              </div>
            ))}
          </div>

          {/* Sección Bebestibles */}
          <div className="section-title">BEBESTIBLES</div>
          <div className="bebestibles-grid">
            {productos.productos.bebidas.items.map((bebida) => (
              <div 
                key={bebida.id} 
                className="bebida-card"
                onClick={() => agregarProductoAlPedido(bebida as Producto)}
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${getImagenBebida(bebida.id)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  color: 'white'
                }}
              >
                <h6>{bebida.nombre}</h6>
                <div className="size">{bebida.tamaño}</div>
                <div className="price">{formatearPrecio(bebida.precio)}</div>
              </div>
            ))}
          </div>

          {/* Sección Extras */}
          <div className="section-title">EXTRAS</div>
          <div className="extras-grid">
            {/* Botón de Agregados Independientes */}
            <div 
              className="extra-card"
              onClick={abrirModalAgregadosIndependientes}
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop&crop=center)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: 'white'
              }}
            >
              <h6>AGREGADOS</h6>
              <div style={{ 
                fontSize: '10px', 
                margin: '2px 0', 
                textAlign: 'center',
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
              }}>
                Comprar agregados independientes
              </div>
              <div className="price">Desde $700</div>
            </div>
            {productos.productos.extras.items.map((extra) => (
              <div 
                key={extra.id} 
                className="extra-card"
                onClick={() => agregarProductoAlPedido(extra as Producto)}
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${getImagenExtra(extra.id)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  color: 'white'
                }}
              >
                <h6>{extra.nombre}</h6>
                {extra.descripcion && (
                  <div style={{ 
                    fontSize: '10px', 
                    margin: '2px 0', 
                    textAlign: 'center',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                  }}>
                    {extra.descripcion}
                  </div>
                )}
                <div className="price">{formatearPrecio(extra.precio)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Columna del pedido (derecha) */}
        <div className="pedido-column">
          <div className="pedido-header">
            <div className="pedido-title">PEDIDO ACTUAL</div>
          </div>

          <div className="pedido-items">
            {pedidoActual.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#666', marginTop: '50px' }}>
                <p>No hay productos en el pedido</p>
              </div>
            ) : (
              pedidoActual.map((item) => (
                <div 
                  key={item.id} 
                  className={`pedido-item ${item.producto.id.includes('papas_') ? 'clickeable' : ''}`}
                  onClick={() => handleItemClick(item)}
                  style={{ cursor: item.producto.id.includes('papas_') ? 'pointer' : 'default' }}
                >
                  <div className="pedido-item-info">
                    <h6>
                      {item.producto.id.includes('papas_') 
                        ? `Papas Fritas ${getTamañoParaPedido(item.producto.tamaño || '')}` 
                        : item.producto.nombre}
                    </h6>
                    <div className="item-details">
                      {!item.producto.id.includes('papas_') && item.producto.tamaño}
                      {item.agregados.length > 0 && (
                                                   <div className="agregados-list">
                            {item.agregados.map((agregado, index) => (
                              <div key={index} className="agregado-en-pedido">
                                {agregado.nombre} x{agregado.cantidad}
                              </div>
                            ))}
                          </div>
                      )}
                    </div>
                  </div>
                  <div className="pedido-item-price">
                    {formatearPrecio(item.subtotal)}
                  </div>
                  <button 
                    className="btn-remove-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      eliminarDelPedido(item.id);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

          {pedidoActual.length > 0 && (
            <>
              <div className="pedido-total">
                <div className="total-label">Total:</div>
                <div className="total-amount">{formatearPrecio(calcularTotal())}</div>
              </div>

              <button 
                className="btn-finalizar"
                onClick={procesarPedido}
              >
                Finalizar Pedido
              </button>
            </>
          )}
        </div>
      </div>



      {/* Modal de Historial de Pedidos */}
      {mostrarHistorial && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            background: 'var(--papa-white)',
            borderRadius: '15px',
            padding: '2rem',
            maxWidth: '800px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            border: '3px solid var(--papa-yellow)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
          }}>
            {/* Header del Modal de Historial */}
            <div className="modal-header text-center mb-4" style={{
              background: 'linear-gradient(135deg, var(--papa-black) 0%, var(--papa-gray-dark) 100%)',
              color: 'var(--papa-yellow)',
              padding: '1rem',
              borderRadius: '10px',
              margin: '-2rem -2rem 2rem -2rem'
            }}>
              <h3 className="mb-0" style={{fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'}}>
                📊 HISTORIAL DE PEDIDOS
              </h3>
            </div>

            {/* Lista de pedidos */}
            <div className="historial-pedidos" style={{maxHeight: '50vh', overflow: 'auto'}}>
              {historialPedidos.length === 0 ? (
                <div className="text-center" style={{color: 'var(--papa-gray-dark)', padding: '2rem'}}>
                  <p>No hay pedidos registrados</p>
                </div>
              ) : (
                historialPedidos.map((pedido) => (
                  <div key={pedido.numeroOrden} className="pedido-historial mb-3" style={{
                    background: 'var(--papa-gray-light)',
                    border: '2px solid var(--papa-border)',
                    borderRadius: '8px',
                    padding: '1rem',
                    cursor: 'pointer'
                  }}
                  onClick={() => verDetallePedidoHistorial(pedido)}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1" style={{color: 'var(--papa-black)', fontWeight: 'bold'}}>
                          Orden N° {pedido.numeroOrden}
                        </h6>
                        <p className="mb-0 small" style={{color: 'var(--papa-gray-dark)'}}>
                          {pedido.fecha} - {pedido.items.length} item(s)
                        </p>
                      </div>
                      <div className="text-end">
                        <div style={{color: 'var(--papa-black)', fontWeight: 'bold', fontSize: '1.1rem'}}>
                          {formatearPrecio(pedido.total)}
                        </div>
                        <small style={{color: pedido.estado === 'completado' ? 'green' : 'orange'}}>
                          {pedido.estado}
                        </small>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Estadísticas del día */}
            {historialPedidos.length > 0 && (
              <div className="estadisticas-dia mt-4" style={{
                background: 'var(--papa-yellow-light)',
                border: '2px solid var(--papa-yellow-dark)',
                borderRadius: '8px',
                padding: '1rem'
              }}>
                <h6 style={{color: 'var(--papa-black)', fontWeight: 'bold', marginBottom: '1rem'}}>
                  📈 Estadísticas del día:
                </h6>
                {(() => {
                  const stats = obtenerEstadisticasDelDia()
                  return (
                    <div className="row text-center">
                      <div className="col-4">
                        <div style={{color: 'var(--papa-black)', fontWeight: 'bold', fontSize: '1.2rem'}}>
                          {stats.cantidadPedidos}
                        </div>
                        <small>Pedidos</small>
                      </div>
                      <div className="col-4">
                        <div style={{color: 'var(--papa-black)', fontWeight: 'bold', fontSize: '1.2rem'}}>
                          {formatearPrecio(stats.totalVentas)}
                        </div>
                        <small>Total Ventas</small>
                      </div>
                      <div className="col-4">
                        <div style={{color: 'var(--papa-black)', fontWeight: 'bold', fontSize: '1.2rem'}}>
                          {formatearPrecio(stats.promedioVenta)}
                        </div>
                        <small>Promedio</small>
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}

            {/* Botón cerrar */}
            <div className="text-center mt-4">
              <button 
                className="btn"
                onClick={cerrarHistorial}
                style={{
                  background: 'var(--papa-gray-dark)',
                  border: '2px solid var(--papa-gray-dark)',
                  color: 'var(--papa-white)',
                  fontWeight: 'bold',
                  padding: '0.75rem 2rem'
                }}
              >
                ❌ Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalle de Pedido del Historial */}
      {pedidoSeleccionado && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1001
        }}>
          <div className="modal-content" style={{
            background: 'var(--papa-white)',
            borderRadius: '15px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            border: '3px solid var(--papa-yellow)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
          }}>
            {/* Header del Modal */}
            <div className="modal-header text-center mb-4" style={{
              background: 'linear-gradient(135deg, var(--papa-black) 0%, var(--papa-gray-dark) 100%)',
              color: 'var(--papa-yellow)',
              padding: '1rem',
              borderRadius: '10px',
              margin: '-2rem -2rem 2rem -2rem'
            }}>
              <h3 className="mb-2" style={{fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'}}>
                🍟 PAPA FACTORY 🍟
              </h3>
              <h4 className="mb-0" style={{
                background: 'var(--papa-yellow)',
                color: 'var(--papa-black)',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                display: 'inline-block',
                fontWeight: 'bold'
              }}>
                ORDEN N° {pedidoSeleccionado.numeroOrden}
              </h4>
            </div>

            {/* Información de la empresa */}
            <div className="text-center mb-4" style={{
              fontSize: '0.9rem',
              color: 'var(--papa-gray-dark)',
              borderBottom: '2px solid var(--papa-yellow)',
              paddingBottom: '1rem'
            }}>
              <div><strong>Las mejores papas fritas de la ciudad</strong></div>
              <div>Tel: (56) 9 1234 5678</div>
              <div>Dirección: Av. Principal 123</div>
              <div className="mt-2">
                <strong>Fecha: {pedidoSeleccionado.fecha}</strong>
              </div>
            </div>

            {/* Detalle del pedido */}
            <div className="pedido-detalle mb-4">
              <h5 className="mb-3" style={{color: 'var(--papa-black)', fontWeight: 'bold'}}>
                📋 Detalle del Pedido:
              </h5>
              
              {pedidoSeleccionado.items.map((item) => (
                <div key={item.id} className="item-detalle mb-3" style={{
                  background: 'var(--papa-yellow-light)',
                  border: '2px solid var(--papa-yellow-dark)',
                  borderRadius: '8px',
                  padding: '1rem'
                }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0" style={{color: 'var(--papa-black)', fontWeight: 'bold'}}>
                      {item.producto.nombre}
                    </h6>
                    <span style={{color: 'var(--papa-black)', fontWeight: 'bold'}}>
                      {formatearPrecio(item.producto.precio)}
                    </span>
                  </div>
                  
                  {/* Mostrar agregados si los hay */}
                  {item.agregados.length > 0 && (
                    <div className="ms-3">
                      {item.agregados.map((agregado, index) => (
                        <div key={index} className="d-flex justify-content-between align-items-center mb-1" style={{
                          fontSize: '0.9rem',
                          color: 'var(--papa-gray-dark)'
                        }}>
                          <span>
                            {agregado.nombre} x{agregado.cantidad}
                          </span>
                          <span style={{fontWeight: 'bold'}}>
                            {formatearPrecio(agregado.precio * agregado.cantidad)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="total-section mb-4" style={{
              background: 'linear-gradient(135deg, var(--papa-black) 0%, var(--papa-gray-dark) 100%)',
              color: 'var(--papa-yellow)',
              padding: '1rem',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <h4 className="mb-0" style={{fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'}}>
                💰 TOTAL: {formatearPrecio(pedidoSeleccionado.total)}
              </h4>
            </div>

            {/* Botones de acción */}
            <div className="d-flex justify-content-center gap-3">
              <button 
                className="btn btn-success"
                onClick={imprimirPedidoHistorial}
                style={{
                  background: 'var(--papa-yellow)',
                  border: '2px solid var(--papa-black)',
                  color: 'var(--papa-black)',
                  fontWeight: 'bold',
                  padding: '0.75rem 1.5rem'
                }}
              >
                🖨️ Reimprimir
              </button>
              <button 
                className="btn btn-secondary"
                onClick={cerrarDetallePedidoHistorial}
                style={{
                  background: 'var(--papa-gray-dark)',
                  border: '2px solid var(--papa-gray-dark)',
                  color: 'var(--papa-white)',
                  fontWeight: 'bold',
                  padding: '0.75rem 1.5rem'
                }}
              >
                ❌ Cerrar
              </button>
            </div>

            {/* Mensaje de agradecimiento */}
            <div className="text-center mt-4" style={{
              fontSize: '0.9rem',
              color: 'var(--papa-gray-dark)',
              borderTop: '1px solid var(--papa-yellow)',
              paddingTop: '1rem'
            }}>
              <div>¡Gracias por su compra!</div>
              <div>Vuelva pronto 😊</div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Agregados Independientes */}
      {mostrarModalAgregadosIndependientes && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1001
        }}>
          <div className="modal-content" style={{
            background: '#ffffff',
            borderRadius: '15px',
            padding: '20px',
            maxWidth: '700px',
            width: '90%',
            maxHeight: '85vh',
            overflow: 'auto',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            position: 'relative'
          }}>
            {/* Botón X cerrar */}
            <button 
              onClick={cerrarModalAgregadosIndependientes}
              style={{
                position: 'absolute',
                top: '15px',
                right: '20px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                color: '#666',
                cursor: 'pointer',
                padding: '0',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>

            {/* Título */}
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '25px',
              marginTop: '5px'
            }}>
              Agregados Disponibles
            </h2>

            {/* Selector de tamaños */}
            <div style={{ marginBottom: '30px' }}>
              <div style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'flex-start'
              }}>
                {['Pequeño', 'Mediano', 'Grande'].map((tamaño) => (
                  <button
                    key={tamaño}
                    onClick={() => setTamañoSeleccionado(tamaño)}
                    style={{
                      backgroundColor: tamañoSeleccionado === tamaño ? '#FFD700' : 'transparent',
                      border: '2px solid #FFD700',
                      borderRadius: '25px',
                      padding: '8px 20px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#333',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {getTamañoParaPedido(tamaño)}
                  </button>
                ))}
              </div>
            </div>

            {/* Agregados Básicos */}
            {tamañoSeleccionado && (
              <>
                <div style={{ marginBottom: '25px' }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '15px'
                  }}>
                    Agregados Básicos
                  </h3>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '10px'
                  }}>
                    {productos.productos.agregados_basicos.items.map((item, index) => {
                      const precio = productos.productos.agregados_basicos.precios_por_tamaño[tamañoSeleccionado as keyof typeof productos.productos.agregados_basicos.precios_por_tamaño];
                      const agregado: Agregado = {
                        nombre: item,
                        precio: precio,
                        tamaño: tamañoSeleccionado,
                        tipo: 'basico'
                      };
                      
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            agregarAgregadoIndependiente(agregado);
                            cerrarModalAgregadosIndependientes();
                          }}
                          style={{
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #dee2e6',
                            borderRadius: '8px',
                            padding: '15px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            minHeight: '70px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#e9ecef';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#f8f9fa';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          <div style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#333',
                            marginBottom: '5px'
                          }}>
                            {item}
                          </div>
                          <div style={{
                            fontSize: '14px',
                            color: '#666',
                            fontWeight: 'normal'
                          }}>
                            {formatearPrecio(precio)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Agregados Premium */}
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '15px'
                  }}>
                    Agregados Premium
                  </h3>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '10px'
                  }}>
                    {productos.productos.agregados_premium.items.map((item, index) => {
                      const precio = productos.productos.agregados_premium.precios_por_tamaño[tamañoSeleccionado as keyof typeof productos.productos.agregados_premium.precios_por_tamaño];
                      const agregado: Agregado = {
                        nombre: item,
                        precio: precio,
                        tamaño: tamañoSeleccionado,
                        tipo: 'premium'
                      };
                      
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            agregarAgregadoIndependiente(agregado);
                            cerrarModalAgregadosIndependientes();
                          }}
                          style={{
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #dee2e6',
                            borderRadius: '8px',
                            padding: '15px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            minHeight: '70px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#e9ecef';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#f8f9fa';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          <div style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#333',
                            marginBottom: '5px'
                          }}>
                            {item}
                          </div>
                          <div style={{
                            fontSize: '14px',
                            color: '#666',
                            fontWeight: 'normal'
                          }}>
                            {formatearPrecio(precio)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal de Agregados */}
      <ModalAgregados
        show={showModalAgregados}
        onClose={() => {
          setShowModalAgregados(false);
          setProductoParaAgregados(null);
          setItemEditandoId(null);
        }}
        producto={productoParaAgregados}
        onAgregarAgregado={handleAgregarAgregado}
        onDecrementarAgregado={handleDecrementarAgregado}
        agregadosExistentes={itemEditandoId ? pedidoActual.find(item => item.id === itemEditandoId)?.agregados || [] : []}
      />
    </>
  )
}

export default App
