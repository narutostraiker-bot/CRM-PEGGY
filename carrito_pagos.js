/* =========================================================
   ARCHIVO 8: carrito_pagos.js
   Controla el Carrito, Empaque, Envío, Comisión de Tarjeta y Pagos
========================================================== */

function agregarAlCarritoPorSku(sku) {
  const prod = window.CRM_DB.catalogo.find(p => p.sku === Number(sku));
  if (!prod) return;

  const itemCarrito = {
    ...prod,
    idUnico: Date.now() + Math.random(),
    quitados: [],
    extrasSeleccionados: []
  };

  window.CRM_DB.carrito.push(itemCarrito);
  actualizarVistaCarrito();
  if (typeof hablarNotificacionVoz === 'function') {
    hablarNotificacionVoz(`${prod.nombre} agregado al carrito.`);
  }
}

function quitarDelCarritoPorIndice(indice) {
  window.CRM_DB.carrito.splice(indice, 1);
  actualizarVistaCarrito();
}

function actualizarVistaCarrito() {
  const contenedor = document.getElementById('contenedor-carrito');
  if (!contenedor) return;

  const carrito = window.CRM_DB.carrito;
  const negocio = window.CRM_DB.negocio;
  const empaque = window.CRM_DB.cargosEmpaque;
  const paraLlevar = window.CRM_DB.paraLlevar;

  if (carrito.length === 0) {
    contenedor.innerHTML = `
      <div class="tarjeta-cristal rounded-2xl p-4 text-center text-xs opacity-60">
        <i class="fa-solid fa-cart-shopping text-2xl mb-1"></i>
        <p>Tu carrito de compras está vacío.</p>
      </div>
    `;
    return;
  }

  // Cálculos financieros
  const subtotalProductos = carrito.reduce((acc, el) => acc + el.precio, 0);
  
  let costoEmpaqueTotal = 0;
  if (paraLlevar.contenedores > 0) costoEmpaqueTotal += paraLlevar.contenedores * empaque.contenedor;
  if (paraLlevar.incluyeUtensilios) costoEmpaqueTotal += empaque.utensilios;
  if (paraLlevar.incluyeBolsa) costoEmpaqueTotal += empaque.bolsa;

  const descuento = window.CRM_DB.descuentoActivo.monto || 0;
  const subtotalConEmpaque = Math.max(0, subtotalProductos + costoEmpaqueTotal - descuento);

  // Regla de Envío: Gratis con compra mínima de $120
  const costoEnvio = subtotalConEmpaque >= negocio.compraMinimaEnvioGratis ? 0 : negocio.costoEnvioMenorMinimo;
  const totalSinTarjeta = subtotalConEmpaque + costoEnvio;

  contenedor.innerHTML = `
    <div class="tarjeta-cristal rounded-2xl p-4 text-xs space-y-3">
      <div class="flex justify-between items-center border-b border-white/10 pb-2">
        <h3 class="font-extrabold text-sm"><i class="fa-solid fa-cart-shopping text-amber-400 mr-1"></i> Tu Bandeja (${carrito.length} items)</h3>
        <button onclick="window.CRM_DB.carrito = []; actualizarVistaCarrito();" class="text-rose-400 font-bold hover:underline">Vaciar</button>
      </div>

      <!-- Lista de Productos -->
      <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
        ${carrito.map((item, idx) => `
          <div class="bg-slate-950 p-2.5 rounded-xl flex justify-between items-center border border-slate-800">
            <div>
              <p class="font-bold">${item.nombre}</p>
              <p class="text-[10px] opacity-60 font-mono">SKU: ${item.sku} · ⏱️ ${item.minutos}m</p>
            </div>
            <div class="flex items-center gap-2">
              <strong class="text-emerald-400">$${item.precio}</strong>
              <button onclick="quitarDelCarritoPorIndice(${idx})" class="text-rose-400 p-1"><i class="fa-solid fa-trash-can text-xs"></i></button>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Opciones de Empaque para Llevar -->
      <div class="bg-black/30 p-2.5 rounded-xl border border-white/10 space-y-2">
        <span class="font-bold block opacity-90">🛍️ Opciones de Empaque para Llevar:</span>
        <div class="grid grid-cols-2 gap-2 text-[11px]">
          <label class="flex items-center gap-1.5 cursor-pointer">
            <input type="number" min="0" value="${paraLlevar.contenedores}" onchange="actualizarEmpaqueConfig('contenedores', this.value)" class="w-12 bg-slate-950 border border-slate-700 rounded-lg p-1 text-center font-bold" />
            <span>Contenedores ($${empaque.contenedor} c/u)</span>
          </label>
          <label class="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" ${paraLlevar.incluyeUtensilios ? 'checked' : ''} onchange="actualizarEmpaqueConfig('utensilios', this.checked)" class="rounded" />
            <span>Utensilios ($${empaque.utensilios})</span>
          </label>
          <label class="flex items-center gap-1.5 cursor-pointer col-span-2">
            <input type="checkbox" ${paraLlevar.incluyeBolsa ? 'checked' : ''} onchange="actualizarEmpaqueConfig('bolsa', this.checked)" class="rounded" />
            <span>Bolsa de plástico ($${empaque.bolsa})</span>
          </label>
        </div>
      </div>

      <!-- Resumen Financiero -->
      <div class="space-y-1 text-[11px] pt-1 border-t border-white/10">
        <div class="flex justify-between"><span>Subtotal platillos:</span> <strong>$${subtotalProductos}</strong></div>
        <div class="flex justify-between"><span>Cargos de empaque:</span> <strong>+$${costoEmpaqueTotal}</strong></div>
        ${descuento > 0 ? `<div class="flex justify-between text-emerald-400"><span>Descuento aplicado:</span> <strong>-$${descuento}</strong></div>` : ''}
        <div class="flex justify-between">
          <span>Envío (${subtotalConEmpaque >= negocio.compraMinimaEnvioGratis ? '¡Gratis por compra > $120!' : 'Menor a $120'}):</span>
          <strong class="${costoEnvio === 0 ? 'text-emerald-400' : ''}">${costoEnvio === 0 ? 'GRATIS' : '+$' + costoEnvio}</strong>
        </div>
      </div>

      <div class="flex justify-between items-center border-t border-white/10 pt-2 text-base">
        <span class="font-bold">Total a Pagar:</span>
        <span class="font-extrabold text-amber-400">$<span id="span-total-final">${totalSinTarjeta}</span> MXN</span>
      </div>

      <!-- Botón para enviar a validación de Mesas -->
      <button onclick="enviarPedidoAMesasDesdeCarrito()" class="w-full py-3 rounded-xl degradado-comercial text-white font-extrabold shadow-lg transition hover:opacity-95">
        Solicitar Pedido (Validar en Mesas)
      </button>
    </div>
  `;
}

function actualizarEmpaqueConfig(tipo, valor) {
  if (tipo === 'contenedores') window.CRM_DB.paraLlevar.contenedores = Number(valor);
  if (tipo === 'utensilios') window.CRM_DB.paraLlevar.incluyeUtensilios = Boolean(valor);
  if (tipo === 'bolsa') window.CRM_DB.paraLlevar.incluyeBolsa = Boolean(valor);
  actualizarVistaCarrito();
}

function enviarPedidoAMesasDesdeCarrito() {
  const carrito = window.CRM_DB.carrito;
  if (carrito.length === 0) return alert("Agrega al menos un producto.");

  const totalCalculado = Number(document.getElementById('span-total-final').textContent);
  window.CRM_DB.pedidoActual.folio = "ORD-" + Math.floor(1000 + Math.random() * 9000);
  
  if (typeof actualizarSemaforoCliente === 'function') {
    actualizarSemaforoCliente("VALIDANDO_MESAS", window.CRM_DB.pedidoActual.folio);
  }

  if (typeof hablarNotificacionVoz === 'function') {
    hablarNotificacionVoz(`${obtenerSaludoCliente()}, tu pedido fue enviado al área de mesas para verificar disponibilidad.`);
  }

  // Notificar al sistema de mesas
  if (typeof renderizarPanelMesas === 'function') {
    renderizarPanelMesas();
  }
}

function desbloquearOpcionesPagoCliente(metodo) {
  window.CRM_DB.pedidoActual.metodoPago = metodo;
  const subtotalBase = Number(document.getElementById('span-total-final').textContent);
  
  let totalConComision = subtotalBase;
  let textoComision = "";

  // Regla: Comisión del 5% sobre el monto total al pagar con tarjeta
  if (metodo === 'Tarjeta') {
    const comision = Math.round(subtotalBase * (window.CRM_DB.negocio.comisionTarjetaPorcentaje / 100));
    totalConComision += comision;
    textoComision = ` (Incluye 5% de comisión por tarjeta: +$${comision})`;
  }

  const contenedorSemaforo = document.getElementById('contenedor-semaforo');
  if (!contenedorSemaforo) return;

  contenedorSemaforo.innerHTML = `
    <div class="p-3.5 rounded-2xl border semaforo-confirmado text-xs shadow-lg space-y-2">
      <p class="font-extrabold">🔵 MESAS CONFIRMÓ TU PEDIDO (${metodo})</p>
      <p class="opacity-90">Total final a cobrar: <strong class="text-amber-300">$${totalConComision} MXN</strong>${textoComision}</p>
      <button onclick="finalizarPagoCliente('${metodo}', ${totalConComision})" class="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold shadow hover:bg-emerald-400 transition">
        Confirmar y Pagar $${totalConComision} MXN
      </button>
    </div>
  `;
}

function finalizarPagoCliente(metodo, montoTotal) {
  window.CRM_DB.pedidoActual.pagado = true;
  window.CRM_DB.pedidoActual.estadoSemaforo = "EN_COCINA";

  // Registrar venta local en caja
  if (metodo === 'Efectivo') window.CRM_DB.caja.ventasEfectivoLocal += montoTotal;
  else if (metodo === 'Tarjeta') window.CRM_DB.caja.ventasTarjetaLocal += montoTotal;

  // Registrar en últimas compras del cliente
  window.CRM_DB.cliente.ultimasCompras.unshift({
    fecha: new Date().toLocaleDateString(),
    resumen: window.CRM_DB.carrito.map(i => i.nombre).join(', '),
    total: montoTotal,
    itemsIds: window.CRM_DB.carrito.map(i => i.sku)
  });

  // Limpiar carrito
  window.CRM_DB.carrito = [];
  guardarEnMemoriaLocal();

  if (typeof actualizarSemaforoCliente === 'function') {
    actualizarSemaforoCliente("EN_COCINA", window.CRM_DB.pedidoActual.folio, `Pago confirmado con ${metodo}. Su orden ya se encuentra en proceso en cocina.`);
  }

  actualizarVistaCarrito();
}
