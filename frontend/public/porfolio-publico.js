// =========================================================================
// INITIALIZER CENTRAL DE LA PÁGINA PÚBLICA DE VIDEOS
// =========================================================================
function initPantallaVideos() {
    renderizarPorfolioPublico();
    chequearSesionGlobal();
}

// =========================================================================
// REGLA DE NEGOCIO: INYECCIÓN AUTOMÁTICA DE LOS 6 VIDEOS PREESTABLECIDOS
// =========================================================================
function inicializarVideosPreestablecidos() {
    let vids = JSON.parse(localStorage.getItem('global-videos')) || [];
    
    // Si la base de datos local está vacía, monta los 6 videos estables con mp4 reales que reproducen al toque
    if (vids.length === 0) {
        vids = [
            { 
                id: 1001, 
                titulo: "Tatuaje Realismo Black and Grey - Proceso", 
                desc: "Técnica avanzada de dilución de tintas oscuras y degradación sólida sobre piel.", 
                src: "https://vjs.zencdn.net/v/oceans.mp4", 
                esEmbed: false 
            },
            { 
                id: 1002, 
                titulo: "Calibración y Línea Fina Profesional", 
                desc: "Uso estratégico de cartuchos 3RL y máquinas de motor rotativo para trazo limpio de alta precisión.", 
                src: "https://www.w3schools.com/html/movie.mp4", 
                esEmbed: false 
            },
            { 
                id: 1003, 
                titulo: "Body Painting Flúor con Iluminación UV", 
                desc: "Sesión artística interactiva utilizando pigmentaciones reactivas a la luz negra y luz ultravioleta.", 
                src: "https://vjs.zencdn.net/v/oceans.mp4", 
                esEmbed: false 
            },
            { 
                id: 1004, 
                titulo: "Armado de Mesa y Protocolo de Bioseguridad", 
                desc: "Encintado estricto de componentes, barreras protectoras médicas y descarte seguro de agujas.", 
                src: "https://www.w3schools.com/html/movie.mp4", 
                esEmbed: false 
            },
            { 
                id: 1005, 
                titulo: "Exposición de Flashes Neo Tradicionales", 
                desc: "Muestra panorámica del catálogo de transferencias de Dark Phase listos para aplicar en el estudio.", 
                src: "https://vjs.zencdn.net/v/oceans.mp4", 
                esEmbed: false 
            },
            { 
                id: 1006, 
                titulo: "Cobertura Completa y Cover Up Técnico", 
                desc: "Estudio de bloqueo cromático profundo para rediseñar y tapar una pieza antigua deteriorada.", 
                src: "https://www.w3schools.com/html/movie.mp4", 
                esEmbed: false 
            }
        ];
        localStorage.setItem('global-videos', JSON.stringify(vids));
    }
}

// =========================================================================
// RENDERIZADO EN GRILLA PANORÁMICA (ESTILO YOUTUBE - 3 COLUMNAS)
// =========================================================================
function renderizarPorfolioPublico() {
    inicializarVideosPreestablecidos();

    const listaVideos = JSON.parse(localStorage.getItem('global-videos')) || [];
    const contenedor = document.getElementById('contenedor-publico-porfolio');
    if (!contenedor) return;

    // Abrimos la fila estructurada con Grid Responsivo (1 columna en cel, 2 en tablet, 3 en PC)
    let htmlContenido = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">';

    listaVideos.forEach(v => {
        let reproductor = "";
        
        // Verificación del tipo de origen para evitar quiebre de reproductores
        if (v.esEmbed || (v.src && (v.src.includes("embed") || v.src.includes("youtube")))) {
            reproductor = `
                <div class="relative w-full aspect-video bg-black rounded-sm overflow-hidden shadow-inner border border-gray-100">
                    <iframe src="${v.src}" class="absolute top-0 left-0 w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>`;
        } else {
            // El atributo controls inyecta la botonera nativa para que corra el video sin trabarse
            reproductor = `
                <div class="relative w-full aspect-video bg-black rounded-sm overflow-hidden shadow-inner border border-gray-100">
                    <video src="${v.src}" controls playsinline preload="auto" class="w-full h-full object-cover"></video>
                </div>`;
        }

        htmlContenido += `
            <div class="bg-white border border-gray-100 rounded-sm overflow-hidden p-4 flex flex-col justify-between shadow-xs hover:shadow-md transition duration-200">
                <div class="space-y-3">
                    ${reproductor}
                    <div class="px-1">
                        <h3 class="font-bold text-gray-900 text-sm font-serif tracking-wide uppercase leading-snug line-clamp-1">${v.titulo}</h3>
                        <p class="text-gray-500 text-[11px] leading-relaxed normal-case mt-1 font-medium line-clamp-2">${v.desc || 'Sin descripción disponible.'}</p>
                    </div>
                </div>
            </div>`;
    });

    htmlContenido += '</div>';
    contenedor.innerHTML = htmlContenido;
}

// =========================================================================
// CONTROL PERSISTENTE DE SESIONES DE NAVEGACIÓN
// =========================================================================
function chequearSesionGlobal() {
    const u = JSON.parse(localStorage.getItem('usuario-sesion'));
    const btnLogin = document.getElementById('nav-login-btn');
    const txtLogin = document.getElementById('nav-login-text');
    
    if (u) {
        if (u.email === 'admin@bodyart.com' || u.rol === 'ADMIN') {
            if (txtLogin) txtLogin.innerText = 'Panel Admin';
            if (btnLogin) btnLogin.href = 'admin-dashboard.html';
        } else {
            if (txtLogin) txtLogin.innerText = u.nombre;
            if (btnLogin) btnLogin.href = '#';
        }
    } else {
        if (txtLogin) txtLogin.innerText = 'Ingresar';
        if (btnLogin) btnLogin.href = 'login.html';
    }
}