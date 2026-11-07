/* =========================================================
   ARCHIVO 12: popups_metricas.js
   Controla los Pop-ups Comerciales de Sinergia y Métricas de Conversión
========================================================== */

function dispararPopupComercialSinergia() {
  const carrito = window.CRM_DB.carrito;
  const itemAgotado = carrito[0] ? carrito[0] : window.CRM_DB.catalogo[0];
  const recomendacionSinergia = typeof buscarSustitutoSinergia === 'function' ? buscarSustitutoSinergia(itemAgotado.sku) : window.CRM_DB.catalogo[1];

  // Registrar impresión (Visto)
  window.CRM_DB.metricasPopups.impresionesVistas++;
  registrarEventoMetrica("VISTO", `Pop-up comercial mostrado para recomendar ${recomendacionSinergia.nombre}`);

  const contenedorPopup = document.getElementById('contenedor-popups');
  if (!contenedorPopup) return;

  contenedorPopup.innerHTML = `
    <div class="fixed inset-0 modal-aviso-ia flex items-center justify-center p-4 z-50">
      <div class="tarjeta-cristal rounded-3xl p-5 max-w-sm w-full text-xs border-2 border-amber-400 borde-pulso shadow-2xl space-y-3 bg-slate-900">
        
        <div class="degradado-comercial p-4 rounded-2xl text-white relative shadow">
          <span class="inline-block text-[9px] font-extrabold uppercase tracking-wider bg-black/40 px-2.5 py-0.5 rounded-full mb-1">
            🔥 Recomendación en Sinergia (IA)
          </span>
          <h3 class="text-sm font-extrabold leading-tight">
            ${obtenerSaludoCliente()}, el producto se agotó temporalmente
          </h3>
          <p class="text-[11px] opacity-90 mt-1">
            Para que no esperes de más, te recomendamos este platillo recién hecho que combina con tu orden:
          </p>
        </div>

        <div class="bg-slate-950 p-3 rounded-2xl border border-white/10 flex justify-between items-center">
          <div>
            <span class="text-[10px] text-amber-400 font-bold block">SKU: ${recomendacionSinergia.sku} · ⏱️ ${recomendacionSinergia.minutos}m</span>
            <h4 class="font-extrabold text-xs">${recomendacionSinergia.nombre}</h4>
          </div>
          <span class="text-base font-extrabold text-emerald-400">$${recomendacionSinergia.precio} MXN</span>
        </div>

        <div class="space-y-2">
          <button onclick="aceptarOfertaComercialSinergia(${recomendacionSinergia.sku})" class="w-full py-3 rounded-xl degradado-comercial text-white font-extrabold shadow-lg transition hover:opacity-95">
            ¡Sí, cambiar por esta recomendación!
          </button>
          <button onclick="cerrarPopupComercial()" class="w-full py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white font-bold transition">
            No gracias, elegiré otra opción
          </button>
        </div>

      </div>
    </div>
  `;

  if (typeof hablarNotificacionVoz === 'function') {
    hablarNotificacionVoz(`${obtenerSaludoCliente()}, el producto seleccionado no está disponible en este momento, pero te recomendamos ${recomendacionSinergia.nombre}.`);
  }
}

function aceptarOfertaComercialSinergia(skuSugerido) {
  const prodSugerido = window.CRM_DB.catalogo.find(p => p.sku === Number(skuSugerido));
  if (!prodSugerido) return;

  // Reemplazar o agregar al carrito
  if (window.CRM_DB.carrito.length > 0) {
    window.CRM_DB.carrito.shift();
  }
  window.CRM_DB.carrito.push({
    ...prodSugerido,
    idUnico: Date.now() + Math.random(),
    quitados: [],
    extrasSeleccionados: []
  });

  // Registrar conversión y venta extra
  window.CRM_DB.metricasPopups.conversionesCompras++;
  window.CRM_DB.metricasPopups.ingresoExtraGenerado += prodSugerido.precio;
  registrarEventoMetrica("COMPRADO", `Cliente aceptó comercial de ${prodSugerido.nombre} (+$${prodSugerido.precio} MXN)`);

  cerrarPopupComercial();
  if (typeof actualizarVistaCarrito === 'function') actualizarVistaCarrito();
  if (typeof aprobarPedidoEnMesas === 'function') aprobarPedidoEnMesas();
}

function cerrarPopupComercial() {
  const contenedorPopup = document.getElementById('contenedor-popups');
  if (contenedorPopup) contenedorPopup.innerHTML = "";
  registrarEventoMetrica("CERRADO", "Cliente cerró el pop-up comercial sin comprar.");
}

function registrarEventoMetrica(accion, detalle) {
  const evento = {
    fecha: new Date().toLocaleTimeString(),
    cliente: `${window.CRM_DB.cliente.nombre} (${window.CRM_DB.cliente.telefono})`,
    accion,
    detalle
  };
  window.CRM_DB.metricasPopups.historialEventos.unshift(evento);
  guardarEnMemoriaLocal();
  enviarDatosASheets("METRICA_POPUP", evento);
}
