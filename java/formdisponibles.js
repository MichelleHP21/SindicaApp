// ==========================================
// VARIABLES GLOBALES
// ==========================================
let formatoActual = '';
let idFormatoActual = '';

// ==========================================
// INICIALIZACIÓN
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
    console.log("🔍 INICIO: JavaScript cargado correctamente");
    
    // Verificación de usuario (COMENTADA TEMPORALMENTE PARA DEBUG)
    /*
    const usuarioStr = localStorage.getItem("usuario");
    const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;

    if (!usuario) {
        window.location.href = "index.html";
        return;
    }
    */
    
    console.log("🔍 Iniciando carga de formatos...");

    // Cargar y mostrar formatos activos
    await cargarFormatosActivos();
});

// ==========================================
// CARGA DE FORMATOS DESDE API
// ==========================================
async function cargarFormatosActivos() {
    console.log("🔍 FUNCIÓN: cargarFormatosActivos ejecutándose");
    
    try {
        console.log("🔍 Haciendo petición a:", 'http://localhost/sindicato/SindicaApp/api/formatosactivos.php');

        const response = await fetch('http://localhost/sindicato/SindicaApp/api/formatosactivos.php');
        if (!response.ok) throw new Error("Error al obtener formatos");

        const formatos = await response.json();
        
        // 🔍 DEBUGGING: Ver qué datos llegaron
        console.log('🔍 DATOS RECIBIDOS DEL API:');
        console.log('Total de formatos:', formatos.length);
        console.log('Formatos completos:', formatos);
        
        const cuerpoTabla = document.getElementById('cuerpoTablaFormatos');

        // Limpiar tabla
        cuerpoTabla.innerHTML = '';

        if (formatos.length === 0) {
            // Si no hay formatos activos, mostrar mensaje
            cuerpoTabla.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center py-5">
                        <div class="text-muted">
                            <i class="bi bi-exclamation-triangle fs-1 mb-3 d-block"></i>
                            <h5>No hay formatos disponibles</h5>
                            <p>Actualmente no hay formatos activos. Contacta al administrador.</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        // Llenar tabla con formatos activos
        cuerpoTabla.innerHTML = formatos.map((formato, index) => {
            console.log(`🔍 Procesando formato ${index + 1}:`, {
                id: formato.id_formato,
                nombre: formato.nombre,
                inicio: formato.fecha_inicio,
                fin: formato.fecha_fin
            });
            
            return `
                <tr>
                    <th scope="row">${index + 1}</th>
                    <td>
                        <i class="bi bi-file-pdf text-danger me-2"></i>
                        <strong>${escapeHTML(formato.nombre)}</strong>
                    </td>
                    <td>
                        <span class="badge bg-success">
                            ${formatearPeriodo(formato.fecha_inicio, formato.fecha_fin)}
                        </span>
                    </td>
                    <td>
                        <div class="btn-group" role="group">
                            <button class="btn btn-primary btn-sm" 
                                    onclick="llenarFormato('${formato.id_formato}', '${escapeJS(formato.nombre)}')" 
                                    title="Llenar formato">
                                <i class="bi bi-pencil-square"></i>
                            </button>
                            <button class="btn btn-outline-success btn-sm" 
                                    onclick="descargarFormatoVacio('${formato.id_formato}', '${escapeJS(formato.nombre)}')" 
                                    title="Descargar formato vacío">
                                <i class="bi bi-download"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        console.log(`✅ RESULTADO: Se cargaron ${formatos.length} formatos en la tabla`);
        
    } catch (error) {
        console.error('Error al cargar formatos:', error);
        mostrarErrorEnTabla();
    }
}

// ==========================================
// GESTIÓN DE CAMPOS ESPECÍFICOS POR FORMATO
// ==========================================
function cargarCamposEspecificos(tipoFormato, idFormato) {
    const contenedor = document.getElementById('datosEspecificos');
    let camposHTML = '';

    // Mapeo de tipos de formato (compatibilidad con código anterior)
    const tipoCompatible = mapearTipoFormato(tipoFormato, idFormato);

    switch(tipoCompatible) {
        case 'concepto026':
            camposHTML = `
                <!-- DATOS DEL TRABAJADOR -->
                <div class="row">
                    <div class="col-12 mb-3">
                        <h5 class="text-success border-bottom pb-2">DATOS DEL TRABAJADOR</h5>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-4">
                        <label for="apellidoPaterno" class="form-label">Apellido Paterno *</label>
                        <input type="text" class="form-control" id="apellidoPaterno" required>
                    </div>
                    <div class="col-4">
                        <label for="apellidoMaterno" class="form-label">Apellido Materno *</label>
                        <input type="text" class="form-control" id="apellidoMaterno" required>
                    </div>
                    <div class="col-4">
                        <label for="nombres" class="form-label">Nombre(s) *</label>
                        <input type="text" class="form-control" id="nombres" required>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-6">
                        <label for="matricula" class="form-label">Matrícula *</label>
                        <input type="text" class="form-control" id="matricula" required>
                    </div>
                    <div class="col-6">
                        <label for="categoria" class="form-label">Categoría *</label>
                        <input type="text" class="form-control" id="categoria" required>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-12">
                       <label for="adscripcion" class="form-label">Adscripción *</label>
                        <input type="text" class="form-control" id="adscripcion" required>
                     </div>
                </div>
                <div class="row mb-3">
                    <div class="col-8">
                        <label for="funcionesExtramuros" class="form-label">Funciones Extramuros</label>
                        <input type="text" class="form-control" id="funcionesExtramuros">
                    </div>
                    <div class="col-4">
                        <label for="periodoTraslado" class="form-label">Período de traslado</label>
                        <input type="text" class="form-control" id="periodoTraslado">
                    </div>
                </div>

                <!-- DICTAMEN DE LA COMISIÓN NACIONAL -->
                <div class="row mb-4 mt-4">
                    <div class="col-12">
                        <h5 class="text-success border-bottom pb-2">DICTAMEN DE LA COMISIÓN NACIONAL/SUBCOMISIÓN MIXTA DE PASAJES</h5>
                    </div>
                </div>
                <div class="row mb-3">
                <div class="col-md-6">
                    <label for="importeQuincenal" class="form-label">Importe Quincenal a Pagar *</label>
                    <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input 
                        type="number" 
                        class="form-control" 
                        id="importeNumero" 
                        step="0.01" 
                        min="0" 
                        required 
                        placeholder="1234.56"
                    >
                    </div>
                </div>
                <div class="col-md-6">
                    <label for="numeroLetras" class="form-label">Con Número en Letras *</label>
                    <input 
                    type="text" 
                    class="form-control" 
                    id="importeLetras" 
                    readonly
                    placeholder="Mil doscientos treinta y cuatro pesos con 56/100 M.N."
                    >
                </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-2">
                        <label for="lapsoDelDia" class="form-label">Por el Lapso del día</label>
                        <input type="number" class="form-control" id="lapsoDelDia">
                    </div>
                    <div class="col-md-3">
                        <label for="lapsoDeMes" class="form-label">de Mes</label>
                        <input type="text" class="form-control" id="lapsoDeMes">
                    </div>
                    <div class="col-md-2">
                        <label for="lapsoAlDia" class="form-label">al Día</label>
                        <input type="number" class="form-control" id="lapsoAlDia">
                    </div>
                    <div class="col-md-3">
                        <label for="lapsoDeMes2" class="form-label">de Mes</label>
                        <input type="text" class="form-control" id="lapsoDeMes2">
                    </div>
                    <div class="col-md-2">
                        <label for="lapsoDeAnio" class="form-label">de Año</label>
                        <input type="number" class="form-control" id="lapsoDeAnio">
                    </div>
                </div>
                <div class="mb-3">
                    <label for="observaciones" class="form-label">Observaciones</label>
                    <textarea class="form-control" id="observaciones" rows="3"></textarea>
                </div>
            `;
            break;

        case 'vacaciones':
            camposHTML = `
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="fechaInicio" class="form-label">Fecha de Inicio *</label>
                            <input type="date" class="form-control" id="fechaInicio" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="fechaFin" class="form-label">Fecha de Fin *</label>
                            <input type="date" class="form-control" id="fechaFin" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="diasSolicitados" class="form-label">Días Solicitados *</label>
                            <input type="number" class="form-control" id="diasSolicitados" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="periodoVacacional" class="form-label">Período Vacacional *</label>
                            <select class="form-control" id="periodoVacacional" required>
                                <option value="">Seleccione...</option>
                                <option value="2024">2024</option>
                                <option value="2025">2025</option>
                            </select>
                        </div>
                        <div class="col-12 mb-3">
                            <label for="observacionesVacaciones" class="form-label">Observaciones</label>
                            <textarea class="form-control" id="observacionesVacaciones" rows="3"></textarea>
                        </div>
                    </div>
                </div>
            `;
            break;

        case 'incapacidad':
            camposHTML = `
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="fechaIncapacidad" class="form-label">Fecha de Incapacidad *</label>
                            <input type="date" class="form-control" id="fechaIncapacidad" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="diasIncapacidad" class="form-label">Días de Incapacidad *</label>
                            <input type="number" class="form-control" id="diasIncapacidad" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="tipoIncapacidad" class="form-label">Tipo de Incapacidad *</label>
                            <select class="form-control" id="tipoIncapacidad" required>
                                <option value="">Seleccione...</option>
                                <option value="enfermedad_general">Enfermedad General</option>
                                <option value="riesgo_trabajo">Riesgo de Trabajo</option>
                                <option value="maternidad">Maternidad</option>
                            </select>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="folioIncapacidad" class="form-label">Folio de Incapacidad</label>
                            <input type="text" class="form-control" id="folioIncapacidad">
                        </div>
                        <div class="col-12 mb-3">
                            <label for="diagnostico" class="form-label">Diagnóstico</label>
                            <textarea class="form-control" id="diagnostico" rows="3"></textarea>
                        </div>
                    </div>
                </div>
            `;
            break;

        default:
            // Formato genérico para otros tipos
            camposHTML = `
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="fechaSolicitud" class="form-label">Fecha de Solicitud *</label>
                            <input type="date" class="form-control" id="fechaSolicitud" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="motivo" class="form-label">Motivo *</label>
                            <input type="text" class="form-control" id="motivo" required>
                        </div>
                        <div class="col-12 mb-3">
                            <label for="observaciones" class="form-label">Observaciones</label>
                            <textarea class="form-control" id="observaciones" rows="3"></textarea>
                        </div>
                    </div>
                    <div class="alert alert-info">
                        <i class="bi bi-info-circle me-2"></i>
                        Complete todos los campos requeridos para procesar su formato.
                    </div>
                </div>
            `;
            break;
    }

    contenedor.innerHTML = camposHTML;
    
    // Si es concepto026, agregar el evento para conversión de números a letras
    if (tipoCompatible === 'concepto026') {
        setTimeout(() => {
            const importeInput = document.getElementById('importeNumero');
            const numeroLetrasInput = document.getElementById('importeLetras');
            
            if (importeInput && numeroLetrasInput) {
                importeInput.addEventListener('input', function() {
                    const valor = parseFloat(this.value);
                    const texto = isNaN(valor) ? '' : numeroALetras(valor);
                    numeroLetrasInput.value = texto;
                });
                
                console.log('✅ Evento de conversión a letras agregado correctamente');
            }
        }, 100);
    }
}

// ==========================================
// FUNCIÓN PRINCIPAL PARA LLENAR FORMATO
// ==========================================
async function llenarFormato(idFormato, nombreFormato) {
    console.log(`Llenar formato: ${nombreFormato} (ID: ${idFormato})`);
    
    // Actualizar variables globales
    formatoActual = mapearTipoFormato(nombreFormato, idFormato);
    idFormatoActual = idFormato;
    
    // Actualizar el modal con el nombre del formato
    document.getElementById('nombreFormatoModal').textContent = nombreFormato;

    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('modalLlenarFormato'));
    modal.show();

    // Cargar estructura del formulario específica
    cargarCamposEspecificos(nombreFormato, idFormato);

    // Esperar a que el DOM se actualice y cargar datos del usuario
    setTimeout(async () => {
        await cargarDatosUsuario();
    }, 300);
}

// ==========================================
// CARGA DE DATOS DEL USUARIO
// ==========================================
async function cargarDatosUsuario() {
    try {
        const usuario = obtenerDatosUsuario();
        if (!usuario?.id_usuario) {
            console.warn('Usuario no válido para cargar datos');
            return;
        }

        const response = await fetch(`api/formatos.php?id_usuario=${usuario.id_usuario}`);
        if (!response.ok) throw new Error('Error al obtener datos del usuario');

        const datos = await response.json();
        if (!datos.existe) {
            console.warn('El usuario no tiene datos guardados aún');
            return;
        }

        llenarCamposEspecificos(formatoActual, datos);
        console.log('Datos del usuario cargados correctamente');

    } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
        mostrarError('No se pudo cargar la información del usuario.');
    }
}

function obtenerDatosUsuario() {
    try {
        const usuarioStr = sessionStorage.getItem('usuario') || localStorage.getItem('usuario');
        if (!usuarioStr) return null;
        return JSON.parse(usuarioStr);
    } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
        return null;
    }
}

function llenarCamposEspecificos(tipoFormato, datos) {
    // Función auxiliar para llenar un campo si existe
    const llenarCampo = (id, valor) => {
        const elemento = document.getElementById(id);
        if (elemento) elemento.value = valor || '';
    };

    switch(tipoFormato) {
        case 'concepto026':
            llenarCampo('apellidoPaterno', datos.ApellidoPaterno);
            llenarCampo('apellidoMaterno', datos.ApellidoMaterno);
            llenarCampo('nombres', datos.Nombre);
            llenarCampo('matricula', datos.matricula || datos.Matricula);
            llenarCampo('categoria', datos.Categoria);
            llenarCampo('adscripcion', datos.OOAD || datos.Adscripcion);
            llenarCampo('funcionesExtramuros', datos.FuncionesExtramuros);
            llenarCampo('periodoTraslado', datos.PeriodoTraslado);
            llenarCampo('importeNumero', datos.ImporteNumero);
            llenarCampo('importeLetras', datos.ImporteLetras);
            llenarCampo('lapsoDelDia', datos.LapsoDelDia);
            llenarCampo('lapsoDeMes', datos.LapsoDeMes);
            llenarCampo('lapsoAlDia', datos.LapsoAlDia);
            llenarCampo('lapsoDeMes2', datos.LapsoDeMes2);
            llenarCampo('lapsoDeAnio', datos.LapsoDeAnio);
            llenarCampo('observaciones', datos.Observaciones);
            break;
        case 'vacaciones':
            // Llenar campos específicos de vacaciones
            llenarCampo('periodoVacacional', new Date().getFullYear().toString());
            break;
        case 'incapacidad':
            // Llenar campos específicos de incapacidad
            llenarCampo('fechaIncapacidad', new Date().toISOString().split('T')[0]);
            break;
    }
}

// ==========================================
// FUNCIONES DEL MODAL
// ==========================================
function verArchivo() {
    const tipoFormato = formatoActual;
    
    Swal.fire({
        title: 'Generando documento...',
        html: `Preparando el formato <strong>${tipoFormato}</strong>`,
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();

            setTimeout(() => {
                try {
                    let url = '';
                    const params = new URLSearchParams();

                    switch(tipoFormato) {
                        case 'concepto026':
                            params.append('apellidoPaterno', document.getElementById('apellidoPaterno')?.value || '');
                            params.append('apellidoMaterno', document.getElementById('apellidoMaterno')?.value || '');
                            params.append('nombres', document.getElementById('nombres')?.value || '');
                            params.append('matricula', document.getElementById('matricula')?.value || '');
                            params.append('categoria', document.getElementById('categoria')?.value || '');
                            params.append('adscripcion', document.getElementById('adscripcion')?.value || '');
                            params.append('funcionesExtramuros', document.getElementById('funcionesExtramuros')?.value || '');
                            params.append('periodoTraslado', document.getElementById('periodoTraslado')?.value || '');
                            params.append('importeNumero', document.getElementById('importeNumero')?.value || '');
                            params.append('importeLetras', document.getElementById('importeLetras')?.value || '');
                            params.append('lapsoDelDia', document.getElementById('lapsoDelDia')?.value || '');
                            params.append('lapsoDeMes', document.getElementById('lapsoDeMes')?.value || '');
                            params.append('lapsoAlDia', document.getElementById('lapsoAlDia')?.value || '');
                            params.append('lapsoDeMes2', document.getElementById('lapsoDeMes2')?.value || '');
                            params.append('lapsoDeAnio', document.getElementById('lapsoDeAnio')?.value || '');
                            params.append('observaciones', document.getElementById('observaciones')?.value || '');
                            url = `http://localhost/sindicato/SindicaApp/api/concepto026.php?${params.toString()}`;
                            break;
                        default:
                            url = `http://localhost/sindicato/SindicaApp/api/verformato.php?id=${idFormatoActual}`;
                    }

                    // Validar campos obligatorios
                    if (tipoFormato === 'concepto026' && (!params.get('nombres') || !params.get('matricula'))) {
                        throw new Error('Faltan datos obligatorios para el formato 026');
                    }

                    window.open(url, '_blank');
                    Swal.close();
                } catch (error) {
                    Swal.fire({
                        title: 'Error al generar PDF',
                        text: error.message,
                        icon: 'error',
                        confirmButtonText: 'Entendido'
                    });
                }
            }, 500);
        }
    });
}

