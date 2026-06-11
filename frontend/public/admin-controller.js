// =========================================================================
// VARIABLES GLOBALES DE CONTROL (ESTADO CENTRALIZADO)
// =========================================================================
let pedidoSeleccionadoId = null;
let tipoAccionActual = "";
let fotoCargadaBase64 = ""; 
let videoCargadoBase64 = "";

// =========================================================================
// CONMUTADORES DE INTERFAZ Y MODOS DE CARGA (URL vs DISCO LOCAL)
// =========================================================================
function conmutarModoFoto() {
    const modo = document.getElementById('prod-origen-foto').value;
    if (modo === 'url') {
        document.getElementById('contenedor-foto-url').classList.remove('hidden');
        document.getElementById('contenedor-foto-file').classList.add('hidden');
        document.getElementById('prod-foto-file').value = "";
        fotoCargadaBase64 = "";
    } else {
        document.getElementById('contenedor-foto-url').classList.add('hidden');
        document.getElementById('contenedor-foto-file').classList.remove('hidden');
        document.getElementById('prod-foto-url').value = "";
    }
    actualizarLivePreview();
}

function conmutarModoVideo() {
    const modo = document.getElementById('vid-origen').value;
    const contenedorUrl = document.getElementById('contenedor-vid-url');
    const contenedorFile = document.getElementById('contenedor-vid-file');
    const inputUrl = document.getElementById('vid-url-input');
    const inputFile = document.getElementById('vid-file-input');

    if (modo === 'url') {
        if(contenedorUrl) contenedorUrl.classList.remove('hidden');
        if(contenedorFile) contenedorFile.classList.add('hidden');
        if(inputFile) inputFile.value = "";
        videoCargadaBase64 = "";
    } else {
        if(contenedorUrl) contenedorUrl.classList.add('hidden');
        if(contenedorFile) contenedorFile.classList.remove('hidden');
        if(inputUrl) inputUrl.value = "";
    }
}

// =========================================================================
// PROCESAMIENTO DE ARCHIVOS EN BASE64 (FileReader)
// =========================================================================
function procesarFotoLocal(input) {
    const archivo = input.files[0];
    if (archivo) {
        const lector = new FileReader();
        lector.onload = function(e) {
            fotoCargadaBase64 = e.target.result;
            actualizarLivePreview();
        };
        lector.readAsDataURL(archivo);
    }
}

function procesarVideoLocal(input) {
    const archivo = input.files[0];
    if (archivo) {
        if (archivo.size > 7 * 1024 * 1024) {
            alert("⚠️ El video es muy pesado para guardarse completo en LocalStorage. Se sugiere usar una URL de video o un archivo de pocos segundos.");
            input.value = "";
            return;
        }
        const lector = new FileReader();
        lector.onload = function(e) {
            videoCargadoBase64 = e.target.result;
        };
        lector.readAsDataURL(archivo);
    }
}

// =========================================================================
// MÓDULO 1: ALTA Y PREVIEW EN TIEMPO REAL DE PRODUCTOS
// =========================================================================
function calcularPreciosIva() {
    const costo = parseFloat(document.getElementById('prod-costo').value) || 0;
    const iva = costo * 0.21;
    const ventaSugerido = costo + iva;
    document.getElementById('prod-iva-visual').value = `$${iva.toFixed(0)}`;
    document.getElementById('prod-precio').value = ventaSugerido > 0 ? Math.round(ventaSugerido) : "";
    actualizarLivePreview();
}

