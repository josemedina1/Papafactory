import { useState, useCallback, useEffect } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import productos from './productos.json'

interface Producto {
  id: string;
  nombre: string;
  tamaño?: string;
  precio: number;
  moneda: string;
  descripcion?: string;
}

interface Agregado {
  nombre: string;
  precio: number;
  tipo: 'basico' | 'premium';
  cantidad?: number;
}

interface AgregadoEnPedido extends Agregado {
  cantidad: number;
}

interface ItemPedido {
  id: string;
  producto: Producto;
  agregados: AgregadoEnPedido[];
  cantidad: number;
  subtotal: number;
}

const getTamañoNombre = (tamaño: string): string => {
  switch (tamaño) {
    case '200G':
      return 'PEQUEÑA';
    case '350G':
      return 'MEDIANA';
    case '500G':
      return 'GRANDE';
    default:
      return '';
  }
}

const getTamañoParaPedido = (tamaño: string): string => {
  switch (tamaño) {
    case '200G':
      return 'Pequeña';
    case '350G':
      return 'Mediana';
    case '500G':
      return 'Grande';
    default:
      return '';
  }
}

const getTamañoLetra = (tamaño: string): string => {
  switch (tamaño) {
    case '200G':
      return 'P';
    case '350G':
      return 'M';
    case '500G':
      return 'G';
    default:
      return '';
  }
}

