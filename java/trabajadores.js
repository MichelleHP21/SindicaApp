let trabajadorActual = {};
    let buscador, filtroDepartamento, limpiarBusqueda, filas;

    // Función para editar trabajador
    function editarTrabajador(button) {
      const fila = button.closest('tr');
      trabajadorActual = {
        matricula: fila.dataset.matricula,
        nombre: fila.dataset.nombre,
        departamento: fila.dataset.departamento,
        telefono: fila.dataset.telefono,
        correo: fila.dataset.correo
      };
      
      // Llenar el formulario de edición
      document.getElementById('editMatricula').value = trabajadorActual.matricula;
      document.getElementById('editNombre').value = trabajadorActual.nombre;
      document.getElementById('editDepartamento').value = trabajadorActual.departamento;
      document.getElementById('editTelefono').value = trabajadorActual.telefono;
      document.getElementById('editCorreo').value = trabajadorActual.correo;
      
      // Mostrar modal
      const modal = new bootstrap.Modal(document.getElementById('editarModal'));
      modal.show();
    }

    // Función para ver trabajador
    function verTrabajador(button) {
      const fila = button.closest('tr');
      const trabajador = {
        matricula: fila.dataset.matricula,
        nombre: fila.dataset.nombre,
        departamento: fila.dataset.departamento,
        telefono: fila.dataset.telefono,
        correo: fila.dataset.correo
      };
      
      // Llenar la información de visualización
      document.getElementById('verMatricula').textContent = trabajador.matricula;
      document.getElementById('verNombre').textContent = trabajador.nombre;
      document.getElementById('verDepartamento').textContent = trabajador.departamento;
      document.getElementById('verTelefono').textContent = trabajador.telefono;
      document.getElementById('verCorreo').textContent = trabajador.correo;
      
      // Llenar información del display
      document.getElementById('verNombreDisplay').textContent = trabajador.nombre;
      document.getElementById('verMatriculaDisplay').textContent = `Mat: ${trabajador.matricula}`;
      
      // Guardar datos para posible edición
      trabajadorActual = trabajador;
      
      // Mostrar modal
      const modal = new bootstrap.Modal(document.getElementById('verModal'));
      modal.show();
    }

    // Función para editar desde el modal de ver
    function editarDesdeVer() {
      // Cerrar modal de ver
      const verModal = bootstrap.Modal.getInstance(document.getElementById('verModal'));
      verModal.hide();
      
      // Esperar a que se cierre y abrir modal de editar
      setTimeout(() => {
        // Llenar el formulario de edición con los datos actuales
        document.getElementById('editMatricula').value = trabajadorActual.matricula;
        document.getElementById('editNombre').value = trabajadorActual.nombre;
        document.getElementById('editDepartamento').value = trabajadorActual.departamento;
        document.getElementById('editTelefono').value = trabajadorActual.telefono;
        document.getElementById('editCorreo').value = trabajadorActual.correo;
        
        // Mostrar modal de editar
        const editModal = new bootstrap.Modal(document.getElementById('editarModal'));
        editModal.show();
      }, 300);
    }

    function confirmarEliminacion(nombreTrabajador) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Deseas dar de baja al trabajador ${nombreTrabajador}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, dar de baja',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            '¡Eliminado!',
            'El trabajador ha sido dado de baja correctamente.',
            'success'
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelado',
            'No se dio de baja al trabajador.',
            'info'
          );
        }
      });
    }

    // Función para filtrar tabla
    function filtrarTabla() {
      const texto = buscador.value.toLowerCase();
      const departamentoSeleccionado = filtroDepartamento.value.toLowerCase();

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

    // Función para limpiar búsqueda
    function limpiarBusquedaCompleta() {
      buscador.value = '';
      filtroDepartamento.value = '';
      filtrarTabla();
      buscador.focus();
      
      // Mostrar notificación
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
      });
      
      Toast.fire({
        icon: 'info',
        title: 'Búsqueda limpiada'
      });
    }

    function darDeBajaTrabajador(boton) {
      const fila = boton.closest('tr');
      const nombre = fila.dataset.nombre;

      Swal.fire({
        title: `¿Dar de baja a ${nombre}?`,
        text: "Este trabajador ya no estará activo en el sistema.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, dar de baja',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          // Aquí deberías llamar a tu backend o hacer una solicitud para actualizar en la base de datos
          // Por ahora, simulamos cambiando visualmente el estado:
          const estado = fila.querySelector('.badge');
          if (estado) {
            estado.classList.remove('bg-success');
            estado.classList.add('bg-secondary');
            estado.innerHTML = '<i class="bi bi-x-circle me-1"></i>Inactivo';
          }

          // También podrías marcar la fila de otra forma o deshabilitar botones

          Swal.fire('Actualizado', `${nombre} fue dado de baja.`, 'success');
        }
      });
    }


    // Event listeners cuando el DOM esté cargado
    document.addEventListener("DOMContentLoaded", function () {
      // Inicializar variables después de que el DOM esté cargado
      buscador = document.getElementById("buscador");
      filtroDepartamento = document.getElementById("filtroDepartamento");
      limpiarBusqueda = document.getElementById("limpiarBusqueda");
      filas = document.querySelectorAll("tbody tr");

      // Event listeners para búsqueda y filtros
      if (buscador) {
        buscador.addEventListener("input", filtrarTabla);
      }
      
      if (filtroDepartamento) {
        filtroDepartamento.addEventListener("change", filtrarTabla);
      }

      // Event listener para limpiar búsqueda
      if (limpiarBusqueda) {
        limpiarBusqueda.addEventListener("click", limpiarBusquedaCompleta);
      }

      // Event listener para el botón de guardar edición
      const botonGuardar = document.getElementById("btnGuardarEdicion");
      const modalElement = document.getElementById("editarModal");

      if (botonGuardar && modalElement) {
        botonGuardar.addEventListener("click", function (e) {
          e.preventDefault();

          // Validar campos requeridos
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

          // Cerrar modal
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal.hide();

          // Mostrar confirmación
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