/* =========================================================
   ARCHIVO 6: perfil_cliente.js
   Gestiona la Zona 1: Mi Perfil, Direcciones, Puntos y Historial
========================================================== */

function renderizarModuloPerfil() {
  const zonaPerfil = document.getElementById('zona-perfil');
  if (!zonaPerfil) return;

  const c = window.CRM_DB.cliente;

  zonaPerfil.innerHTML = `
    <div class="space-y-4 text-xs">
      
      <!-- TARJETA PRINCIPAL DEL PERFIL Y FOTO -->
      <div class="tarjeta-cristal rounded-2xl p-4 flex items-center gap-4">
        <div class="relative">
          <img id="img-avatar-perfil" src="${c.foto}" class="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md" alt="Avatar" />
          <label class="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer shadow hover:bg-amber-400 transition">
            <i class="fa-solid fa-camera text-xs"></i>
            <input type="file" accept="image/*" class="hidden" onchange="cambiarFotoPerfilCliente(event)" />
          </label>
        </div>
        <div>
          <h3 class="font-extrabold text-base">${c.trato} ${c.nombre} ${c.apellido}</h3>
          <p class="opacity-70">📱 ${c.telefono} · ${c.correo || 'Sin correo'}</p>
          <span class="inline-block mt-1 px-2 py-0.5 rounded bg-black/30 text-amber-400 font-bold border border-amber-500/30">
            Trato activo: ${c.trato}
          </span>
        </div>
      </div>

      <!-- ZONA DE PUNTOS Y CANJE DE CÓDIGOS -->
      <div class="tarjeta-cristal rounded-2xl p-4">
        <div class="flex justify-between items-center mb-2">
          <h4 class="font-extrabold text-sm"><i class="fa-solid fa-star text-amber-400 mr-1"></i> Mis Puntos y Lealtad</h4>
          <span class="text-amber-400 font-extrabold text-sm">⭐ <span id="span-puntos-val">${c.puntos}</span> pts</span>
        </div>
        <div class="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mb-3">
          <div class="degradado-comercial h-full" style="width: ${Math.min(100, (c.puntos / 200) * 100)}%"></div>
        </div>
        <div class="flex gap-2">
          <input type="text" id="input-codigo-canje" placeholder="Ingresa código o cupón..." class="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs uppercase font-mono" />
          <button onclick="canjearCodigoPerfil()" class="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-extrabold shadow hover:bg-amber-400 transition">Canjear</button>
        </div>
      </div>

      <!-- MIS DIRECCIONES GUARDADAS -->
      <div class="tarjeta-cristal rounded-2xl p-4">
        <h4 class="font-extrabold text-sm mb-2"><i class="fa-solid fa-location-dot text-emerald-400 mr-1"></i> Mis Ubicaciones Guardadas</h4>
        <div id="lista-direcciones-guardadas" class="space-y-2 mb-3">
          ${c.direcciones.map((dir, idx) => `
            <div onclick="seleccionarDireccionActiva(${idx})" class="p-2.5 rounded-xl bg-slate-950 border ${c.ubicacionActiva.includes(dir.direccion) ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800'} flex justify-between items-center cursor-pointer transition">
              <span><strong>${dir.etiqueta}:</strong> ${dir.direccion}</span>
              <span class="text-[10px] ${c.ubicacionActiva.includes(dir.direccion) ? 'text-emerald-400 font-extrabold' : 'opacity-60'}">${c.ubicacionActiva.includes(dir.direccion) ? 'Activa hoy' : 'Seleccionar'}</span>
            </div>
          `).join('')}
        </div>

        <div class="grid grid-cols-3 gap-1.5">
          <select id="nueva-etiqueta-dir" class="bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 font-bold text-[11px]">
            <option value="🏠 Casa">🏠 Casa</option>
            <option value="💼 Trabajo">💼 Trabajo</option>
            <option value="❤️ Con mi novi@">❤️ Con mi novi@</option>
            <option value="📍 Otra">📍 Otra</option>
          </select>
          <input type="text" id="nueva-calle-dir" placeholder="Calle y número..." class="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-xs" />
          <button onclick="agregarNuevaDireccionPerfil()" class="rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold transition">+ Guardar</button>
        </div>
      </div>

      <!-- HISTORIAL DE ÚLTIMAS COMPRAS -->
      <div class="tarjeta-cristal rounded-2xl p-4">
        <h4 class="font-extrabold text-sm mb-2"><i class="fa-solid fa-receipt text-sky-400 mr-1"></i> Últimas Compras</h4>
        <div id="lista-ultimas-compras" class="space-y-2">
          ${c.ultimasCompras.length === 0 ? '<p class="opacity-60 italic text-center py-2">Aún no tienes compras registradas en este dispositivo.</p>' : c.ultimasCompras.map(compra => `
            <div class="bg-slate-950 p-3 rounded-xl flex justify-between items-center border border-slate-800">
              <div>
                <p class="font-bold">${compra.resumen}</p>
                <p class="opacity-60 text-[10px]">${compra.fecha} · <strong class="text-emerald-400">$${compra.total} MXN</strong></p>
              </div>
              <button onclick="repetirUltimaCompra(${JSON.stringify(compra.itemsIds).replace(/"/g, '&quot;')})" class="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold hover:bg-amber-500/30 transition">
                Repetir
              </button>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;
}