async function descargarPDFLleno() {
    const tipoFormato = formatoActual;
    
    try {
        let datos = {};
        let endpoint = '';

        switch(tipoFormato) {
            case 'concepto026':
                datos = {
                    apellidoPaterno: document.getElementById('apellidoPaterno')?.value || '',
                    apellidoMaterno: document.getElementById('apellidoMaterno')?.value || '',
                    nombres: document.getElementById('nombres')?.value || '',
                    matricula: document.getElementById('matricula')?.value || '',
                    categoria: document.getElementById('categoria')?.value || '',
                    adscripcion: document.getElementById('adscripcion')?.value || '',
                    funcionesExtramuros: document.getElementById('funcionesExtramuros')?.value || '',
                    periodoTraslado: document.getElementById('periodoTraslado')?.value || '',
                    importeNumero: document.getElementById('importeNumero')?.value || '',
                    importeLetras: document.getElementById('importeLetras')?.value || '',
                    lapsoDelDia: document.getElementById('lapsoDelDia')?.value || '',
                    lapsoDeMes: document.getElementById('lapsoDeMes')?.value || '',
                    lapsoAlDia: document.getElementById('lapsoAlDia')?.value || '',
                    lapsoDeAnio: document.getElementById('lapsoDeAnio')?.value || '',
                    observaciones: document.getElementById('observaciones')?.value || ''
                };
                endpoint = 'api/concepto026.php';
                break;
            default:
                // Para otros formatos, usar endpoint genérico
                datos = obtenerDatosFormulario();
                endpoint = `api/descargarformatollenado.php?id=${idFormatoActual}`;
        }

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            throw new Error('No se pudo generar el PDF');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${tipoFormato}_generado.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

    } catch (error) {
        console.error('Error al descargar PDF:', error);
        Swal.fire('Error', 'No se pudo generar el PDF', 'error');
    }
}

