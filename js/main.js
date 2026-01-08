// ===== MÓDULO PRINCIPAL DE LA APLICACIÓN =====
const Main = {
    // Inicializar aplicación
    init: function() {
        this.cargarPostulacionesGuardadas();
        this.actualizarContadorPostulaciones();
        this.configurarEventListeners();
        console.log('✅ Sistema Carabineros OG 3125 inicializado');
    },
    
    // Cargar postulaciones desde localStorage
    cargarPostulacionesGuardadas: function() {
        try {
            const guardadas = localStorage.getItem('postulacionesCarabinerosOG3125');
            if (guardadas) {
                SISTEMA.postulaciones = JSON.parse(guardadas);
                console.log(`📂 Cargadas ${SISTEMA.postulaciones.length} postulaciones previas`);
            }
        } catch (error) {
            console.error('❌ Error cargando postulaciones:', error);
            SISTEMA.postulaciones = [];
        }
    },
    
    // Guardar postulaciones en localStorage
    guardarPostulaciones: function() {
        try {
            localStorage.setItem('postulacionesCarabinerosOG3125', JSON.stringify(SISTEMA.postulaciones));
            this.actualizarContadorPostulaciones();
        } catch (error) {
            console.error('❌ Error guardando postulaciones:', error);
        }
    },
    
    // Actualizar contador visual
    actualizarContadorPostulaciones: function() {
        const contador = document.getElementById('contadorPostulaciones');
        if (contador) {
            contador.textContent = SISTEMA.postulaciones.length;
        }
    },
    
    // Configurar event listeners globales
    configurarEventListeners: function() {
        // Evento para mostrar requisitos al seleccionar categoría
        document.getElementById('categoriaPremio').addEventListener('change', function() {
            const categoria = this.value;
            const requisitosDiv = document.getElementById('requisitosCategoria');
            const lista = document.getElementById('listaRequisitos');
            
            if (categoria && SISTEMA.categorias[categoria]) {
                requisitosDiv.classList.remove('hidden');
                lista.innerHTML = '';
                
                SISTEMA.categorias[categoria].requisitos.forEach(req => {
                    const li = document.createElement('li');
                    li.textContent = req;
                    lista.appendChild(li);
                });
            } else {
                requisitosDiv.classList.add('hidden');
            }
        });
        
        // Evento para actualizar grados al cambiar nombramiento
        document.getElementById('nombramiento').addEventListener('change', function() {
            const nombramiento = this.value;
            const selectGrado = document.getElementById('grado');
            
            selectGrado.disabled = !nombramiento;
            
            if (nombramiento) {
                const grados = SISTEMA.gradosPorNombramiento[nombramiento] || [];
                selectGrado.innerHTML = '<option value="">-- Seleccione grado --</option>';
                
                grados.forEach(grado => {
                    const option = document.createElement('option');
                    option.value = grado;
                    option.textContent = grado;
                    selectGrado.appendChild(option);
                });
            } else {
                selectGrado.innerHTML = '<option value="">-- Seleccione nombramiento primero --</option>';
            }
        });
    },
    
    // Mostrar alerta global
    mostrarAlerta: function(tipo, mensaje) {
        const alertDiv = document.getElementById('globalAlert');
        
        alertDiv.className = `alert alert-${tipo} show`;
        alertDiv.innerHTML = mensaje;
        
        setTimeout(() => {
            alertDiv.classList.remove('show');
        }, CONFIG.APP_CONFIG.TIEMPO_ALERTA);
    },
    
    // Nueva postulación
    nuevaPostulacion: function() {
        // Reiniciar estado
        ESTADO.currentStep = 1;
        ESTADO.postulacionActual = { evaluacion: [] };
        
        // Limpiar formulario
        Utils.limpiarFormulario();
        
        // Reiniciar interfaz
        document.querySelectorAll('.step-content').forEach(div => {
            div.classList.remove('active');
        });
        document.getElementById('stepContent1').classList.add('active');
        
        // Reiniciar progreso
        document.querySelectorAll('.step').forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index === 0) {
                step.classList.add('active');
            }
        });
        
        // Resetear grados
        document.getElementById('grado').innerHTML = '<option value="">-- Seleccione nombramiento primero --</option>';
        document.getElementById('grado').disabled = true;
        
        // Habilitar botón enviar
        document.getElementById('btnEnviar').disabled = false;
        
        // Cerrar modal
        Utils.closeModal();
        
        this.mostrarAlerta('success', '📝 Nueva postulación iniciada. Complete los datos desde el principio.');
    },
    
    // Exportar postulaciones a JSON
    exportarPostulaciones: function() {
        if (SISTEMA.postulaciones.length === 0) {
            this.mostrarAlerta('warning', 'No hay postulaciones para exportar');
            return;
        }
        
        const dataStr = JSON.stringify(SISTEMA.postulaciones, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `postulaciones_carabineros_${new Date().toISOString().slice(0,10)}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        this.mostrarAlerta('success', `📥 Exportadas ${SISTEMA.postulaciones.length} postulaciones`);
    },
    
    // Verificar conexión con Google Sheets
    verificarConexionSheets: async function() {
        try {
            const valSheets = document.getElementById('valSheets');
            if (valSheets) {
                valSheets.innerHTML = '<span class="spinner"></span>Verificando conexión...';
            }
            
            const response = await fetch(CONFIG.GOOGLE_SHEETS_WEB_APP_URL + '?test=1');
            
            if (response.ok) {
                if (valSheets) {
                    valSheets.innerHTML = '✅ Conexión con Google Sheets establecida';
                    valSheets.style.color = 'var(--verde-ok)';
                }
                return true;
            } else {
                throw new Error('Error en la conexión');
            }
        } catch (error) {
            console.warn('⚠️ No se pudo verificar conexión con Google Sheets:', error);
            const valSheets = document.getElementById('valSheets');
            if (valSheets) {
                valSheets.innerHTML = '⚠️ Conexión con Google Sheets no disponible';
                valSheets.style.color = 'var(--amarillo-alerta)';
            }
            return false;
        }
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    Main.init();
});

// Hacer disponible globalmente
window.Main = Main;
