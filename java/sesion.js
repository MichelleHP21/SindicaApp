document.addEventListener("DOMContentLoaded", function () {
  const usuarioStr = localStorage.getItem("usuario");
  const sesionInicio = localStorage.getItem("sesionInicio");
  const unaHora = 60 * 60 * 1000; // 1 hora

  if (usuarioStr && sesionInicio) {
    if (Date.now() - parseInt(sesionInicio) > unaHora) {
      // Sesión expirada
      localStorage.removeItem("usuario");
      localStorage.removeItem("sesionInicio");
      if (!window.location.pathname.endsWith("index.html")) {
        window.location.href = "index.html";
      }
    } else {
      // Redirige a inicio si está en index y sesión válida
      if (window.location.pathname.endsWith("index.html")) {
        window.location.href = "inicio.html";
      }
    }
  } else {
    // No hay sesión activa, redirige a index si intenta entrar a inicio
    if (window.location.pathname.endsWith("inicio.html")) {
      window.location.href = "index.html";
    }
  }

  // Mostrar nombre en navbar si hay usuario
  if (usuarioStr) {
    try {
      const usuario = JSON.parse(usuarioStr);
      if (usuario.Nombre && usuario.ApellidoPaterno && usuario.ApellidoMaterno) {
        const nombreCompleto = `${usuario.Nombre} ${usuario.ApellidoPaterno} ${usuario.ApellidoMaterno}`;
        const nombreElemento = document.getElementById("nombreUsuarioNavbar");
        if (nombreElemento) {
          nombreElemento.textContent = nombreCompleto;
        } else {
          console.warn("Elemento con ID 'nombreUsuarioNavbar' no encontrado.");
        }
      } else {
        console.warn("Faltan datos del usuario en localStorage.");
      }
    } catch (e) {
      console.error("Error al parsear el usuario desde localStorage:", e);
    }
  }
});
