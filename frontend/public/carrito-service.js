const CarritoService = {
    // CLAVE UNIFICADA PARA TODO EL PROYECTO BODY ART
    STORAGE_KEY: 'carrito-bodyart',

    // Obtiene los ítems actuales desde el almacenamiento
    obtener() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
    },

    // Guarda el estado del carrito y actualiza los contadores de la interfaz
    guardar(carrito) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(carrito));
        this.actualizarBadgesNavbar();
        
        // Si estamos en la página de checkout, disparamos el renderizado automáticamente
        if (typeof renderizarItemsCheckout === 'function') {
            renderizarItemsCheckout();
        }
    },

    // Añade un insumo o kit al carrito validando stock y asociando sesión si existe
    agregar(id) {
        const catalogo = JSON.parse(localStorage.getItem('catalogo-dinamico')) || [];
        const prod = catalogo.find(p => p.id == id);
        if (!prod) return false;

        let carrito = this.obtener();
        const existe = carrito.find(item => item.id == id);

        // Verificación de stock disponible antes de añadir (Ignora control estricto si es un KIT armado)
        const cantidadActual = existe ? existe.cantidad : 0;
        const esKit = prod.codigo && prod.codigo.includes("KIT");
        
        if (!esKit && prod.stock !== undefined && cantidadActual >= prod.stock) {
            console.warn(`⚠️ [CarritoService] No hay suficiente stock de "${prod.nombre}".`);
            return false;
        }

        if (existe) {
            existe.cantidad++;
        } else {
            // Guardamos una copia limpia del producto con cantidad inicial
            carrito.push({
                id: prod.id,
                nombre: prod.nombre,
                precio: prod.precio,
                cantidad: 1
            });
        }

        this.guardar(carrito);
        console.log(`🛒 [CarritoService] Item "${prod.nombre}" añadido al carrito.`);
        return true;
    },

    // Remueve un ítem completo de la lista (Usado por el botón del tacho de basura)
    remover(id) {
        let carrito = this.obtener();
        carrito = carrito.filter(item => item.id != id);
        this.guardar(carrito);
        console.log(`🗑️ [CarritoService] Item ID ${id} removido por completo.`);
    },

    // Descuenta una unidad (para botones de control - / + si los usás)
    decrementar(id) {
        let carrito = this.obtener();
        const existe = carrito.find(item => item.id == id);
        
        if (existe) {
            existe.cantidad--;
            if (existe.cantidad <= 0) {
                this.remover(id);
                return;
            }
        }
        this.guardar(carrito);
    },

    // Limpia por completo el carrito de la sesión
    vaciar() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.actualizarBadgesNavbar();
        console.log("🧹 [CarritoService] Carrito vaciado correctamente.");
        
        if (typeof renderizarItemsCheckout === 'function') {
            renderizarItemsCheckout();
        }
    },

    // Calculates la cantidad total de unidades físicas en el carrito
    contarItems() {
        return this.obtener().reduce((acc, item) => acc + item.cantidad, 0);
    },

    // Calcula el subtotal bruto en pesos argentinos
    calcularSubtotal() {
        return this.obtener().reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    },

    // Actualiza visualmente el circulito morado del Navbar en cualquier pantalla
    actualizarBadgesNavbar() {
        const badge = document.getElementById('cart-badge');
        if (!badge) return;

        const total = this.contarItems();
        if (total > 0) {
            badge.innerText = total;
            badge.className = "absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-purple-600 rounded-full";
        } else {
            badge.className = "hidden";
        }
    },

    /**
              * 🔥 OPERACIÓN SUPREMA POST-VENTA
     * Procesa la confirmación de pago, descuenta el stock real del inventario y liquida cupones.
     */
    procesarFinalizacionCompra() {
        console.log("📦 [CarritoService] Liquidando operaciones comerciales...");

        // 1. DESCUENTO AUTOMÁTICO DE STOCK REAL EN EL INVENTARIO CENTRAL
        let catalogoDinamico = JSON.parse(localStorage.getItem('catalogo-dinamico')) || [];
        let itemsComprados = this.obtener();

        itemsComprados.forEach(itemCarrito => {
            let productoCatalogo = catalogoDinamico.find(p => p.id == itemCarrito.id);
            if (productoCatalogo && productoCatalogo.stock !== undefined) {
                // Restamos las unidades llevadas por el cliente
                productoCatalogo.stock = Math.max(0, productoCatalogo.stock - itemCarrito.cantidad);
            }
        });
        localStorage.setItem('catalogo-dinamico', JSON.stringify(catalogoDinamico));
        console.log("📉 [CarritoService] Unidades vendidas descontadas del stock de forma exitosa.");

        // 2. AUDITORÍA Y EXPIRACIÓN AUTOMÁTICA DEL CUPÓN EMPLEADO
        let codigoCuponAplicado = localStorage.getItem('cupon-aplicado-checkout');

        if (codigoCuponAplicado) {
            let cuponesGlobales = JSON.parse(localStorage.getItem('global-cupones')) || [];
            let cuponInstancia = cuponesGlobales.find(c => c.codigo === codigoCuponAplicado.toUpperCase().trim());
            
            if (cuponInstancia) {
                // Restamos un tiro disponible del beneficio exclusivo
                cuponInstancia.usosRestantes = (cuponInstancia.usosRestantes || 1) - 1;
                
                // Si llegó al límite fijado por el admin, deja de existir (Expira)
                if (cuponInstancia.usosRestantes <= 0) {
                    cuponInstancia.usosRestantes = 0;
                    cuponInstancia.estado = "Expirado";
                }
                
                localStorage.setItem('global-cupones', JSON.stringify(cuponesGlobales));
                localStorage.removeItem('cupon-aplicado-checkout'); // Limpiamos la pasarela
                console.log(`🎟️ Cupón comercial ${codigoCuponAplicado} procesado. Cupos restantes: ${cuponInstancia.usosRestantes}`);
            }
        }

        // 3. VACIADO INTEGRAL DEL CARRITO
        this.vaciar();
    }
};