function Modal({ 
  show, 
  onClose, 
  producto, 
  onAgregarAgregado,
  onCambiarTamañoProducto,
  agregadosExistentes = []
}: { 
  show: boolean; 
  onClose: () => void; 
  producto: Producto | null;
  onAgregarAgregado: (agregado: Agregado) => void;
  onCambiarTamañoProducto?: (nuevoTamaño: string) => void;
  agregadosExistentes?: AgregadoEnPedido[];
}) {
  if (!show || !producto) return null;

  const esChorrillana = producto.id.includes('chorrillana_');
  const esPapa = producto.id.includes('papas_');
  const [gramajeSelecionado, setGramajeSelecionado] = useState<string>(producto.tamaño || (esPapa ? '200G' : 'Chica'));

  const formatearPrecio = (precio: number): string => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio)
  }

  const handleGramajeClick = (gramaje: string) => {
    setGramajeSelecionado(gramaje);
    // Notificar el cambio de tamaño del producto
    if (onCambiarTamañoProducto) {
      onCambiarTamañoProducto(gramaje);
    }
  };

  const getPrecioAgregado = (tamaño: string, tipo: 'basico' | 'premium'): number => {
    // Mapear tamaños de chorrillana a tamaños de papa para precios
    let tamañoParaPrecio = tamaño;
    if (esChorrillana) {
      switch (tamaño) {
        case 'Chica':
          tamañoParaPrecio = '200G';
          break;
        case 'Mediana':
          tamañoParaPrecio = '350G';
          break;
        case 'Grande':
          tamañoParaPrecio = '500G';
          break;
      }
    }
    
    if (tipo === 'basico') {
      return productos.productos.agregados_basicos.precios_por_tamaño[tamañoParaPrecio as keyof typeof productos.productos.agregados_basicos.precios_por_tamaño];
    } else {
      return productos.productos.agregados_premium.precios_por_tamaño[tamañoParaPrecio as keyof typeof productos.productos.agregados_premium.precios_por_tamaño];
    }
  };

  const handleAgregadoClick = (nombre: string, precio: number, tipo: 'basico' | 'premium') => {
    onAgregarAgregado({
      nombre: nombre,
      precio,
      tipo
    });
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getTamañoNombreModal = (tamaño: string): string => {
    if (esChorrillana) {
      switch (tamaño) {
        case 'Chica':
          return 'CHICA';
        case 'Mediana':
          return 'MEDIANA';
        case 'Grande':
          return 'GRANDE';
        default:
          return tamaño.toUpperCase();
      }
    } else {
      return getTamañoNombre(tamaño);
    }
  };

  const gramajes = esChorrillana ? ['Chica', 'Mediana', 'Grande'] : ['200G', '350G', '500G'];

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{esChorrillana ? 'Chorrillana - Agregados Disponibles' : 'Papas Fritas - Agregados Disponibles'}</h2>
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
                {getTamañoNombreModal(gramaje)}
              </button>
            ))}
    </div>
    
          <div className="agregados-container">
            <div className="agregados-section">
              <h3>Agregados Básicos</h3>
              <div className="agregados-grid">
                {productos.productos.agregados_basicos.items.map((agregado, index) => {
                  const precio = getPrecioAgregado(gramajeSelecionado, 'basico');
                  const agregadoExistente = agregadosExistentes.find(a => a.nombre === agregado);
                  return (
                    <div 
                      key={index} 
                      className={`agregado-item ${agregadoExistente ? 'active' : ''}`}
                      onClick={() => handleAgregadoClick(agregado, precio, 'basico')}
                    >
                      <span className="agregado-nombre">
                        {agregado}
                        {agregadoExistente && <span className="cantidad-badge">{agregadoExistente.cantidad}</span>}
                      </span>
                      <span className="agregado-precio">{formatearPrecio(precio)}</span>
            </div>
                  );
                })}
            </div>
        </div>

            <div className="agregados-section">
              <h3>Agregados Premium</h3>
              <div className="agregados-grid">
                {productos.productos.agregados_premium.items.map((agregado, index) => {
                  const precio = getPrecioAgregado(gramajeSelecionado, 'premium');
                  const agregadoExistente = agregadosExistentes.find(a => a.nombre === agregado);
                  return (
                    <div 
                      key={index} 
                      className={`agregado-item ${agregadoExistente ? 'active' : ''}`}
                      onClick={() => handleAgregadoClick(agregado, precio, 'premium')}
                    >
                      <span className="agregado-nombre">
                        {agregado}
                        {agregadoExistente && <span className="cantidad-badge">{agregadoExistente.cantidad}</span>}
                      </span>
                      <span className="agregado-precio">{formatearPrecio(precio)}</span>
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

function App() {
  const [pedidoActual, setPedidoActual] = useState<ItemPedido[]>([])
  const [totalPedido, setTotalPedido] = useState<number>(0)
  const [showModal, setShowModal] = useState(false)
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null)
  const [itemEditandoId, setItemEditandoId] = useState<string | null>(null)

  const getImagenFondo = (tamaño: string): string => {
    switch (tamaño) {
      case '200G':
        return 'https://www.lavanguardia.com/files/og_thumbnail/uploads/2020/08/19/5f3d3a3f2bea3.jpeg';
      case '350G':
        return 'https://buendia-pro-app.s3.eu-west-3.amazonaws.com/s3fs-public/styles/highlight_large/public/2020-05/bruselas-guia-comer-dormir-comer-patatas-fritas-cono_0.jpg.webp?VersionId=V3iFMz8GEYQEXbD38DcnP_HYcICagaoO&itok=xGh7mylF';
      case '500G':
        return 'https://i0.wp.com/foodandpleasure.com/wp-content/uploads/2022/06/papas-fritas-cdmx-frituurmx-1-e1656219926660.jpg?fit=1080%2C901&ssl=1';
      default:
        return '';
    }
  }

  const getImagenChorrillana = (id: string): string => {
    switch(id) {
      case 'chorrillana_chica':
        return 'https://i.blogs.es/29d125/chorrillana-650/650_1200.jpg';
      case 'chorrillana_mediana':
        return 'https://curiyorkdelivery.cl/wp-content/uploads/2023/11/YEK01232-scaled.jpg';
      case 'chorrillana_grande':
        return 'https://tb-static.uber.com/prod/image-proc/processed_images/89fe4947f34e9edeaf3bcb469322020c/58f691da9eaef86b0b51f9b2c483fe63.jpeg';
      default:
        return 'https://i.blogs.es/29d125/chorrillana-650/650_1200.jpg';
    }
  }

  const getImagenBebida = (id: string): string => {
    switch (id) {
      case 'agua_mineral_500ml':
        return 'https://www.meshi.cl/wp-content/uploads/2024/07/como-e-feito-o-envase-de-agua-mineral.jpg';
      case 'bebida_lata_350ml':
        return 'https://delivery.pwcc.cl/wp-content/uploads/2020/08/Bebidas.png';
      case 'red_bull_250ml':
        return 'https://santaisabel.vtexassets.com/arquivos/ids/496384/Bebida-Energetica-Red-Bull-Tradicional-Lata-355-ml.jpg?v=638814648562030000';
      case 'bebida_botella_591ml':
        return 'https://socomepcl.cl/wp-content/uploads/2022/10/CCU-ZERO-PET-500CC-VARIEDADES.jpg';
      case 'score_energetica_500ml':
        return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr9OhfgjLzBt0ercTKtGdYAao1_Io7vIXWkg&s';
      case 'jugo_botella_300ml':
        return 'https://d1ks0wbvjr3pux.cloudfront.net/4dfd13fa-8b39-4b79-9fe5-ff4d72fd04f1-md.jpg';
      default:
        return '';
    }
  }

  const getImagenExtra = (id: string): string => {
    switch (id) {
      case 'caja':
        return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7TpCbCf3S-e2DFn14ASq3GjD_5-5WMVQx6g&s';
      case 'bolsa_papel':
        return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDZk377PpbrQ0YgpwMFx0VgDpOoeu3UM0Pzg&s';
      case 'pocillo_plastico':
        return 'https://cdnx.jumpseller.com/empak2/image/50073130/resize/500/500?1719263649';
      case 'pack_delivery':
        return 'https://cdnx.jumpseller.com/insumitus/image/36827194/resize/540/540?1708521257';
      default:
        return '';
    }
  }

  const formatearPrecio = (precio: number): string => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio)
  }

  const calcularTotalPedido = (pedido: ItemPedido[]) => {
    const nuevoTotal = pedido.reduce((total, item) => total + item.subtotal, 0);
    setTotalPedido(nuevoTotal);
  };

  const handleProductoClick = (producto: Producto) => {
    if (producto.id.includes('papas_') || producto.id.includes('chorrillana_')) {
      // Para papas fritas y chorrillanas, siempre crear un nuevo item
      const nuevoItem: ItemPedido = {
        id: Date.now().toString(),
        producto,
        agregados: [],
        cantidad: 1,
        subtotal: producto.precio
      };

      setPedidoActual([...pedidoActual, nuevoItem]);
      calcularTotalPedido([...pedidoActual, nuevoItem]);
      setProductoSeleccionado(producto);
      setItemEditandoId(nuevoItem.id);
      setShowModal(true);
    } else if (producto.id.includes('bebida_') || 
               producto.id.includes('agua_') || 
               producto.id.includes('jugo_') ||
               producto.id.includes('red_bull') ||
               producto.id.includes('score_')) {
      // Para bebestibles, buscar si ya existe y actualizar cantidad
      const itemExistente = pedidoActual.find(item => item.producto.id === producto.id);

      if (itemExistente) {
        const nuevoPedido = pedidoActual.map(item => {
          if (item.id === itemExistente.id) {
            return {
              ...item,
              cantidad: item.cantidad + 1,
              subtotal: (item.cantidad + 1) * item.producto.precio
            };
          }
          return item;
        });
        setPedidoActual(nuevoPedido);
        calcularTotalPedido(nuevoPedido);
      } else {
        // Si no existe, crear nuevo item con cantidad 1
        const nuevoItem: ItemPedido = {
          id: Date.now().toString(),
          producto,
          agregados: [],
          cantidad: 1,
          subtotal: producto.precio
        };
        setPedidoActual([...pedidoActual, nuevoItem]);
        calcularTotalPedido([...pedidoActual, nuevoItem]);
      }
    } else {
      // Para otros productos (extras), mantener el comportamiento actual
      const itemExistente = pedidoActual.find(item => item.producto.id === producto.id);

      if (itemExistente) {
        const nuevoPedido = pedidoActual.map(item => {
          if (item.id === itemExistente.id) {
            return {
              ...item,
              cantidad: item.cantidad + 1,
              subtotal: (item.cantidad + 1) * item.producto.precio
            };
          }
          return item;
        });
        setPedidoActual(nuevoPedido);
        calcularTotalPedido(nuevoPedido);
      } else {
        const nuevoItem: ItemPedido = {
          id: Date.now().toString(),
          producto,
          agregados: [],
          cantidad: 1,
          subtotal: producto.precio
        };
        setPedidoActual([...pedidoActual, nuevoItem]);
        calcularTotalPedido([...pedidoActual, nuevoItem]);
      }
    }
  };

  const handleItemClick = (item: ItemPedido) => {
    // Mostrar modal para papas fritas y chorrillanas
    if (item.producto.id.includes('papas_') || item.producto.id.includes('chorrillana_')) {
      setProductoSeleccionado(item.producto);
      setItemEditandoId(item.id);
      setShowModal(true);
    }
  };

  const handleAgregarAgregado = (agregado: Agregado) => {
    if (!itemEditandoId) return;

    const nuevoPedido = pedidoActual.map(item => {
      if (item.id === itemEditandoId) {
        // Buscar si el agregado ya existe
        const agregadoExistente = item.agregados.find(a => a.nombre === agregado.nombre);
        
        if (agregadoExistente) {
          // Si existe, incrementar la cantidad
          return {
            ...item,
            agregados: item.agregados.map(a => 
              a.nombre === agregado.nombre 
                ? { ...a, cantidad: a.cantidad + 1 }
                : a
            ),
            subtotal: item.subtotal + agregado.precio
          };
        } else {
          // Si no existe, agregarlo con cantidad 1
          return {
            ...item,
            agregados: [...item.agregados, { ...agregado, cantidad: 1 }],
            subtotal: item.subtotal + agregado.precio
          };
        }
      }
      return item;
    });

    setPedidoActual(nuevoPedido);
    calcularTotalPedido(nuevoPedido);
  };

  const handleCambiarTamañoProducto = (nuevoTamaño: string) => {
    if (!itemEditandoId) return;

    const nuevoPedido = pedidoActual.map(item => {
      if (item.id === itemEditandoId) {
        let nuevoProducto = { ...item.producto };
        
        // Si es chorrillana, actualizar el precio según el tamaño
        if (item.producto.id.includes('chorrillana_')) {
          const chorrillanas = productos.productos.chorrillanas.items;
          const chorrillanaNueva = chorrillanas.find(c => c.tamaño === nuevoTamaño);
          
          if (chorrillanaNueva) {
            nuevoProducto = {
              ...nuevoProducto,
              id: chorrillanaNueva.id,
              nombre: chorrillanaNueva.nombre,
              tamaño: chorrillanaNueva.tamaño,
              precio: chorrillanaNueva.precio
            };
          }
        } else if (item.producto.id.includes('papas_')) {
          // Si es papa, actualizar el precio según el tamaño
          const papas = productos.productos.papas_fritas.items;
          const papaNueva = papas.find(p => p.tamaño === nuevoTamaño);
          
          if (papaNueva) {
            nuevoProducto = {
              ...nuevoProducto,
              id: papaNueva.id,
              nombre: papaNueva.nombre,
              tamaño: papaNueva.tamaño,
              precio: papaNueva.precio
            };
          }
        }

        const agregadosTotal = item.agregados.reduce((total, a) => total + (a.precio * a.cantidad), 0);
        
        return {
          ...item,
          producto: nuevoProducto,
          subtotal: nuevoProducto.precio + agregadosTotal
        };
      }
      return item;
    });

    setPedidoActual(nuevoPedido);
    calcularTotalPedido(nuevoPedido);
    setProductoSeleccionado(nuevoPedido.find(i => i.id === itemEditandoId)?.producto || null);
  };

  const handleQuitarAgregado = (itemId: string, agregadoNombre: string) => {
    setPedidoActual(prevPedido => {
      const nuevoPedido = prevPedido.map(item => {
        if (item.id === itemId) {
          const nuevosAgregados = item.agregados.map(a => {
            if (a.nombre === agregadoNombre) {
              return { ...a, cantidad: Math.max(0, a.cantidad - 1) };
            }
            return a;
          }).filter(a => a.cantidad > 0);

          const nuevoSubtotal = item.producto.precio + 
            nuevosAgregados.reduce((total, a) => total + (a.precio * a.cantidad), 0);
        
        return {
          ...item,
          agregados: nuevosAgregados,
          subtotal: nuevoSubtotal
          };
        }
        return item;
      });

      // Actualizar el total del pedido
      calcularTotalPedido(nuevoPedido);
      return nuevoPedido;
    });
  };

  const handleIncrementarAgregado = (itemId: string, agregadoNombre: string) => {
    setPedidoActual(prevPedido => {
      const nuevoPedido = prevPedido.map(item => {
        if (item.id === itemId) {
        const nuevosAgregados = item.agregados.map(a => {
          if (a.nombre === agregadoNombre) {
              return { ...a, cantidad: a.cantidad + 1 };
          }
            return a;
          });

          const nuevoSubtotal = item.producto.precio + 
            nuevosAgregados.reduce((total, a) => total + (a.precio * a.cantidad), 0);
        
        return {
          ...item,
          agregados: nuevosAgregados,
          subtotal: nuevoSubtotal
          };
        }
        return item;
      });

      // Actualizar el total del pedido
      calcularTotalPedido(nuevoPedido);
      return nuevoPedido;
    });
  };

  const handleEliminarItem = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation(); // Evitar que se abra el modal al eliminar
    setPedidoActual(prevPedido => {
      const nuevoPedido = prevPedido.filter(item => item.id !== itemId);
      calcularTotalPedido(nuevoPedido);
      return nuevoPedido;
    });
  };

  // Función para obtener el prefijo del día
  const obtenerPrefijoDia = (fecha: Date): string => {
    const dias = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
    return dias[fecha.getDay()];
  };

  // Función para obtener y actualizar el número de ticket
  const obtenerNumeroTicket = (): string => {
    const ahora = new Date();
    const fechaHoy = ahora.toISOString().split('T')[0];
    const prefijoHoy = obtenerPrefijoDia(ahora);
    
    // Obtener el último ticket guardado
    const ticketGuardado = localStorage.getItem('ultimoTicket');
    let ultimoTicket = ticketGuardado ? JSON.parse(ticketGuardado) : null;

    // Si no hay ticket guardado o es de otro día, empezar desde 1
    if (!ultimoTicket || ultimoTicket.fecha !== fechaHoy) {
      ultimoTicket = {
        fecha: fechaHoy,
        numero: 1
      };
    } else {
      // Incrementar el número del ticket
      ultimoTicket.numero++;
    }

    // Guardar el nuevo número de ticket
    localStorage.setItem('ultimoTicket', JSON.stringify(ultimoTicket));

    // Formatear el número con dos dígitos (01, 02, etc.)
    const numeroFormateado = ultimoTicket.numero.toString().padStart(2, '0');
    return `${prefijoHoy}${numeroFormateado}`;
  };

  const finalizarPedido = async () => {
    const numeroTicket = obtenerNumeroTicket();
    const fecha = new Date();
    
    const generarContenidoTicket = (tipo: 'CLIENTE' | 'LOCAL') => {
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              @page {
                size: 58mm auto;
                margin: 0;
              }
              body {
                font-family: monospace;
                width: 58mm;
                padding: 4mm;
                margin: 0;
                font-weight: bold;
              }
              .ticket-section {
                text-align: center;
                padding: 0 0 10px 0;
                font-weight: bold;
              }
              .ticket-title {
                font-size: 18px;
                margin-bottom: 5px;
                letter-spacing: 2px;
                font-weight: bold;
              }
              .ticket-number {
                font-size: 36px;
                font-weight: bold;
                margin: 10px 0;
              }
              .ticket-copy {
                font-size: 16px;
                font-weight: bold;
                margin: 5px 0;
                text-align: center;
                border: 1px solid black;
                padding: 2px;
              }
              .ticket-divider {
                border-top: 1px dotted black;
                margin: 10px 0;
                height: 1px;
              }
              .titulo {
                text-align: center;
                font-size: 16px;
                font-weight: bold;
                margin: 15px 0;
                letter-spacing: 1px;
              }
              .item {
                margin-bottom: 8px;
                font-weight: bold;
              }
              .producto-linea {
                display: flex;
                align-items: flex-start;
                margin-bottom: 4px;
                font-weight: bold;
              }
              .producto-numero {
                margin-right: 5px;
                flex-shrink: 0;
                font-weight: bold;
                font-size: 12px;
              }
              .producto-nombre {
                flex-grow: 1;
                position: relative;
                padding-right: 5px;
                word-wrap: break-word;
                hyphens: auto;
                line-height: 1.3;
                font-weight: bold;
                font-size: 12px;
              }
              .producto-nombre::after {
                content: "";
              }
              .producto-precio {
                padding-left: 5px;
                position: relative;
                z-index: 1;
                background: white;
                font-weight: bold;
                font-size: 12px;
              }
              .agregados-titulo {
                margin-left: 15px;
                margin-bottom: 4px;
                font-size: 12px;
                font-weight: bold;
              }
              .agregado {
                margin-left: 15px;
                display: flex;
                align-items: flex-start;
                margin-bottom: 2px;
                font-size: 11px;
                font-weight: bold;
              }
              .agregado-nombre {
                flex-grow: 1;
                position: relative;
                padding-right: 5px;
                word-wrap: break-word;
                hyphens: auto;
                line-height: 1.3;
                font-size: 11px;
                font-weight: bold;
              }
              .agregado-nombre::after {
                content: "";
              }
              .agregado-precio {
                padding-left: 5px;
                position: relative;
                z-index: 1;
                background: white;
                font-size: 11px;
                font-weight: bold;
              }
              .linea-divisoria {
                border-top: 2px solid black;
                margin: 15px 0 10px 0;
              }
              .total {
                display: flex;
                align-items: baseline;
                margin-top: 5px;
                font-weight: bold;
              }
              .total-texto {
                font-weight: bold;
                margin-right: 10px;
              }
              .total-simbolo {
                margin-right: 5px;
                font-weight: bold;
              }
              .total-monto {
                flex-grow: 1;
                text-align: right;
                font-weight: bold;
              }
              .fecha {
                text-align: center;
                font-size: 12px;
                margin: 10px 0;
                font-weight: bold;
              }
              .direccion {
                text-align: center;
                font-size: 12px;
                margin: 10px 0;
                font-weight: bold;
              }
              .page-break {
                page-break-after: always;
              }
              span {
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <!-- Sección del número de ticket -->
            <div class="ticket-section">
              <div class="ticket-title">PAPA FACTORY</div>
              <div class="ticket-number">#${numeroTicket}</div>
              <div class="ticket-copy">COPIA ${tipo}</div>
              <div class="fecha">${fecha}</div>
            </div>
            <div class="ticket-divider"></div>

            <!-- Detalle del pedido -->
            <div class="detalle-pedido">
              ${pedidoActual.map((item, index) => `
                <div class="item">
                  <div class="producto-linea">
                    <span class="producto-numero">${index + 1}.</span>
                    <span class="producto-nombre">${item.producto.id.includes('papas_') ? `Papas Fritas ${getTamañoLetra(item.producto.tamaño || '')}` : item.producto.id.includes('chorrillana_') ? item.producto.nombre : item.producto.nombre}${item.cantidad > 1 ? ` x${item.cantidad}` : ''}</span>
                    <span class="producto-precio">$${(item.producto.precio * item.cantidad).toLocaleString()}</span>
                  </div>
                  ${item.agregados.length > 0 ? `
                    <div class="agregados-titulo">Agregados:</div>
                    ${item.agregados.map(agregado => `
                      <div class="agregado">
                        <span class="agregado-nombre">- ${agregado.nombre} x${agregado.cantidad}</span>
                        <span class="agregado-precio">$${(agregado.precio * agregado.cantidad).toLocaleString()}</span>
                      </div>
                    `).join('')}
                  ` : ''}
                </div>
              `).join('')}
              
              <div class="linea-divisoria"></div>
              <div class="total">
                <span class="total-texto">TOTAL:</span>
                <span class="total-simbolo">$</span>
                <span class="total-monto">${totalPedido.toLocaleString()}</span>
              </div>
            </div>

            <div class="ticket-divider"></div>
          </body>
        </html>
      `;
    };

    // Crear el contenido completo con ambas copias
    const contenidoCompleto = `
      ${generarContenidoTicket('CLIENTE')}
      <div class="page-break"></div>
      ${generarContenidoTicket('LOCAL')}
    `;

    try {
      if ((window as any).electron) {
        // Usar la impresión silenciosa de Electron
        await (window as any).electron.printSilent(contenidoCompleto);
      } else {
        // Fallback para navegador web
        const iframeElement = document.createElement('iframe');
        iframeElement.style.display = 'none';
        document.body.appendChild(iframeElement);

        const iframeWindow = iframeElement.contentWindow;
        if (iframeWindow) {
          iframeWindow.document.open();
          iframeWindow.document.write(contenidoCompleto);
          iframeWindow.document.close();
          iframeWindow.print();
          setTimeout(() => {
            document.body.removeChild(iframeElement);
          }, 1000);
        }
      }

      // Limpiar el pedido actual
      setPedidoActual([]);
      setProductoSeleccionado(null);
      setShowModal(false);
      setTotalPedido(0);
    } catch (error) {
      console.error('Error al imprimir:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  // Función para calcular el total
  const calcularTotal = useCallback(() => {
    const total = pedidoActual.reduce((sum, item) => {
      let itemTotal = item.producto.precio * item.cantidad;
      if (item.agregados) {
        itemTotal += item.agregados.reduce((agregadosSum, agregado) => 
          agregadosSum + (agregado.precio * agregado.cantidad), 0);
      }
      return sum + itemTotal;
    }, 0);
    setTotalPedido(total);
    return total;
  }, [pedidoActual]);

  // Usar useEffect para actualizar el total cuando cambie el pedido
  useEffect(() => {
    calcularTotal();
  }, [pedidoActual, calcularTotal]);

  // Agregar funciones para incrementar/decrementar cantidad
  const incrementarCantidad = (itemId: string) => {
    const nuevoPedido = pedidoActual.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          cantidad: item.cantidad + 1,
          subtotal: (item.cantidad + 1) * item.producto.precio + 
            item.agregados.reduce((total, agregado) => total + (agregado.precio * agregado.cantidad), 0)
        };
      }
      return item;
    });
    setPedidoActual(nuevoPedido);
    calcularTotalPedido(nuevoPedido);
  };

  const decrementarCantidad = (itemId: string) => {
    const nuevoPedido = pedidoActual.map(item => {
      if (item.id === itemId && item.cantidad > 1) {
        return {
          ...item,
          cantidad: item.cantidad - 1,
          subtotal: (item.cantidad - 1) * item.producto.precio +
            item.agregados.reduce((total, agregado) => total + (agregado.precio * agregado.cantidad), 0)
        };
      }
      return item;
    }).filter(item => item.cantidad > 0);
    setPedidoActual(nuevoPedido);
    calcularTotalPedido(nuevoPedido);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-8">
          <div className="menu-principal">
            <div className="seccion-menu">
              <h2 className="titulo-seccion">PAPAS FRITAS</h2>
              <div className="productos-grid">
                {productos.productos.papas_fritas.items.map((papa) => (
                  <div 
                    key={papa.id} 
                    className="producto-box papa-frita"
                    onClick={() => handleProductoClick(papa)}
                style={{
                      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${getImagenFondo(papa.tamaño)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="producto-contenido">
                      <h3 className="producto-titulo">{getTamañoNombre(papa.tamaño)}</h3>
                      <div className="producto-tamaño">{papa.tamaño}</div>
                      <div className="producto-precio">{formatearPrecio(papa.precio)}</div>
            </div>
                            </div>
                          ))}
                        </div>
                      </div>

            <div className="seccion-menu">
              <h2 className="titulo-seccion">CHORRILLANAS</h2>
              <div className="productos-grid">
                {productos.productos.chorrillanas.items.map((chorrillana) => (
                  <div 
                    key={chorrillana.id} 
                    className="producto-box papa-frita"
                    onClick={() => handleProductoClick(chorrillana)}
                    style={{
                      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${getImagenChorrillana(chorrillana.id)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="producto-contenido">
                      <h3 className="producto-titulo">{chorrillana.nombre}</h3>
                      <div className="producto-tamaño">{chorrillana.tamaño}</div>
                      <div className="producto-precio">{formatearPrecio(chorrillana.precio)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="seccion-menu">
              <h2 className="titulo-seccion">BEBESTIBLES</h2>
              <div className="productos-grid">
                {productos.productos.bebidas.items.map((bebida) => (
                  <div 
                    key={bebida.id} 
                    className="producto-box bebestible"
                    onClick={() => handleProductoClick(bebida)}
                    style={{
                      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${getImagenBebida(bebida.id)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="producto-contenido">
                      <h3 className="producto-titulo">{bebida.nombre}</h3>
                      <div className="producto-tamaño">{bebida.tamaño}</div>
                      <div className="producto-precio">{formatearPrecio(bebida.precio)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="seccion-menu">
              <h2 className="titulo-seccion">EXTRAS</h2>
              <div className="productos-grid">
                {productos.productos.extras.items.map((extra) => (
                  <div 
                    key={extra.id} 
                    className="producto-box extra"
                    data-producto-id={extra.id}
                    onClick={() => handleProductoClick(extra)}
                    style={{
                      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${getImagenExtra(extra.id)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="producto-contenido">
                      <h3 className="producto-titulo">{extra.nombre}</h3>
                      {extra.descripcion && <div className="producto-descripcion">{extra.descripcion}</div>}
                      <div className="producto-precio">{formatearPrecio(extra.precio)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
                    <div className="pedido-actual">
            <h2 className="titulo-pedido">PEDIDO ACTUAL</h2>
            <div className="total-pedido">
              <div className="total">Total: {formatearPrecio(totalPedido)}</div>
              <button 
                className="boton-finalizar"
                onClick={finalizarPedido}
              >
                Finalizar Pedido
              </button>
            </div>
            <div className="items-pedido">
              {pedidoActual.map(item => (
                        <div 
                          key={item.id} 
                  className="item-pedido"
                          onClick={() => handleItemClick(item)}
                        >
                          <div className="item-header">
                                                <div className="item-info">
                              <h3>
                                {item.producto.id.includes('papas_') 
                                  ? `Papas Fritas ${getTamañoParaPedido(item.producto.tamaño || '')}` 
                                  : item.producto.id.includes('chorrillana_')
                                  ? item.producto.nombre
                                  : item.producto.nombre}
                              </h3>
                              {!item.producto.id.includes('papas_') && !item.producto.id.includes('chorrillana_') && item.cantidad > 1 && (
                                <span className="cantidad-badge">x{item.cantidad}</span>
                              )}
                    </div>
                    <div className="item-actions">
                      {!item.producto.id.includes('papas_') && !item.producto.id.includes('chorrillana_') && (
                        <div className="cantidad-controles">
                          <button 
                            className="btn-cantidad"
                            onClick={(e) => {
                              e.stopPropagation();
                              decrementarCantidad(item.id);
                            }}
                          >
                            -
                          </button>
                          <span className="cantidad-display">{item.cantidad}</span>
                          <button 
                            className="btn-cantidad"
                            onClick={(e) => {
                              e.stopPropagation();
                              incrementarCantidad(item.id);
                            }}
                          >
                            +
                          </button>
                        </div>
                      )}
                      <button 
                        className="btn-eliminar"
                        onClick={(e) => handleEliminarItem(e, item.id)}
                        title="Eliminar item"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  {item.agregados.length > 0 && (
                    <div className="agregados-lista">
                      {item.agregados.map((agregado, index) => (
                        <div key={index} className="agregado-linea">
                          <span className="agregado-nombre">{agregado.nombre}</span>
                          <div className="agregado-controles">
                            <button 
                              className="btn-control"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuitarAgregado(item.id, agregado.nombre);
                              }}
                            >
                              -
                            </button>
                            <span className="agregado-cantidad">{agregado.cantidad}</span>
                            <button 
                              className="btn-control"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleIncrementarAgregado(item.id, agregado.nombre);
                              }}
                            >
                              +
                            </button>
                          </div>
                          <span className="agregado-precio">{formatearPrecio(agregado.precio * agregado.cantidad)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="item-subtotal">
                    Subtotal: {formatearPrecio(item.subtotal)}
                        </div>
                          </div>
                        ))}
                      </div>
                  </div>
              </div>
              </div>

      <Modal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setProductoSeleccionado(null);
          setItemEditandoId(null);
        }}
        producto={productoSeleccionado}
        onAgregarAgregado={handleAgregarAgregado}
        onCambiarTamañoProducto={handleCambiarTamañoProducto}
        agregadosExistentes={itemEditandoId ? pedidoActual.find(item => item.id === itemEditandoId)?.agregados || [] : []}
      />
                  </div>
  )
}

export default App
