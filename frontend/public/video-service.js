const VideoService = {
    VIDEOS_FABRICA: [
        { id: 1, titulo: "La Creación del Camaleón Humano", desc: "Proceso completo de mimetización corporal de más de 8 horas de pintura continua.", img: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1000" },
        { id: 2, titulo: "Metamorfosis Natural", desc: "Fusión de la anatomía corporal con texturas y paisajes orgánicos.", img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000" }
    ],

    init() {
        if (!localStorage.getItem('porfolio-dinamico')) {
            localStorage.setItem('porfolio-dinamico', JSON.stringify(this.VIDEOS_FABRICA));
        }
    },

    obtenerTodos() {
        this.init();
        return JSON.parse(localStorage.getItem('porfolio-dinamico')) || [];
    },

    agregar(titulo, desc) {
        let vids = this.obtenerTodos();
        vids.push({
            id: Date.now(),
            titulo,
            desc,
            img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000"
        });
        localStorage.setItem('porfolio-dinamico', JSON.stringify(vids));
    },

    restaurarFabrica() {
        localStorage.setItem('porfolio-dinamico', JSON.stringify(this.VIDEOS_FABRICA));
    }
};

// Auto-inicializar
VideoService.init();