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
  let cursosList = [];

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
    if (input.id === 'edadDoc') {
      const edad = parseInt(input.value, 10);
      if (isNaN(edad) || edad < 0) {
        mostrarError(input, 'Edad inválida');
        return false;
      }
    }
    return true;
  }

  function validarFormulario() {
    limpiarErrores();
    let valido = true;
    formDocente.querySelectorAll('input').forEach(input => {
      if (!validarCampo(input)) valido = false;
    });
    return valido;
  }

  async function fetchCursos() {
    try {
      const response = await fetch('/api/cursos');
      if (!response.ok) throw new Error('Error al cargar cursos');
      const data = await response.json();
      cursosList = data;
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
      option.textContent = curso.nombre;
      cursosSelect.appendChild(option);
    });
  }

  function getCursoNombresByIds(ids) {
    if (!ids || !Array.isArray(ids)) return '';
    const nombres = cursosList
      .filter(curso => ids.includes(curso._id))
      .map(curso => curso.nombre);
    return nombres.join(', ');
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
    fila.dataset.telefono = docente.Telefono || '';
    fila.innerHTML = `
      <td>${docente.Nombre}</td>
      <td>${docente.Apellido || ''}</td>
      <td>${docente.correo}</td>
      <td>${docente.Edad || ''}</td>
      <td>${docente.Telefono || ''}</td>
      <td>${docente.GradoAcademico || ''}</td>
      <td>${getCursoNombresByIds(docente.cursosAsignados)}</td>
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
    const gradoAcademico = formDocente.gradoAcademico.value;
    const password = formDocente.passwordDoc.value;
    const cursosAsignados = Array.from(cursosSelect.selectedOptions).map(option => option.value);

    const docenteData = {
      Nombre: nombre,
      Apellido: apellido,
      correo: correo,
      Edad: edad,
      Telefono: telefono,
      GradoAcademico: gradoAcademico,
      password: password || undefined,
      cursosAsignados: cursosAsignados,
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
          editandoFila.cells[5].textContent = gradoAcademico;
          editandoFila.cells[6].textContent = getCursoNombresByIds(cursosAsignados);
        }
      } else {
        const result = await crearDocente(docenteData);
        agregarFila(result.docente || result);
      }
      cerrarModal();
    } catch (error) {
      // Error already handled
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
          // Error already handled
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
      formDocente.telefonoDoc.value = fila.dataset.telefono || '';
      formDocente.gradoAcademico.value = fila.cells[5].textContent;

      // Seleccionar cursos asignados en el select múltiple
      const cursosAsignados = JSON.parse(fila.dataset.cursosAsignados || '[]');
      Array.from(cursosSelect.options).forEach(option => {
        option.selected = cursosAsignados.includes(option.value);
      });

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
