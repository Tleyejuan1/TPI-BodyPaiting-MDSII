const CarritoService = {
    // Obtiene los ítems actuales desde el almacenamiento
    obtener() {
        return JSON.parse(localStorage.getItem('carrito-bodyart')) || [];
    },

    // Guarda el estado del carrito y actualiza los contadores de la interfaz
    guardar(carrito) {
        localStorage.setItem('carrito-bodyart', JSON.stringify(carrito));
        this.actualizarBadgesNavbar();
    },

    // Añade un insumo o kit al carrito
    agregar(id) {
        const catalogo = JSON.parse(localStorage.getItem('catalogo-dinamico')) || [];
        const prod = catalogo.find(p => p.id === id);
        if (!prod) return;

        let carrito = this.obtener();
        const existe = carrito.find(item => item.id === id);

        if (existe) {
            existe.cantidad++;
        } else {
            carrito.push({ ...prod, cantidad: 1 });
        }

        this.guardar(carrito);
        console.log(`🛒 [CarritoService] Item "${prod.nombre}" añadido.`);
    },

    // Remueve un ítem completo de la lista
    remover(id) {
        let carrito = this.obtener();
        carrito = carrito.filter(item => item.id !== id);
        this.guardar(carrito);
    },

    // Limpia por completo el carrito
    vaciar() {
        localStorage.removeItem('carrito-bodyart');
        this.actualizarBadgesNavbar();
    },

    // Calcula la cantidad total de unidades en el carrito
    contarItems() {
        return this.obtener().reduce((acc, item) => acc + item.cantidad, 0);
    },

    // Calcula el subtotal bruto en pesos
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
    }
};