document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modalDocenteContainer');
  const btnNuevoDocente = document.getElementById('createDocenteBtn');
  const btnCerrarModal = document.getElementById('modalDocenteCloseBtn');
  const btnCancelar = document.getElementById('cancelDocenteBtn');
  const formDocente = document.getElementById('formDocente');
  const tablaCuerpo = document.querySelector('#teachersSectionTable tbody');
  const cursosSelect = document.getElementById('cursosAsignados');

  let editandoFila = null;
  let editandoDocenteId = null;

  function abrirModal() {
    modal.classList.remove('hidden');
    formDocente.reset();
    limpiarErrores();
    editandoFila = null;
    editandoDocenteId = null;
    document.getElementById('modalDocenteTitle').textContent = 'Nuevo Docente';
  }

  function cerrarModal() {
    modal.classList.add('hidden');
    formDocente.reset();
    limpiarErrores();
    editandoFila = null;
    editandoDocenteId = null;
  }

  function mostrarError(input, mensaje) {
    let errorElem = input.parentElement.querySelector('.error-message');
    if (!errorElem) {
      errorElem = document.createElement('small');
      errorElem.className = 'error-message';
      errorElem.style.color = 'red';
      input.parentElement.appendChild(errorElem);
    }
    errorElem.textContent = mensaje;
    input.classList.add('input-error');
  }

  function limpiarError(input) {
    const errorElem = input.parentElement.querySelector('.error-message');
    if (errorElem) errorElem.textContent = '';
    input.classList.remove('input-error');
  }

  function limpiarErrores() {
    formDocente.querySelectorAll('.error-message').forEach(e => e.textContent = '');
    formDocente.querySelectorAll('.input-error').forEach(i => i.classList.remove('input-error'));
  }

  function validarCampo(input) {
    limpiarError(input);
    if (!input.value.trim()) {
      mostrarError(input, 'Este campo es obligatorio');
      return false;
    }
    if (input.id === 'correoDoc') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value.trim())) {
        mostrarError(input, 'Correo inválido');
        return false;
      }
    }
    return true;
  }

  function validarFormulario() {
    limpiarErrores();
    let valido = true;
    formDocente.querySelectorAll('input[required]').forEach(input => {
      if (!validarCampo(input)) valido = false;
    });
    return valido;
  }

  async function fetchCursos() {
    try {
      const response = await fetch('/api/cursos');
      if (!response.ok) throw new Error('Error al cargar cursos');
      const data = await response.json();
      populateCursosSelect(data);
    } catch (error) {
      alert(error.message);
    }
  }

  function populateCursosSelect(cursos) {
    cursosSelect.innerHTML = '';
    cursos.forEach(curso => {
      const option = document.createElement('option');
      option.value = curso._id;
      option.textContent = curso.Nombre || curso.nombre || 'Curso';
      cursosSelect.appendChild(option);
    });
  }

  async function crearDocente(data) {
    try {
      const response = await fetch('/api/docentes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      return await response.json();
    } catch (error) {
      alert(error.message);
      throw error;
    }
  }

  async function actualizarDocente(id, data) {
    try {
      const response = await fetch(`/api/docentes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar docente');
      }
      return await response.json();
    } catch (error) {
      alert(error.message);
      throw error;
    }
  }

  async function eliminarDocente(id) {
    try {
      const response = await fetch(`/api/docentes/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar docente');
      }
      return await response.json();
    } catch (error) {
      alert(error.message);
      throw error;
    }
  }

  async function cargarDocentes() {
    try {
      const response = await fetch('/api/docentes');
      if (!response.ok) throw new Error('Error al cargar docentes');
      const data = await response.json();
      data.forEach(docente => agregarFila(docente));
    } catch (error) {
      alert(error.message);
    }
  }

  function agregarFila(docente) {
    const fila = document.createElement('tr');
    fila.dataset.id = docente._id;
    fila.dataset.cursosAsignados = JSON.stringify(docente.cursosAsignados || []);
    fila.innerHTML = `
      <td>${docente.nombre}</td>
      <td>${docente.apellido || ''}</td>
      <td>${docente.correo}</td>
      <td>${docente.edad || ''}</td>
      <td>${docente.telefono || ''}</td>
      <td>${docente.estado || ''}</td>
      <td>${docente.gradoAcademico || ''}</td>
      <td>
        <button class="btn-editar">Editar</button>
        <button class="btn-borrar">Borrar</button>
      </td>
    `;
    tablaCuerpo.appendChild(fila);
  }

  formDocente.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validarFormulario()) return;

    const nombre = formDocente.nombreDoc.value;
    const apellido = formDocente.apellidoDoc.value;
    const correo = formDocente.correoDoc.value;
    const edad = formDocente.edadDoc.value;
    const telefono = formDocente.telefonoDoc.value;
    const estado = formDocente.estadoDoc.value;
    const gradoAcademico = formDocente.gradoAcademicoDoc.value;
    const password = formDocente.passwordDoc.value;

    // Obtener cursos seleccionados
    const selectedOptions = Array.from(cursosSelect.selectedOptions);
    const cursosAsignados = selectedOptions.map(option => option.value);

    const docenteData = {
      nombre: nombre,
      apellido: apellido,
      correo: correo,
      edad: edad,
      telefono: telefono,
      estado: estado,
      gradoAcademico: gradoAcademico,
      password: password,
      cursosAsignados: cursosAsignados
    };

    try {
      if (editandoDocenteId) {
        const result = await actualizarDocente(editandoDocenteId, docenteData);
        if (editandoFila) {
          editandoFila.cells[0].textContent = nombre;
          editandoFila.cells[1].textContent = apellido;
          editandoFila.cells[2].textContent = correo;
          editandoFila.cells[3].textContent = edad;
          editandoFila.cells[4].textContent = telefono;
          editandoFila.cells[5].textContent = estado;
          editandoFila.cells[6].textContent = gradoAcademico;
        }
      } else {
        const result = await crearDocente(docenteData);
        agregarFila(result.docente || result);
      }
      cerrarModal();
    } catch (error) {
      // Error ya manejado
    }
  });

  tablaCuerpo.addEventListener('click', async e => {
    if (e.target.classList.contains('btn-borrar')) {
      const fila = e.target.closest('tr');
      const docenteId = fila.dataset.id;
      if (docenteId) {
        try {
          await eliminarDocente(docenteId);
          fila.remove();
        } catch (error) {
          // Error ya manejado
        }
      } else {
        fila.remove();
      }
    } else if (e.target.classList.contains('btn-editar')) {
      const fila = e.target.closest('tr');
      formDocente.nombreDoc.value = fila.cells[0].textContent;
      formDocente.apellidoDoc.value = fila.cells[1].textContent;
      formDocente.correoDoc.value = fila.cells[2].textContent;
      formDocente.edadDoc.value = fila.cells[3].textContent;
      formDocente.telefonoDoc.value = fila.cells[4].textContent;
      formDocente.estadoDoc.value = fila.cells[5].textContent;
      formDocente.gradoAcademicoDoc.value = fila.cells[6].textContent;

      // Cargar cursos asignados en el select múltiple
      const cursosAsignados = JSON.parse(fila.dataset.cursosAsignados || '[]');
      for (const option of cursosSelect.options) {
        option.selected = cursosAsignados.includes(option.value);
      }

      editandoFila = fila;
      editandoDocenteId = fila.dataset.id || null;
      document.getElementById('modalDocenteTitle').textContent = 'Editar Docente';
      modal.classList.remove('hidden');
    }
  });

  btnNuevoDocente.addEventListener('click', abrirModal);
  btnCerrarModal.addEventListener('click', cerrarModal);
  btnCancelar.addEventListener('click', cerrarModal);

  async function init() {
    await fetchCursos();
    await cargarDocentes();
  }

  init();
});
