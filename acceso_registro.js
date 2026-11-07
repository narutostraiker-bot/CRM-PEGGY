/* =========================================================
   ARCHIVO 5: acceso_registro.js
   Controla el Acceso, Registro con 10 dígitos, Trato y Temas
========================================================== */

function iniciarModuloAcceso() {
  const contenedorAcceso = document.getElementById('vista-acceso');
  if (!contenedorAcceso) return;

  contenedorAcceso.innerHTML = `
    <div class="tarjeta-cristal rounded-3xl p-6 shadow-2xl text-center">
      <div class="w-16 h-16 mx-auto mb-4 rounded-2xl degradado-comercial flex items-center justify-center shadow-lg">
        <i class="fa-solid fa-burger text-3xl text-white"></i>
      </div>
      <h1 class="text-xl font-extrabold tracking-tight mb-1">¡Bienvenido a Peggy Burgers Silvia!</h1>
      <p class="text-xs opacity-80 mb-6">El Sabor Auténtico. Selecciona una opción para comenzar:</p>

      <!-- Selector de Temas Visuales sin romper la Sinergia -->
      <div class="mb-5 p-3 rounded-2xl bg-black/20 border border-white/10 text-left">
        <label class="text-[11px] font-bold block mb-2 opacity-90">🎨 Elige el Tema Visual de tu App:</label>
        <div class="grid grid-cols-4 gap-1.5 text-[10px] font-bold">
          <button onclick="cambiarTemaVisual('oscuro')" class="py-1.5 px-2 rounded-lg bg-slate-900 border border-slate-700 text-amber-400">🌙 Oscuro</button>
          <button onclick="cambiarTemaVisual('blanco')" class="py-1.5 px-2 rounded-lg bg-slate-100 text-slate-900 border border-slate-300">☀️ Blanco</button>
          <button onclick="cambiarTemaVisual('grises')" class="py-1.5 px-2 rounded-lg bg-zinc-900 text-zinc-300 border border-zinc-700">⬛ Grises</button>
          <button onclick="cambiarTemaVisual('azul')" class="py-1.5 px-2 rounded-lg bg-sky-950 text-sky-300 border border-sky-800">🌊 Azul</button>
        </div>
      </div>

      <p class="text-amber-400 font-bold text-xs uppercase tracking-wider mb-3">¿Ya has comido aquí antes?</p>

      <div class="space-y-2.5">
        <button onclick="mostrarFormularioRegistro()" class="w-full py-3.5 px-4 rounded-2xl degradado-comercial font-extrabold text-white shadow-lg flex items-center justify-between transition">
          <span class="flex items-center gap-2.5 text-left">
            <i class="fa-solid fa-wand-magic-sparkles text-lg"></i>
            <span>
              <span class="block text-sm">Es mi primera vez</span>
              <span class="block text-[10px] opacity-90 font-normal">Crear perfil y acumular puntos</span>
            </span>
          </span>
          <i class="fa-solid fa-chevron-right text-xs"></i>
        </button>

        <button onclick="mostrarFormularioLogin()" class="w-full py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-bold text-slate-100 flex items-center justify-between transition">
          <span class="flex items-center gap-2.5 text-left">
            <i class="fa-solid fa-user-check text-lg text-emerald-400"></i>
            <span>
              <span class="block text-sm">Sí, ya había venido</span>
              <span class="block text-[10px] opacity-70 font-normal">Iniciar sesión con mi teléfono</span>
            </span>
          </span>
          <i class="fa-solid fa-chevron-right text-xs opacity-70"></i>
        </button>
      </div>
    </div>
  `;
}

function cambiarTemaVisual(tema) {
  document.body.classList.remove('tema-blanco', 'tema-grises', 'tema-azul');
  if (tema === 'blanco') document.body.classList.add('tema-blanco');
  if (tema === 'grises') document.body.classList.add('tema-grises');
  if (tema === 'azul') document.body.classList.add('tema-azul');
  localStorage.setItem("PEGGY_TEMA_VISUAL", tema);
}

