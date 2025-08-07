// configuracion.js - Versión corregida con funciones globales
// Configuración de API
document.addEventListener("DOMContentLoaded", function () {
  // Obtener usuario del localStorage
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario || !usuario.id_usuario) {
    console.error("No hay usuario en localStorage");
    return;
  }

  const id_usuario = usuario.id_usuario;

  fetch(`http://localhost/sindicato/SindicaApp/api/obtenerdatospersonales.php?id_usuario=${id_usuario}`)
    .then(res => res.json())
    .then(data => {
      if (data.existe) {
        // Aquí puedes llenar los inputs o mostrar los datos
        console.log("Datos personales:", data);

        document.getElementById("nombre").value = data.Nombre;
        document.getElementById("apellido-paterno").value = data.ApellidoPaterno; 
        document.getElementById("apellido-materno").value = data.ApellidoMaterno;
        document.getElementById("ooad").value = data.OOAD;
        document.getElementById("no-plaza").value = data.NoPlaza;
        document.getElementById("categoria").value = data.Categoria;
        document.getElementById("contratacion").value = data.Contratacion;
        document.getElementById("turno").value = data.Turno;
        document.getElementById("hora-inicio").value = data.HoraInicio;
        document.getElementById("hora-fin").value = data.HoraFin;
        document.getElementById("correo").value = data.Correo;
        document.getElementById("dia-descanso").value = data.DiaDescanso;
        document.getElementById("direccion").value = data.Direccion;
        document.getElementById("telefono").value = data.Telefono;
        document.getElementById("curp").value = data.curp;
        document.getElementById("rfc").value = data.rfc;
        document.getElementById("fecha-nac").value = data.fecha_nac;
        
      } else {
        console.warn("No se encontraron datos personales.");
      }
    })
    .catch(error => {
      console.error("Error al obtener datos personales:", error);
    });
});


// Variables globales
let editandoDatos = false;
let datosOriginales = {};
// Función para obtener ID del usuario
function obtenerIdUsuario() {
    // Opción 1: Desde URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id_usuario');
    
    // Opción 2: Desde localStorage/sessionStorage
    if (!id) {
        id = localStorage.getItem('id_usuario') || sessionStorage.getItem('id_usuario');
    }
    
    // Opción 3: Desde una variable global o cookie
    if (!id) {
        id = window.usuarioActual?.id || getCookie('id_usuario');
    }
    
    return id;
}

// Función para obtener cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// ================================
// FUNCIONES DE CARGA DE DATOS
// ================================

// Función para cargar datos del usuario desde la API
async function cargarDatosUsuario() {
    if (!idUsuario) {
        Swal.fire({
            title: 'Error',
            text: 'No se pudo identificar al usuario',
            icon: 'error'
        });
        return;
    }
    
    try {
        // Mostrar loading
        Swal.fire({
            title: 'Cargando datos...',
            text: 'Por favor espera',
            icon: 'info',
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => {
                Swal.showLoading();
            }
        });
        
        // Usar la función helper para hacer la petición
        const data = await apiRequest(`${API_CONFIG.ENDPOINTS.OBTENER_DATOS}?id_usuario=${idUsuario}`);
        
        Swal.close();
        
        if (data.existe) {
            // Mapear los campos de la API a los campos del formulario
            const mapeosCampos = {
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
            
            // Llenar los campos con los datos de la API
            Object.keys(mapeosCampos).forEach(campoAPI => {
                const campoFormulario = mapeosCampos[campoAPI];
                const elemento = document.getElementById(campoFormulario);
                if (elemento && data[campoAPI]) {
                    elemento.value = data[campoAPI];
                }
            });
            
            // Actualizar nombre en navbar
            if (data.Nombre && data.ApellidoPaterno) {
                const nombreCompleto = `${data.Nombre} ${data.ApellidoPaterno} ${data.ApellidoMaterno || ''}`.trim();
                const spanNombre = document.querySelector('.navbar .me-2');
                if (spanNombre) {
                    spanNombre.textContent = nombreCompleto;
                }
            }
            
        } else {
            Swal.fire({
                title: 'Usuario no encontrado',
                text: 'No se encontraron datos para este usuario',
                icon: 'warning'
            });
        }
        
    } catch (error) {
        Swal.close();
        console.error('Error al cargar datos:', error);
        Swal.fire({
            title: 'Error de conexión',
            text: 'No se pudieron cargar los datos del usuario',
            icon: 'error'
        });
    }
}

// ================================
// FUNCIONES DE EDICIÓN DE DATOS (GLOBALES)
// ================================

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
            elemento.removeAttribute('readonly');
            elemento.classList.add('editing');
        }
    });
    
    // Mostrar botones de acción y ocultar botón editar
    const actionsDiv = document.getElementById('datos-personales-actions');
    const editBtn = document.querySelector('[onclick="editarDatosPersonales()"]');
    
    if (actionsDiv) actionsDiv.style.display = 'block';
    if (editBtn) editBtn.style.display = 'none';
    
    // Mostrar alerta de modo edición
    Swal.fire({
        title: 'Modo Edición Activado',
        text: 'Ahora puedes modificar tus datos personales',
        icon: 'info',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
    });
}

