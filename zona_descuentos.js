/* =========================================================
   ARCHIVO 11: zona_descuentos.js
   Gestiona la Zona de Códigos Promocionales y el Modo Híbrido
========================================================== */

function renderizarZonaDescuentos() {
  const zonaDescuentos = document.getElementById('zona-descuentos');
  if (!zonaDescuentos) return;

  // Generar código dinámico del día para el Modo Híbrido
  const codigoHoy = typeof obtenerCodigoFechaHoy === 'function' ? obtenerCodigoFechaHoy() : "PEGGY10%";

  zonaDescuentos.innerHTML = `
    <div class="space-y-3 text-xs">
      
      <!-- TARJETA MODO HÍBRIDO (AUTOMÁTICO POR FECHA) -->
      <div class="degradado-comercial rounded-3xl p-5 text-white shadow-xl relative overflow-hidden">
        <div class="absolute -right-5 -bottom-5 opacity-15 text-7xl font-extrabold">
          <i class="fa-solid fa-tags"></i>
        </div>
        <span class="inline-block text-[10px] uppercase tracking-wider bg-black/30 px-2.5 py-1 rounded-full font-extrabold mb-2">
          ✨ Modo Híbrido Activo (Fecha y Sinergia)
        </span>
        <h3 class="text-base font-extrabold mt-1">10% de Descuento por Temporada</h3>
        <p class="opacity-90 text-[11px] mb-4 leading-relaxed">
          Generado automáticamente por nuestro sistema según la fecha y el análisis de tus formularios de satisfacción. Aplícalo directo a tu bandeja.
        </p>
        <div class="flex items-center justify-between bg-black/30 backdrop-blur-sm rounded-2xl p-3 border border-white/15">
          <span class="font-mono font-extrabold text-sm tracking-widest text-amber-300">${codigoHoy}</span>
          <button onclick="aplicarCodigoPromocional('${codigoHoy}', 0, 10)" class="bg-white text-slate-950 px-3.5 py-2 rounded-xl text-xs font-extrabold shadow hover:bg-slate-100 transition">
            Aplicar 10% OFF
          </button>
        </div>
      </div>

      <!-- CUPÓN FIJO DE LEALTAD -->
      <div class="tarjeta-cristal rounded-2xl p-4 border border-emerald-500/30 space-y-2">
        <div class="flex justify-between items-start">
          <div>
            <span class="text-[10px] font-extrabold text-emerald-400 uppercase">Cupón Fijo</span>
            <h4 class="font-extrabold text-sm mt-0.5">Bono de Bienvenida Peggy</h4>
          </div>
          <span class="bg-emerald-500/20 text-emerald-300 font-extrabold px-2 py-0.5 rounded text-[10px]">-$15 MXN</span>
        </div>
        <p class="opacity-70 text-[11px]">Válido al pedir cualquier platillo de Especialidades o Hamburguesas.</p>
        <div class="flex items-center justify-between bg-slate-950 rounded-xl p-2.5 border border-slate-800">
          <span class="font-mono font-extrabold text-amber-400">BIENVENIDA15</span>
          <button onclick="aplicarCodigoPromocional('BIENVENIDA15', 15, 0)" class="bg-emerald-500 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-extrabold shadow hover:bg-emerald-400 transition">
            Aplicar Cupón
          </button>
        </div>
      </div>

      <!-- CAJA PARA INGRESAR CÓDIGO MANUAL -->
      <div class="tarjeta-cristal rounded-2xl p-4 space-y-2">
        <h4 class="font-extrabold text-sm">¿Tienes otro código promocional?</h4>
        <div class="flex gap-2">
          <input type="text" id="input-cupon-manual" placeholder="Escribe tu código..." class="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs uppercase font-mono" />
          <button onclick="validarCuponManual()" class="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-extrabold shadow hover:bg-amber-400 transition">Aplicar</button>
        </div>
      </div>

    </div>
  `;
}

function aplicarCodigoPromocional(codigo, montoFijo, porcentaje) {
  window.CRM_DB.descuentoActivo = {
    codigo: codigo,
    monto: montoFijo,
    porcentaje: porcentaje
  };

  if (typeof actualizarVistaCarrito === 'function') {
    actualizarVistaCarrito();
  }

  if (typeof cambiarZonaCliente === 'function') {
    cambiarZonaCliente('zona-tienda');
  }

  if (typeof hablarNotificacionVoz === 'function') {
    hablarNotificacionVoz(`¡Código ${codigo} aplicado con éxito a tu bandeja, ${obtenerSaludoCliente()}!`);
  }
}

function validarCuponManual() {
  const input = document.getElementById('input-cupon-manual');
  if (!input) return;
  const codigo = input.value.trim().toUpperCase();
  if (!codigo) return;

  // Si el código contiene "10%", aplicamos 10% de descuento por defecto
  if (codigo.includes("10") || codigo.includes("PEGGY")) {
    aplicarCodigoPromocional(codigo, 0, 10);
    input.value = "";
  } else {
    aplicarCodigoPromocional(codigo, 20, 0); // Descuento base de $20
    input.value = "";
  }
}

// Renderizar al cargar la zona
document.addEventListener('DOMContentLoaded', () => {
  renderizarZonaDescuentos();
});
