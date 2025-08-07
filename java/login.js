document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault(); // Evita que el formulario se envíe automáticamente
  
  const matricula = document.getElementById("username").value;
  const contrasena = document.getElementById("password").value;
  
  const formData = new FormData();
  formData.append("matricula", matricula);
  formData.append("contrasena", contrasena);
  
  fetch("http://localhost/sindicato/SindicaApp/api/iniciosesion.php", {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    const mensaje = document.getElementById("loginMessage");
    if (data.estado === "ok") {
      // Guarda sesión y hora de inicio
      localStorage.setItem("usuario", JSON.stringify(data.datos));
      localStorage.setItem("sesionInicio", Date.now());

      // Mostrar nombre en navbar si quieres (opcional)
      // ...

      // Control de acceso por rol
      if (data.datos.Rol === "administrador") {
        window.location.href = "inicio.html";
      } else if (data.datos.Rol === "trabajador") {
        window.location.href = "inicio1.html";
      } else {
        // Si el rol no está permitido, muestra mensaje y no redirige
        mensaje.innerHTML = `<div class="alert alert-danger">No tienes permisos para acceder.</div>`;
      }
    } else {
      mensaje.innerHTML = `<div class="alert alert-danger">${data.mensaje}</div>`;
    }
  })
  .catch(error => {
    console.error("Error:", error);
    document.getElementById("loginMessage").innerHTML = `<div class="alert alert-danger">Error de conexión.</div>`;
  });
});