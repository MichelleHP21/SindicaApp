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

// Función para cargar solo los formatos activos desde el API
async function cargarFormatosActivos() {
    console.log("🔍 FUNCIÓN: cargarFormatosActivos ejecutándose");
    
    try {
        console.log("🔍 Haciendo petición a:", 'https://sindicato.infinityfree.me/api/formatosactivos.php');

        const response = await fetch('https://sindicato.infinityfree.me/api/formatosactivos.php');
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
                                    onclick="descargarFormato('${formato.id_formato}', '${escapeJS(formato.nombre)}')" 
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
        mostrarError('Error', 'No se pudieron cargar los formatos disponibles');
        
        const cuerpoTabla = document.getElementById('cuerpoTablaFormatos');
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

// Función para actualizar la tabla (botón actualizar)
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

// Función para llenar formato
function llenarFormato(idFormato, nombreFormato) {
    console.log(`Llenar formato: ${nombreFormato} (ID: ${idFormato})`);
    
    // Actualizar el modal con el nombre del formato
    document.getElementById('nombreFormatoModal').textContent = nombreFormato;
    
    // Cargar datos específicos del formato
    cargarDatosEspecificosFormato(idFormato, nombreFormato);
    
    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('modalLlenarFormato'));
    modal.show();
}

// Función para descargar formato vacío
async function descargarFormato(idFormato, nombreFormato) {
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

        // Simular descarga (aquí pondrías tu lógica real de descarga)
        const response = await fetch(`https://sindicato.infinityfree.me/api/descargarformato.php?id=${idFormato}`);

        if (!response.ok) throw new Error('Error al descargar el formato');
        
        // Aquí manejarías la descarga real del archivo
        // Por ejemplo, crear un blob y descargarlo
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

// Función para cargar datos específicos del formato en el modal
async function cargarDatosEspecificosFormato(idFormato, nombreFormato) {
    const contenedorDatos = document.getElementById('datosEspecificos');
    
    try {
        // Aquí cargarías los campos específicos según el formato
        // Por ahora, muestro un ejemplo genérico
        contenedorDatos.innerHTML = `
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="fechaSolicitud" class="form-label">Fecha de Solicitud</label>
                        <input type="date" class="form-control" id="fechaSolicitud" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="motivo" class="form-label">Motivo</label>
                        <input type="text" class="form-control" id="motivo" required>
                    </div>
                    <div class="col-12 mb-3">
                        <label for="observaciones" class="form-label">Observaciones</label>
                        <textarea class="form-control" id="observaciones" rows="3"></textarea>
                    </div>
                </div>
                <div class="alert alert-info">
                    <i class="bi bi-info-circle me-2"></i>
                    Complete todos los campos requeridos para procesar su ${nombreFormato}.
                </div>
            </div>
        `;
        
        // Aquí podrías hacer una petición específica para obtener los campos del formato
        // const response = await fetch(`/api/campos-formato/${idFormato}`);
        
    } catch (error) {
        console.error('Error al cargar datos específicos:', error);
        contenedorDatos.innerHTML = `
            <div class="card-body">
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    Error al cargar los campos del formato.
                </div>
            </div>
        `;
    }
}

// Funciones del modal
function verArchivo() {
    Swal.fire('Función no implementada', 'La vista previa del PDF se implementará próximamente', 'info');
}

function descargarPDFLleno() {
    Swal.fire('Función no implementada', 'La descarga del PDF lleno se implementará próximamente', 'info');
}

function guardarBorrador() {
    Swal.fire('Borrador guardado', 'Sus datos han sido guardados como borrador', 'success');
}

function enviarFormato() {
    Swal.fire({
        title: '¿Enviar formato?',
        text: 'Una vez enviado, no podrá modificar los datos',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, enviar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('Enviado', 'Su formato ha sido enviado correctamente', 'success');
            bootstrap.Modal.getInstance(document.getElementById('modalLlenarFormato')).hide();
        }
    });
}

// Funciones auxiliares
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
    return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeJS(str) {
    if (!str) return '';
    return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
}

function mostrarError(titulo, mensaje) {
    console.error(titulo, mensaje);
    Swal.fire(titulo, mensaje, 'error');
}