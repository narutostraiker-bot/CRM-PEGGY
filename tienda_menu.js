/* =========================================================
   ARCHIVO 7: tienda_menu.js
   Muestra el catálogo con el Carrusel de 3 fotos y aviso legal de IA
========================================================== */

function renderizarTiendaYCarrito() {
  const zonaTienda = document.getElementById('zona-tienda');
  if (!zonaTienda) return;

  const c = window.CRM_DB.cliente;
  const esperaActual = typeof calcularMinutosEsperaGlobal === 'function' ? calcularMinutosEsperaGlobal() : 15;

  zonaTienda.innerHTML = `
    <!-- Resumen Superior Cliente + Fila -->
    <div class="tarjeta-cristal rounded-2xl p-3.5 mb-3 flex justify-between items-center text-xs shadow-md">
      <div>
        <p class="font-extrabold text-amber-400 text-sm">${c.trato} ${c.nombre}</p>
        <p class="opacity-70"><i class="fa-solid fa-location-dot text-emerald-400 mr-1"></i> ${c.ubicacionActiva}</p>
      </div>
      <div class="text-right">
        <span class="bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full font-bold border border-amber-500/30">⭐ ${c.puntos} pts</span>
        <p class="text-emerald-400 font-extrabold mt-1">⏱️ Espera: ${esperaActual} min</p>
      </div>
    </div>

    <!-- Buscador Instantáneo -->
    <div class="relative mb-3">
      <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-slate-400 text-xs"></i>
      <input type="text" id="buscador-catalogo" oninput="dibujarCatalogoPlatillos()" placeholder="Buscar tortas, hamburguesas, chilaquiles, SKU..."
        class="w-full bg-slate-950 border border-slate-700 rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:border-amber-500 focus:outline-none transition" />
    </div>

    <!-- Categorías Deslizables -->
    <div class="flex gap-2 overflow-x-auto ocultar-scroll pb-2 mb-3">
      <button onclick="filtrarCategoriaMenu('Todo')" class="cat-pill shrink-0 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-amber-500 text-slate-950 transition">Todo</button>
      <button onclick="filtrarCategoriaMenu('Hamburguesas')" class="cat-pill shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-900 border border-slate-800 text-slate-300 transition">🍔 Hamburguesas</button>
      <button onclick="filtrarCategoriaMenu('Tortas Gigantes')" class="cat-pill shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-900 border border-slate-800 text-slate-300 transition">🥖 Tortas</button>
      <button onclick="filtrarCategoriaMenu('Chilaquiles')" class="cat-pill shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-900 border border-slate-800 text-slate-300 transition">🌶️ Chilaquiles</button>
      <button onclick="filtrarCategoriaMenu('Tacos Gigantes')" class="cat-pill shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-900 border border-slate-800 text-slate-300 transition">🌮 Tacos</button>
      <button onclick="filtrarCategoriaMenu('Extras y Botanas')" class="cat-pill shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-900 border border-slate-800 text-slate-300 transition">🍟 Botanas</button>
    </div>

    <!-- Contenedor de la Lista de Platillos -->
    <div id="grid-catalogo-platillos" class="space-y-4"></div>
  `;

  dibujarCatalogoPlatillos();
}

let categoriaSeleccionadaGlobal = 'Todo';
function filtrarCategoriaMenu(cat) {
  categoriaSeleccionadaGlobal = cat;
  dibujarCatalogoPlatillos();
}

