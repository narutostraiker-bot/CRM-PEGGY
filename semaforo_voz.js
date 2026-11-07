/* =========================================================
   ARCHIVO 4: semaforo_voz.js
   Controla los 5 estados del pedido y las notificaciones por voz
========================================================== */

function hablarNotificacionVoz(texto) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const mensajeVoz = new SpeechSynthesisUtterance(texto);
    mensajeVoz.lang = 'es-MX';
    mensajeVoz.rate = 1.02;
    window.speechSynthesis.speak(mensajeVoz);
  }
}

function actualizarSemaforoCliente(estado, folio, mensajePersonalizado) {
  window.CRM_DB.pedidoActual.estadoSemaforo = estado;
  const contenedorSemaforo = document.getElementById('contenedor-semaforo');
  if (!contenedorSemaforo) return;

  let claseColor = "semaforo-validando";
  let tituloTexto = "🟡 EN VALIDACIÓN POR EL ÁREA DE MESAS";
  let audioTexto = mensajePersonalizado || `Estimado cliente, su pedido está siendo revisado en mesas.`;

  if (estado === "CONFIRMADO_PAGO") {
    claseColor = "semaforo-confirmado";
    tituloTexto = "🔵 CONFIRMADO — SELECCIONA TU PAGO";
    audioTexto = mensajePersonalizado || `El área de mesas confirmó su pedido. Ya puede realizar su pago.`;
  } else if (estado === "EN_COCINA") {
    claseColor = "semaforo-cocina";
    tituloTexto = "🟣 EN PROCESO EN COCINA";
    audioTexto = mensajePersonalizado || `Su pago ha sido confirmado. Su orden se está preparando en cocina.`;
  } else if (estado === "LISTO") {
    claseColor = "semaforo-listo";
    tituloTexto = "🟢 ¡PEDIDO LISTO PARA ENTREGA!";
    audioTexto = mensajePersonalizado || `Su pedido está listo y recién salido de cocina.`;
  } else if (estado === "CANCELADO") {
    claseColor = "semaforo-cancelado";
    tituloTexto = "🔴 PEDIDO CANCELADO";
    audioTexto = mensajePersonalizado || `Su pedido ha sido cancelado.`;
  }

  contenedorSemaforo.innerHTML = `
    <div class="p-3.5 rounded-2xl border ${claseColor} text-xs shadow-lg transition-all">
      <div class="flex justify-between items-center font-extrabold mb-1">
        <span>${tituloTexto}</span>
        <span class="font-mono text-[11px]">${folio || '#ORD-99'}</span>
      </div>
      <p class="opacity-90">${audioTexto}</p>
    </div>
  `;
  contenedorSemaforo.classList.remove('hidden');
  hablarNotificacionVoz(audioTexto);
}
