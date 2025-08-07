document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".cerrar-sesion").forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      Swal.fire({
        title: "¿Estás seguro?",
        text: "Tu sesión se cerrará",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem("usuario");
          localStorage.removeItem("sesionInicio");
          // Aquí puedes limpiar sesión o redirigir
          window.location.href = "index.html";
        }
      });
    });
  });
});
