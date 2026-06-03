/**
 * BODY ART STUDIO - MOTOR DE DATOS UNIFICADO
 * (Inyecta los 9 productos reales en tu estructura visual original - UTN Villa María)
 */

const ProductoService = {
    
    // El catálogo oficial de Body Paint con sus variantes reales
    obtenerCatalogoSemilla() {
        return {
            productosSimples: [
                { id: 1, codigo: "PIN-RED", nombre: "Pintura Corporal FX - Rojo Intenso (100ml)", precio: 450, stock: 15, minimo: 4 },
                { id: 2, codigo: "PIN-BLU", nombre: "Pintura Corporal FX - Azul Francia (100ml)", precio: 450, stock: 3, minimo: 4 }, // Alerta Crítica
                { id: 3, codigo: "PIN-BLK", nombre: "Pintura Corporal FX - Negro Absoluto (100ml)", precio: 490, stock: 20, minimo: 5 },
                { id: 4, codigo: "PNC-02", nombre: "Pincel de Detalle Liner N°2", precio: 300, stock: 10, minimo: 3 },
                { id: 5, codigo: "PNC-08", nombre: "Pincel Chato para Fondos N°8", precio: 380, stock: 6, minimo: 2 },
                { id: 6, codigo: "GLI-GLD", nombre: "Gliter Cosmético Destello - Oro", precio: 350, stock: 12, minimo: 3 },
                { id: 7, codigo: "ESP-STP", nombre: "Esponja de Stippling (Efectos/Texturas)", precio: 220, stock: 8, minimo: 2 },
                { id: 8, codigo: "STN-GEO", nombre: "Plantilla Stencil - Patrones Geométricos", precio: 280, stock: 14, minimo: 3 },
                { id: 9, codigo: "COM-PLT", nombre: "Compotera Plástica de Mezcla (6 Cavidades)", precio: 190, stock: 5, minimo: 2 }
            ],
            kits: [
                {
                    id: 10,
                    codigo: "KIT-START-FX",
                    nombre: "Pack Iniciación (Rojo + Azul + Pincel N°2 + Compotera)",
                    precio: 1100,
                    componentes: ["PIN-RED", "PIN-BLU", "PNC-02", "COM-PLT"]
                },
                {
                    id: 11,
                    codigo: "KIT-PRO-GLAM",
                    nombre: "Combo Glitter & Efectos (Negro + Pincel + Glitter)",
                    precio: 1400,
                    componentes: ["PIN-BLK", "GLI-GLD", "ESP-STP"]
                }
            ]
        };
    },

    // Esta función limpia la memoria vieja si existía y devuelve los productos listos para tu bucle viejo
    obtenerTodos() {
        let inventario = JSON.parse(localStorage.getItem('global-inventario'));
        
        // Si la memoria tiene datos del formato viejo con "PIN-01", la reseteamos automáticamente
        if (inventario && inventario.productosSimples && inventario.productosSimples.length > 0) {
            const primerProd = inventario.productosSimples[0];
            if (primerProd.codigo === "PIN-01" || primerProd.nombre === "Pincel Profesional") {
                localStorage.removeItem('global-inventario');
                inventario = null;
            }
        }

        if (!inventario) {
            inventario = this.obtenerCatalogoSemilla();
            localStorage.setItem('global-inventario', JSON.stringify(inventario));
        }
        
        // Retorna la lista unificada para que el for/forEach de tu HTML viejo los dibuje con tu CSS
        return [...inventario.productosSimples, ...inventario.kits];
    },

    sumarStockDiezUnidades(idProducto) {
        let inventario = JSON.parse(localStorage.getItem('global-inventario')) || this.obtenerCatalogoSemilla();
        let prod = inventario.productosSimples.find(p => p.id === parseInt(idProducto));
        if (prod) {
            prod.stock += 10;
            localStorage.setItem('global-inventario', JSON.stringify(inventario));
        }
    },

    restaurarFabrica() {
        const semilla = this.obtenerCatalogoSemilla();
        localStorage.setItem('global-inventario', JSON.stringify(semilla));
    }
};