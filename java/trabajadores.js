console.log("Archivo JS cargado");
let trabajadorActual = {};
let buscador, filtroDepartamento, limpiarBusqueda;

// Cargar lista de trabajadores desde API
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM cargado");
  cargarTrabajadores();
  buscador = document.getElementById("buscador");
  filtroDepartamento = document.getElementById("filtroDepartamento");
  limpiarBusqueda = document.getElementById("limpiarBusqueda");

  if (buscador) buscador.addEventListener("input", filtrarTabla);
  if (filtroDepartamento) filtroDepartamento.addEventListener("change", filtrarTabla);
  if (limpiarBusqueda) limpiarBusqueda.addEventListener("click", limpiarBusquedaCompleta);

  const botonGuardar = document.getElementById("btnGuardarEdicion");
  const modalElement = document.getElementById("editarModal");

  if (botonGuardar && modalElement) {
    botonGuardar.addEventListener("click", function (e) {
      e.preventDefault();

      const nombre = document.getElementById('editNombre').value.trim();
      const departamento = document.getElementById('editDepartamento').value;
      const telefono = document.getElementById('editTelefono').value.trim();
      const correo = document.getElementById('editCorreo').value.trim();

      if (!nombre || !departamento || !telefono || !correo) {
        Swal.fire({
          title: 'Campos incompletos',
          text: 'Por favor completa todos los campos requeridos',
          icon: 'warning'
        });
        return;
      }

      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide();

      setTimeout(() => {
        Swal.fire({
          title: "¡Cambios guardados!",
          text: `La información de ${nombre} ha sido actualizada correctamente`,
          icon: "success",
          confirmButtonText: "OK"
        });
      }, 300);
    });
  }
});

