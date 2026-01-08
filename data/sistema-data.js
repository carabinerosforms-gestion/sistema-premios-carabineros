// ===== DATOS DEL SISTEMA CARABINEROS =====
window.SISTEMA = {
    // Categorías de premios según OG 3125
    categorias: {
        d1: {
            nombre: "Desempeño Profesional Operativo",
            requisitos: [
                "Personal de Nombramiento Supremo (Subteniente a Teniente Coronel)",
                "Personal de Nombramiento Institucional (Carabinero a Suboficial Mayor)",
                "Lista N°1 de Méritos o N°2 Satisfactorios",
                "Sin sanciones últimos 12 meses (días de arresto)",
                "Sin procesos judiciales como imputado"
            ],
            factores: [
                "Eficacia: Realiza trabajos según objetivos y metas asignadas",
                "Eficiencia: Administra recursos con máximo rendimiento",
                "Calidad de trabajo: Cumple labor sin errores importantes",
                "Capacidad de Gestión: Anticipa necesidades y genera acciones proactivas",
                "Servicios a la comunidad: Interactúa permanentemente con ciudadanía",
                "Motivación laboral: Buena disposición en cumplimiento de obligaciones",
                "Iniciativa: Propone soluciones sin necesidad de supervisión",
                "Relaciones interpersonales: Trato amable y respetuoso",
                "Discreción: Reserva en manejo de información institucional",
                "Principios y Valores: Comportamiento ético acorde a la Institución"
            ],
            puntajeMinimo: 10
        },
        d2: {
            nombre: "Servicios Destacados a la Comunidad",
            requisitos: [
                "Personal de Nombramiento Supremo o Institucional",
                "Desempeño óptimo en acercamiento a la comunidad",
                "Lista N°1 de Méritos o N°2 Satisfactorios",
                "Sin procesos judiciales como imputado",
                "Aprobación del Jefe de Zona o Prefecto"
            ],
            factores: [
                "Desempeño Comunitario: Detecta necesidades ciudadanas",
                "Capacidad para solucionar problemas",
                "Integración Social: Mantiene canales de comunicación",
                "Calidad de Servicio: Cumple con orientación de compromiso comunitario",
                "Aporte a la efectividad Institucional",
                "Liderazgo social: Motiva a la comunidad",
                "Interés por el trabajo hacia la comunidad",
                "Relaciones interpersonales respetuosas",
                "Iniciativa en soluciones comunitarias",
                "Principios y Valores institucionales"
            ],
            puntajeMinimo: 10
        },
        d3: {
            nombre: "Acción Policial Destacada",
            requisitos: [
                "Hecho de importancia, gravedad o trascendencia",
                "Impacto positivo en la comunidad",
                "Personal puso en riesgo su integridad física",
                "Evitó que personal o civiles resultaran afectados",
                "Acción prestigia a Carabineros de Chile",
                "Excede exigencias normales del servicio"
            ],
            factores: [
                "Importancia y trascendencia del hecho",
                "Impacto en la comunidad",
                "Participación activa del personal",
                "Nivel de riesgo para la integridad física",
                "Protección a personal institucional y civiles",
                "Prestigio institucional generado",
                "Exceder exigencias del servicio",
                "Grado de compromiso demostrado",
                "Reconocimiento requerido",
                "Características distintivas sobre lo exigido"
            ],
            puntajeMinimo: 8
        },
        d4: {
            nombre: "Acciones Destacadas en Promoción de DD.HH.",
            requisitos: [
                "Personal que propone iniciativas para garantizar DD.HH.",
                "Evidencia compromiso institucional con estándares nacionales e internacionales",
                "Lista N°1 de Méritos o N°2 Satisfactorios",
                "Sin sanciones graves",
                "Aprobación de la Sección de DD.HH."
            ],
            factores: [
                "Eficacia en procedimientos de DD.HH.",
                "Eficiencia en uso de recursos para DD.HH.",
                "Contribución a protección de DD.HH.",
                "Promoción activa de DD.HH.",
                "Iniciativa en ejecución de acciones",
                "Relaciones interpersonales empáticas",
                "Discreción en manejo de información",
                "Principios y Valores institucionales",
                "Enfoque en grupos vulnerables",
                "Difusión de información apropiada"
            ],
            puntajeMinimo: 10
        },
        f1: {
            nombre: "Desempeño Profesional Administrativo",
            requisitos: [
                "Personal de Nombramiento Supremo de Intendencia/Servicios",
                "Personal Civil de Nombramiento Supremo/Institucional",
                "Personal Contratado por Resolución (C.P.R.)",
                "Lista N°1 de Méritos o N°2 Satisfactorios",
                "Sin sanciones administrativas graves"
            ],
            factores: [
                "Eficacia de la labor administrativa",
                "Eficiencia en uso de recursos",
                "Calidad del trabajo sin errores importantes",
                "Capacidad de gestión según planificación",
                "Motivación laboral",
                "Iniciativa en propuesta de soluciones",
                "Relaciones interpersonales adecuadas",
                "Discreción en manejo de información",
                "Principios y Valores institucionales",
                "Presentación y orden del trabajo"
            ],
            puntajeMinimo: 10
        }
    },
    
    // Grados por tipo de nombramiento
    gradosPorNombramiento: {
        PNS: [
            "Subteniente", 
            "Teniente", 
            "Capitán", 
            "Mayor", 
            "Teniente Coronel", 
            "Coronel", 
            "General"
        ],
        PNI: [
            "Carabinero", "Cabo 2°", "Cabo 1°", "Sargento 2°", 
            "Sargento 1°", "Suboficial", "Suboficial Mayor"
        ],
        CPR: [
            "Profesional", "Técnico Superior", "Técnico", 
            "Administrativo", "Especialista", "Analista"
        ]
    },
    
    // Postulaciones guardadas
    postulaciones: []
};

// ===== ESTADO GLOBAL DE LA APLICACIÓN =====
window.ESTADO = {
    currentStep: 1,
    postulacionActual: {
        evaluacion: []
    }
};