function guardarBorrador() {
    try {
        const datos = obtenerDatosFormulario();
        const clave = `borrador_${formatoActual}_${idFormatoActual}`;
        
        localStorage.setItem(clave, JSON.stringify({
            datos: datos,
            fecha: new Date().toISOString(),
            formato: formatoActual,
            id: idFormatoActual
        }));
        
        Swal.fire({
            title: 'Borrador guardado',
            text: 'Sus datos han sido guardados localmente',
            icon: 'success',
            timer: 2000
        });
    } catch (error) {
        console.error('Error al guardar borrador:', error);
        Swal.fire('Error', 'No se pudo guardar el borrador', 'error');
    }
}

function enviarFormato() {
    const form = document.querySelector('#modalLlenarFormato form') || 
                  document.getElementById('formDatosUsuario');
    
    // Validar campos requeridos
    const camposRequeridos = document.querySelectorAll('#datosEspecificos [required]');
    let camposVacios = [];
    
    camposRequeridos.forEach(campo => {
        if (!campo.value.trim()) {
            camposVacios.push(campo.previousElementSibling?.textContent || 'Campo sin nombre');
            campo.classList.add('is-invalid');
        } else {
            campo.classList.remove('is-invalid');
        }
    });

    if (camposVacios.length > 0) {
        return Swal.fire({
            title: 'Campos incompletos',
            html: `Por favor complete los siguientes campos:<br><br><strong>${camposVacios.join('<br>')}</strong>`,
            icon: 'warning'
        });
    }

    Swal.fire({
        title: '¿Enviar formato?',
        text: 'Una vez enviado, no podrá modificar los datos',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, enviar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                // Aquí iría la lógica real de envío al servidor
                const datos = obtenerDatosFormulario();
                
                // Simular envío (reemplazar con llamada real al API)
                const response = await fetch('api/enviarformato.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id_formato: idFormatoActual,
                        tipo: formatoActual,
                        datos: datos
                    })
                });

                if (response.ok) {
                    Swal.fire({
                        title: '¡Formato enviado!',
                        text: 'Su solicitud ha sido enviada correctamente',
                        icon: 'success'
                    }).then(() => {
                        bootstrap.Modal.getInstance(document.getElementById('modalLlenarFormato')).hide();
                        actualizarTabla(); // Actualizar tabla por si cambia el estado
                    });
                } else {
                    throw new Error('Error en el servidor');
                }
            } catch (error) {
                console.error('Error al enviar formato:', error);
                Swal.fire('Error', 'No se pudo enviar el formato. Intente nuevamente.', 'error');
            }
        }
    });
}

