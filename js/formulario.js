// ===== MÓDULO DE FORMULARIO =====
const Formulario = {
    // Navegar al siguiente paso
    nextStep: function(step) {
        if (!this.validarPaso(ESTADO.currentStep)) {
            Main.mostrarAlerta('error', 'Por favor complete todos los campos requeridos correctamente');
            return;
        }
        
        // Ocultar paso actual
        document.getElementById(`stepContent${ESTADO.currentStep}`).classList.remove('active');
        
        // Marcar paso como completado
        document.getElementById(`step${ESTADO.currentStep}`).classList.add('completed');
        
        // Actualizar estado
        ESTADO.currentStep = step;
        
        // Mostrar nuevo paso
        document.getElementById(`stepContent${step}`).classList.add('active');
        
        // Actualizar progreso visual
        this.actualizarProgreso();
        
        // Configuración específica por paso
        switch(step) {
            case 4:
                this.cargarFactoresEvaluacion();
                break;
            case 5:
                this.generarResumen();
                break;
        }
    },
    
    // Navegar al paso anterior
    prevStep: function(step) {
        // Ocultar paso actual
        document.getElementById(`stepContent${ESTADO.currentStep}`).classList.remove('active');
        
        // Quitar estado completado del paso actual
        document.getElementById(`step${ESTADO.currentStep}`).classList.remove('completed');
        
        // Actualizar estado
        ESTADO.currentStep = step;
        
        // Mostrar paso anterior
        document.getElementById(`stepContent${step}`).classList.add('active');
        
        // Actualizar progreso visual
        this.actualizarProgreso();
    },
    
    // Actualizar barra de progreso
    actualizarProgreso: function() {
        document.querySelectorAll('.step').forEach((step, i) => {
            const stepNumber = i + 1;
            
            if (stepNumber === ESTADO.currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else if (stepNumber < ESTADO.currentStep) {
                step.classList.remove('active');
                step.classList.add('completed');
            } else {
                step.classList.remove('active');
                step.classList.remove('completed');
            }
        });
    },
    
    // Validar paso actual
    validarPaso: function(paso) {
        switch(paso) {
            case 1:
                return this.validarPaso1();
            case 2:
                return this.validarPaso2();
            case 3:
                return this.validarPaso3();
            case 4:
                return this.validarPaso4();
            case 5:
                return this.validarPaso5();
            default:
                return true;
        }
    },
    
    // Validar paso 1 - Categoría
    validarPaso1: function() {
        const categoria = document.getElementById('categoriaPremio').value;
        let valido = true;
        
        if (!categoria) {
            Utils.mostrarError('categoriaError');
            valido = false;
        } else {
            Utils.ocultarError('categoriaError');
            ESTADO.postulacionActual.categoria = categoria;
            ESTADO.postulacionActual.categoriaNombre = SISTEMA.categorias[categoria].nombre;
        }
        
        return valido;
    },
    
    // Validar paso 2 - Datos personales
    validarPaso2: function() {
        let valido = true;
        
        // Limpiar errores previos
        ['runError', 'nombresError', 'apellidosError', 'nombramientoError', 
         'gradoError', 'altaRepError', 'reparticionError', 'dotacionError']
         .forEach(errorId => Utils.ocultarError(errorId));
        
        // Validar RUN
        const runInput = document.getElementById('run');
        let run = runInput.value;
        
        if (run) {
            run = Utils.formatearRUN(run);
            runInput.value = run;
        }
        
        if (!Utils.validarRUN(run)) {
            Utils.mostrarError('runError');
            valido = false;
        } else {
            ESTADO.postulacionActual.run = run;
        }
        
        // Validar otros campos
        const campos = [
            { id: 'nombres', error: 'nombresError' },
            { id: 'apellidos', error: 'apellidosError' },
            { id: 'nombramiento', error: 'nombramientoError' },
            { id: 'grado', error: 'gradoError' },
            { id: 'altaReparticion', error: 'altaRepError' },
            { id: 'reparticion', error: 'reparticionError' },
            { id: 'dotacion', error: 'dotacionError' }
        ];
        
        campos.forEach(campo => {
            const el = document.getElementById(campo.id);
            if (!el.value) {
                Utils.mostrarError(campo.error);
                valido = false;
            } else {
                Utils.ocultarError(campo.error);
                ESTADO.postulacionActual[campo.id] = el.value;
            }
        });
        
        return valido;
    },
    
    // Validar paso 3 - Antecedentes
    validarPaso3: function() {
        let valido = true;
        
        // Limpiar errores previos
        ['listaError', 'sancionesError', 'procesoError']
         .forEach(errorId => Utils.ocultarError(errorId));
        
        const campos = [
            { id: 'listaMeritos', error: 'listaError' },
            { id: 'sanciones12meses', error: 'sancionesError' },
            { id: 'procesoJudicial', error: 'procesoError' }
        ];
        
        campos.forEach(campo => {
            const el = document.getElementById(campo.id);
            if (!el.value) {
                Utils.mostrarError(campo.error);
                valido = false;
            } else {
                Utils.ocultarError(campo.error);
                ESTADO.postulacionActual[campo.id] = el.value;
            }
        });
        
        // Validar elegibilidad
        if (!this.validarElegibilidad()) {
            valido = false;
        }
        
        // Guardar otros antecedentes
        ESTADO.postulacionActual.amonestaciones = document.getElementById('amonestaciones').value;
        ESTADO.postulacionActual.reprensiones = document.getElementById('reprensiones').value;
        ESTADO.postulacionActual.arrestos = document.getElementById('arrestos').value;
        ESTADO.postulacionActual.licenciaActo = document.getElementById('licenciaActo').value;
        
        return valido;
    },
    
    // Validar elegibilidad según OG 3125
    validarElegibilidad: function() {
        const sanciones = document.getElementById('sanciones12meses')?.value;
        const proceso = document.getElementById('procesoJudicial')?.value;
        
        let elegible = true;
        let mensaje = '';
        
        if (sanciones === 'si') {
            elegible = false;
            mensaje += '• Tiene sanciones (días de arresto) en los últimos 12 meses\n';
        }
        
        if (proceso === 'si_imputado') {
            elegible = false;
            mensaje += '• Está sometido a proceso judicial como formalizado/imputado\n';
        }
        
        if (!elegible) {
            Main.mostrarAlerta('error', 
                '⚠️ NO ELEGIBLE SEGÚN ART. 8.7 OG 3125\n\n' + 
                mensaje + 
                '\nEl funcionario no cumple los requisitos de elegibilidad establecidos en el Manual.'
            );
        }
        
        return elegible;
    },
    
    // Validar paso 4 - Evaluación
    validarPaso4: function() {
        const categoriaActual = ESTADO.postulacionActual.categoria;
        let valido = true;
        let totalPuntaje = 0;
        
        // Limpiar evaluación previa
        ESTADO.postulacionActual.evaluacion = [];
        
        // Validar factores
        const factores = document.querySelectorAll('.factor-input');
        factores.forEach((input, index) => {
            const valor = parseInt(input.value) || 0;
            
            if (valor < 1 || valor > 3) {
                Utils.mostrarError(`factor${index}Error`);
                valido = false;
            } else {
                Utils.ocultarError(`factor${index}Error`);
                totalPuntaje += valor;
                
                // Guardar factor con justificación si aplica
                const justificacion = document.getElementById(`justificacion${index}`)?.value || '';
                
                ESTADO.postulacionActual.evaluacion.push({
                    factor: SISTEMA.categorias[categoriaActual].factores[index],
                    puntaje: valor,
                    justificacion: valor === 3 ? justificacion : ''
                });
                
                // Validar justificación obligatoria para puntaje 3
                if (valor === 3 && !justificacion.trim()) {
                    Utils.mostrarError(`justificacion${index}Error`);
                    valido = false;
                } else {
                    Utils.ocultarError(`justificacion${index}Error`);
                }
            }
        });
        
        // Validar sección especial para acción policial
        if (categoriaActual === 'd3') {
            const narracion = document.getElementById('narracionHecho').value;
            const razones = document.getElementById('razonesFundamentacion').value;
            
            if (!narracion.trim()) {
                Utils.mostrarError('narracionError');
                valido = false;
            } else {
                Utils.ocultarError('narracionError');
                ESTADO.postulacionActual.narracionHecho = narracion;
            }
            
            if (!razones.trim()) {
                Utils.mostrarError('razonesError');
                valido = false;
            } else {
                Utils.ocultarError('razonesError');
                ESTADO.postulacionActual.razonesFundamentacion = razones;
            }
        }
        
        // Guardar puntaje total
        ESTADO.postulacionActual.totalPuntaje = totalPuntaje;
        document.getElementById('totalPuntaje').value = totalPuntaje;
        
        return valido;
    },
    
    // Validar paso 5 - Revisión final
    validarPaso5: function() {
        const declaracion = document.getElementById('declaracionVeracidad').checked;
        let valido = true;
        
        if (!declaracion) {
            Utils.mostrarError('declaracionError');
            valido = false;
        } else {
            Utils.ocultarError('declaracionError');
            ESTADO.postulacionActual.declaracionVeracidad = true;
        }
        
        return valido;
    },
    
    // Cargar factores de evaluación según categoría
    cargarFactoresEvaluacion: function() {
        const categoria = ESTADO.postulacionActual.categoria;
        const factoresDiv = document.getElementById('factoresEvaluacion');
        const titulo = document.getElementById('categoriaTitulo');
        
        if (!categoria) return;
        
        const categoriaInfo = SISTEMA.categorias[categoria];
        titulo.textContent = categoriaInfo.nombre;
        
        factoresDiv.innerHTML = '';
        
        categoriaInfo.factores.forEach((factor, index) => {
            const factorDiv = document.createElement('div');
            factorDiv.className = 'form-group';
            factorDiv.innerHTML = `
                <label>${index + 1}. ${factor} <span class="required">*</span></label>
                <select class="form-control factor-input" id="factor${index}" 
                        onchange="Formulario.actualizarTotalPuntaje(); Formulario.toggleJustificacion(${index})">
                    <option value="0">-- Seleccione puntaje --</option>
                    <option value="1">1 - Bueno</option>
                    <option value="2">2 - Muy Bueno</option>
                    <option value="3">3 - Excelente</option>
                </select>
                <div class="error-message" id="factor${index}Error">Seleccione un puntaje</div>
                <div id="justificacion${index}Div" class="hidden" style="margin-top: 10px;">
                    <label>Justificación del puntaje excelente (requerida):</label>
                    <textarea class="form-control" id="justificacion${index}" rows="3" 
                              placeholder="Explique por qué merece el puntaje máximo en este factor..."></textarea>
                    <div class="error-message" id="justificacion${index}Error">Debe justificar el puntaje excelente</div>
                </div>
            `;
            factoresDiv.appendChild(factorDiv);
        });
        
        // Mostrar/ocultar sección especial para acción policial
        const seccionAccion = document.getElementById('seccionAccionPolicial');
        if (categoria === 'd3') {
            seccionAccion.classList.remove('hidden');
        } else {
            seccionAccion.classList.add('hidden');
        }
        
        // Inicializar total
        this.actualizarTotalPuntaje();
    },
    
    // Mostrar/ocultar justificación
    toggleJustificacion: function(index) {
        const select = document.getElementById(`factor${index}`);
        const justificacionDiv = document.getElementById(`justificacion${index}Div`);
        
        if (select.value === '3') {
            justificacionDiv.classList.remove('hidden');
        } else {
            justificacionDiv.classList.add('hidden');
            Utils.ocultarError(`justificacion${index}Error`);
        }
    },
    
    // Actualizar total de puntaje
    actualizarTotalPuntaje: function() {
        const factores = document.querySelectorAll('.factor-input');
        let total = 0;
        
        factores.forEach(input => {
            total += parseInt(input.value) || 0;
        });
        
        document.getElementById('totalPuntaje').value = total;
    },
    
    // Generar resumen final
    generarResumen: function() {
        const resumenDiv = document.getElementById('resumenPostulacion');
        const alertDiv = document.getElementById('revisionAlert');
        
        // Validar elegibilidad final
        let elegible = true;
        let mensajesError = [];
        
        // 1. Validar categoría
        if (!ESTADO.postulacionActual.categoria) {
            elegible = false;
            mensajesError.push('❌ No se seleccionó categoría');
            document.getElementById('valCategoria').innerHTML = '❌ Categoría no seleccionada';
            document.getElementById('valCategoria').style.color = 'var(--rojo-error)';
        } else {
            document.getElementById('valCategoria').innerHTML = '✓ Categoría seleccionada correctamente';
            document.getElementById('valCategoria').style.color = 'var(--verde-ok)';
        }
        
        // 2. Validar datos personales
        if (!ESTADO.postulacionActual.run || !ESTADO.postulacionActual.nombres || !ESTADO.postulacionActual.apellidos) {
            elegible = false;
            mensajesError.push('❌ Datos personales incompletos');
            document.getElementById('valDatos').innerHTML = '❌ Datos personales incompletos';
            document.getElementById('valDatos').style.color = 'var(--rojo-error)';
        } else {
            document.getElementById('valDatos').innerHTML = '✓ Datos personales completos y válidos';
            document.getElementById('valDatos').style.color = 'var(--verde-ok)';
        }
        
        // 3. Validar antecedentes
        if (!ESTADO.postulacionActual.listaMeritos || !ESTADO.postulacionActual.sanciones12meses || !ESTADO.postulacionActual.procesoJudicial) {
            elegible = false;
            mensajesError.push('❌ Antecedentes incompletos');
            document.getElementById('valAntecedentes').innerHTML = '❌ Antecedentes incompletos';
            document.getElementById('valAntecedentes').style.color = 'var(--rojo-error)';
        } else if (ESTADO.postulacionActual.sanciones12meses === 'si' || ESTADO.postulacionActual.procesoJudicial === 'si_imputado') {
            elegible = false;
            mensajesError.push('❌ No cumple requisitos de elegibilidad (Art. 8.7)');
            document.getElementById('valAntecedentes').innerHTML = '❌ No cumple requisitos Art. 8.7';
            document.getElementById('valAntecedentes').style.color = 'var(--rojo-error)';
        } else {
            document.getElementById('valAntecedentes').innerHTML = '✓ Antecedentes validados según Art. 8.7';
            document.getElementById('valAntecedentes').style.color = 'var(--verde-ok)';
        }
        
        // 4. Validar evaluación
        if (!ESTADO.postulacionActual.evaluacion || ESTADO.postulacionActual.evaluacion.length === 0) {
            elegible = false;
            mensajesError.push('❌ Evaluación incompleta');
            document.getElementById('valEvaluacion').innerHTML = '❌ Evaluación incompleta';
            document.getElementById('valEvaluacion').style.color = 'var(--rojo-error)';
        } else {
            const categoria = ESTADO.postulacionActual.categoria;
            const puntajeMinimo = SISTEMA.categorias[categoria]?.puntajeMinimo || 10;
            
            if (ESTADO.postulacionActual.totalPuntaje < puntajeMinimo) {
                elegible = false;
                mensajesError.push(`❌ Puntaje insuficiente (mínimo ${puntajeMinimo} puntos)`);
                document.getElementById('valEvaluacion').innerHTML = `❌ Puntaje insuficiente (${ESTADO.postulacionActual.totalPuntaje}/${puntajeMinimo})`;
                document.getElementById('valEvaluacion').style.color = 'var(--rojo-error)';
            } else {
                document.getElementById('valEvaluacion').innerHTML = `✓ Evaluación completa (${ESTADO.postulacionActual.totalPuntaje} puntos)`;
                document.getElementById('valEvaluacion').style.color = 'var(--verde-ok)';
            }
        }
        
        // 5. Validar elegibilidad final
        document.getElementById('valElegibilidad').innerHTML = elegible ? 
            '✓ Cumple requisitos de elegibilidad' : '❌ No cumple requisitos de elegibilidad';
        document.getElementById('valElegibilidad').style.color = elegible ? 'var(--verde-ok)' : 'var(--rojo-error)';
        
        // Configurar alerta
        if (elegible) {
            alertDiv.className = 'alert alert-success show';
            alertDiv.innerHTML = `
                <strong>✅ POSTULACIÓN VÁLIDA</strong><br>
                Cumple con todos los requisitos de la Orden General N° 3125<br>
                <small>Los datos se enviarán automáticamente a Google Sheets</small>
            `;
        } else {
            alertDiv.className = 'alert alert-danger show';
            alertDiv.innerHTML = `
                <strong>❌ POSTULACIÓN NO VÁLIDA</strong><br>
                No cumple con los requisitos:<br>
                ${mensajesError.map(m => `<div style="margin-left: 20px;">${m}</div>`).join('')}
            `;
        }
        
        // Activar/desactivar botón enviar
        document.getElementById('btnEnviar').disabled = !elegible;
        
        // Generar tabla de resumen
        let html = `
            <div class="table-container">
                <table>
                    <tr>
                        <th colspan="2" style="background: var(--azul-carabineros); color: white;">
                            RESUMEN DE POSTULACIÓN
                        </th>
                    </tr>
                    <tr>
                        <td style="width: 30%;"><strong>Categoría</strong></td>
                        <td>${ESTADO.postulacionActual.categoriaNombre || 'No definida'}</td>
                    </tr>
                    <tr>
                        <td><strong>Funcionario</strong></td>
                        <td>
                            ${ESTADO.postulacionActual.nombres || ''} ${ESTADO.postulacionActual.apellidos || ''}<br>
                            <small>RUN: ${ESTADO.postulacionActual.run || 'No ingresado'} | 
                            Grado: ${ESTADO.postulacionActual.grado || 'No ingresado'}</small>
                        </td>
                    </tr>
                    <tr>
                        <td><strong>Unidad</strong></td>
                        <td>
                            ${ESTADO.postulacionActual.altaReparticion || ''} > 
                            ${ESTADO.postulacionActual.reparticion || ''}<br>
                            <small>Dotación: ${ESTADO.postulacionActual.dotacion || ''}</small>
                        </td>
                    </tr>
                    <tr>
                        <td><strong>Antecedentes</strong></td>
                        <td>
                            Lista: ${ESTADO.postulacionActual.listaMeritos === 'lista1' ? 'N°1 Méritos' : 
                                   ESTADO.postulacionActual.listaMeritos === 'lista2' ? 'N°2 Satisfactorios' : 'No especificada'}<br>
                            Sanciones 12 meses: ${ESTADO.postulacionActual.sanciones12meses === 'si' ? 'SÍ ⚠️' : 'NO ✅'}<br>
                            Proceso judicial: ${ESTADO.postulacionActual.procesoJudicial ? 
                                ESTADO.postulacionActual.procesoJudicial.replace('si_imputado', 'SÍ (imputado) ⚠️')
                                           .replace('si_victima', 'Sí (víctima)')
                                           .replace('no', 'NO ✅') : 'No especificado'}
                        </td>
                    </tr>
                    <tr>
                        <td><strong>Evaluación</strong></td>
                        <td>
                            Total Puntaje: <strong>${ESTADO.postulacionActual.totalPuntaje || 0}</strong><br>
                            Factores evaluados: ${ESTADO.postulacionActual.evaluacion?.length || 0}<br>
                            <small style="color: ${ESTADO.postulacionActual.totalPuntaje >= (SISTEMA.categorias[ESTADO.postulacionActual.categoria]?.puntajeMinimo || 10) ? 'green' : 'red'}">
                                ${ESTADO.postulacionActual.totalPuntaje >= (SISTEMA.categorias[ESTADO.postulacionActual.categoria]?.puntajeMinimo || 10) ? 
                                  '✅ Cumple puntaje mínimo' : '❌ No cumple puntaje mínimo'}
                            </small>
                        </td>
                    </tr>
                    ${ESTADO.postulacionActual.narracionHecho ? `
                    <tr>
                        <td><strong>Narración</strong></td>
                        <td><em>"${ESTADO.postulacionActual.narracionHecho.substring(0, 100)}..."</em></td>
                    </tr>
                    ` : ''}
                    <tr>
                        <td><strong>Google Sheets</strong></td>
                        <td>
                            <span class="status-badge status-complete">ENVÍO AUTOMÁTICO</span><br>
                            <small>Los datos se enviarán automáticamente al formulario</small>
                        </td>
                    </tr>
                </table>
            </div>
        `;
        
        resumenDiv.innerHTML = html;
    }
};

// Hacer disponible globalmente
window.Formulario = Formulario;
