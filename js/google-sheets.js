// ===== MÓDULO DE INTEGRACIÓN CON GOOGLE SHEETS =====
const GoogleSheets = {
    // Enviar postulación a Google Sheets
    enviarPostulacion: async function() {
        if (!Formulario.validarPaso(5)) {
            Main.mostrarAlerta('error', 'Debe aceptar la declaración de veracidad');
            return;
        }
        
        // Cambiar texto del botón a "Enviando..."
        const btnEnviar = document.getElementById('btnEnviar');
        const originalText = btnEnviar.innerHTML;
        btnEnviar.innerHTML = '<span class="spinner"></span> Enviando a Google Sheets...';
        btnEnviar.disabled = true;
        
        try {
            // Generar ID único y completar datos
            const postulacionId = Utils.generarIdUnico();
            const fechaEnvio = Utils.formatearFecha();
            
            ESTADO.postulacionActual.id = postulacionId;
            ESTADO.postulacionActual.fechaEnvio = fechaEnvio;
            ESTADO.postulacionActual.estado = 'COMPLETA CONFORME OG 3125';
            ESTADO.postulacionActual.version = CONFIG.APP_CONFIG.VERSION;
            
            // Preparar datos para Google Sheets
            const datosParaSheet = [
                ESTADO.postulacionActual.id,
                ESTADO.postulacionActual.fechaEnvio,
                ESTADO.postulacionActual.estado,
                ESTADO.postulacionActual.categoria,
                ESTADO.postulacionActual.categoriaNombre,
                ESTADO.postulacionActual.run,
                ESTADO.postulacionActual.nombres,
                ESTADO.postulacionActual.apellidos,
                ESTADO.postulacionActual.nombramiento,
                ESTADO.postulacionActual.grado,
                ESTADO.postulacionActual.altaReparticion,
                ESTADO.postulacionActual.reparticion,
                ESTADO.postulacionActual.dotacion,
                ESTADO.postulacionActual.listaMeritos,
                ESTADO.postulacionActual.sanciones12meses,
                ESTADO.postulacionActual.procesoJudicial,
                ESTADO.postulacionActual.amonestaciones || 0,
                ESTADO.postulacionActual.reprensiones || 0,
                ESTADO.postulacionActual.arrestos || 0,
                ESTADO.postulacionActual.licenciaActo || 0,
                ESTADO.postulacionActual.totalPuntaje || 0,
                JSON.stringify(ESTADO.postulacionActual.evaluacion || []),
                ESTADO.postulacionActual.narracionHecho || '',
                ESTADO.postulacionActual.razonesFundamentacion || '',
                ESTADO.postulacionActual.declaracionVeracidad ? 'SÍ' : 'NO'
            ];
            
            // Enviar a Google Sheets
            Main.mostrarAlerta('info', 'Enviando datos a Google Sheets...');
            
            // Crear FormData para enviar
            const formData = new FormData();
            formData.append('action', 'insertarPostulacion');
            formData.append('datos', JSON.stringify(datosParaSheet));
            formData.append('timestamp', new Date().toISOString());
            
            // Enviar usando fetch
            const response = await fetch(CONFIG.GOOGLE_SHEETS_WEB_APP_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            });
            
            // Esperar para dar tiempo al procesamiento
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Guardar localmente como respaldo
            SISTEMA.postulaciones.push(JSON.parse(JSON.stringify(ESTADO.postulacionActual)));
            Main.guardarPostulaciones();
            
            // Mostrar confirmación exitosa
            this.mostrarConfirmacionExito(postulacionId);
            
        } catch (error) {
            console.error('❌ Error enviando a Google Sheets:', error);
            
            // Guardar localmente aunque falle el envío a Sheets
            SISTEMA.postulaciones.push(JSON.parse(JSON.stringify(ESTADO.postulacionActual)));
            Main.guardarPostulaciones();
            
            // Mostrar advertencia pero permitir continuar
            Main.mostrarAlerta('warning', 
                '⚠️ Los datos se guardaron localmente pero hubo un problema con la conexión.<br>' +
                'Puede exportar los datos manualmente más tarde.'
            );
            
            // Mostrar confirmación parcial
            this.mostrarConfirmacionParcial();
        } finally {
            // Restaurar botón
            btnEnviar.innerHTML = originalText;
            btnEnviar.disabled = false;
        }
    },
    
    // Mostrar confirmación exitosa
    mostrarConfirmacionExito: function(postulacionId) {
        document.getElementById('postulacionId').textContent = postulacionId;
        document.getElementById('postulacionFecha').textContent = ESTADO.postulacionActual.fechaEnvio;
        document.getElementById('sheetsStatus').textContent = 'REGISTRADO EN SHEETS';
        document.getElementById('sheetsStatus').className = 'status-badge status-complete';
        
        document.getElementById('confirmModal').classList.add('active');
        
        console.log(`✅ Postulación ${postulacionId} enviada exitosamente`);
    },
    
    // Mostrar confirmación parcial (solo local)
    mostrarConfirmacionParcial: function() {
        const postulacionId = ESTADO.postulacionActual.id || Utils.generarIdUnico();
        
        document.getElementById('postulacionId').textContent = postulacionId;
        document.getElementById('postulacionFecha').textContent = ESTADO.postulacionActual.fechaEnvio;
        document.getElementById('sheetsStatus').textContent = 'SOLO LOCAL';
        document.getElementById('sheetsStatus').className = 'status-badge status-pending';
        
        // Actualizar mensaje
        const mensajeElement = document.getElementById('mensajeConfirmacion');
        mensajeElement.innerHTML = `
            <div class="alert alert-warning" style="margin: 10px 0;">
                <strong>⚠️ Atención:</strong> Los datos se guardaron localmente pero no se pudieron enviar a Google Sheets.<br>
                <small>Puede exportar los datos manualmente más tarde usando la función de exportación.</small>
            </div>
            La postulación ha sido registrada localmente y se encuentra disponible para revisión.
        `;
        
        document.getElementById('confirmModal').classList.add('active');
    },
    
    // Ver Google Sheets
    verGoogleSheets: function() {
        window.open(CONFIG.GOOGLE_SHEET_URL, '_blank');
    },
    
    // Probar conexión con Google Sheets
    testConexionSheets: async function() {
        Main.mostrarAlerta('info', 'Probando conexión con Google Sheets...');
        const conexion = await Main.verificarConexionSheets();
        if (conexion) {
            Main.mostrarAlerta('success', '✅ Conexión con Google Sheets establecida correctamente');
        } else {
            Main.mostrarAlerta('warning', '⚠️ No se pudo establecer conexión con Google Sheets');
        }
    }
};

// Hacer disponible globalmente
window.GoogleSheets = GoogleSheets;
