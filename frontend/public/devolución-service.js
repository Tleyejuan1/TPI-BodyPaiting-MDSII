const DevolucionService = {
    // 1. CAMBIAR ESTADO LOGÍSTICO MANUALMENTE (Para flujos intermedios)
    actualizarEstadoPedidoManual(idPedido, nuevoEstado) {
        console.log(`📦 [Logística] Actualizando pedido ${idPedido} a estado: ${nuevoEstado}`);
        
        let pedidos = JSON.parse(localStorage.getItem('global-pedidos')) || [];
        let ord = pedidos.find(p => p.id === idPedido);
        if (!ord) return null;

        ord.estado = nuevoEstado;

        // Si pasa a Andreani y no tiene número de guía, le asignamos uno automáticamente
        if ((nuevoEstado === "Recibido por Andreani" || nuevoEstado === "Enviado (Retirado por Andreani)") && (!ord.tracking || ord.tracking.includes("No asignado"))) {
            ord.tracking = "AND-" + Math.floor(1000 + Math.random() * 9000) + "-" + Math.floor(1000 + Math.random() * 9000);
        }
        
        localStorage.setItem('global-pedidos', JSON.stringify(pedidos));
        return ord;
    },

    // 2. SIMULACIÓN DE CONEXIÓN ASINCRÓNICA CON LA API DE ANDREANI (Mantiene compatibilidad con tu botón viejo si hace falta)
    async conectarApiAndreaniDespacho(idPedido) {
        console.log(`📡 [API Andreani] Iniciando handshake para pedido: ${idPedido}`);
        await new Promise(resolve => setTimeout(resolve, 1500));

        let pedidos = JSON.parse(localStorage.getItem('global-pedidos')) || [];
        let ord = pedidos.find(p => p.id === idPedido);
        if (!ord) return null;

        ord.estado = "Recibido por Andreani";
        ord.tracking = "AND-" + Math.floor(1000 + Math.random() * 9000) + "-" + Math.floor(1000 + Math.random() * 9000);
        ord.motivoAdmin = "Tu paquete ya fue retirado por el camión de Andreani y está en viaje.";
        
        localStorage.setItem('global-pedidos', JSON.stringify(pedidos));
        return ord;
    },

    // 3. PROCESAR RESOLUCIÓN DE INCIDENCIA / REEMBOLSOS
    procesarResolucion(idPedido, compensacion, tipoAccion, motivo) {
        let pedidos = JSON.parse(localStorage.getItem('global-pedidos')) || [];
        let ord = pedidos.find(p => p.id === idPedido);
        if (!ord) return null;

        let estadoFinal = "";

        if (compensacion === 'dinero') {
            estadoFinal = tipoAccion === 'INCIDENCIA_EMPRESA' ? "Cancelado - Reembolsado por Empresa" : "Devolución Aprobada - Dinero Reembolsado";
            this.registrarSalidaFinancieraReembolso(ord.id, ord.total, motivo);
        } else {
            estadoFinal = tipoAccion === 'INCIDENCIA_EMPRESA' ? "Cancelado - Cambio Autorizado" : "Devolución Aprobada - Cambio de Insumos";
        }

        ord.estado = estadoFinal;
        ord.motivoAdmin = motivo; 
        ord.tracking = "Finalizado por Gestión de Devoluciones";
        
        localStorage.setItem('global-pedidos', JSON.stringify(pedidos));
        return { ordenModificada: ord };
    },

    registrarSalidaFinancieraReembolso(idPedido, monto, motivo) {
        let cajaReembolsos = JSON.parse(localStorage.getItem('auditoria-reembolsos')) || [];
        cajaReembolsos.push({
            idPedido,
            monto,
            motivo,
            fecha: new Date().toISOString().split('T')[0]
        });
        localStorage.setItem('auditoria-reembolsos', JSON.stringify(cajaReembolsos));
    }
};