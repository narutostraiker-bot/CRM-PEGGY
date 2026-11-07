/* =========================================================
   ARCHIVO 3: conexion.js (ACTUALIZADO - 3 FOTOS + CARRUSEL + IA)
   Peggy Burgers Silvia - Base de Datos Central
========================================================== */

const CONFIG_CONEXION = {
  URL_GOOGLE_SCRIPT: "", 
  FIREBASE_HABILITADO: false
};

const BASES_FAMILIA = {
  HUEVOS: {
    base: "Incluye frijoles refritos con queso, totopos y tortillas",
    quitarSinCosto: ["Frijoles", "Queso en frijoles", "Cebolla", "Picante"],
    eleccionObligatoria: ["Revueltos", "Estrellados tiernos", "Estrellados bien cocidos"],
    extrasConCosto: [{ nombre: "Huevo extra", precio: 15 }, { nombre: "Tocino o Jamón", precio: 18 }, { nombre: "Milanesa extra", precio: 30 }, { nombre: "Aguacate", precio: 15 }]
  },
  ENCHILADAS: {
    base: "Orden acompañada de arroz, frijoles refritos, crema, queso y cebolla",
    quitarSinCosto: ["Crema", "Queso rallado", "Cebolla", "Arroz", "Frijoles"],
    eleccionObligatoria: ["Salsa Roja", "Salsa Verde"],
    extrasConCosto: [{ nombre: "Milanesa extra", precio: 30 }, { nombre: "Pollo extra", precio: 20 }, { nombre: "Queso gratinado", precio: 15 }, { nombre: "Aguacate", precio: 15 }]
  },
  CHILAQUILES: {
    base: "Totopos crujientes con salsa a elegir, crema, queso rallado y aros de cebolla",
    quitarSinCosto: ["Crema", "Queso rallado", "Cebolla"],
    eleccionObligatoria: ["Salsa Verde", "Salsa Roja"],
    extrasConCosto: [{ nombre: "Huevo estrellado", precio: 15 }, { nombre: "Pollo deshebrado", precio: 20 }, { nombre: "Milanesa", precio: 30 }, { nombre: "Aguacate", precio: 15 }]
  },
  TORTAS: {
    base: "Base: milanesa de puerco, frijoles, lechuga, jitomate, cebolla, aguacate, quesillo y mayonesa",
    quitarSinCosto: ["Frijoles", "Lechuga", "Jitomate", "Cebolla", "Aguacate", "Quesillo", "Mayonesa", "Picante"],
    eleccionObligatoria: ["Con chiles/salsa", "Sin picante"],
    extrasConCosto: [{ nombre: "Quesillo extra", precio: 15 }, { nombre: "Chilaquiles extra", precio: 20 }, { nombre: "Papas a la francesa (SKU 130)", precio: 52 }]
  },
  TACOS: {
    base: "Taco gigante en doble tortilla con cebolla, cilantro, limones y salsa",
    quitarSinCosto: ["Cebolla", "Cilantro", "Salsa"],
    eleccionObligatoria: ["Con todo", "Solo carne (natural)"],
    extrasConCosto: [{ nombre: "Queso fundido/costra", precio: 15 }, { nombre: "Aguacate", precio: 15 }]
  },
  HAMBURGUESAS: {
    base: "Pan con ajonjolí, carne a la plancha, queso, lechuga, jitomate, cebolla, aderezos y papas",
    quitarSinCosto: ["Lechuga", "Jitomate", "Cebolla", "Mayonesa", "Mostaza", "Cátsup", "Chiles"],
    eleccionObligatoria: ["Con papas incluidas", "Sin aderezos"],
    extrasConCosto: [{ nombre: "Carne extra", precio: 30 }, { nombre: "Tocino extra", precio: 18 }, { nombre: "Piña", precio: 12 }, { nombre: "Quesillo extra", precio: 15 }]
  },
  BURRITOS_CLUB: {
    base: "Preparado al momento con frijoles, queso fundido y guarnición",
    quitarSinCosto: ["Frijoles", "Cebolla", "Pimiento", "Crema/Mayonesa", "Lechuga", "Jitomate"],
    eleccionObligatoria: ["Salsa Verde", "Salsa Roja", "Sin salsa"],
    extrasConCosto: [{ nombre: "Queso extra", precio: 15 }, { nombre: "Aguacate", precio: 15 }, { nombre: "Papas a la francesa (SKU 130)", precio: 52 }]
  },
  ALITAS_BONELESS_COSTILLAS: {
    base: "Orden de 8 a 10 piezas acompañadas de apio y aderezo Ranch",
    quitarSinCosto: ["Aderezo Ranch", "Bastones de apio"],
    eleccionObligatoria: ["BBQ", "Habanero", "Buffalo", "Naturales"],
    extrasConCosto: [{ nombre: "Aderezo Ranch extra", precio: 12 }, { nombre: "Salsa extra", precio: 12 }, { nombre: "Papas a la francesa (SKU 130)", precio: 52 }]
  },
  BOTANAS_HOTDOGS: {
    base: "Preparados al momento con cátsup, mostaza y mayonesa",
    quitarSinCosto: ["Cátsup", "Mostaza", "Mayonesa", "Cebolla", "Jitomate"],
    eleccionObligatoria: ["Con todo", "Solo cátsup"],
    extrasConCosto: [{ nombre: "Tocino extra", precio: 15 }, { nombre: "Queso extra", precio: 15 }]
  }
};