// ==========================================
// DESCARGA DE FORMATO VACÍO
// ==========================================
async function descargarFormatoVacio(idFormato, nombreFormato) {
    try {
        console.log(`Descargando formato: ${nombreFormato} (ID: ${idFormato})`);
        
        // Mostrar loading
        Swal.fire({
            title: 'Descargando...',
            text: `Preparando ${nombreFormato}`,
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => {
                Swal.showLoading();
            }
        });

        const response = await fetch(`http://localhost/sindicato/SindicaApp/api/descargarformato.php?id=${idFormato}`);
        
        if (!response.ok) throw new Error('Error al descargar el formato');
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${nombreFormato}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        Swal.close();
        
    } catch (error) {
        console.error('Error al descargar:', error);
        Swal.fire('Error', 'No se pudo descargar el formato', 'error');
    }
}

// ==========================================
// ACTUALIZACIÓN DE TABLA
// ==========================================
async function actualizarTabla() {
    const cuerpoTabla = document.getElementById('cuerpoTablaFormatos');
    cuerpoTabla.innerHTML = `
        <tr>
            <td colspan="4" class="text-center py-5">
                <div class="text-primary">
                    <div class="spinner-border mb-3" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                    <h5>Cargando formatos...</h5>
                </div>
            </td>
        </tr>
    `;
    
    // Recargar formatos
    await cargarFormatosActivos();
    
    // Mostrar notificación
    Swal.fire({
        icon: 'success',
        title: 'Actualizado',
        text: 'La tabla se ha actualizado correctamente',
        timer: 1500,
        showConfirmButton: false
    });
}