function mostrarFormularioRegistro() {
  const contenedorAcceso = document.getElementById('vista-acceso');
  contenedorAcceso.innerHTML = `
    <div class="tarjeta-cristal rounded-3xl p-6 shadow-2xl text-xs">
      <button onclick="iniciarModuloAcceso()" class="opacity-70 hover:opacity-100 mb-4 flex items-center gap-2 font-bold">
        <i class="fa-solid fa-arrow-left"></i> Volver
      </button>
      <h2 class="text-lg font-extrabold mb-1">Registro de Comensal</h2>
      <p class="opacity-70 mb-4">Indícanos tus datos para coordinar entregas y avisarte por voz.</p>

      <form onsubmit="procesarRegistroCliente(event)" class="space-y-3">
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="font-bold block mb-1">Nombre *</label>
            <input type="text" id="reg-nombre" required placeholder="Ej. Sofía" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5" />
          </div>
          <div>
            <label class="font-bold block mb-1">Apellido *</label>
            <input type="text" id="reg-apellido" required placeholder="Ej. Ramírez" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5" />
          </div>
        </div>

        <div>
          <label class="font-bold block mb-1">Trato en el sistema *</label>
          <div class="grid grid-cols-3 gap-1.5 text-center font-bold">
            <label class="cursor-pointer">
              <input type="radio" name="reg-sexo" value="F" checked class="peer hidden" />
              <div class="py-2 rounded-xl border border-slate-700 bg-slate-950 peer-checked:border-amber-500 peer-checked:bg-amber-500/20">👩 Señorita</div>
            </label>
            <label class="cursor-pointer">
              <input type="radio" name="reg-sexo" value="M" class="peer hidden" />
              <div class="py-2 rounded-xl border border-slate-700 bg-slate-950 peer-checked:border-amber-500 peer-checked:bg-amber-500/20">👨 Joven</div>
            </label>
            <label class="cursor-pointer">
              <input type="radio" name="reg-sexo" value="N" class="peer hidden" />
              <div class="py-2 rounded-xl border border-slate-700 bg-slate-950 peer-checked:border-amber-500 peer-checked:bg-amber-500/20">✨ Nombre</div>
            </label>
          </div>
        </div>

        <div>
          <div class="flex justify-between mb-1">
            <label class="font-bold">Teléfono Celular (10 dígitos) *</label>
            <span id="reg-tel-contador" class="text-red-400 font-bold">0 / 10</span>
          </div>
          <input type="tel" id="reg-telefono" maxlength="10" inputmode="numeric" required placeholder="7221234567"
            oninput="validarTelefonoDiezDigitos(this)"
            class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono tracking-widest text-sm" />
          <p id="reg-tel-aviso" class="text-[10px] text-amber-400 mt-1">Debe ingresar exactamente 10 dígitos numéricos.</p>
        </div>

        <div>
          <label class="font-bold block mb-1">Ubicación de entrega *</label>
          <select id="reg-etiqueta-dir" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 mb-1.5 font-bold">
            <option value="🏠 Casa">🏠 Casa</option>
            <option value="💼 Trabajo">💼 Trabajo</option>
            <option value="❤️ Con mi novi@">❤️ Con mi novi@</option>
          </select>
          <input type="text" id="reg-calle-dir" required placeholder="Calle, número y referencias (ej. De las Palmas 97)..." class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5" />
        </div>

        <button type="submit" id="btn-enviar-reg" disabled class="w-full py-3.5 rounded-xl bg-slate-800 text-slate-500 font-extrabold cursor-not-allowed transition">
          Completa los 10 dígitos del teléfono
        </button>
      </form>
    </div>
  `;
}

function validarTelefonoDiezDigitos(input) {
  input.value = input.value.replace(/\D/g, '').slice(0, 10);
  const len = input.value.length;
  document.getElementById('reg-tel-contador').textContent = `${len} / 10`;
  const btn = document.getElementById('btn-enviar-reg');
  const aviso = document.getElementById('reg-tel-aviso');

  if (len === 10) {
    input.className = "w-full bg-slate-950 border border-emerald-500 rounded-xl p-2.5 font-mono tracking-widest text-sm input-valido";
    aviso.textContent = "✅ Teléfono de 10 dígitos validado correctamente.";
    aviso.className = "text-[10px] text-emerald-400 mt-1 font-bold";
    btn.disabled = false;
    btn.className = "w-full py-3.5 rounded-xl degradado-comercial text-white font-extrabold shadow-lg cursor-pointer transition";
    btn.textContent = "¡Registrarme e Ingresar al Menú!";
  } else {
    input.className = "w-full bg-slate-950 border border-red-500 rounded-xl p-2.5 font-mono tracking-widest text-sm input-invalido";
    aviso.textContent = `Faltan ${10 - len} dígitos para habilitar el botón.`;
    aviso.className = "text-[10px] text-amber-400 mt-1";
    btn.disabled = true;
    btn.className = "w-full py-3.5 rounded-xl bg-slate-800 text-slate-500 font-extrabold cursor-not-allowed transition";
    btn.textContent = "Completa los 10 dígitos del teléfono";
  }
}