// Función para cancelar edición de datos
function cancelarEdicionDatos() {
    Swal.fire({
        title: '¿Cancelar cambios?',
        text: 'Se perderán todos los cambios realizados',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'Continuar editando'
    }).then((result) => {
        if (result.isConfirmed) {
            // Restaurar datos originales
            Object.keys(datosOriginales).forEach(campo => {
                const elemento = document.getElementById(campo);
                if (elemento) {
                    elemento.value = datosOriginales[campo];
                    elemento.setAttribute('readonly', true);
                    elemento.classList.remove('editing');
                }
            });
            
            // Ocultar botones de acción y mostrar botón editar
            const actionsDiv = document.getElementById('datos-personales-actions');
            const editBtn = document.querySelector('[onclick="editarDatosPersonales()"]');
            
            if (actionsDiv) actionsDiv.style.display = 'none';
            if (editBtn) editBtn.style.display = 'inline-block';
            
            editandoDatos = false;
            datosOriginales = {};
            
            // Mostrar alerta de cancelación
            Swal.fire({
                title: 'Cambios cancelados',
                text: 'Se han restaurado los datos originales',
                icon: 'info',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000
            });
        }
    });
}

// Función para guardar datos personales
async function guardarDatosPersonales() {
    // Obtener usuario del localStorage
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    
    if (!usuario || !usuario.id_usuario) {
        Swal.fire({
            title: 'Error',
            text: 'No se pudo identificar al usuario',
            icon: 'error'
        });
        return;
    }

    const id_usuario = usuario.id_usuario;

    // Validar campos requeridos
    const camposRequeridos = ['nombre', 'apellido-paterno', 'correo', 'telefono'];
    let camposVacios = [];
    
    camposRequeridos.forEach(campo => {
        const elemento = document.getElementById(campo);
        if (elemento && !elemento.value.trim()) {
            camposVacios.push(campo);
        }
    });
    
    if (camposVacios.length > 0) {
        Swal.fire({
            title: 'Campos requeridos',
            text: 'Por favor completa todos los campos obligatorios',
            icon: 'warning'
        });
        return;
    }
    
    // Validar email
    const correo = document.getElementById('correo').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        Swal.fire({
            title: 'Correo inválido',
            text: 'Por favor ingresa un correo electrónico válido',
            icon: 'error'
        });
        return;
    }
    
    // Preparar datos para enviar
    const datosParaGuardar = {
        id_usuario: id_usuario,
        OOAD: document.getElementById('ooad').value || '',
        Nombre: document.getElementById('nombre').value || '',
        ApellidoPaterno: document.getElementById('apellido-paterno').value || '',
        ApellidoMaterno: document.getElementById('apellido-materno').value || '',
        NoPlaza: document.getElementById('no-plaza').value || '',
        Categoria: document.getElementById('categoria').value || '',
        Contratacion: document.getElementById('contratacion').value || '',
        Turno: document.getElementById('turno').value || '',
        HoraInicio: document.getElementById('hora-inicio').value || '',
        HoraFin: document.getElementById('hora-fin').value || '',
        Correo: document.getElementById('correo').value || '',
        DiaDescanso: document.getElementById('dia-descanso').value || '',
        Direccion: document.getElementById('direccion').value || '',
        Telefono: document.getElementById('telefono').value || '',
        rfc: document.getElementById('rfc').value || '',
        curp: document.getElementById('curp').value || '',
        fecha_nac: document.getElementById('fecha-nac').value || ''
    };
    
    try {
        // Mostrar loading
        Swal.fire({
            title: 'Guardando datos...',
            text: 'Por favor espera',
            icon: 'info',
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => {
                Swal.showLoading();
            }
        });
        
        // Hacer la petición fetch - AJUSTA LA URL SEGÚN TU API
        const response = await fetch('http://localhost/sindicato/SindicaApp/api/guardardatospersonales.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosParaGuardar)
        });
        
        const result = await response.json();
        
        if (result.success || result.status === 'success') {
            // Hacer campos readonly nuevamente
            const campos = ['nombre', 'apellido-paterno', 'apellido-materno', 'ooad', 'no-plaza', 
                           'categoria', 'contratacion', 'turno', 'hora-inicio', 'hora-fin', 
                           'correo', 'dia-descanso', 'direccion', 'telefono', 'curp', 'rfc', 'fecha-nac'];
            
            campos.forEach(campo => {
                const elemento = document.getElementById(campo);
                if (elemento) {
                    elemento.setAttribute('readonly', true);
                    elemento.classList.remove('editing');
                }
            });
            
            // Ocultar botones de acción y mostrar botón editar
            const actionsDiv = document.getElementById('datos-personales-actions');
            const editBtn = document.querySelector('[onclick="editarDatosPersonales()"]');
            
            if (actionsDiv) actionsDiv.style.display = 'none';
            if (editBtn) editBtn.style.display = 'inline-block';
            
            editandoDatos = false;
            datosOriginales = {};
            
            // Actualizar nombre en navbar si existe
            const nombreCompleto = `${datosParaGuardar.Nombre} ${datosParaGuardar.ApellidoPaterno} ${datosParaGuardar.ApellidoMaterno}`.trim();
            const spanNombre = document.querySelector('.navbar .me-2');
            if (spanNombre) {
                spanNombre.textContent = nombreCompleto;
            }
            
            // Mostrar alerta de éxito
            Swal.fire({
                title: '¡Datos guardados!',
                text: 'Tus datos personales han sido actualizados correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
            
        } else {
            throw new Error(result.mensaje || result.message || 'Error desconocido al guardar');
        }
        
    } catch (error) {
        console.error('Error al guardar datos:', error);
        Swal.fire({
            title: 'Error al guardar',
            text: error.message || 'No se pudieron guardar los datos. Verifica tu conexión.',
            icon: 'error'
        });
    }
}

// Funciones de validación de documentos mexicanos
function validarCURP(curp) {
    if (!curp || curp.length !== 18) return false;
    const curpRegex = /^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9]{2}$/;
    return curpRegex.test(curp.toUpperCase());
}

function validarRFC(rfc) {
    if (!rfc) return false;
    // RFC Persona Física: 4 letras + 6 números + 3 caracteres
    // RFC Persona Moral: 3 letras + 6 números + 3 caracteres
    const rfcRegex = /^[A-Z&Ñ]{3,4}[0-9]{6}[A-V1-9][A-Z1-9][0-9A]$/;
    return rfcRegex.test(rfc.toUpperCase());
}

