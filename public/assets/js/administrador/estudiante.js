document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modalEstudianteContainer');
  const btnNuevoEstudiante = document.getElementById('createEstudianteBtn');
  const btnCerrarModal = document.getElementById('modalEstudianteCloseBtn');
  const btnCancelar = document.getElementById('cancelEstudianteBtn');
  const formEstudiante = document.getElementById('formEstudiante');
  const tablaCuerpo = document.querySelector('#studentsSectionTable tbody');
  const carreraSelect = document.getElementById('carreraEst');

  let editandoFila = null;
  let editandoEstudianteId = null;
  let carrerasList = [];

  function abrirModal() {
    modal.classList.remove('hidden');
    formEstudiante.reset();
    limpiarErrores();
    editandoFila = null;
    editandoEstudianteId = null;
    document.getElementById('modalEstudianteTitle').textContent = 'Nuevo Estudiante';
  }

  function cerrarModal() {
    modal.classList.add('hidden');
    formEstudiante.reset();
    limpiarErrores();
    editandoFila = null;
    editandoEstudianteId = null;
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
    formEstudiante.querySelectorAll('.error-message').forEach(e => e.textContent = '');
    formEstudiante.querySelectorAll('.input-error').forEach(i => i.classList.remove('input-error'));
  }

  function validarCampo(input) {
    limpiarError(input);
    if (!input.value.trim()) {
      mostrarError(input, 'Este campo es obligatorio');
      return false;
    }
    if (input.id === 'correoEst') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value.trim())) {
        mostrarError(input, 'Correo inválido');
        return false;
      }
    }
    if (input.id === 'edadEst') {
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
    formEstudiante.querySelectorAll('input[required]').forEach(input => {
      if (!validarCampo(input)) valido = false;
    });
    return valido;
  }

  async function fetchCarreras() {
    try {
      const response = await fetch('/api/carreras');
      if (!response.ok) throw new Error('Error al cargar carreras');
      const data = await response.json();
      carrerasList = data;
      populateCarreraSelect(data);
    } catch (error) {
      alert(error.message);
    }
  }

  function populateCarreraSelect(carreras) {
    carreraSelect.innerHTML = '<option value="">Seleccione una carrera</option>';
    carreras.forEach(carrera => {
      const option = document.createElement('option');
      option.value = carrera._id;
      option.textContent = carrera.nombre;
      carreraSelect.appendChild(option);
    });
  }

  async function crearEstudiante(data) {
    try {
      const response = await fetch('/api/estudiantes', {
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

  async function actualizarEstudiante(id, data) {
    try {
      const response = await fetch(`/api/estudiantes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar estudiante');
      }
      return await response.json();
    } catch (error) {
      alert(error.message);
      throw error;
    }
  }

  async function eliminarEstudiante(id) {
    try {
      const response = await fetch(`/api/estudiantes/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar estudiante');
      }
      return await response.json();
    } catch (error) {
      alert(error.message);
      throw error;
    }
  }

  async function cargarEstudiantes() {
    try {
      const response = await fetch('/api/estudiantes');
      if (!response.ok) throw new Error('Error al cargar estudiantes');
      const data = await response.json();
      data.forEach(estudiante => agregarFila(estudiante));
    } catch (error) {
      alert(error.message);
    }
  }

  function agregarFila(estudiante) {
    const fila = document.createElement('tr');
    fila.dataset.id = estudiante._id;
    fila.innerHTML = `
      <td>${estudiante.Nombre}</td>
      <td>${estudiante.Apellidos || ''}</td>
      <td>${estudiante.correo}</td>
      <td>${estudiante.Edad || ''}</td>
      <td>${estudiante.Direccion || ''}</td>
      <td>${estudiante.nombreCarrera || ''}</td>
      <td>
        <button class="btn-editar">Editar</button>
        <button class="btn-borrar">Borrar</button>
      </td>
    `;
    tablaCuerpo.appendChild(fila);
  }

  formEstudiante.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validarFormulario()) return;

    const nombre = formEstudiante.nombreEst.value;
    const apellido = formEstudiante.apellidoEst.value;
    const correo = formEstudiante.correoEst.value;
    const edad = formEstudiante.edadEst.value;
    const direccion = formEstudiante.direccionEst.value;
    const password = formEstudiante.passwordEst.value;
    const carreraId = formEstudiante.carreraEst.value;

    const estudianteData = {
      Nombre: nombre,
      Apellidos: apellido,
      correo: correo,
      Edad: edad,
      Direccion: direccion,
      password: password,
      carreraId: carreraId || null
    };

    try {
      if (editandoEstudianteId) {
        const result = await actualizarEstudiante(editandoEstudianteId, estudianteData);
        if (editandoFila) {
          editandoFila.cells[0].textContent = nombre;
          editandoFila.cells[1].textContent = apellido;
          editandoFila.cells[2].textContent = correo;
          editandoFila.cells[3].textContent = edad;
          editandoFila.cells[4].textContent = direccion;
          editandoFila.cells[5].textContent = carreraId ? carrerasList.find(c => c._id === carreraId)?.nombre || '' : '';
        }
      } else {
        const result = await crearEstudiante(estudianteData);
        agregarFila(result.estudiante || result);
      }
      cerrarModal();
    } catch (error) {
      // Error ya manejado
    }
  });

  tablaCuerpo.addEventListener('click', async e => {
    if (e.target.classList.contains('btn-borrar')) {
      const fila = e.target.closest('tr');
      const estudianteId = fila.dataset.id;
      if (estudianteId) {
        try {
          await eliminarEstudiante(estudianteId);
          fila.remove();
        } catch (error) {
          // Error ya manejado
        }
      } else {
        fila.remove();
      }
    } else if (e.target.classList.contains('btn-editar')) {
      const fila = e.target.closest('tr');
      formEstudiante.nombreEst.value = fila.cells[0].textContent;
      formEstudiante.apellidoEst.value = fila.cells[1].textContent;
      formEstudiante.correoEst.value = fila.cells[2].textContent;
      formEstudiante.edadEst.value = fila.cells[3].textContent;
      formEstudiante.direccionEst.value = fila.cells[4].textContent;

      const nombreCarrera = fila.cells[5].textContent;
      const carrera = carrerasList.find(c => c.nombre === nombreCarrera);
      formEstudiante.carreraEst.value = carrera ? carrera._id : '';

      editandoFila = fila;
      editandoEstudianteId = fila.dataset.id || null;
      document.getElementById('modalEstudianteTitle').textContent = 'Editar Estudiante';
      modal.classList.remove('hidden');
    }
  });

  btnNuevoEstudiante.addEventListener('click', abrirModal);
  btnCerrarModal.addEventListener('click', cerrarModal);
  btnCancelar.addEventListener('click', cerrarModal);

  async function init() {
    await fetchCarreras();
    await cargarEstudiantes();
  }

  init();
});
