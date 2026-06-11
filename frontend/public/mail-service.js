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
 * 🔥 FUNCIÓN PUENTE DE COMPATIBILIDAD GLOBAL (Disponible en window)
 * Vincula el llamado nativo de tu checkout.html y de tus controladores con el motor de EmailJS.
 */
window.despacharCorreoConfirmacionOrden = function(emailDestino, datosPedido) {
    console.log(`✉️ [MailService] Interceptando orden ${datosPedido.id} para enrutamiento por EmailJS...`);
    
    // Sincronizamos las propiedades cruzadas que espera tu base de datos central
    const pedidoAdaptado = {
        id: datosPedido.id,
        clienteNombre: datosPedido.clienteNombre || "Artista Body Art",
        clienteEmail: emailDestino,
        detalle: datosPedido.detalle,
        destino: datosPedido.destino,
        estado: datosPedido.estado || "Procesando",
        tracking: datosPedido.tracking,
        total: datosPedido.total,
        cuponUsado: datosPedido.cuponUsado || "Ninguno",
        metodo: datosPedido.metodo || "Mercado Pago",
        motivoAdmin: datosPedido.motivoAdmin || "Tu pedido está siendo procesado en nuestro centro logístico."
    };

    // Lanzamos tu validador e inyector asincrónico real expuesto
    window.dispararNotificacionMailReal(pedidoAdaptado);
};

/**
 * Función Suprema de despacho postal por correo electrónico (Disponible en window).
 * Mapea las variables internas del sistema con los tags {{ }} de tu plantilla web.
 */
window.dispararNotificacionMailReal = function(pedidoObjeto) {
    if (!pedidoObjeto) {
        console.error("❌ [MailService] No se puede enviar el correo: El objeto de la orden está vacío.");
        return;
    }

    // Convertimos de forma segura a número para evitar que toLocaleString() pinche la ejecución
    const importeNumerico = parseFloat(pedidoObjeto.total) || 0;

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

        // Monto monetario formateado con signo pesos de forma segura
        monto_total: "$" + importeNumerico.toLocaleString('es-AR'),

        // Motivo dinámico de cambios de estado logísticos o cupones corporativos
        motivo_cancelacion: pedidoObjeto.motivoAdmin || "Tu pedido está siendo procesado en nuestro centro logístico.",

        // Datos extendidos de disputas estilo Mercado Libre por si querés ponerlos en el mail
        motivo_reclamo_cliente: pedidoObjeto.reclamoCliente ? pedidoObjeto.reclamoCliente.motivo : "Ninguno",
        shadow_reclamo: pedidoObjeto.motivoReclamo || "Ninguno"
    };

    // === CÓDIGOS DE ACCESO ASIGNADOS EN TU PANEL DE EMAILJS ===
    const serviceID = "service_z5brsv9";  
    const templateID = "template_cmuujmp"; 

    console.log(`📧 [MailService] Intentando conectar con el servidor SMTP para el pedido ${pedidoObjeto.id}...`);

    // Disparo asincrónico directo por canal seguro de EmailJS
    emailjs.send(serviceID, templateID, parametrosTemplate)
        .then(function(response) {
            console.log("%c📧 [MailService] ¡SUCCESS! El correo impactó de forma exitosa en la bandeja de EmailJS.", "background: #064e3b; color: #34d399; font-weight: bold; padding: 4px;", response.status, response.text);
        }, function(error) {
            console.error("❌ [MailService] ERROR CRÍTICO: El servidor SMTP de EmailJS rechazó la conexión:", error);
            alert(`Error de Correo: No se pudo despachar la notificación del pedido ${pedidoObjeto.id}. Revisá la consola F12.`);
        });
};