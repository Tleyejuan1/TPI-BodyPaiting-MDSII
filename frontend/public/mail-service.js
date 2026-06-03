(function() {
    const PUBLIC_KEY = "9aVfl7VyEf07FLnLX"; 
    
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";
    script.onload = function() {
        emailjs.init(PUBLIC_KEY);
        console.log("🚀 [MailService] SDK de EmailJS inicializado de forma correcta.");
    };
    document.head.appendChild(script);
})();

/**
 * Función Suprema de despacho postal por correo electrónico.
 * Mapea las variables internas del sistema con los tags {{ }} de tu plantilla web.
 */
function dispararNotificacionMailReal(pedidoObjeto) {
    if (!pedidoObjeto) {
        console.error("❌ [MailService] No se puede enviar el correo: El objeto de la orden está vacío.");
        return;
    }

    // Estructuramos los parámetros de manera idéntica a lo que espera tu plantilla en los servidores de EmailJS
    const parametrosTemplate = {
        // Variables Base de Control Comercial
        id_pedido: pedidoObjeto.id,
        cliente_nombre: pedidoObjeto.clienteNombre,
        cliente_email: pedidoObjeto.clienteEmail,
        detalle: pedidoObjeto.detalle,
        destino: pedidoObjeto.destino,
        estado: pedidoObjeto.estado,
        tracking: pedidoObjeto.tracking,

        // Variables de Seguridad / Compatibilidad de Plantillas Viejas
        name: pedidoObjeto.clienteNombre,
        email: pedidoObjeto.clienteEmail,

        // AGREGADO: Monto monetario formateado con signo pesos
        monto_total: "$" + pedidoObjeto.total.toLocaleString('es-AR'),

        // AGREGADO: Motivo dinámico de cancelación por empresa o dictamen del vendedor
        motivo_cancelacion: pedidoObjeto.motivoAdmin || "Tu pedido está siendo procesado en nuestro centro logístico.",

        // AGREGADO: Datos extendidos de disputas estilo Mercado Libre por si querés ponerlos en el mail
        motivo_reclamo_cliente: pedidoObjeto.reclamoCliente ? pedidoObjeto.reclamoCliente.motivo : "Ninguno",
        descripcion_reclamo_cliente: pedidoObjeto.reclamoCliente ? pedidoObjeto.reclamoCliente.descripcion : "Ninguna"
    };

    // === CÓDIGOS DE ACCESO ASIGNADOS EN TU PANEL DE EMAILJS ===
    const serviceID = "service_z5brsv9";  
    const templateID = "template_cmuujmp"; 

    console.log(`📧 [MailService] Intentando conectar con el servidor SMTP para el pedido ${pedidoObjeto.id}...`);

    // Disparo asincrónico directo por canal seguro de EmailJS
    emailjs.send(serviceID, templateID, parametrosTemplate)
        .then(function(response) {
            console.log("📧 [MailService] ¡SUCCESS! El correo impactó de forma exitosa en la bandeja del cliente.", response.status, response.text);
        }, function(error) {
            console.error("❌ [MailService] ERROR CRÍTICO: El servidor SMTP de EmailJS rechazó la conexión:", error);
            alert(`Error de Correo: No se pudo despachar la notificación del pedido ${pedidoObjeto.id}. Revisá la consola F12.`);
        });
}