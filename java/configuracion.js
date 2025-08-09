// configuracion.js - Versión mejorada con dropdowns para categoría, contratación y turno

document.addEventListener("DOMContentLoaded", function () {
    // Obtener usuario del localStorage
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario || !usuario.id_usuario) {
        console.error("No hay usuario en localStorage");
        return;
    }

    // Cargar datos al iniciar
    cargarDatosUsuario(usuario.id_usuario);
});

// Variables globales
let editandoDatos = false;
let datosOriginales = {};

// Función para cargar datos del usuario
async function cargarDatosUsuario(id_usuario) {
    try {
        // Mostrar loading
        Swal.fire({
            title: 'Cargando datos...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        const response = await fetch(`http://localhost/sindicato/SindicaApp/api/obtenerdatospersonales.php?id_usuario=${id_usuario}`);
        const data = await response.json();

        Swal.close();

        if (data.existe) {
            // Mapeo de campos API a formulario
            const mapeoCampos = {
                'Nombre': 'nombre',
                'ApellidoPaterno': 'apellido-paterno', 
                'ApellidoMaterno': 'apellido-materno',
                'OOAD': 'ooad',
                'NoPlaza': 'no-plaza',
                'Categoria': 'categoria',
                'Contratacion': 'contratacion',
                'Turno': 'turno',
                'HoraInicio': 'hora-inicio',
                'HoraFin': 'hora-fin',
                'Correo': 'correo',
                'DiaDescanso': 'dia-descanso',
                'Direccion': 'direccion',
                'Telefono': 'telefono',
                'curp': 'curp',
                'rfc': 'rfc',
                'fecha_nac': 'fecha-nac'
            };

            // Llenar campos
            Object.keys(mapeoCampos).forEach(campoApi => {
                const campoForm = mapeoCampos[campoApi];
                const elemento = document.getElementById(campoForm);
                
                if (elemento && data[campoApi]) {
                    // Para selects, buscar la opción que coincida
                    if (elemento.tagName === 'SELECT') {
                        const options = elemento.options;
                        for (let i = 0; i < options.length; i++) {
                            if (options[i].value === data[campoApi]) {
                                options[i].selected = true;
                                break;
                            }
                        }
                    } else {
                        elemento.value = data[campoApi];
                    }
                }
            });
            
        } else {
            console.warn("No se encontraron datos personales.");
            Swal.fire({
                title: 'Aviso',
                text: 'No se encontraron datos personales registrados',
                icon: 'info'
            });
        }
    } catch (error) {
        console.error("Error al obtener datos personales:", error);
        Swal.fire({
            title: 'Error',
            text: 'No se pudieron cargar los datos del usuario',
            icon: 'error'
        });
    }
}

// Función para editar datos personales
function editarDatosPersonales() {
    if (editandoDatos) return;
    
    editandoDatos = true;
    
    // Guardar datos originales
    const campos = ['nombre', 'apellido-paterno', 'apellido-materno', 'ooad', 'no-plaza', 
                   'categoria', 'contratacion', 'turno', 'hora-inicio', 'hora-fin', 
                   'correo', 'dia-descanso', 'direccion', 'telefono', 'curp', 'rfc', 'fecha-nac'];
    
    campos.forEach(campo => {
        const elemento = document.getElementById(campo);
        if (elemento) {
            datosOriginales[campo] = elemento.value;
            
            // Habilitar según el tipo de elemento
            if (elemento.tagName === 'SELECT') {
                elemento.disabled = false;
            } else {
                elemento.readOnly = false;
            }
            
            elemento.classList.add('editing');
        }
    });
    
    // Mostrar botones de acción
    document.getElementById('datos-personales-actions').style.display = 'block';
    document.querySelector('[onclick="editarDatosPersonales()"]').style.display = 'none';
    
    // Opcional: Enfocar el primer campo editable
    const primerCampo = document.querySelector('.editing');
    if (primerCampo) primerCampo.focus();
    console.log('🛠️ Entrando en modo edición');
    verificarEstadoDropdowns();
}

// Función para cancelar edición
function cancelarEdicionDatos() {
    // Restaurar valores originales
    Object.keys(datosOriginales).forEach(campo => {
        const elemento = document.getElementById(campo);
        if (elemento) {
            elemento.value = datosOriginales[campo];
            
            // Deshabilitar según el tipo de elemento
            if (elemento.tagName === 'SELECT') {
                elemento.disabled = true;
            } else {
                elemento.readOnly = true;
            }
            
            elemento.classList.remove('editing');
        }
    });
    
    // Restaurar UI
    document.getElementById('datos-personales-actions').style.display = 'none';
    document.querySelector('[onclick="editarDatosPersonales()"]').style.display = 'inline-block';
    
    editandoDatos = false;
    datosOriginales = {};
    verificarEstadoDropdowns();
}

// Verificador de estado de los dropdowns
function verificarEstadoDropdowns() {
    console.group('🔄 Verificación de Dropdowns');
    
    // Verificar selects
    ['categoria', 'contratacion', 'turno'].forEach(id => {
        const select = document.getElementById(id);
        if (select) {
            console.log(`🔘 ${id.toUpperCase()}:`, {
                'Valor seleccionado': select.value,
                'Estado': select.disabled ? '❌ Deshabilitado' : '✅ Habilitado',
                'Opciones disponibles': Array.from(select.options).map(opt => opt.value)
            });
        }
    });
    
    console.groupEnd();
}

// Función para guardar datos
async function guardarDatosPersonales() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario?.id_usuario) {
        Swal.fire('Error', 'No se pudo identificar al usuario', 'error');
        return;
    }

    // Validaciones básicas
    if (!validarCamposRequeridos()) return;
    if (!validarEmail(document.getElementById('correo').value)) {
        Swal.fire('Error', 'Ingrese un correo electrónico válido', 'error');
        return;
    }

    // Preparar datos
    const datos = {
        id_usuario: usuario.id_usuario,
        Nombre: document.getElementById('nombre').value,
        ApellidoPaterno: document.getElementById('apellido-paterno').value,
        ApellidoMaterno: document.getElementById('apellido-materno').value,
        OOAD: document.getElementById('ooad').value,
        NoPlaza: document.getElementById('no-plaza').value,
        Categoria: document.getElementById('categoria').value,
        Contratacion: document.getElementById('contratacion').value,
        Turno: document.getElementById('turno').value,
        HoraInicio: document.getElementById('hora-inicio').value,
        HoraFin: document.getElementById('hora-fin').value,
        Correo: document.getElementById('correo').value,
        DiaDescanso: document.getElementById('dia-descanso').value,
        Direccion: document.getElementById('direccion').value,
        Telefono: document.getElementById('telefono').value,
        curp: document.getElementById('curp').value,
        rfc: document.getElementById('rfc').value,
        fecha_nac: document.getElementById('fecha-nac').value
    };

    try {
        Swal.fire({
            title: 'Guardando...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        const response = await fetch('http://localhost/sindicato/SindicaApp/api/guardardatospersonales.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        const result = await response.json();

        if (result.success) {
            // Actualizar UI
            const campos = ['nombre', 'apellido-paterno', 'apellido-materno', 'ooad', 'no-plaza', 
                          'categoria', 'contratacion', 'turno', 'hora-inicio', 'hora-fin', 
                          'correo', 'dia-descanso', 'direccion', 'telefono', 'curp', 'rfc', 'fecha-nac'];
            
            campos.forEach(campo => {
                const elemento = document.getElementById(campo);
                if (elemento) {
                    if (elemento.tagName === 'SELECT') {
                        elemento.disabled = true;
                    } else {
                        elemento.readOnly = true;
                    }
                    elemento.classList.remove('editing');
                }
            });

            document.getElementById('datos-personales-actions').style.display = 'none';
            document.querySelector('[onclick="editarDatosPersonales()"]').style.display = 'inline-block';
            
            editandoDatos = false;
            datosOriginales = {};

            Swal.fire('Éxito', 'Datos guardados correctamente', 'success');
        } else {
            throw new Error(result.message || 'Error al guardar');
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire('Error', error.message || 'Error al guardar datos', 'error');
    }
}

// Funciones auxiliares
function validarCamposRequeridos() {
    const requeridos = ['nombre', 'apellido-paterno', 'correo', 'telefono'];
    const vacios = requeridos.filter(campo => !document.getElementById(campo).value.trim());
    
    if (vacios.length > 0) {
        Swal.fire('Campos requeridos', 'Complete todos los campos obligatorios', 'warning');
        return false;
    }
    return true;
}

function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}