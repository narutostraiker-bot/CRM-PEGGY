/* =========================================================
   ARCHIVO 10: mesas_tiempos.js
   Controla la Fila de Mesas Digitales (máx 5), Mesa Física y Cocina
========================================================== */

function calcularMinutosEsperaGlobal() {
  const m = window.CRM_DB.mesas;
  const totalActivos = m.digitalesOcupadas + m.filaEsperaDigital + m.fisicasActivas;
  return (totalActivos * 10) + m.minutosExtraCocina;
}

function renderizarPanelMesas() {
  const panel = document.getElementById('vista-mesas');
  if (!panel) return;

  const m = window.CRM_DB.mesas;
  const esperaTotal = calcularMinutosEsperaGlobal();

  panel.innerHTML = `
    <div class="tarjeta-cristal rounded-2xl p-4 text-xs space-y-4">
      <div class="flex flex-wrap justify-between items-center gap-2 border-b border-white/10 pb-3">
        <div>
          <h2 class="text-base font-extrabold text-amber-400"><i class="fa-solid fa-fire-burner mr-1"></i> Control de Mesas y Cocina (KDS)</h2>
          <p class="opacity-70">Monitorea los 5 lugares digitales y la carga del comedor físico en tiempo real.</p>
        </div>
        <select id="select-tasa-intercalado" onchange="cambiarTasaIntercalado(this.value)" class="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 font-bold text-amber-300">
          <option value="1:1" ${m.tasaIntercalado === '1:1' ? 'selected' : ''}>Intercalado 1 Digital : 1 Física</option>
          <option value="1:2" ${m.tasaIntercalado === '1:2' ? 'selected' : ''}>Prioridad Local (1 Digital : 2 Físicas)</option>
          <option value="2:1" ${m.tasaIntercalado === '2:1' ? 'selected' : ''}>Prioridad Digital (2 Digitales : 1 Física)</option>
        </select>
      </div>

      <!-- Contadores en Vivo -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
        <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span class="opacity-60 block text-[10px]">Mesas Digitales</span>
          <span class="text-xl font-extrabold text-amber-400">${m.digitalesOcupadas} / ${m.maximoDigitales}</span>
        </div>
        <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span class="opacity-60 block text-[10px]">En Fila de Espera</span>
          <span class="text-xl font-extrabold text-rose-400">${m.filaEsperaDigital}</span>
        </div>
        <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span class="opacity-60 block text-[10px]">Mesas Físicas Local</span>
          <span class="text-xl font-extrabold text-sky-400">${m.fisicasActivas}</span>
        </div>
        <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span class="opacity-60 block text-[10px]">Reloj Global Espera</span>
          <span class="text-xl font-extrabold text-emerald-400">${esperaTotal} min</span>
        </div>
      </div>

      <!-- Botones Operativos de Cocina -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 font-bold">
        <button onclick="agregarMesaFisicaCocina()" class="p-2.5 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-300 hover:bg-sky-500/30 transition">
          + Mesa Física (Sin datos)
        </button>
        <button onclick="sumarMinutosCocinaGlobal(10)" class="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 transition">
          ⏱️ + Más Tiempo (+10m)
        </button>
        <button onclick="liberarMesaCocina()" class="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 transition">
          ✅ Despachar 1 Mesa
        </button>
        <button onclick="cancelarPedidoActualMesas()" class="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30 transition">
          ❌ Cancelar Pedido
        </button>
      </div>

      <!-- Tarjeta de Validación del Pedido Actual -->
      <div class="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-3">
        <h3 class="font-extrabold text-sm text-amber-400"><i class="fa-solid fa-clipboard-check mr-1"></i> Validación de Pedido Entrante</h3>
        <div id="detalle-pedido-mesas" class="opacity-80 text-xs">
          ${window.CRM_DB.pedidoActual.folio ? `
            <p><strong>Folio:</strong> ${window.CRM_DB.pedidoActual.folio} · <strong>Cliente:</strong> ${obtenerSaludoCliente()}</p>
            <p class="mt-1">El cliente está esperando que verifiques si los platillos de su carrito están disponibles.</p>
          ` : `
            <p class="italic opacity-60">No hay ningún pedido digital pendiente de validación en este momento.</p>
          `}
        </div>

        ${window.CRM_DB.pedidoActual.folio ? `
          <div class="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 font-extrabold">
            <button onclick="aprobarPedidoEnMesas()" class="py-2.5 px-3 rounded-xl bg-emerald-500 text-slate-950 shadow hover:bg-emerald-400 transition">
              ✅ Sí hay disponible (Activar Pago)
            </button>
            <button onclick="rechazarYActivarPopupSinergia()" class="py-2.5 px-3 rounded-xl degradado-comercial text-white shadow transition">
              📢 No hay (Lanzar Pop-up Comercial)
            </button>
          </div>
        ` : ''}
      </div>

    </div>
  `;
}

function cambiarTasaIntercalado(valor) {
  window.CRM_DB.mesas.tasaIntercalado = valor;
  renderizarPanelMesas();
}

function agregarMesaFisicaCocina() {
  window.CRM_DB.mesas.fisicasActivas++;
  renderizarPanelMesas();
  if (typeof hablarNotificacionVoz === 'function') {
    hablarNotificacionVoz("Se registró una nueva mesa física en el local.");
  }
}

function sumarMinutosCocinaGlobal(min) {
  window.CRM_DB.mesas.minutosExtraCocina += min;
  renderizarPanelMesas();
  if (typeof hablarNotificacionVoz === 'function') {
    hablarNotificacionVoz(`Atención comensales: cocina agregó ${min} minutos adicionales por alta demanda.`);
  }
}

function liberarMesaCocina() {
  const m = window.CRM_DB.mesas;
  if (m.filaEsperaDigital > 0) {
    m.filaEsperaDigital--;
    m.digitalesOcupadas++;
  } else if (m.digitalesOcupadas > 0) {
    m.digitalesOcupadas--;
  } else if (m.fisicasActivas > 0) {
    m.fisicasActivas--;
  }
  m.minutosExtraCocina = Math.max(0, m.minutosExtraCocina - 5);
  renderizarPanelMesas();
}

function aprobarPedidoEnMesas() {
  window.CRM_DB.pedidoActual.estadoSemaforo = "CONFIRMADO_PAGO";
  if (typeof actualizarSemaforoCliente === 'function') {
    actualizarSemaforoCliente("CONFIRMADO_PAGO", window.CRM_DB.pedidoActual.folio);
  }
  if (typeof desbloquearOpcionesPagoCliente === 'function') {
    desbloquearOpcionesPagoCliente('Efectivo'); // Valor por defecto para iniciar selector
  }
  renderizarPanelMesas();
}

function rechazarYActivarPopupSinergia() {
  if (typeof dispararPopupComercialSinergia === 'function') {
    dispararPopupComercialSinergia();
  }
}

function cancelarPedidoActualMesas() {
  window.CRM_DB.pedidoActual.estadoSemaforo = "CANCELADO";
  if (typeof actualizarSemaforoCliente === 'function') {
    actualizarSemaforoCliente("CANCELADO", window.CRM_DB.pedidoActual.folio, "El pedido ha sido cancelado por el establecimiento.");
  }
  window.CRM_DB.pedidoActual.folio = null;
  renderizarPanelMesas();
}