// ==========================================
// FUNCIONES DE UTILIDAD
// ==========================================
function obtenerDatosFormulario() {
    const datos = {};
    const inputs = document.querySelectorAll('#datosEspecificos input, #datosEspecificos select, #datosEspecificos textarea');
    
    inputs.forEach(input => {
        if (input.id) {
            datos[input.id] = input.value;
        }
    });
    
    return datos;
}

function mapearTipoFormato(nombreFormato, idFormato) {
    // Mapeo inteligente basado en nombre o ID
    const nombre = nombreFormato.toLowerCase();
    
    if (nombre.includes('concepto') || nombre.includes('026')) {
        return 'concepto026';
    }
    if (nombre.includes('vacacion')) {
        return 'vacaciones';
    }
    if (nombre.includes('incapacidad')) {
        return 'incapacidad';
    }
    
    // Si no coincide con ningún patrón, usar el ID o nombre como tipo genérico
    return idFormato || nombre.replace(/\s+/g, '_').toLowerCase();
}

function mostrarError(mensaje) {
    const contenedor = document.getElementById('datosEspecificos');
    if (contenedor) {
        contenedor.innerHTML = `
            <div class="alert alert-danger">
                <div class="d-flex align-items-center">
                    <i class="bi bi-exclamation-octagon-fill fs-4 me-2"></i>
                    <div>
                        <h5 class="alert-heading">Error</h5>
                        <p class="mb-0">${mensaje}</p>
                    </div>
                </div>
                <div class="mt-3 d-flex justify-content-between">
                    <button class="btn btn-outline-primary" onclick="window.location.reload()">
                        <i class="bi bi-arrow-repeat"></i> Recargar página
                    </button>
                    <button class="btn btn-primary" onclick="llenarFormato('${idFormatoActual}', '${formatoActual}')">
                        <i class="bi bi-arrow-clockwise"></i> Intentar nuevamente
                    </button>
                </div>
            </div>
        `;
    } else {
        // Fallback si no existe el contenedor
        Swal.fire('Error', mensaje, 'error');
    }
}

