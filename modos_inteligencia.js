/* =========================================================
   ARCHIVO 13: modos_inteligencia.js
   Controla los 3 Modos Comerciales (Manual, Automático e Híbrido) y Editor Admin
========================================================== */

function renderizarModuloModosInteligencia() {
  const contenedorModos = document.getElementById('vista-modos');
  if (!contenedorModos) return;

  const modos = window.CRM_DB.modos;
  const catalogo = window.CRM_DB.catalogo;
  const codigoHoy = typeof obtenerCodigoFechaHoy === 'function' ? obtenerCodigoFechaHoy() : "PEGGY10%";

  contenedorModos.innerHTML = `
    <div class="tarjeta-cristal rounded-2xl p-4 text-xs space-y-4">
      
      <!-- Selector de Modos -->
      <div class="border-b border-white/10 pb-3 flex flex-wrap justify-between items-center gap-2">
        <div>
          <h2 class="text-base font-extrabold text-amber-400"><i class="fa-solid fa-brain mr-1"></i> Inteligencia Comercial y 3 Modos</h2>
          <p class="opacity-70">Alterna entre control manual, recomendaciones automáticas y cupones híbridos por fecha.</p>
        </div>
        <div class="flex gap-1.5 font-bold">
          <button onclick="cambiarModoComercial('MANUAL')" class="px-3 py-1.5 rounded-xl ${modos.modoActivo === 'MANUAL' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-300 border border-slate-700'}">Manual</button>
          <button onclick="cambiarModoComercial('AUTOMATICO')" class="px-3 py-1.5 rounded-xl ${modos.modoActivo === 'AUTOMATICO' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-300 border border-slate-700'}">Automático</button>
          <button onclick="cambiarModoComercial('HIBRIDO')" class="px-3 py-1.5 rounded-xl ${modos.modoActivo === 'HIBRIDO' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-300 border border-slate-700'}">Híbrido</button>
        </div>
      </div>

      <!-- VISTA MODO MANUAL (Editor Admin sin tocar código) -->
      <div id="seccion-modo-manual" class="space-y-3 ${modos.modoActivo === 'MANUAL' ? '' : 'hidden'}">
        <div class="flex justify-between items-center">
          <h3 class="font-extrabold text-sm">🛠️ Editor Administrador de Menú (Modo Manual)</h3>
          <span class="text-emerald-400 font-bold">${catalogo.length} SKUs activos</span>
        </div>

        <div class="space-y-2 max-h-60 overflow-y-auto pr-1">
          ${catalogo.map(prod => `
            <div class="bg-slate-950 p-2.5 rounded-xl flex justify-between items-center border border-slate-800">
              <div>
                <span class="font-mono font-bold text-amber-400">SKU ${prod.sku}</span> · <span class="font-bold">${prod.nombre}</span>
                <p class="opacity-60 text-[10px]">${prod.categoria} · ⏱️ ${prod.minutos}m</p>
              </div>
              <div class="flex items-center gap-2">
                <strong class="text-emerald-400">$${prod.precio}</strong>
                <button onclick="alternarDisponibilidadAdmin(${prod.sku})" class="px-2.5 py-1 rounded-lg ${prod.disponible ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'} font-bold">
                  ${prod.disponible ? 'Disponible' : 'Agotado'}
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- VISTA MODO AUTOMÁTICO (Recomendaciones Google Forms / Telemetría) -->
      <div id="seccion-modo-automatico" class="space-y-3 ${modos.modoActivo === 'AUTOMATICO' ? '' : 'hidden'}">
        <h3 class="font-extrabold text-sm">🤖 Sugerencias Automáticas (Basadas en Formularios y Ventas)</h3>
        <div class="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
          <p class="opacity-90">El motor analizó que las <strong>Hamburguesas y Tacos Gigantes</strong> tienen alta rotación en fines de semana.</p>
          <div class="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300">
            <strong>Sugerencia IA:</strong> Crear combo especial de fin de semana con Hamburguesa a la Peggy + Papas.
          </div>
        </div>
      </div>

      <!-- VISTA MODO HÍBRIDO (Cupones por Fecha) -->
      <div id="seccion-modo-hibrido" class="space-y-3 ${modos.modoActivo === 'HIBRIDO' ? '' : 'hidden'}">
        <h3 class="font-extrabold text-sm">📅 Modo Híbrido (Códigos Automáticos por Fecha)</h3>
        <div class="degradado-comercial p-4 rounded-2xl text-white space-y-2 shadow">
          <span class="bg-black/30 px-2 py-0.5 rounded text-[10px] font-extrabold">Código Activo Hoy</span>
          <p class="text-base font-mono font-extrabold tracking-widest text-amber-300">${codigoHoy}</p>
          <p class="text-[11px] opacity-90">Este código se genera combinando el día actual y las reglas de satisfacción configuradas en tus formularios.</p>
        </div>
      </div>

    </div>
  `;
}

function cambiarModoComercial(modo) {
  window.CRM_DB.modos.modoActivo = modo;
  guardarEnMemoriaLocal();
  renderizarModuloModosInteligencia();
}

function alternarDisponibilidadAdmin(sku) {
  const prod = window.CRM_DB.catalogo.find(p => p.sku === Number(sku));
  if (prod) {
    prod.disponible = !prod.disponible;
    guardarEnMemoriaLocal();
    renderizarModuloModosInteligencia();
    if (typeof dibujarCatalogoPlatillos === 'function') dibujarCatalogoPlatillos();
  }
}

// Renderizar al cargar la sección
document.addEventListener('DOMContentLoaded', () => {
  renderizarModuloModosInteligencia();
});