function dibujarCatalogoPlatillos() {
  const texto = (document.getElementById('buscador-catalogo')?.value || "").toLowerCase();
  const grid = document.getElementById('grid-catalogo-platillos');
  if (!grid) return;

  const catalogo = window.CRM_DB.catalogo;
  const filtrados = catalogo.filter(p => {
    const matchCat = categoriaSeleccionadaGlobal === 'Todo' || p.categoria.toLowerCase() === categoriaSeleccionadaGlobal.toLowerCase();
    const matchText = p.nombre.toLowerCase().includes(texto) || p.categoria.toLowerCase().includes(texto) || String(p.sku).includes(texto);
    return matchCat && matchText;
  });

  if (filtrados.length === 0) {
    grid.innerHTML = `<div class="tarjeta-cristal p-6 text-center opacity-60 text-xs">No se encontraron platillos con ese filtro.</div>`;
    return;
  }

  grid.innerHTML = filtrados.map(prod => {
    // Si no tiene fotos configuradas, asignamos placeholders por defecto
    const f = prod.fotos || {
      principal: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600",
      detalles: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600",
      oficialSKU: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600"
    };

    return `
      <div class="tarjeta-cristal rounded-3xl overflow-hidden shadow-lg border border-white/10 text-xs">
        
        <!-- CARRUSEL DE 3 FOTOS CON ETIQUETA DE IA -->
        <div class="contenedor-carrusel relative h-48 bg-slate-950">
          <span class="badge-ia-referencia"><i class="fa-solid fa-robot mr-1"></i> Imagen Ref. IA</span>
          
          <div id="carrusel-track-${prod.sku}" class="flex h-full w-full transition-transform duration-300 ease-in-out" style="transform: translateX(0%);">
            <div class="min-w-full h-full relative cursor-pointer" onclick="mostrarAvisoLegalIA(${prod.sku})">
              <img src="${f.principal}" class="w-full h-full object-cover" alt="${prod.nombre}" />
              <span class="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] font-bold text-amber-300">1. Foto Principal</span>
            </div>
            <div class="min-w-full h-full relative cursor-pointer" onclick="mostrarAvisoLegalIA(${prod.sku})">
              <img src="${f.detalles}" class="w-full h-full object-cover" alt="${prod.nombre} - Detalles" />
              <span class="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] font-bold text-sky-300">2. Ingredientes / Detalles</span>
            </div>
            <div class="min-w-full h-full relative cursor-pointer" onclick="mostrarAvisoLegalIA(${prod.sku})">
              <img src="${f.oficialSKU}" class="w-full h-full object-cover" alt="SKU y Precio" />
              <span class="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] font-bold text-emerald-300">3. SKU ${prod.sku} | $${prod.precio}</span>
            </div>
          </div>

          <!-- Controles de Flechas del Carrusel -->
          <button onclick="moverCarruselPlatillo(${prod.sku}, -1)" class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white w-7 h-7 rounded-full flex items-center justify-center transition shadow">
            <i class="fa-solid fa-chevron-left text-xs"></i>
          </button>
          <button onclick="moverCarruselPlatillo(${prod.sku}, 1)" class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white w-7 h-7 rounded-full flex items-center justify-center transition shadow">
            <i class="fa-solid fa-chevron-right text-xs"></i>
          </button>
        </div>

        <!-- INFORMACIÓN DEL PLATILLO -->
        <div class="p-3.5 space-y-2">
          <div class="flex justify-between items-start">
            <div>
              <span class="text-[10px] font-extrabold text-amber-400 uppercase tracking-wide">SKU: ${prod.sku} · ⏱️ ${prod.minutos} min</span>
              <h4 class="font-extrabold text-sm mt-0.5">${prod.nombre}</h4>
            </div>
            <span class="text-base font-extrabold text-emerald-400">$${prod.precio} MXN</span>
          </div>

          <button onclick="agregarAlCarritoPorSku(${prod.sku})" class="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold shadow transition flex items-center justify-center gap-1.5">
            <i class="fa-solid fa-cart-plus"></i> Agregar al Carrito
          </button>
        </div>

      </div>
    `;
  }).join('');
}

// Control de desplazamiento del carrusel por SKU
const indicesCarrusel = {};
function moverCarruselPlatillo(sku, direccion) {
  if (!indicesCarrusel[sku]) indicesCarrusel[sku] = 0;
  indicesCarrusel[sku] += direccion;
  if (indicesCarrusel[sku] > 2) indicesCarrusel[sku] = 0;
  if (indicesCarrusel[sku] < 0) indicesCarrusel[sku] = 2;

  const track = document.getElementById(`carrusel-track-${sku}`);
  if (track) {
    track.style.transform = `translateX(-${indicesCarrusel[sku] * 100}%)`;
  }
}

// Pop-up legal de Aviso de IA (Se muestra al inicio de cada platillo)
function mostrarAvisoLegalIA(sku) {
  const prod = window.CRM_DB.catalogo.find(p => p.sku === Number(sku));
  if (!prod) return;

  const contenedorPopup = document.getElementById('contenedor-popups');
  if (!contenedorPopup) return;

  contenedorPopup.innerHTML = `
    <div class="fixed inset-0 modal-aviso-ia flex items-center justify-center p-4 z-50">
      <div class="tarjeta-cristal rounded-3xl p-5 max-w-sm w-full text-xs border border-amber-400/40 shadow-2xl space-y-3">
        <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg font-extrabold">
          <i class="fa-solid fa-robot"></i>
        </div>
        <h3 class="text-sm font-extrabold">Aviso de Imagen de Referencia (IA)</h3>
        <p class="opacity-80 leading-relaxed">
          Te informamos que la fotografía de <strong>${prod.nombre}</strong> (SKU ${prod.sku}) es de carácter ilustrativo y fue generada con Inteligencia Artificial. El platillo final preparado en cocina conserva todos sus ingredientes de calidad, pero puede presentar variaciones visuales.
        </p>
        <button onclick="cerrarAvisoLegalIA()" class="w-full py-3 rounded-xl degradado-comercial text-white font-extrabold shadow transition">
          Entendido, ver platillo
        </button>
      </div>
    </div>
  `;
}

function cerrarAvisoLegalIA() {
  const contenedorPopup = document.getElementById('contenedor-popups');
  if (contenedorPopup) contenedorPopup.innerHTML = "";
}

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', () => {
  renderizarTiendaYCarrito();
});
