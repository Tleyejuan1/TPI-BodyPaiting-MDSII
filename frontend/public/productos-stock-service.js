/**
 * BODY ART STUDIO - INVENTARIO ADAPTADO (9 PRODUCTOS REALES Y COMBOS)
 * (Manejo de Stock Composite por Código y Variantes - UTN Villa María)
 */

const ProductosStockService = {
    
    // 1. INICIALIZACIÓN DEL INVENTARIO CORPORAL REAL
    inicializarInventario() {
        let inventario = JSON.parse(localStorage.getItem('global-inventario'));
        
        if (!inventario) {
            inventario = {
                // Los 9 productos individuales con sus variantes de color/medida (Código único por variante)
                productosSimples: [
                    // 1. Pinturas (Variante por Color)
                    { codigo: "PIN-RED", nombre: "Pintura Corporal FX - Rojo Intenso (100ml)", tipo: "Producto", precio: 450, stock: 15, stockMinimo: 4 },
                    { codigo: "PIN-BLU", nombre: "Pintura Corporal FX - Azul Francia (100ml)", tipo: "Producto", precio: 450, stock: 3, stockMinimo: 4 }, // Alerta Roja!
                    { codigo: "PIN-BLK", nombre: "Pintura Corporal FX - Negro Absoluto (100ml)", tipo: "Producto", precio: 490, stock: 20, stockMinimo: 5 },
                    
                    // 2. Pinceles (Variante por Medida/NÚMERO)
                    { codigo: "PNC-02", nombre: "Pincel de Detalle Liner N°2", tipo: "Producto", precio: 300, stock: 10, stockMinimo: 3 },
                    { codigo: "PNC-08", nombre: "Pincel Chato para Fondos N°8", tipo: "Producto", precio: 380, stock: 6, stockMinimo: 2 },
                    
                    // 3. Brillantina / Glitters
                    { codigo: "GLI-GLD", nombre: "Gliter Cosmético Destello - Oro", tipo: "Producto", precio: 350, stock: 12, stockMinimo: 3 },
                    
                    // 4. Esponjas
                    { codigo: "ESP-STP", nombre: "Esponja de Stippling (Efectos de Barba/Textura)", tipo: "Producto", precio: 220, stock: 8, stockMinimo: 2 },
                    
                    // 5. Plantillas de Dibujos / Stencils
                    { codigo: "STN-GEO", nombre: "Plantilla Stencil - Patrones Geométricos", tipo: "Producto", precio: 280, stock: 14, stockMinimo: 3 },
                    
                    // 6. Accesorios Agregados: Compotera Mezcladora
                    { codigo: "COM-PLT", nombre: "Compotera Plástica de Mezcla (6 Cavidades)", tipo: "Producto", precio: 190, stock: 5, stockMinimo: 2 }
                ],
                
                // Packs / Kits comerciales armados a partir de los productos simples (Precios Fijos e Independientes)
                kits: [
                    {
                        codigo: "KIT-START-FX",
                        nombre: "Pack Iniciación Arte Corporal (Rojo + Azul + Pincel N°2 + Compotera)",
                        tipo: "Kit",
                        precio: 1100, // Suma real: $1390 -> Descuento especial de Kit
                        componentes: ["PIN-RED", "PIN-BLU", "PNC-02", "COM-PLT"] // Máximo un único código por kit
                    },
                    {
                        codigo: "KIT-PRO-GLAM",
                        nombre: "Combo Glitter & Efectos (Negro + Pincel N°8 + Glitter Oro + Esponja + Plantilla)",
                        tipo: "Kit",
                        precio: 1400, // Suma real: $1720 -> Precio independiente del kit
                        componentes: ["PIN-BLK", "PNC-08", "GLI-GLD", "ESP-STP", "STN-GEO"]
                    }
                ]
            };
            localStorage.setItem('global-inventario', JSON.stringify(inventario));
            console.log("📦 [Inventario] Los 9 productos de Body Paint y Packs cargados.");
        }
        return inventario;
    },

    // 2. CÁLCULO DINÁMICO DE STOCK DISPONIBLE PARA UN PACK
    obtenerStockDeKit(codigoKit) {
        const inventario = this.inicializarInventario();
        const kit = inventario.kits.find(k => k.codigo === codigoKit);
        
        if (!kit) return 0;

        let stockMaximoPosible = Infinity;

        kit.componentes.forEach(codigoComponente => {
            const productoSimple = inventario.productosSimples.find(p => p.codigo === codigoComponente);
            if (productoSimple) {
                if (productoSimple.stock < stockMaximoPosible) {
                    stockMaximoPosible = productoSimple.stock;
                }
            } else {
                stockMaximoPosible = 0;
            }
        });

        return stockMaximoPosible === Infinity ? 0 : stockMaximoPosible;
    },

    // 3. ACTUALIZACIÓN AUTOMÁTICA AL CONFIRMAR COMPRA
    procesarCompraDeArticulo(codigoArticulo, cantidadComprada) {
        let inventario = this.inicializarInventario();
        cantidadComprada = parseInt(cantidadComprada);

        // Si es producto simple
        let producto = inventario.productosSimples.find(p => p.codigo === codigoArticulo);
        if (producto) {
            if (producto.stock < cantidadComprada) return { exito: false, msg: `Stock insuficiente de ${producto.nombre}` };
            producto.stock -= cantidadComprada;
            localStorage.setItem('global-inventario', JSON.stringify(inventario));
            return { exito: true, msg: "Stock actualizado." };
        }

        // Si es un Pack compuesto
        let kit = inventario.kits.find(k => k.codigo === codigoArticulo);
        if (kit) {
            const stockDisponibleKit = this.obtenerStockDeKit(codigoArticulo);
            if (stockDisponibleKit < cantidadComprada) {
                return { exito: false, msg: "❌ Componentes insuficientes en depósito para armar este pack." };
            }

            // Descontamos a los productos individuales que lo componen
            kit.componentes.forEach(codigoComponente => {
                let componenteBase = inventario.productosSimples.find(p => p.codigo === codigoComponente);
                if (componenteBase) {
                    componenteBase.stock -= cantidadComprada;
                }
            });

            localStorage.setItem('global-inventario', JSON.stringify(inventario));
            return { exito: true, msg: "✨ ¡Despacho exitoso! El stock de los individuales varió por la compra del pack." };
        }

        return { exito: false, msg: "Artículo no registrado." };
    }
};