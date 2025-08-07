document.getElementById("registroForm").addEventListener("submit", function(e) {
  e.preventDefault(); // Evita envío automático del formulario

  const matricula = document.getElementById("matricula").value;
  const rol = document.getElementById("rol").value;

  if (!matricula || !rol) {
    document.getElementById("registroMensaje").innerHTML =
      '<div class="alert alert-warning">Por favor, completa todos los campos.</div>';
    return;
  }

  const formData = new FormData();
  formData.append("matricula", matricula);
  formData.append("rol", rol);

  fetch("http://localhost/sindicato/SindicaApp/api/registrar.php", {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    const mensaje = document.getElementById("registroMensaje");
    if (data.estado === "ok") {
      mensaje.innerHTML = `<div class="alert alert-success">${data.mensaje}</div>`;
      document.getElementById("registroForm").reset();
    } else {
      mensaje.innerHTML = `<div class="alert alert-danger">${data.mensaje}</div>`;
    }
  })
  .catch(error => {
    console.error("Error:", error);
    document.getElementById("registroMensaje").innerHTML =
      '<div class="alert alert-danger">Error al conectar con el servidor.</div>';
  });
});
