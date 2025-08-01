document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("btn-cerrar-sesion");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      confirmarCerrarSesion();
    });
  }

  function confirmarCerrarSesion() {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: 'Serás redirigido a la página de inicio de sesión',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#02542D'
    }).then((result) => {
      if (result.isConfirmed) {
        // Aquí iría la lógica para cerrar sesión (como limpiar localStorage)
        localStorage.removeItem("usuario"); // si usas localStorage
        window.location.href = 'index.html';
      }
    });
  }
});
