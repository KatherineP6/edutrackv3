document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modalContainer');
  const btnNuevoCurso = document.getElementById('createCursoBtn');
  const btnCerrarModal = document.getElementById('modalCloseBtn');
  const btnCancelar = document.getElementById('CancelBtn');
  const formCurso = document.getElementById('formCurso');
  const tablaCuerpo = document.querySelector('#cursosSectionTable tbody');
  const tipoSelect = document.getElementById('tipo');
  const carreraGroup = document.getElementById('carreraGroup');
  const carreraSelect = document.getElementById('carrera');

    const deleteModal = document.getElementById('deleteConfirmModal');
  const btnCerrarDeleteModal = document.getElementById('deleteModalCloseBtn');
  const btnCancelarDelete = document.getElementById('deleteCancelBtn');
  const btnConfirmarDelete = document.getElementById('deleteConfirmBtn');

  const deleteConfirmModal = document.getElementById('deleteConfirmModal');

  let editandoFila = null;
  let editandoCursoId = null;
  let carrerasList = [];
  
  let cursoEditandoId = null;
  let cursoEliminandoId = null;

  function abrirModal() {
    modal.classList.remove('hidden');
    formCurso.reset();
    limpiarErrores();
    editandoFila = null;
    editandoCursoId = null;
    document.getElementById('modalTitle').textContent = 'Nuevo Curso';
  }
  

  function cerrarModal() {
    modal.classList.add('hidden');
    formCurso.reset();
    limpiarErrores();
    editandoFila = null;
    editandoCursoId = null;
  }

  
  function abrirDeleteModal() {
    deleteModal.classList.remove('hidden');
  }

  function cerrarDeleteModal() {
    deleteModal.classList.add('hidden');
    cursoEliminandoId = null;
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
    formCurso.querySelectorAll('.error-message').forEach(e => e.textContent = '');
    formCurso.querySelectorAll('.input-error').forEach(i => i.classList.remove('input-error'));
  }



  function validarFormulario() {
    limpiarErrores();
    let valido = true;
    formCurso.querySelectorAll('input, select, textarea').forEach(input => {
      // descripcion not required if tipo is taller
      if (input.id === 'descripcion' && tipoSelect.value === 'tipo') {
        limpiarError(input);
        return true;
      }
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

  function getCarreraNombreById(id) {
    const carrera = carrerasList.find(c => String(c._id) === String(id));
    return carrera ? carrera.nombre : '';
  }

  async function crearCurso(data) {
    try {
      const response = await fetch('/api/cursos', {
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

  async function actualizarCurso(id, data) {
    try {
      const response = await fetch(`/api/cursos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar curso');
      }
      return await response.json();
    } catch (error) {
      alert(error.message);
      throw error;
    }
  }

  async function eliminarCurso(id) {
    try {
      const response = await fetch(`/api/cursos/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar curso');
      }
      return await response.json();
    } catch (error) {
      alert(error.message);
      throw error;
    }
  }

  async function cargarCursos() {
    try {
      const response = await fetch('/api/cursos');
      if (!response.ok) throw new Error('Error al cargar cursos');
      const data = await response.json();
      tablaCuerpo.innerHTML = '';
      data.forEach(curso => agregarFila(curso));
    } catch (error) {
      alert(error.message);
    }
  }

  async function init() {
    await fetchCarreras();
    await cargarCursos();
  }

  function handleDelete(e) {
    bloqueIdToDelete = e.target.dataset.id;
    deleteConfirmModal.classList.remove('hidden');
  }
 

  function agregarFila(curso) {
    const fila = document.createElement('tr');
    fila.dataset.id = curso._id;
    fila.innerHTML = `
      <td>${curso.nombre}</td>
      <td>${curso.descripcion || ''}</td>
      <td>${curso.tipo}</td>
      <td>${curso.precio.toFixed(2)}</td>
      <td>${curso.carrera ? getCarreraNombreById(curso.carrera) : ''}</td>
      <td>${curso.semestre || ''}</td>
      <td>
        
        <button class="btn btn-sm btn-primary btn-editar" title="Editar" style="margin-right: 5px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16">
            <path d="M12.146.854a.5.5 0 0 1 .708 0l2.292 2.292a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 3L13 4.793 14.793 3 13 1.207 11.207 3zM12 5.207L10.793 4 3 11.793V13h1.207L12 5.207z"/>
          </svg>
        </button>
        <button class="btn btn-sm btn-danger btn-borrar" title="Eliminar">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </button>
      </td>
    `;

    fila.querySelector('.btn-editar').addEventListener('click', () => abrirModalEditar(curso));
    fila.querySelector('.btn-borrar').addEventListener('click', () => abrirModalEliminar(curso._id));
    tablaCuerpo.appendChild(fila);
  }


  formCurso.addEventListener('submit', async e => {
    e.preventDefault();
    //if (!validarFormulario()) return;

    const nombre = formCurso.nombre.value;
    const descripcion = formCurso.descripcion.value;
    const tipo = formCurso.tipo.value;
    const precio = parseFloat(formCurso.precio.value);
    const semestre = formCurso.semestre.value ? parseInt(formCurso.semestre.value, 10) : null;
    const carrera = formCurso.carrera.value ;

    const cursoData = {
      nombre,
      descripcion,
      tipo,
      precio,
      carrera,
      semestre,
    };

    try {
      if (editandoCursoId) {
        const result = await actualizarCurso(editandoCursoId, cursoData);
        if (editandoFila) {
          editandoFila.cells[0].textContent = nombre;
          editandoFila.cells[1].textContent = descripcion;
          editandoFila.cells[2].textContent = tipo;
          editandoFila.cells[3].textContent = precio.toFixed(2);
          editandoFila.cells[4].textContent = getCarreraNombreById(carrera);
          editandoFila.cells[5].textContent = semestre || '';
        }
      } else {
        const result = await crearCurso(cursoData);
        agregarFila(result.curso || result);
      }
      cerrarModal();
    } catch (error) {
      // Error already handled
    }
  });

    document.querySelectorAll('.btn-plus').forEach(btn => {
    btn.addEventListener('click', handleAdd);
  });

  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', handleEdit);
  });

  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', handleDelete);
  });
  
  // Manejar eventos de edición y eliminación
  tablaCuerpo.addEventListener('click', async e => {
    if (e.target.classList.contains('btn-borrar')) {
      const fila = e.target.closest('tr');
      const cursoId = fila.dataset.id;
      if (cursoId) {
        try {
          await eliminarCurso(cursoId);
          fila.remove();
        } catch (error) {
          // Error already handled
        }
      } else {
        fila.remove();
      }
    } else if (e.target.classList.contains('btn-editar')) {
      const fila = e.target.closest('tr');
      formCurso.nombre.value = fila.cells[0].textContent;
      formCurso.descripcion.value = fila.cells[1].textContent;
      formCurso.tipo.value = fila.cells[2].textContent;
      formCurso.precio.value = fila.cells[3].textContent;
      // To get carreraId from name, find in carrerasList
      const carreraNombre = fila.cells[4].textContent;
      const carreraObj = carrerasList.find(c => c.nombre === carreraNombre);
      formCurso.carrera.value = carreraObj ? carreraObj._id : '';
      formCurso.semestre.value = fila.cells[5].textContent;
      editandoFila = fila;
      editandoCursoId = fila.dataset.id || null;
      document.getElementById('modalTitle').textContent = 'Editar Curso';
      modal.classList.remove('hidden');
    }
  });

  // Add event listeners for modal open/close buttons
  btnNuevoCurso.addEventListener('click', abrirModal);
  btnCerrarModal.addEventListener('click', cerrarModal);
  btnCancelar.addEventListener('click', cerrarModal);

 function abrirModalEditar(curso) {
    editandoCursoId = curso._id;
    modalTitle.textContent = 'Editar Curso';
    formCurso.nombre.value = curso.nombre || '';
    formCurso.descripcion.value = curso.descripcion || '';
    formCurso.tipo.value = curso.tipo || '';
    formCurso.precio.value = curso.precio || '';
    formCurso.carrera.value = curso.carrera || '';
    formCurso.semestre.value = curso.semestre || '';
    /*
    // Limpiar selección previa
    for (let i = 0; i < selectCursos.options.length; i++) {
      selectCursos.options[i].selected = false;
    }
    // Seleccionar cursos asignados
    if (Array.isArray(docente.cursosAsignados)) {
     // docente.cursosAsignados.forEach(cursoId => {
      for (let j = 0; j < docente.cursosAsignados.length; j++) {
        for (let i = 0; i < selectCursos.options.length; i++) {
          // Convert both to string for safe comparison
          if (selectCursos.options[i].value.toString() === docente.cursosAsignados[j]._id.toString()) {
            selectCursos.options[i].selected = true;
            break;
          }
        }
      }//});
    }
*/

    modal.classList.remove('hidden');
  
  }

  function abrirModalEliminar(id) {
    cursoEliminandoId = id;
    abrirDeleteModal();
  }

  btnCerrarDeleteModal.addEventListener('click', cerrarDeleteModal);
  btnCancelarDelete.addEventListener('click', cerrarDeleteModal);

  btnConfirmarDelete.addEventListener('click', async () => {
    try {
      const response = await fetch(`/api/cursos/${cursoEliminandoId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Error al eliminar cursos');
      alert('Docente eliminado exitosamente');
      cerrarDeleteModal();
      cargarCursos();
    } catch (error) {
      alert(error.message);
    }
  });

  init();
});