window.CRM_DB = {
  negocio: {
    nombre: "Peggy Burgers Silvia",
    lema: "El Sabor Auténtico",
    direccion: "De las Palmas 97, San Jorge Pueblo Nuevo, Metepec",
    telefono: "311-351-6702",
    horario: "7:00 AM a 11:00 PM",
    compraMinimaEnvioGratis: 120,
    comisionTarjetaPorcentaje: 5,
    cargosEmpaque: { contenedor: 5, utensilios: 2, bolsa: 2 }
  },

  cliente: {
    autenticado: false,
    esPersonal: false,
    nombre: "Sofía",
    apellido: "Ramírez",
    sexo: "F",
    trato: "Señorita",
    telefono: "7221234567",
    puntos: 120,
    ubicacionActiva: "🏠 Casa: De las Palmas 97",
    direcciones: [{ etiqueta: "🏠 Casa", direccion: "De las Palmas 97, San Jorge Pueblo Nuevo" }]
  },

  // Catálogo completo con las 3 FOTOS por SKU para el Carrusel e Inteligencia Artificial
  catalogo: [
    {
      sku: 67, categoria: "Hamburguesas", subcategoria: "Dobles y Gigantes", nombre: "Hamburguesa a la Peggy", precio: 145, minutos: 15, disponible: true, skuSinergia: 66, familia: "HAMBURGUESAS",
      fotos: {
        principal: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
        detalles: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600",
        oficialSKU: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600"
      }
    },
    {
      sku: 46, categoria: "Tortas Gigantes", subcategoria: "Bombas de la Casa", nombre: "Torta Cubana (¡La Bomba!)", precio: 125, minutos: 14, disponible: true, skuSinergia: 45, familia: "TORTAS",
      fotos: {
        principal: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600",
        detalles: "https://images.unsplash.com/photo-1554475901-4538ddfbccc2?w=600",
        oficialSKU: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600"
      }
    },
    {
      sku: 30, categoria: "Chilaquiles", subcategoria: "Sencillos", nombre: "Chilaquiles", precio: 95, minutos: 10, disponible: true, skuSinergia: 31, familia: "CHILAQUILES",
      fotos: {
        principal: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600",
        detalles: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=600",
        oficialSKU: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600"
      }
    }
  ],

  carrito: [],
  paraLlevar: { contenedores: 0, incluyeUtensilios: false, incluyeBolsa: false },
  descuentoActivo: { codigo: "", monto: 0, porcentaje: 0 },
  pedidoActual: { folio: null, estadoSemaforo: "SIN_PEDIDO", pagado: false, metodoPago: "" },
  mesas: { digitalesOcupadas: 2, maximoDigitales: 5, filaEsperaDigital: 0, fisicasActivas: 1, minutosExtraCocina: 0, tasaIntercalado: "1:1" },
  modos: { modoActivo: "MANUAL", codigosPublicados: [], borradoresRecomendados: [] },
  metricasPopups: { impresionesVistas: 0, conversionesCompras: 0, ingresoExtraGenerado: 0, historialEventos: [] },
  plataformasExternas: [],
  caja: { fondoInicial: 500, ventasEfectivoLocal: 0, ventasTarjetaLocal: 0, efectivoRecibidoApps: 0, gastosOperativos: 0, historialArqueos: [] }
};

function obtenerSaludoCliente() {
  const c = window.CRM_DB.cliente;
  return c.sexo === "F" ? `Señorita ${c.nombre}` : `Joven ${c.nombre}`;
}

function guardarEnMemoriaLocal() {
  try { localStorage.setItem("CRM_PEGGY_V3", JSON.stringify(window.CRM_DB)); } catch (e) {}
}

function cargarDeMemoriaLocal() {
  try {
    const data = localStorage.getItem("CRM_PEGGY_V3");
    if (data) Object.assign(window.CRM_DB, JSON.parse(data));
  } catch (e) {}
}

cargarDeMemoriaLocal();
