/**
 * BODY ART STUDIO - SERVICIO CENTRAL DE VALIDACIÓN DE CUPONES
 * (Reglas de Negocio Estrictas de Cátedra - UTN Villa María)
 */

const CuponService = {
    CUPONES_SEMILLA: [
        { codigo: "UTN2026", monto: 2000, estado: "Activo", clienteExclusivo: null },
        { codigo: "DESCUENTOBODY", monto: 4000, estado: "Activo", clienteExclusivo: null }
    ],

    init() {
        if (!localStorage.getItem('global-cupones')) {
            localStorage.setItem('global-cupones', JSON.stringify(this.CUPONES_SEMILLA));
            console.log("🎟️ [CuponService] Cupones semilla inicializados.");
        }
    },

    obtenerTodos() {
        this.init();
        return JSON.parse(localStorage.getItem('global-cupones')) || [];
    },

    // VALIDADOR SUPREMO DE IDENTIDAD CRUZADA Y MONTO DE COMPRA
    validarCupon(codigo, subtotalCarrito) {
        const cupones = this.obtenerTodos();
        const cupon = cupones.find(c => c.codigo === codigo.toUpperCase().trim());

        if (!cupon) {
            return { valido: false, msg: "❌ El cupón ingresado no existe o venció.", monto: 0 };
        }

        if (cupon.estado === "Usado") {
            return { valido: false, msg: "⚠️ Este cupón ya fue utilizado en otra transacción.", monto: 0 };
        }

        // VALIDACIÓN DE CLIENTE ESPECÍFICO ASOCIADO DESDE LA CONSOLA
        const sesionUsuario = JSON.parse(localStorage.getItem('usuario-sesion'));
        const emailCompradorActual = sesionUsuario ? sesionUsuario.email.toLowerCase().trim() : "comprador@utn.com";

        if (cupon.clienteExclusivo && cupon.clienteExclusivo !== emailCompradorActual) {
            return { 
                valido: false, 
                msg: `❌ Error de Permisos: Este cupón es exclusivo para otra cuenta de correo asignada.`, 
                monto: 0 
            };
        }

        // COMPROBACIÓN EXIGIDA: El valor de la compra debe superar el monto del cupón
        if (subtotalCarrito <= cupon.monto) {
            return { 
                valido: false, 
                msg: `❌ Regla UTN: El monto del pedido ($${subtotalCarrito}) debe ser mayor al descuento ($${cupon.monto}).`, 
                monto: 0 
            };
        }

        return { valido: true, msg: `✅ ¡Cupón Aplicado! Descuento de $${cupon.monto} autorizado.`, monto: cupon.monto };
    },

    marcarComoUsado(codigo) {
        let cupones = this.obtenerTodos();
        const cupon = cupones.find(c => c.codigo === codigo.toUpperCase().trim());
        
        if (cupon) {
            cupon.estado = "Usado";
            localStorage.setItem('global-cupones', JSON.stringify(cupones));
            console.log(`🎟️ [CuponService] Cupón ${codigo} quemado con éxito.`);
            return true;
        }
        return false;
    },

    guardarNuevoCupon(codigo, monto) {
        let cupones = this.obtenerTodos();
        const codigoFormateado = codigo.toUpperCase().trim();
        
        const clonado = cupones.find(c => c.codigo === codigoFormateado);
        if (clonado) return { exito: false, msg: "❌ Ya existe ese código." };

        cupones.push({ 
            codigo: codigoFormateado, 
            monto: parseInt(monto), 
            estado: "Activo",
            clienteExclusivo: null 
        });
        
        localStorage.setItem('global-cupones', JSON.stringify(cupones));
        return { exito: true, msg: `✅ Cupón general creado.` };
    }
};

CuponService.init();