// Función para cargar trabajadores desde la API
function cargarTrabajadores() {
  fetch('http://localhost/sindicato/SindicaApp/api/listartrabajadores.php')
    .then(response => {
      console.log('Respuesta recibida del servidor:', response);
      if (!response.ok) {
        throw new Error('Error en la respuesta HTTP: ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      console.log('Datos JSON recibidos:', data);

      const tbody = document.getElementById('tablaTrabajadoresBody');
      tbody.innerHTML = '';

      if (!data.length) {
        console.warn('No se recibieron trabajadores');
      }

      data.forEach((trabajador, index) => {
        const fila = document.createElement('tr');
        fila.dataset.matricula = trabajador.matricula;
        fila.dataset.nombre = trabajador.nombre_completo;
        fila.dataset.departamento = trabajador.Categoria; // Aquí usas "Categoría" como departamento
        fila.dataset.telefono = trabajador.Telefono;
        fila.dataset.correo = trabajador.Correo;

        fila.innerHTML = `
          <td>${index + 1}</td>
          <td>${trabajador.matricula}</td>
          <td>${trabajador.nombre_completo}</td>
          <td>${trabajador.Telefono}</td>
          <td>${trabajador.Correo}</td>
          <td>${trabajador.Categoria}</td>
          <td>
            <button class="btn btn-sm btn-primary" onclick="verTrabajador(this)">Ver</button>
            <button class="btn btn-sm btn-warning" onclick="editarTrabajador(this)">Editar</button>
            <button onclick="bajaTrabajador(${trabajador.id_usuario})">Dar de baja</button>
          </td>
        `;
        tbody.appendChild(fila);
      });
    })
    .catch(error => {
      console.error('Error al cargar los datos:', error);
    });
}

function editarTrabajador(button) {
  const fila = button.closest('tr');
  trabajadorActual = {
    matricula: fila.dataset.matricula,
    nombre: fila.dataset.nombre,
    departamento: fila.dataset.departamento,
    telefono: fila.dataset.telefono,
    correo: fila.dataset.correo
  };

  document.getElementById('editMatricula').value = trabajadorActual.matricula;
  document.getElementById('editNombre').value = trabajadorActual.nombre;
  document.getElementById('editDepartamento').value = trabajadorActual.departamento;
  document.getElementById('editTelefono').value = trabajadorActual.telefono;
  document.getElementById('editCorreo').value = trabajadorActual.correo;

  const modal = new bootstrap.Modal(document.getElementById('editarModal'));
  modal.show();
}

function verTrabajador(button) {
  const fila = button.closest('tr');
  const trabajador = {
    matricula: fila.dataset.matricula,
    nombre: fila.dataset.nombre,
    departamento: fila.dataset.departamento,
    telefono: fila.dataset.telefono,
    correo: fila.dataset.correo
  };

  document.getElementById('verMatricula').textContent = trabajador.matricula;
  document.getElementById('verNombre').textContent = trabajador.nombre;
  document.getElementById('verDepartamento').textContent = trabajador.departamento;
  document.getElementById('verTelefono').textContent = trabajador.telefono;
  document.getElementById('verCorreo').textContent = trabajador.correo;
  document.getElementById('verNombreDisplay').textContent = trabajador.nombre;
  document.getElementById('verMatriculaDisplay').textContent = `Mat: ${trabajador.matricula}`;

  trabajadorActual = trabajador;

  const modal = new bootstrap.Modal(document.getElementById('verModal'));
  modal.show();
}

function editarDesdeVer() {
  const verModal = bootstrap.Modal.getInstance(document.getElementById('verModal'));
  verModal.hide();

  setTimeout(() => {
    document.getElementById('editMatricula').value = trabajadorActual.matricula;
    document.getElementById('editNombre').value = trabajadorActual.nombre;
    document.getElementById('editDepartamento').value = trabajadorActual.departamento;
    document.getElementById('editTelefono').value = trabajadorActual.telefono;
    document.getElementById('editCorreo').value = trabajadorActual.correo;

    const editModal = new bootstrap.Modal(document.getElementById('editarModal'));
    editModal.show();
  }, 300);
}

function bajaTrabajador(id_usuario) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "Este usuario será dado de baja",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, dar de baja',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch('http://localhost/sindicato/SindicaApp/api/bajatrabajador.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `id=${encodeURIComponent(id_usuario)}`
      })
      .then(response => response.text())
      .then(texto => {
        console.log("Respuesta cruda del servidor:", texto);
        const data = JSON.parse(texto);
        Swal.fire({
          title: data.mensaje || "Usuario dado de baja correctamente",
          icon: data.mensaje.includes('exitosamente') ? 'success' : 'error',
          confirmButtonText: 'OK'
        });
        cargarTrabajadores();
      })
      .catch(error => {
        console.error("Error al dar de baja al usuario:", error);
        Swal.fire({
          title: "Error inesperado",
          text: "No se pudo dar de baja al usuario",
          icon: "error",
          confirmButtonText: "OK"
        });
      });
    }
  });
}

function filtrarTabla() {
  const texto = buscador.value.toLowerCase();
  const departamentoSeleccionado = filtroDepartamento.value.toLowerCase();
  const filas = document.querySelectorAll("tbody tr");

  filas.forEach(fila => {
    const matricula = fila.children[1].textContent.toLowerCase();
    const nombre = fila.children[2].textContent.toLowerCase();
    const departamento = fila.children[3].textContent.toLowerCase();
    const telefono = fila.children[4].textContent.toLowerCase();
    const correo = fila.children[5].textContent.toLowerCase();

    const coincideTexto =
      matricula.includes(texto) ||
      nombre.includes(texto) ||
      departamento.includes(texto) ||
      telefono.includes(texto) ||
      correo.includes(texto);

    const coincideDepartamento =
      departamentoSeleccionado === "" || departamento === departamentoSeleccionado;

    fila.style.display = (coincideTexto && coincideDepartamento) ? "" : "none";
  });
}

function limpiarBusquedaCompleta() {
  buscador.value = '';
  filtroDepartamento.value = '';
  filtrarTabla();
  buscador.focus();

  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'info',
    title: 'Búsqueda limpiada',
    showConfirmButton: false,
    timer: 1500
  });
}