function mostrarErrorEnTabla() {
    const cuerpoTabla = document.getElementById('cuerpoTablaFormatos');
    if (cuerpoTabla) {
        cuerpoTabla.innerHTML = `
            <tr>
                <td colspan="4" class="text-center py-5">
                    <div class="text-danger">
                        <i class="bi bi-exclamation-circle fs-1 mb-3 d-block"></i>
                        <h5>Error al cargar formatos</h5>
                        <p>No se pudieron cargar los formatos. Por favor, recarga la página.</p>
                        <button class="btn btn-primary" onclick="actualizarTabla()">
                            <i class="bi bi-arrow-clockwise me-1"></i>Reintentar
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }
}

function formatearPeriodo(inicio, fin) {
    if (!inicio || !fin) return 'No definido';
    return `${formatearFecha(inicio)} - ${formatearFecha(fin)}`;
}

function formatearFecha(fechaISO) {
    if (!fechaISO) return '';
    const [a, m, d] = fechaISO.split('-');
    return `${d}/${m}/${a}`;
}

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function escapeJS(str) {
    if (!str) return '';
    return str.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
}

// ==========================================
// FUNCIONES ADICIONALES DE GESTIÓN
// ==========================================

// Cargar borrador guardado
function cargarBorrador() {
    try {
        const clave = `borrador_${formatoActual}_${idFormatoActual}`;
        const borradorStr = localStorage.getItem(clave);
        
        if (borradorStr) {
            const borrador = JSON.parse(borradorStr);
            
            Swal.fire({
                title: 'Borrador encontrado',
                html: `Se encontró un borrador guardado el <strong>${new Date(borrador.fecha).toLocaleString()}</strong>.<br>¿Desea cargarlo?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Cargar borrador',
                cancelButtonText: 'Empezar nuevo'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Cargar datos del borrador
                    Object.keys(borrador.datos).forEach(campo => {
                        const elemento = document.getElementById(campo);
                        if (elemento) {
                            elemento.value = borrador.datos[campo];
                        }
                    });
                    
                    Swal.fire({
                        title: 'Borrador cargado',
                        text: 'Los datos del borrador han sido restaurados',
                        icon: 'success',
                        timer: 2000
                    });
                }
            });
        }
    } catch (error) {
        console.error('Error al cargar borrador:', error);
    }
}

