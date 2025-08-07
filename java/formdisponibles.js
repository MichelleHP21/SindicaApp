let formatoActual = '';

// Función para cargar estructura de campos
function cargarCamposEspecificos(tipoFormato) {
    const contenedor = document.getElementById('datosEspecificos');
    let camposHTML = '';

    switch(tipoFormato) {
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
                    <div class="col-md-4">
                        <label for="importeQuincenal" class="form-label">Importe Quincenal a Pagar *</label>
                    <div class="input-group">
                        <span class="input-group-text">$</span>
                        <input type="number" class="form-control" id="importeQuincenal" step="0.01" required>
                    </div>
                    </div>
                    <div class="col-md-4">
                        <label for="numeroLetras" class="form-label">Con Número en Letras *</label>
                        <input type="text" class="form-control" id="numeroLetras" required>
                    </div>
                    <div class="col-md-4">
                        <label for="conLetras" class="form-label">Con Letras</label>
                        <input type="text" class="form-control" id="conLetras">
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-3">
                        <label for="lapsoDelDia" class="form-label">Por el Lapso del Día</label>
                        <input type="number" class="form-control" id="lapsoDelDia">
                    </div>
                    <div class="col-md-3">
                        <label for="lapsoDeMes" class="form-label">de Mes</label>
                        <input type="text" class="form-control" id="lapsoDeMes">
                    </div>
                    <div class="col-md-3">
                        <label for="lapsoAlDia" class="form-label">al Día</label>
                        <input type="number" class="form-control" id="lapsoAlDia">
                    </div>
                    <div class="col-md-3">
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
                <!-- Tu estructura HTML para vacaciones -->
            `;
            break;
        case 'incapacidad':
            camposHTML = `
                <!-- Tu estructura HTML para incapacidad -->
            `;
            break;
    }

    contenedor.innerHTML = camposHTML;
}

// Función para obtener datos del usuario
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
            break;
        case 'vacaciones':
            // Lógica para vacaciones
            break;
        case 'incapacidad':
                    // Lógica para incapacidad
            break;
    }
}

// Función llenarFormato optimizada
async function llenarFormato(tipoFormato) {
    formatoActual = tipoFormato;
    // Mostrar nombre del formato en el modal
    const nombreFormato = tipoFormato === 'concepto026' ? 'Concepto 026'
                        : tipoFormato === 'vacaciones' ? 'Solicitud de Vacaciones'
                        : tipoFormato === 'incapacidad' ? 'Incapacidad Médica'
                        : 'Formato Desconocido';

    document.getElementById('nombreFormatoModal').textContent = nombreFormato;

    // Abrir modal
    const modal = new bootstrap.Modal(document.getElementById('modalLlenarFormato'));
    modal.show();

    // Cargar estructura del formulario específica
    cargarCamposEspecificos(tipoFormato);

    // Esperar a que el DOM se actualice (300ms)
    setTimeout(async () => {
        try {
            const usuario = obtenerDatosUsuario(); // Asume que tienes esta función
            if (!usuario?.id_usuario) {
                mostrarError('Usuario no válido');
                return;
            }

            const response = await fetch(`api/formatos.php?id_usuario=${usuario.id_usuario}`);
            if (!response.ok) throw new Error('Error al obtener datos del usuario');

            const datos = await response.json();
            if (!datos.existe) {
                console.warn('El usuario no tiene datos guardados aún');
                return;
            }

            llenarCamposEspecificos(tipoFormato, datos);
            console.log('Datos del usuario cargados correctamente');

        } catch (error) {
            console.error('Error al cargar y llenar los campos:', error);
            mostrarError('No se pudo cargar la información del usuario.');
        }
    }, 300);
}


// Función mostrarError mejorada
function mostrarError(mensaje) {
    const contenedor = document.getElementById('datosEspecificos');
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
                <button class="btn btn-primary" onclick="llenarFormato('${formatoActual}')">
                    <i class="bi bi-arrow-clockwise"></i> Intentar nuevamente
                </button>
            </div>
        </div>
    `;
}

function verArchivo() {
    const tipoFormato = formatoActual; // variable global
    
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
                            url = `/sindicato/SindicaApp/api/concepto026.php?${params.toString()}`;
                            break;
                        // ... otros casos ...
                        default:
                            throw new Error('Formato no reconocido');
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
    const datos = {
        apellidoPaterno: document.getElementById('apellidoPaterno')?.value || '',
        apellidoMaterno: document.getElementById('apellidoMaterno')?.value || '',
        nombres: document.getElementById('nombres')?.value || '',
        matricula: document.getElementById('matricula')?.value || '',
        categoria: document.getElementById('categoria')?.value || '',
        adscripcion: document.getElementById('adscripcion')?.value || '',
        // ... añade más campos si quieres
    };

    const response = await fetch('api/concepto026.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    });

    if (!response.ok) {
        return Swal.fire('Error', 'No se pudo generar el PDF', 'error');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'concepto026_generado.pdf';
    a.click();
    window.URL.revokeObjectURL(url);
}


function descargarFormato(tipoFormato) {
    // Lógica para descargar formato vacío
    console.log('Descargando formato:', tipoFormato);
    // Implementación real dependería de tu backend
}

function guardarBorrador() {
    // Lógica para guardar borrador
    console.log('Guardando borrador...');
    // Implementación real dependería de tu backend
}

function enviarFormato() {
    const form = document.getElementById('formDatosUsuario');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return Swal.fire({
            title: 'Campos incompletos',
            text: 'Por favor complete todos los campos requeridos',
            icon: 'warning'
        });
    }

    Swal.fire({
        title: '¿Enviar formato?',
        text: 'Una vez enviado, no podrá modificar los datos',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#6c757d'
    }).then((result) => {
        if (result.isConfirmed) {
            // Aquí iría la lógica real de envío
            Swal.fire({
                title: '¡Formato enviado!',
                text: 'Su solicitud ha sido enviada correctamente',
                icon: 'success'
            }).then(() => {
                bootstrap.Modal.getInstance(document.getElementById('modalLlenarFormato')).hide();
            });
        }
    });
}

function actualizarTabla() {
    Swal.fire({
        title: 'Actualizando...',
        text: 'Cargando formatos disponibles',
        icon: 'info',
        showConfirmButton: false,
        timer: 1500
    });
}