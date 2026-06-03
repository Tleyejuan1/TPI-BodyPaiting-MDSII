const CuponNotificacionService = {
    // 1. ASIGNA UN CUPÓN A UN CLIENTE EN LOCALSTORAGE
    asignarYNotificarCuponACliente(codigo, monto, emailCliente, tipoMensaje = "RECOMPENSA") {
        if (!emailCliente || !codigo) {
            console.error("❌ [CuponNotificacion] Faltan datos esenciales.");
            return { exito: false, msg: "❌ Faltan datos del cliente o del cupón." };
        }

        let cupones = JSON.parse(localStorage.getItem('global-cupones')) || [];
        const codigoFormateado = codigo.toUpperCase().trim();
        const emailFormateado = emailCliente.toLowerCase().trim();

        const clonado = cupones.find(c => c.codigo === codigoFormateado);
        if (clonado) return { exito: false, msg: "❌ Ya existe un cupón activo con ese mismo código." };

        const nuevoCupon = {
            codigo: codigoFormateado,
            monto: parseInt(monto),
            estado: "Activo",
            clienteExclusivo: emailFormateado,
            validez: "30 Días Corridos",
            productosAbarcados: "Kits Profesionales, Agujas y Tintas de Arte Corporal"
        };

        cupones.push(nuevoCupon);
        localStorage.setItem('global-cupones', JSON.stringify(cupones));

        // Lanzamos el mail inyectando el párrafo dinámico según la situación
        this.enviarMailBeneficioExclusivo(nuevoCupon, emailFormateado, tipoMensaje);

        return { exito: true, msg: `✅ Cupón exclusivo enviado a ${emailFormateado} de forma exitosa.` };
    },

    // 2. ENVÍO DE PARÁMETROS ADAPTADOS CON INTRODUCCIÓN COMPATIBLE
    enviarMailBeneficioExclusivo(cuponObjeto, emailCliente, tipoMensaje) {
        
        let introduccionTexto = "";
        let tituloCupon = "";
        let detalleCupon = "";

        // Redactamos los textos según el tipo de beneficio para que encajen con la estética
        if (tipoMensaje === "COMPENSACION") {
            introduccionTexto = "Nos comunicamos desde la administración de Body Art Studio para notificarte que se ha generado una orden de crédito en tu cuenta a fin de subsanar un inconveniente con tu última orden.";
            tituloCupon = "🎁 SECCIÓN DE REEMBOLSO: ORDEN DE CRÉDITO ACTIVADA";
            detalleCupon = `¡Hola! Para compensar la incidencia con tu último pedido, te generamos un saldo a favor:\n\n` +
                           `👉 CÓDIGO DE CANJE: ${cuponObjeto.codigo}\n` +
                           `• Monto adjudicado: $${cuponObjeto.monto.toLocaleString('es-AR')}\n` +
                           `• Plazo de validez: ${cuponObjeto.validez}.\n\n` +
                           `*Podés ingresarlo directamente en la pasarela de pago de tu próximo carrito para descontar el valor.`;
        } else {
            introduccionTexto = "Nos complace comunicarte desde la administración de Body Art Studio que tu perfil de usuario ha sido seleccionado para recibir un beneficio exclusivo en nuestra plataforma web.";
            tituloCupon = "✨ SECCIÓN EXCLUSIVA: ¡BONIFICACIÓN VIP PARA VOS!";
            detalleCupon = `Queremos premiar tu fidelidad en la plataforma de Body Art Studio con un beneficio único:\n\n` +
                           `👉 CÓDIGO DE DESCUENTO: ${cuponObjeto.codigo}\n` +
                           `• Valor del regalo: $${cuponObjeto.monto.toLocaleString('es-AR')}\n` +
                           `• Productos incluidos: ${cuponObjeto.productosAbarcados}.\n` +
                           `• Vencimiento de la oferta: ${cuponObjeto.validez}.`;
        }

        // Armamos el objeto final para EmailJS
        const parametrosTemplate = {
            cliente_email: emailCliente,
            email: emailCliente,
            cliente_nombre: "Estimado Artista / Tatuador",
            name: "Estimado Artista / Tatuador",
            
            // 🔥 LA SOLUCIÓN: Reemplaza el texto duro de logística por este saludo institucional impecable
            parrafo_introductorio: introduccionTexto,

            // Datos de control para la tabla superior (así mantiene coherencia visual)
            id_pedido: "GESTION-CUPONES",
            estado: "BENEFICIO EMITIDO", 
            tracking: "No aplica (Entrega Digital Inmediata)",
            detalle: `Asignación de beneficio exclusivo por un valor de $${cuponObjeto.monto.toLocaleString('es-AR')}.`, 
            monto_total: "$" + cuponObjeto.monto.toLocaleString('es-AR'), 
            motivo_cancelacion: "Uso exclusivo en pasarela de pagos web (Uso Único).",

            // Las dos variables que pusiste abajo de todo afuera de la tabla
            bloque_cupon_titulo: tituloCupon,
            bloque_cupon_detalle: detalleCupon
        };

        const serviceID = "service_z5brsv9";  
        const templateID = "template_cmuujmp"; 

        console.log(`📧 [CuponNotificacion] Despachando mail dinámico sin textos fijos hacia: ${emailCliente}...`);

        emailjs.send(serviceID, templateID, parametrosTemplate)
            .then(function(response) {
                console.log("📧 [CuponNotificacion] ¡SUCCESS! Mail enviado con introducción dinámica limpia.", response.status, response.text);
            }, function(error) {
                console.error("❌ [CuponNotificacion] Error al enviar:", error);
            });
    }
};