// Limpiar formulario
function limpiarFormulario() {
    Swal.fire({
        title: '¿Limpiar formulario?',
        text: 'Se perderán todos los datos ingresados',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, limpiar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const inputs = document.querySelectorAll('#datosEspecificos input, #datosEspecificos select, #datosEspecificos textarea');
            inputs.forEach(input => {
                input.value = '';
                input.classList.remove('is-invalid', 'is-valid');
            });
            
            Swal.fire({
                title: 'Formulario limpiado',
                text: 'Todos los campos han sido vaciados',
                icon: 'success',
                timer: 1500
            });
        }
    });
}

// Validar formulario en tiempo real
function inicializarValidacion() {
    // Agregar validación en tiempo real a campos requeridos
    const camposRequeridos = document.querySelectorAll('#datosEspecificos [required]');
    
    camposRequeridos.forEach(campo => {
        campo.addEventListener('blur', function() {
            if (this.value.trim()) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            } else {
                this.classList.remove('is-valid');
                this.classList.add('is-invalid');
            }
        });

        campo.addEventListener('input', function() {
            if (this.classList.contains('is-invalid') && this.value.trim()) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        });
    });
}

// Auto-guardar borrador cada cierto tiempo
let autoSaveInterval = null;

function iniciarAutoGuardado() {
    // Limpiar intervalo anterior si existe
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
    }
    
    // Auto-guardar cada 2 minutos
    autoSaveInterval = setInterval(() => {
        const datos = obtenerDatosFormulario();
        const hayDatos = Object.values(datos).some(valor => valor && valor.trim());
        
        if (hayDatos) {
            const clave = `autoguardado_${formatoActual}_${idFormatoActual}`;
            localStorage.setItem(clave, JSON.stringify({
                datos: datos,
                fecha: new Date().toISOString(),
                formato: formatoActual,
                id: idFormatoActual
            }));
            
            // Mostrar indicador sutil de autoguardado
            const indicador = document.createElement('div');
            indicador.className = 'position-fixed bottom-0 end-0 m-3';
            indicador.innerHTML = `
                <div class="alert alert-success alert-dismissible fade show" role="alert" style="font-size: 0.8rem;">
                    <i class="bi bi-check-circle me-1"></i>
                    Autoguardado
                    <button type="button" class="btn-close btn-close-sm" data-bs-dismiss="alert"></button>
                </div>
            `;
            document.body.appendChild(indicador);
            
            // Remover después de 3 segundos
            setTimeout(() => {
                if (document.body.contains(indicador)) {
                    document.body.removeChild(indicador);
                }
            }, 3000);
        }
    }, 120000); // 2 minutos
}

function detenerAutoGuardado() {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
        autoSaveInterval = null;
    }
}