function actualizarLivePreview() {
    const nombre = document.getElementById('prod-nombre') ? document.getElementById('prod-nombre').value.trim() : "Nombre del Producto";
    const codigo = document.getElementById('prod-desc') ? document.getElementById('prod-desc').value.trim().toUpperCase() : "VAR";
    const detalles = document.getElementById('prod-detalles') ? document.getElementById('prod-detalles').value.trim() : "Escribí los detalles...";
    const precio = document.getElementById('prod-precio') ? parseFloat(document.getElementById('prod-precio').value) || 0 : 0;
    const modo = document.getElementById('prod-origen-foto') ? document.getElementById('prod-origen-foto').value : 'url';
    const urlFoto = document.getElementById('prod-foto-url') ? document.getElementById('prod-foto-url').value.trim() : '';

    if(document.getElementById('preview-txt-nombre')) document.getElementById('preview-txt-nombre').innerText = nombre;
    if(document.getElementById('preview-badge-codigo')) document.getElementById('preview-badge-codigo').innerText = codigo;
    if(document.getElementById('preview-txt-desc')) document.getElementById('preview-txt-desc').innerText = detalles;
    if(document.getElementById('preview-txt-precio')) document.getElementById('preview-txt-precio').innerText = `$${precio.toLocaleString('es-AR')}`;

    const boxFoto = document.getElementById('preview-box-foto');
    if (boxFoto) {
        if (modo === 'url' && urlFoto) {
            boxFoto.innerHTML = `<img src="${urlFoto}" class="w-full h-full object-cover">`;
        } else if (modo === 'pc' && fotoCargadaBase64) {
            boxFoto.innerHTML = `<img src="${fotoCargadaBase64}" class="w-full h-full object-cover">`;
        } else {
            boxFoto.innerHTML = `<i class="fa-solid fa-image text-3xl text-gray-300"></i>`;
        }
    }
}

function ejecutarAltaProducto(e) { 
    e.preventDefault(); 
    const nombre = document.getElementById('prod-nombre').value.trim();
    let codigo = document.getElementById('prod-desc').value.trim().toUpperCase();
    const detalles = document.getElementById('prod-detalles').value.trim();
    const precio = parseFloat(document.getElementById('prod-precio').value);
    const stock = parseInt(document.getElementById('prod-stock').value) || 0;
    const modo = document.getElementById('prod-origen-foto').value;
    const urlFoto = document.getElementById('prod-foto-url').value.trim();
    const tipo = document.getElementById('prod-tipo').value;

    if (tipo === 'KIT' && !codigo.startsWith("KIT-")) {
        codigo = "KIT-" + codigo;
    }

    let finalImg = "";
    if (modo === 'url') {
        if (!urlFoto) { alert("Por favor pegá un enlace URL de imagen válido."); return; }
        finalImg = urlFoto;
    } else {
        if (!fotoCargadaBase64) { alert("Por favor seleccioná una imagen válida de tu PC."); return; }
        finalImg = fotoCargadaBase64;
    }

    let catalogo = JSON.parse(localStorage.getItem('catalogo-dinamico')) || [];
    const nuevoId = catalogo.length > 0 ? Math.max(...catalogo.map(o => o.id)) + 1 : 1;

    const nuevoProducto = {
        id: nuevoId, 
        codigo: codigo, 
        nombre: nombre, 
        desc: detalles, 
        precio: precio, 
        stock: stock, 
        minimo: 4, 
        img: finalImg
    };

    catalogo.push(nuevoProducto);
    localStorage.setItem('catalogo-dinamico', JSON.stringify(catalogo));
    
    alert(`✨ ¡Publicación exitosa! Registrado como: ${codigo}`);
    window.location.href = "admin-dashboard.html";
}

