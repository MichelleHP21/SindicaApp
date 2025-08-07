// Redirigir si el usuario no es trabajador
document.addEventListener("DOMContentLoaded", function () {
    const usuarioStr = localStorage.getItem("usuario");
    const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;

    if (!usuario || usuario.Rol !== "trabajador") {
        window.location.href = "index.html";
    }

    // Agregar el evento submit del formulario aquí dentro de DOMContentLoaded
    document.getElementById('cambiar-contrasena-form').addEventListener('submit', async function (e) {
        e.preventDefault();

        const contrasenaActual = document.getElementById('contrasena-actual').value;
        const nuevaContrasena = document.getElementById('nueva-contrasena').value;
        const confirmarContrasena = document.getElementById('confirmar-contrasena').value;

        if (nuevaContrasena !== confirmarContrasena) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Las contraseñas no coinciden'
            });
            return;
        }

        try {
            const response = await fetch("http://localhost/sindicato/SindicaApp/api/cambiarcontrasena.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    matricula: usuario?.matricula,
                    actual: contrasenaActual,
                    nueva: nuevaContrasena
                })
            });

            const result = await response.json();

            if (result.estado === "ok") {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: result.mensaje
                }).then(() => {
                    cancelarCambioContrasena();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: result.mensaje
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error de red',
                text: 'No se pudo conectar con el servidor.'
            });
        }
    });
});

// Mostrar u ocultar el formulario
function toggleCambiarContrasena() {
    const form = document.getElementById('form-cambiar-contrasena');
    if (form.style.display === 'none') {
        form.style.display = 'block';
    } else {
        form.style.display = 'none';
    }
}

// Cancelar y limpiar el formulario
function cancelarCambioContrasena() {
    document.getElementById('form-cambiar-contrasena').style.display = 'none';
    document.getElementById('cambiar-contrasena-form').reset();
}

// Mostrar/ocultar contraseña
function togglePassword(inputId) {
    const passwordInput = document.getElementById(inputId);
    const eyeIcon = document.getElementById('eye-' + inputId);

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.className = 'bi bi-eye';
    } else {
        passwordInput.type = 'password';
        eyeIcon.className = 'bi bi-eye-slash';
    }
}
