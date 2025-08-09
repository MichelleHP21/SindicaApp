document.addEventListener("DOMContentLoaded", async () => {
    // Verificación de usuario administrador
    const usuarioStr = localStorage.getItem("usuario");
    const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;

    if (!usuario || usuario.Rol !== "administrador") {
        window.location.href = "index.html";
        return; // Salir temprano si no es admin
    }

    // Cargar y mostrar formatos
    await cargarFormatos();

    // Configurar submit del formulario
    document.getElementById('formPeriodo').addEventListener('submit', manejarSubmitPeriodo);
});

// FUNCIÓN CORREGIDA - Compara fechas sin problemas de zona horaria
function esPeriodoActivo(inicio, fin) {
    if (!inicio || !fin) return false;
    
    // Obtener fecha actual en formato local YYYY-MM-DD
    const hoy = new Date();
    const añoHoy = hoy.getFullYear();
    const mesHoy = String(hoy.getMonth() + 1).padStart(2, '0');
    const diaHoy = String(hoy.getDate()).padStart(2, '0');
    const fechaHoyStr = `${añoHoy}-${mesHoy}-${diaHoy}`;
    
    // Extraer solo la parte de fecha (sin tiempo)
    const fechaInicio = inicio.split(' ')[0];
    const fechaFin = fin.split(' ')[0];
    
    console.log('--- Verificación de Período ---');
    console.log('Fecha de hoy:', fechaHoyStr);
    console.log('Período:', `${fechaInicio} a ${fechaFin}`);
    console.log('¿Está activo?', fechaHoyStr >= fechaInicio && fechaHoyStr <= fechaFin);
    
    return fechaHoyStr >= fechaInicio && fechaHoyStr <= fechaFin;
}

async function cargarFormatos() {
    const response = await fetch('http://localhost/sindicato/SindicaApp/api/obtenerformatosM.php');
    if (!response.ok) throw new Error("Error al obtener formatos");

    const formatos = await response.json();
    const cuerpoTabla = document.getElementById('cuerpoTablaFormatos');

    cuerpoTabla.innerHTML = formatos.map((formato, index) => {
        const inicio = formato.fecha_inicio ? new Date(formato.fecha_inicio) : null;
        const fin = formato.fecha_fin ? new Date(formato.fecha_fin) : null;
        const activo = esPeriodoActivo(formato.fecha_inicio, formato.fecha_fin);

        // Depuración con fecha local
        console.log(`--- Formato: ${formato.nombre} ---`);
        console.log(`Fecha inicio raw: ${formato.fecha_inicio}`);
        console.log(`Fecha fin raw: ${formato.fecha_fin}`);
        console.log(`Estado: ${activo ? 'ACTIVO' : 'INACTIVO'}`);

        return `
            <tr data-id="${formato.id_formato}">
                <th scope="row">${index + 1}</th>
                <td>${escapeHTML(formato.nombre)}</td>
                <td>${formato.fecha_inicio && formato.fecha_fin 
                    ? `${formatearFecha(formato.fecha_inicio)} - ${formatearFecha(formato.fecha_fin)}`
                    : 'No definido'}</td>
                <td>
                    <span class="badge bg-${activo ? 'success' : 'danger'}">
                        ${activo ? 'Activo' : 'Inactivo'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-${formato.fecha_inicio ? 'primary' : 'success'} btn-sm"
                            onclick="abrirModalPeriodo(${formato.id_formato}, '${escapeJS(formato.nombre)}')">
                        <i class="bi bi-${formato.fecha_inicio ? 'calendar' : 'toggle-on'}"></i>
                        ${formato.fecha_inicio ? 'Cambiar' : 'Habilitar'}
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Función para manejar el envío del formulario
async function manejarSubmitPeriodo(e) {
    e.preventDefault();

    const nombreFormato = document.getElementById('nombreFormatoModal').value;
    const fechaInicio = document.getElementById('periodoInicio').value;
    const fechaFin = document.getElementById('periodoFin').value;

    // Validaciones
    if (!fechaInicio || !fechaFin) {
        Swal.fire('Campos requeridos', 'Selecciona ambas fechas.', 'warning');
        return;
    }

    if (new Date(fechaInicio) > new Date(fechaFin)) {
        Swal.fire('Fechas inválidas', 'La fecha de inicio no puede ser mayor a la fecha de fin', 'error');
        return;
    }

    try {
        const response = await fetch('http://localhost/sindicato/SindicaApp/api/guardarperiodoformatos.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre_formato: nombreFormato,
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin
            })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Error en la respuesta del servidor');
        }

        Swal.fire('Guardado', data.message, 'success');
        bootstrap.Modal.getInstance(document.getElementById('modalPeriodo')).hide();
        await cargarFormatos(); // Recargar la tabla en lugar de refrescar toda la página
    } catch (error) {
        console.error('Error:', error);
        Swal.fire('Error', error.message || 'Hubo un problema al guardar el periodo.', 'error');
    }
}

// Función para abrir el modal con los datos del formato
async function abrirModalPeriodo(idFormato, nombreFormato) {
    const modal = new bootstrap.Modal(document.getElementById('modalPeriodo'));
    document.getElementById('modalPeriodoLabel').textContent = `Configurar periodo para ${nombreFormato}`;
    document.getElementById('nombreFormatoModal').value = nombreFormato;

    // Resetear fechas primero
    document.getElementById('periodoInicio').value = '';
    document.getElementById('periodoFin').value = '';

    // Cargar datos existentes si hay ID
    if (idFormato) {
        try {
            const response = await fetch(`http://localhost/sindicato/SindicaApp/api/obtenerformatosU.php?id_formato=${idFormato}`);
            if (!response.ok) throw new Error("Error al cargar formato");
            
            const formato = await response.json();
            if (formato.fecha_inicio) {
                document.getElementById('periodoInicio').value = formato.fecha_inicio.split(' ')[0];
            }
            if (formato.fecha_fin) {
                document.getElementById('periodoFin').value = formato.fecha_fin.split(' ')[0];
            }
        } catch (error) {
            console.error('Error al cargar formato:', error);
            Swal.fire('Error', 'No se pudieron cargar los datos del formato', 'error');
        }
    }

    modal.show();
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
    return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeJS(str) {
    return str.replace(/'/g, "\\'");
}

function mostrarError(titulo, error) {
    console.error(titulo, error);
    alert(`${titulo}: ${error.message}`);
}