// =========================================================================
// MÓDULO 2: TABLA PANORÁMICA GENERAL E INVENTARIO CONTROLADO
// =========================================================================
function cargarInventarioCompletoPanoramico() {
    const prods = JSON.parse(localStorage.getItem('catalogo-dinamico')) || [];
    const tabla = document.getElementById('tabla-inventario-panoramica');
    if(!tabla) return;
    
    if(prods.length === 0) {
        tabla.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-gray-400 italic font-bold text-xs">No se encontraron ítems en stock. Crea uno nuevo.</td></tr>`;
        actualizarTarjetasContadoras(0, 0, 0);
        return;
    }

    let okCount = 0; let criticoCount = 0; let ceroCount = 0;

    const htmlLineas = prods.map(p => {
        const esKit = p.codigo && p.codigo.includes("KIT");
        const stockReal = p.stock !== undefined && p.stock !== null ? parseInt(p.stock) : 10;
        const minimoReal = p.minimo !== undefined && p.minimo !== null ? parseInt(p.minimo) : 4;
        
        let badgeStock = "";
        let visualStockNumerico = esKit ? `-` : `${stockReal} u.`;

        if (esKit) {
            badgeStock = `<span class="bg-purple-100 text-purple-800 font-bold px-2.5 py-1 rounded-sm text-[9px]">Combo Armado</span>`;
        } else if (stockReal === 0) {
            ceroCount++;
            badgeStock = `<span class="bg-red-100 text-red-800 font-bold px-2.5 py-1 rounded-sm text-[9px]">Agotado</span>`;
        } else if (stockReal <= minimoReal) {
            criticoCount++;
            badgeStock = `<span class="bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-sm text-[9px] animate-pulse">Crítico</span>`;
        } else {
            okCount++;
            badgeStock = `<span class="bg-green-100 text-green-800 font-bold px-2.5 py-1 rounded-sm text-[9px]">Saludable</span>`;
        }

        return `
            <tr class="hover:bg-gray-50/80 transition" data-buscar="${p.codigo} ${p.nombre}">
                <td class="p-4"><img src="${p.img}" class="w-10 h-10 object-cover rounded-sm border"></td>
                <td class="p-4 font-mono font-bold text-purple-600">${p.codigo || 'S/C'}</td>
                <td class="p-4 text-gray-900 font-bold"><div>${p.nombre}</div><div class="text-[10px] text-gray-400 mt-0.5 font-normal">${p.desc || 'Sin detalles registrados.'}</div></td>
                <td class="p-4 font-bold text-gray-700">${visualStockNumerico}</td>
                <td class="p-4">${badgeStock}</td>
                <td class="p-4 font-bold text-gray-900">$${p.precio.toLocaleString('es-AR')}</td>
                <td class="p-4 text-center">
                    <div class="flex items-center justify-center gap-2">
                        ${esKit ? '-' : `<button onclick="ejecutarReabastecimiento(${p.id})" class="bg-gray-900 hover:bg-purple-600 text-white font-bold px-3 py-1.5 rounded-sm text-[10px] cursor-pointer transition">+10 u</button>`}
                        <button onclick="darDeBajaProducto(${p.id})" class="bg-red-50 hover:bg-red-600 text-red-600 hover:text-white p-2.5 rounded-sm cursor-pointer transition"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    tabla.innerHTML = htmlLineas;
    actualizarTarjetasContadoras(okCount, criticoCount, ceroCount);
}

function actualizarTarjetasContadoras(ok, critico, cero) {
    if(document.getElementById('contador-stock-ok')) document.getElementById('contador-stock-ok').innerText = ok;
    if(document.getElementById('contador-stock-critico')) document.getElementById('contador-stock-critico').innerText = critico;
    if(document.getElementById('contador-stock-cero')) document.getElementById('contador-stock-cero').innerText = cero;
}

function filtrarTablaInventarioGeneral() {
    const texto = document.getElementById('buscador-inventario').value.trim().toLowerCase();
    const filas = document.querySelectorAll('#tabla-inventario-panoramica tr');
    filas.forEach(f => {
        const dataBuscar = f.getAttribute('data-buscar');
        if (dataBuscar && !dataBuscar.toLowerCase().includes(texto)) f.style.display = "none";
        else f.style.display = "";
    });
}

function darDeBajaProducto(id) {
    if (confirm("¿Estás seguro de que deseas dar de baja definitiva a este artículo del catálogo?")) {
        let catalogo = JSON.parse(localStorage.getItem('catalogo-dinamico')) || [];
        catalogo = catalogo.filter(p => p.id !== id);
        localStorage.setItem('catalogo-dinamico', JSON.stringify(catalogo));
        cargarInventarioCompletoPanoramico();
    }
}

function ejecutarReabastecimiento(id) { 
    let cat = JSON.parse(localStorage.getItem('catalogo-dinamico')) || [];
    let pr = cat.find(x => x.id === id);
    if(pr) { 
        pr.stock = (pr.stock !== undefined ? parseInt(pr.stock) : 0) + 10; 
        localStorage.setItem('catalogo-dinamico', JSON.stringify(cat)); 
    }
    cargarInventarioCompletoPanoramico(); 
}

// =========================================================================
// MÓDULO 3: GESTIÓN DE ENVÍOS Y LOGÍSTICA (CON DISPARADOR DE EMAILJS AUTOMÁTICO)
// =========================================================================
function cargarPedidosAdmin() {
    const tabla = document.getElementById('tabla-pedidos-admin');
    if(!tabla) return;
    
    let todosLosPedidos = [];
    
    for (let i = 0; i < localStorage.length; i++) {
        const clave = localStorage.key(i);
        if (clave && clave.startsWith("compras-")) {
            const emailCliente = clave.replace("compras-", "");
            const comprasDelCliente = JSON.parse(localStorage.getItem(clave)) || [];
            
            comprasDelCliente.forEach(pedido => {
                todosLosPedidos.push({
                    ...pedido,
                    clienteEmail: emailCliente
                });
            });
        }
    }
    
    if(todosLosPedidos.length === 0) { 
        tabla.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-gray-400 italic font-medium">No se registran órdenes de envío pendientes de distribución.</td></tr>`; 
        return; 
    }
    
    todosLosPedidos.sort((a,b) => new Date(b.fecha) - new Date(a.fecha));

    tabla.innerHTML = todosLosPedidos.map(p => {
        let estadoActual = p.estado || 'Procesando';
        if (estadoActual === 'Recibido por Andreani') estadoActual = 'En Camino';

        return `
            <tr class="hover:bg-gray-50/50 transition font-bold text-gray-900">
                <td class="p-4 text-purple-600 font-mono">${p.id}</td>
                <td class="p-4 flex flex-col text-left">
                    <span>${p.clienteEmail.split('@')[0].toUpperCase()}</span>
                    <span class="text-[9px] text-gray-400 font-medium normal-case font-mono">${p.clienteEmail}</span>
                </td>
                <td class="p-4 font-semibold text-left text-gray-700 uppercase text-[10px]">${p.detalle}</td>
                <td class="p-4 font-mono font-medium text-gray-500">${p.fecha}</td>
                <td class="p-4 text-left">
                    <span class="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-sm font-bold text-[9px] uppercase border border-purple-200/60">${estadoActual}</span>
                </td>
                <td class="p-4 text-center">
                    <select onchange="cambiarEstadoSincronizado('${p.clienteEmail}', '${p.id}', this.value)" class="border border-gray-300 p-2 bg-white text-[10px] uppercase text-gray-700 font-bold focus:border-purple-600 outline-none rounded-sm cursor-pointer">
                        <option value="Procesando" ${p.estado==='Procesando'?'selected':''}>⏳ Procesando</option>
                        <option value="En Camino" ${p.estado==='En Camino' || p.estado==='Recibido por Andreani'?'selected':''}>📦 En Camino</option>
                        <option value="Recibido por Andreani" ${p.estado==='Recibido por Andreani'?'selected':''}>🚛 Andreani</option>
                        <option value="Entregado" ${p.estado==='Entregado'?'selected':''}>✅ Entregado</option>
                    </select>
                </td>
            </tr>`;
    }).join('');
}

// 🔥 MODIFICADO: AHORA ENVÍA EL MAIL POR CADA CAMBIO DE ESTADO LOGÍSTICO MEDIANTE EMAILJS
function cambiarEstadoSincronizado(emailCliente, idPedido, nuevoEstado) {
    const clave = `compras-${emailCliente}`;
    let compras = JSON.parse(localStorage.getItem(clave)) || [];
    let p = compras.find(x => x.id === idPedido);
    
    if(p) { 
        p.estado = nuevoEstado; 
        localStorage.setItem(clave, JSON.stringify(compras)); 

        // También actualizamos la base global sincronizada
        let pedidosGlobales = JSON.parse(localStorage.getItem('global-pedidos')) || [];
        let pGlobal = pedidosGlobales.find(x => x.id === idPedido && x.clienteEmail === emailCliente);
        if(pGlobal) {
            pGlobal.estado = nuevoEstado;
            localStorage.setItem('global-pedidos', JSON.stringify(pedidosGlobales));
        }

        // Definimos el aviso adaptado de EmailJS según la auditoría de Andreani
        let plantillaAvisoLogistica = "";
        if (nuevoEstado === "En Camino" || nuevoEstado === "Recibido por Andreani") {
            plantillaAvisoLogistica = "¡Buenas noticias! Tu caja de insumos ya fue despachada del depósito central y se encuentra arriba del camión de distribución de Andreani.";
        } else if (nuevoEstado === "Entregado") {
            plantillaAvisoLogistica = "¡Tu pedido fue entregado de forma exitosa en tu domicilio! Recordá que a partir de este momento tenés un plazo estricto de 5 días para cualquier reclamo en tu panel.";
        } else {
            plantillaAvisoLogistica = `Tu orden de compra ha cambiado de estado a: ${nuevoEstado}.`;
        }

        // Estructuramos el objeto rico que espera el MailService de EmailJS
        const ordenMailActualizada = {
            id: p.id,
            clienteNombre: pGlobal ? pGlobal.clienteNombre : "Artista Body Art",
            clienteEmail: emailCliente,
            detalle: p.detalle,
            destino: pGlobal ? pGlobal.destino : "Dirección de Facturación Registrada",
            estado: nuevoEstado,
            tracking: pGlobal ? pGlobal.tracking : "AND-7410025",
            total: p.total,
            cuponUsado: pGlobal ? pGlobal.cuponUsado : "Ninguno",
            metodo: pGlobal ? pGlobal.metodo : "Mercado Pago",
            motivoAdmin: plantillaAvisoLogistica
        };

        // Disparo de control automatizado por EmailJS
        if (typeof dispararNotificacionMailReal === "function") {
            dispararNotificacionMailReal(ordenMailActualizada);
        } else {
            console.log(`✉️ [EmailJS Fallback] Cambio de estado despachado a: ${emailCliente}`);
        }
    }
    cargarPedidosAdmin();
}

// =========================================================================
// MÓDULO 4: CONTROL DE BENEFICIOS Y ASIGNACIÓN DE CUPONES (CUPOS LIMITADOS)
// =========================================================================
function refrescarSelectorClientes() {
    // 🔥 CORREGIDO: Ahora lee de 'global-usuarios' de forma simétrica con el registro
    const todosUsuarios = JSON.parse(localStorage.getItem('global-usuarios')) || [];
    const select = document.getElementById('cup-cliente-select');
    
    if(select) {
        if (todosUsuarios.length === 0) {
            select.innerHTML = `<option value="">No hay clientes registrados en el sistema</option>`;
        } else {
            select.innerHTML = todosUsuarios
                .filter(u => u.email !== 'admin@bodyart.com' && u.email !== 'admin@darkphase.com')
                .map(u => `<option value="${u.email}">${u.nombre.toUpperCase()} (${u.email})</option>`)
                .join('');
        }
    }
}

// 🔥 CONTROLADOR SUPREMO: Registra el beneficio, inyecta los cupos y dispara EmailJS
function ejecutarAltaCupon(e) {
    e.preventDefault();
    const codigo = document.getElementById('cup-codigo').value.trim().toUpperCase();
    const cliente = document.getElementById('cup-cliente-select').value;
    const monto = parseFloat(document.getElementById('cup-monto').value) || 0;
    
    // Capturamos el límite considerable fijado por el administrador en el nuevo input
    const inputUsos = document.getElementById('cup-usos-limite');
    const usosPermitidos = inputUsos ? parseInt(inputUsos.value) || 1 : 1;
    
    if(!cliente) {
        alert("❌ Error: Debes seleccionar un artista destinatario para el beneficio.");
        return;
    }

    let cupones = JSON.parse(localStorage.getItem('global-cupones')) || [];
    
    // Verificamos si el código ya existe para evitar colisiones
    if(cupones.some(c => c.codigo === codigo)) {
        alert("❌ El código de cupón ingresado ya existe en la base de datos.");
        return;
    }

    // Insertamos el registro comercial con el tracking de disponibilidad de usos
    cupones.push({ 
        codigo: codigo, 
        clienteExclusivo: cliente, 
        monto: monto, 
        usosRestantes: usosPermitidos,
        usosTotales: usosPermitidos,
        estado: "Activo" 
    });
    localStorage.setItem('global-cupones', JSON.stringify(cupones));
    
    // Buscamos el nombre del artista en 'global-usuarios' para personalizar la plantilla postal
    let listaUsuarios = JSON.parse(localStorage.getItem('global-usuarios')) || [];
    let usuario = listaUsuarios.find(u => u.email.toLowerCase().trim() === cliente.toLowerCase().trim());
    let nombreArtista = usuario ? usuario.nombre : "Artista Body Art";

    // Clonamos la estructura de enrutamiento requerida por tu mail-service.js
    const objetoMailCupon = {
        id: codigo, 
        clienteNombre: nombreArtista,
        clienteEmail: cliente.toLowerCase().trim(),
        detalle: `Cupón de Descuento Exclusivo por el valor neto de $${monto.toLocaleString('es-AR')}`,
        destino: "Bandeja de Beneficios del Club Dark Phase / Body Art",
        estado: "Activo",
        tracking: `Válido para ser utilizado un máximo de ${usosPermitidos} vez/veces`,
        total: monto,
        motivoAdmin: `¡Felicidades! La administración te ha asignado un beneficio comercial exclusivo. Ingresá el código promocional "${codigo}" al momento de liquidar tu carrito de compras para descontar de forma directa $${monto.toLocaleString('es-AR')} del subtotal de tus insumos. Cobertura: Válido para ${usosPermitidos} uso(s) personal(es).`
    };

    // 🔥 CONEXIÓN A EMAILJS DE FORMA SEGURA (Llamando a window para evitar fallbacks)
    if (typeof window.dispararNotificacionMailReal === "function") {
        window.dispararNotificacionMailReal(objetoMailCupon);
    } else {
        console.warn("⚠️ El servicio de EmailJS no está enlazado en este HTML todavía.");
    }

    alert(`🎟️ ¡Cupón ${codigo} asignado con éxito y notificado a la bandeja de ${cliente}!`);
    document.getElementById('form-alta-cupon').reset();
    
    // Recargamos componentes visuales
    cargarCuponesVendedor();
    if(typeof refrescarSelectorClientes === "function") refrescarSelectorClientes();
}

function cargarCuponesVendedor() {
    const cupones = JSON.parse(localStorage.getItem('global-cupones')) || [];
    const tabla = document.getElementById('tabla-cupones-vendedor');
    if(!tabla) return;
    
    if(cupones.length === 0) { 
        tabla.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-gray-400 italic font-bold">No se emitieron cupones de crédito todavía.</td></tr>`; 
        return; 
    }
    
    tabla.innerHTML = cupones.map(c => {
        // Evaluamos dinámicamente si los usos se agotaron para cambiar el badge a expirado
        let limiteUsos = c.usosRestantes !== undefined ? c.usosRestantes : 1;
        let estadoVisual = c.estado;
        if(limiteUsos <= 0) estadoVisual = "Expirado";

        let badgeColor = estadoVisual === "Activo" 
            ? "bg-green-100 text-green-800 border border-green-200" 
            : "bg-red-100 text-red-800 border border-red-200";

        return `
            <tr class="hover:bg-gray-50/50 transition font-bold text-gray-900">
                <td class="p-4 font-mono text-purple-600">${c.codigo}</td>
                <td class="p-4 font-semibold text-gray-800">${c.clienteExclusivo || 'Distribución Pública'}</td>
                <td class="p-4 text-purple-600 font-bold">$${parseFloat(c.monto).toLocaleString('es-AR')}</td>
                <td class="p-4 text-gray-500 font-mono text-[10px]">${limiteUsos} / ${c.usosTotales || 1} u. restantes</td>
                <td class="p-4"><span class="px-2 py-0.5 rounded-sm text-[9px] uppercase tracking-wider font-bold ${badgeColor}">${estadoVisual}</span></td>
            </tr>`;
    }).join('');
}

// =========================================================================
// MÓDULO 5: GESTIÓN INTEGRAL DEL PORFOLIO Y CARGA DE VIDEOS (OPTIMIZADO)
// =========================================================================
function formatearUrlVideo(url) {
    let link = url.trim();
    if (link.includes("youtube.com/watch?v=")) {
        const id = link.split("v=")[1].split("&")[0];
        return `https://www.youtube.com/embed/${id}`;
    }
    if (link.includes("youtu.be/")) {
        const id = link.split("youtu.be/")[1].split("?")[0];
        return `https://www.youtube.com/embed/${id}`;
    }
    return link;
}

function ejecutarAltaVideo(e) { 
    e.preventDefault(); 
    
    const tituloInput = document.getElementById('vid-titulo');
    const descInput = document.getElementById('vid-desc');
    const modoSelect = document.getElementById('vid-origen');
    const urlInput = document.getElementById('vid-url-input');

    if(!tituloInput || !descInput) return;

    const titulo = tituloInput.value.trim();
    const desc = descInput.value.trim();
    const modo = modoSelect ? modoSelect.value : 'url';
    
    let finalSrc = "";

    if (modo === 'url') {
        if(!urlInput || !urlInput.value.trim()) { 
            alert("❌ Por favor, ingresá una URL válida de video."); 
            return; 
        }
        finalSrc = formatearUrlVideo(urlInput.value.trim());
    } else {
        if (!videoCargadoBase64) { 
            alert("❌ Por favor, esperá que el video se cargue desde tu PC o usa una URL directa."); 
            return; 
        }
        finalSrc = videoCargadoBase64;
    }

    let vids = JSON.parse(localStorage.getItem('global-videos')) || [];
    vids.push({ 
        id: Date.now(), 
        titulo: titulo, 
        desc: desc, 
        src: finalSrc,
        esEmbed: finalSrc.includes("youtube.com/embed") || finalSrc.includes("player.vimeo")
    });
    
    localStorage.setItem('global-videos', JSON.stringify(vids));
    alert('🎬 ¡Trabajo de porfolio publicado con éxito!');
    
    if(document.getElementById('vid-titulo')) document.getElementById('vid-titulo').value = "";
    if(document.getElementById('vid-desc')) document.getElementById('vid-desc').value = "";
    if(document.getElementById('vid-url-input')) document.getElementById('vid-url-input').value = "";
    if(document.getElementById('vid-file-input')) document.getElementById('vid-file-input').value = "";
    videoCargadoBase64 = "";

    if(document.getElementById('lista-videos-admin')) {
        cargarVideosAdmin(); 
    } else {
        window.location.reload();
    }
}

function cargarVideosAdmin() {
    const vids = JSON.parse(localStorage.getItem('global-videos')) || [];
    const lista = document.getElementById('lista-videos-admin');
    if (!lista) return;
    
    if (vids.length === 0) { 
        lista.innerHTML = `<p class="text-gray-400 italic text-center p-4">No hay trabajos en el porfolio actualmente.</p>`; 
        return; 
    }
    
    lista.innerHTML = vids.map(v => {
        let reproductorHtml = "";
        if (v.esEmbed) {
            reproductorHtml = `<iframe src="${v.src}" class="w-24 h-16 rounded-sm bg-black border-0" allowfullscreen></iframe>`;
        } else {
            reproductorHtml = `<video src="${v.src}" controls preload="metadata" class="w-24 h-16 bg-black rounded-sm"></video>`;
        }

        return `
            <div class="flex justify-between items-center bg-gray-50 p-4 rounded-sm border gap-4">
                <div>
                    <h5 class="font-bold text-gray-900">${v.titulo}</h5>
                    <p class="text-gray-400 text-[10px] normal-case leading-tight">${v.desc}</p>
                </div>
                <div class="flex items-center gap-3">
                    ${reproductorHtml}
                    <button onclick="eliminarVideoPorfolio(${v.id})" class="text-red-600 bg-red-50 hover:bg-red-600 hover:text-white p-2 rounded-sm cursor-pointer transition">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// =========================================================================
// MÓDULO 6: UTILIDADES GLOBALES DE SISTEMA Y LOGOUT
// =========================================================================
function reinicioDeFabricaTotal() { 
    if(confirm("⚠ ¡Esto borrará todos los productos, cupones y videos del LocalStorage! ¿Continuar?")) {
        localStorage.clear(); 
        window.location.reload(); 
    }
}

function cerrarSesion() { 
    localStorage.removeItem('usuario-sesion'); 
    window.location.href = 'index.html'; 
}
