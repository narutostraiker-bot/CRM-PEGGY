/* =========================================================
   ARCHIVO 14: plataformas_externas.js
   Gestiona pedidos de DiDi Food, Uber Eats y Rappi con cálculo de comisiones
========================================================== */

function renderizarModuloPlataformasExternas() {
  const contenedorPlataformas = document.getElementById('vista-plataformas');
  if (!contenedorPlataformas) return;

  const pedidos = window.CRM_DB.plataformasExternas || [];

  contenedorPlataformas.innerHTML = `
    <div class="tarjeta-cristal rounded-2xl p-4 text-xs space-y-4">
      
      <div class="border-b border-white/10 pb-3">
        <h2 class="text-base font-extrabold text-amber-400"><i class="fa-solid fa-motorcycle mr-1"></i> Control de Plataformas Delivery</h2>
        <p class="opacity-70">Registra pedidos de DiDi Food, Uber Eats y Rappi[cite: 7, 8, 9, 10, 11, 12, 13, 14, 15] descontando comisiones y retenciones oficiales.</p>
      </div>

      <!-- Formulario de Registro de Pedido Externo -->
      <form onsubmit="guardarPedidoPlataformaExterna(event)" class="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-white/10">
        <div>
          <label class="font-bold block mb-1">Plataforma *</label>
          <select id="app-select-nombre" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 font-bold">
            <option value="DiDi Food">🟠 DiDi Food</option>
            <option value="Uber Eats">🟢 Uber Eats</option>
            <option value="Rappi">🔴 Rappi</option>
          </select>
        </div>

        <div>
          <label class="font-bold block mb-1">Método de Cobro en App *</label>
          <select id="app-select-metodo" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 font-bold">
            <option value="Tarjeta">💳 Tarjeta (Pago digital app)</option>
            <option value="Efectivo">💵 Efectivo (Recaudado en local)</option>
          </select>
        </div>

        <div>
          <label class="font-bold block mb-1"># de Pedido de la App *</label>
          <input type="text" id="app-input-folioapp" required placeholder="Ej. #DD-4829" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 font-mono" />
        </div>

        <div>
          <label class="font-bold block mb-1"># de Pedido Interno *</label>
          <input type="text" id="app-input-folioint" required placeholder="Ej. INT-0084" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 font-mono" />
        </div>

        <div>
          <label class="font-bold block mb-1">Costo / Venta Antes de la App ($) *</label>
          <input type="number" step="0.01" id="app-input-costoantes" required placeholder="Ej. 170" oninput="calcularNetoAutomaticoApp(this.value)" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 font-bold" />
        </div>

        <div>
          <label class="font-bold block mb-1">Neto Después de Comisión App ($) *</label>
          <input type="number" step="0.01" id="app-input-costodespues" required placeholder="Calculado aprox. -25%" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 font-bold text-emerald-400" />
        </div>

        <button type="submit" class="sm:col-span-2 py-3 rounded-xl degradado-comercial text-white font-extrabold shadow-lg transition hover:opacity-95">
          + Registrar Pedido de Delivery
        </button>
      </form>

      <!-- Historial de Pedidos de Apps -->
      <div class="space-y-2">
        <h3 class="font-extrabold text-sm">🧾 Historial de Pedidos Externos Recientes</h3>
        <div class="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          ${pedidos.length === 0 ? '<p class="opacity-60 italic text-center py-2">No hay pedidos externos registrados en este turno.</p>' : pedidos.map(p => `
            <div class="bg-slate-950 p-2.5 rounded-xl flex justify-between items-center border border-slate-800 text-[11px]">
              <div>
                <span class="font-bold text-amber-400">${p.app}</span> · <span class="font-mono">${p.folioApp}</span> (Int: ${p.folioInt})
                <p class="opacity-60">Pago: ${p.metodo} · ${p.fecha}</p>
              </div>
              <div class="text-right">
                <span class="line-through opacity-60 block">$${p.antes}</span>
                <strong class="text-emerald-400">Neto: $${p.despues}</strong>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;
}

function calcularNetoAutomaticoApp(valorAntes) {
  const val = Number(valorAntes);
  if (isNaN(val)) return;
  // Estimación estándar de comisión + retenciones en México (~25%)
  const netoEstimado = Math.round(val * 0.75 * 100) / 100;
  const inputDespues = document.getElementById('app-input-costodespues');
  if (inputDespues) inputDespues.value = netoEstimado;
}

function guardarPedidoPlataformaExterna(e) {
  e.preventDefault();
  const nuevoPedido = {
    fecha: new Date().toLocaleTimeString(),
    app: document.getElementById('app-select-nombre').value,
    metodo: document.getElementById('app-select-metodo').value,
    folioApp: document.getElementById('app-input-folioapp').value.trim(),
    folioInt: document.getElementById('app-input-folioint').value.trim(),
    antes: Number(document.getElementById('app-input-costoantes').value),
    despues: Number(document.getElementById('app-input-costodespues').value)
  };

  // Si el pago de la app fue en efectivo, se suma al efectivo recibido de apps en caja
  if (nuevoPedido.metodo === 'Efectivo') {
    window.CRM_DB.caja.efectivoRecibidoApps += nuevoPedido.antes;
  }

  window.CRM_DB.plataformasExternas.unshift(nuevoPedido);
  guardarEnMemoriaLocal();
  enviarDatosASheets("REGISTRAR_APP_EXTERNA", nuevoPedido);

  renderizarModuloPlataformasExternas();
  if (typeof hablarNotificacionVoz === 'function') {
    hablarNotificacionVoz(`Pedido de ${nuevoPedido.app} registrado correctamente.`);
  }
}

// Renderizar al cargar la sección
document.addEventListener('DOMContentLoaded', () => {
  renderizarModuloPlataformasExternas();
});