// ==========================================
// EVENT LISTENERS ADICIONALES
// ==========================================

// Detectar cuando se abre el modal para inicializar funcionalidades
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modalLlenarFormato');
    if (modal) {
        modal.addEventListener('shown.bs.modal', function() {
            // Inicializar validación en tiempo real
            setTimeout(() => {
                inicializarValidacion();
                iniciarAutoGuardado();
                
                // Verificar si hay borrador guardado
                setTimeout(() => {
                    cargarBorrador();
                }, 1000);
            }, 500);
        });

        modal.addEventListener('hidden.bs.modal', function() {
            // Limpiar autoguardado cuando se cierra el modal
            detenerAutoGuardado();
        });
    }
});

// Prevenir pérdida de datos al salir
window.addEventListener('beforeunload', function(e) {
    const modal = document.getElementById('modalLlenarFormato');
    if (modal && modal.classList.contains('show')) {
        const datos = obtenerDatosFormulario();
        const hayDatos = Object.values(datos).some(valor => valor && valor.trim());
        
        if (hayDatos) {
            e.preventDefault();
            e.returnValue = 'Tiene cambios sin guardar. ¿Está seguro que desea salir?';
            return e.returnValue;
        }
    }
});

// ==========================================
// FUNCIONES DE DEBUGING Y LOGS
// ==========================================
function debugFormato() {
    console.log('=== DEBUG FORMATO ===');
    console.log('Formato actual:', formatoActual);
    console.log('ID formato actual:', idFormatoActual);
    console.log('Datos formulario:', obtenerDatosFormulario());
    console.log('Usuario:', obtenerDatosUsuario());
    console.log('====================');
}

// Hacer disponible la función de debug globalmente para pruebas
window.debugFormato = debugFormato;

console.log('✅ JavaScript de gestión de formatos cargado completamente');

// ==========================================
// FUNCIÓN PARA CONVERTIR NÚMEROS A LETRAS
// ==========================================
function numeroALetras(num) {
    const unidades = ['','uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve'];
    const decenas = ['','diez','veinte','treinta','cuarenta','cincuenta','sesenta','setenta','ochenta','noventa'];
    const especiales = {
        11: 'once', 12: 'doce', 13: 'trece', 14: 'catorce', 15: 'quince',
        16: 'dieciséis', 17: 'diecisiete', 18: 'dieciocho', 19: 'diecinueve'
    };
    const centenas = ['','cien','doscientos','trescientos','cuatrocientos','quinientos','seiscientos','setecientos','ochocientos','novecientos'];

    function convertirGrupo(n) {
        let output = '';
        if (n === 100) return 'cien';
        if (n > 99) {
            output += centenas[Math.floor(n/100)] + ' ';
            n = n % 100;
        }
        if (n >= 11 && n <= 19) {
            output += especiales[n];
            return output.trim();
        }
        if (n >= 20) { // FIX: Condición corregida
            output += decenas[Math.floor(n/10)];
            if (n % 10 > 0) {
                output += ' y ' + unidades[n % 10];
            }
            return output.trim();
        }
        if (n >= 10) { // FIX: Agregar condición para 10
            output += decenas[Math.floor(n/10)];
            return output.trim();
        }
        output += unidades[n];
        return output.trim();
    }

    if (isNaN(num)) return '';
    if (num === 0) return 'cero pesos';

    const partes = num.toFixed(2).split('.');
    const entero = parseInt(partes[0], 10);
    const decimales = partes[1];

    let letrasEntero = ''; // FIX: Variable declarada correctamente

    // Para este ejemplo simple, solo números hasta 999,999
    if (entero === 0) {
        letrasEntero = 'cero';
    } else if (entero < 1000) {
        letrasEntero = convertirGrupo(entero);
    } else {
        // Miles
        const miles = Math.floor(entero / 1000);
        const resto = entero % 1000;
        letrasEntero = (miles === 1 ? 'mil' : convertirGrupo(miles) + ' mil') + ' ' + convertirGrupo(resto);
    }

    letrasEntero = letrasEntero.replace(/\s+/g,' ').trim();

    return letrasEntero.charAt(0).toUpperCase() + letrasEntero.slice(1) + ' pesos con ' + decimales + '/100 M.N.';
}

// Evento para actualizar el texto al escribir (REMOVIDO - ahora se hace en cargarCamposEspecificos)
// El evento se agrega dinámicamente cuando se cargan los campos específicos del formato