function cambiarFotoPerfilCliente(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    window.CRM_DB.cliente.foto = e.target.result;
    document.getElementById('img-avatar-perfil').src = e.target.result;
    guardarEnMemoriaLocal();
  };
  reader.readAsDataURL(file);
}

function seleccionarDireccionActiva(idx) {
  const dir = window.CRM_DB.cliente.direcciones[idx];
  window.CRM_DB.cliente.ubicacionActiva = `${dir.etiqueta}: ${dir.direccion}`;
  guardarEnMemoriaLocal();
  renderizarModuloPerfil();
}

function agregarNuevaDireccionPerfil() {
  const etiqueta = document.getElementById('nueva-etiqueta-dir').value;
  const direccion = document.getElementById('nueva-calle-dir').value.trim();
  if (!direccion) return alert("Escribe la dirección y número.");

  window.CRM_DB.cliente.direcciones.push({ etiqueta, direccion });
  window.CRM_DB.cliente.ubicacionActiva = `${etiqueta}: ${direccion}`;
  document.getElementById('nueva-calle-dir').value = "";
  guardarEnMemoriaLocal();
  renderizarModuloPerfil();
}

function canjearCodigoPerfil() {
  const codigo = document.getElementById('input-codigo-canje').value.trim().toUpperCase();
  if (!codigo) return;
  window.CRM_DB.cliente.puntos += 50;
  document.getElementById('input-codigo-canje').value = "";
  guardarEnMemoriaLocal();
  renderizarModuloPerfil();
  if (typeof hablarNotificacionVoz === 'function') {
    hablarNotificacionVoz(`${obtenerSaludoCliente()}, código canjeado con éxito. Sumaste 50 puntos.`);
  }
}

function repetirUltimaCompra(itemsIds) {
  if (!Array.isArray(itemsIds)) return;
  window.CRM_DB.carrito = [];
  itemsIds.forEach(id => {
    const prod = window.CRM_DB.catalogo.find(p => p.sku === Number(id));
    if (prod) window.CRM_DB.carrito.push({ ...prod, idUnico: Date.now() + Math.random(), extrasSeleccionados: [], quitados: [] });
  });
  if (typeof cambiarZonaCliente === 'function') cambiarZonaCliente('zona-tienda');
  if (typeof actualizarVistaCarrito === 'function') actualizarVistaCarrito();
  if (typeof hablarNotificacionVoz === 'function') {
    hablarNotificacionVoz(`Tus platillos favoritos han sido cargados al carrito, ${obtenerSaludoCliente()}.`);
  }
}

// Renderizar al cambiar a la zona de perfil
document.addEventListener('DOMContentLoaded', () => {
  renderizarModuloPerfil();
});