function procesarRegistroCliente(e) {
  e.preventDefault();
  const c = window.CRM_DB.cliente;
  c.nombre = document.getElementById('reg-nombre').value.trim();
  c.apellido = document.getElementById('reg-apellido').value.trim();
  c.sexo = document.querySelector('input[name="reg-sexo"]:checked').value;
  c.trato = c.sexo === "F" ? "Señorita" : (c.sexo === "M" ? "Joven" : c.nombre);
  c.telefono = document.getElementById('reg-telefono').value;
  
  const etiqueta = document.getElementById('reg-etiqueta-dir').value;
  const calle = document.getElementById('reg-calle-dir').value.trim();
  c.ubicacionActiva = `${etiqueta}: ${calle}`;
  c.direcciones = [{ etiqueta, direccion: calle }];
  c.autenticado = true;

  guardarEnMemoriaLocal();
  enviarDatosASheets("REGISTRAR_CLIENTE", c);

  // Ocultar sección de acceso y abrir la Tienda
  document.getElementById('vista-acceso').classList.add('hidden');
  document.getElementById('vista-cliente').classList.remove('hidden');
  
  if (typeof renderizarTiendaYCarrito === 'function') {
    renderizarTiendaYCarrito();
  }
  
  hablarNotificacionVoz(`Bienvenido a Peggy Burgers Silvia, ${obtenerSaludoCliente()}. Tu cuenta ha sido registrada.`);
}

function mostrarFormularioLogin() {
  const contenedorAcceso = document.getElementById('vista-acceso');
  contenedorAcceso.innerHTML = `
    <div class="tarjeta-cristal rounded-3xl p-6 shadow-2xl text-xs">
      <button onclick="iniciarModuloAcceso()" class="opacity-70 hover:opacity-100 mb-4 flex items-center gap-2 font-bold">
        <i class="fa-solid fa-arrow-left"></i> Volver
      </button>
      <h2 class="text-lg font-extrabold mb-1">¡Qué gusto verte de nuevo!</h2>
      <p class="opacity-70 mb-4">Ingresa tu número de teléfono registrado para acceder a tu historial y puntos.</p>

      <form onsubmit="procesarLoginCliente(event)" class="space-y-3">
        <div>
          <label class="font-bold block mb-1">Teléfono a 10 dígitos *</label>
          <input type="tel" id="login-telefono" maxlength="10" inputmode="numeric" required placeholder="7221234567"
            oninput="this.value=this.value.replace(/\\D/g,'').slice(0,10)"
            class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono tracking-widest text-sm" />
        </div>
        <button type="submit" class="w-full py-3.5 rounded-xl degradado-comercial text-white font-extrabold shadow-lg">
          Iniciar Sesión
        </button>
      </form>
    </div>
  `;
}

function procesarLoginCliente(e) {
  e.preventDefault();
  const tel = document.getElementById('login-telefono').value;
  if (tel.length === 10) {
    window.CRM_DB.cliente.telefono = tel;
    window.CRM_DB.cliente.autenticado = true;
    document.getElementById('vista-acceso').classList.add('hidden');
    document.getElementById('vista-cliente').classList.remove('hidden');
    if (typeof renderizarTiendaYCarrito === 'function') renderizarTiendaYCarrito();
    hablarNotificacionVoz(`Sesión iniciada correctamente, ${obtenerSaludoCliente()}.`);
  } else {
    alert("Ingresa un número válido de 10 dígitos.");
  }
}

// Inicializar al cargar
iniciarModuloAcceso();
