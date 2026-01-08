// ===== FUNCIONES DE UTILIDAD GENERAL =====
const Utils = {
    // Formatear RUN chileno
    formatearRUN: function(run) {
        if (!run) return '';
        
        let runLimpio = run.replace(/[^0-9kK]/g, '').toUpperCase();
        
        if (runLimpio.length < 2) return runLimpio;
        
        if (runLimpio.length > 9) {
            runLimpio = runLimpio.substring(0, 9);
        }
        
        let numero = runLimpio.slice(0, -1);
        let dv = runLimpio.slice(-1);
        
        if (numero.length >= 7) {
            let numeroFormateado = '';
            let contador = 0;
            
            for (let i = numero.length - 1; i >= 0; i--) {
                numeroFormateado = numero[i] + numeroFormateado;
                contador++;
                if (contador === 3 && i > 0) {
                    numeroFormateado = '.' + numeroFormateado;
                    contador = 0;
                }
            }
            
            numero = numeroFormateado;
        }
        
        return numero + '-' + dv;
    },
    
    // Validar RUN chileno
    validarRUN: function(run) {
        if (!run) return false;
        
        run = this.formatearRUN(run);
        const regex = /^[0-9]{1,3}(?:\.[0-9]{3}){2}-[0-9K]$/;
        if (!regex.test(run)) return false;
        
        const [numConPuntos, dvIngresado] = run.split('-');
        const num = numConPuntos.replace(/\./g, '');
        
        if (num.length < 7 || num.length > 8) return false;
        
        let suma = 0;
        let multiplo = 2;
        
        for (let i = num.length - 1; i >= 0; i--) {
            suma += parseInt(num[i]) * multiplo;
            multiplo = multiplo === 7 ? 2 : multiplo + 1;
        }
        
        const dv = 11 - (suma % 11);
        let dvFinal = dv === 11 ? '0' : dv === 10 ? 'K' : dv.toString();
        
        return dvFinal === dvIngresado;
    },
    
    // Formatear RUN en tiempo real
    formatearRUNCampo: function(input) {
        const valorOriginal = input.value;
        const cursorPos = input.selectionStart;
        
        const valorFormateado = this.formatearRUN(valorOriginal);
        input.value = valorFormateado;
        
        const cambio = valorFormateado.length - valorOriginal.length;
        input.setSelectionRange(cursorPos + cambio, cursorPos + cambio);
    },
    
    // Validar RUN en tiempo real
    validarRUNCampo: function() {
        const runInput = document.getElementById('run');
        let runValue = runInput.value;
        
        if (!runValue) return;
        
        runValue = this.formatearRUN(runValue);
        runInput.value = runValue;
        
        if (this.validarRUN(runValue)) {
            runInput.classList.remove('error');
            runInput.classList.add('success');
            this.ocultarError('runError');
        } else {
            runInput.classList.remove('success');
            runInput.classList.add('error');
            this.mostrarError('runError');
        }
    },
    
    // Mostrar error en campo
    mostrarError: function(id) {
        const errorEl = document.getElementById(id);
        const inputId = id.replace('Error', '');
        const inputEl = document.getElementById(inputId);
        
        if (errorEl) {
            errorEl.classList.add('show');
        }
        
        if (inputEl) {
            inputEl.classList.add('error');
            inputEl.classList.remove('success');
        }
    },
    
    // Ocultar error en campo
    ocultarError: function(id) {
        const errorEl = document.getElementById(id);
        const inputId = id.replace('Error', '');
        const inputEl = document.getElementById(inputId);
        
        if (errorEl) {
            errorEl.classList.remove('show');
        }
        
        if (inputEl) {
            inputEl.classList.remove('error');
        }
    },
    
    // Generar ID único
    generarIdUnico: function() {
        const timestamp = new Date().getTime();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `POST-${timestamp.toString().slice(-6)}-${random}`;
    },
    
    // Formatear fecha
    formatearFecha: function(fecha = new Date()) {
        return fecha.toLocaleString('es-CL', {
            timeZone: 'America/Santiago',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    },
    
    // Cerrar modal
    closeModal: function() {
        document.getElementById('confirmModal').classList.remove('active');
    },
    
    // Limpiar formulario
    limpiarFormulario: function() {
        document.querySelectorAll('input, select, textarea').forEach(element => {
            if (element.type !== 'button' && element.type !== 'submit') {
                element.value = '';
                element.classList.remove('error', 'success');
                
                if (element.type === 'checkbox') {
                    element.checked = false;
                }
                
                if (element.type === 'select-one') {
                    element.selectedIndex = 0;
                }
            }
        });
        
        // Limpiar errores
        document.querySelectorAll('.error-message').forEach(el => {
            el.classList.remove('show');
        });
        
        // Limpiar alertas
        document.getElementById('globalAlert').classList.remove('show');
        document.getElementById('revisionAlert').classList.remove('show');
    }
};

// Hacer disponible globalmente
window.Utils = Utils;
