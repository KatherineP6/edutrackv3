document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('modalContainer');
  const form = document.getElementById('formBloque');
  const createBtn = document.getElementById('createBloqueBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const closeBtn = document.getElementById('modalCloseBtn');
  const tableBody = document.querySelector('#bloquesTable tbody');

  // Delete confirmation modal elements
  const deleteConfirmModal = document.getElementById('deleteConfirmModal');
  const deleteModalCloseBtn = document.getElementById('deleteModalCloseBtn');
  const deleteCancelBtn = document.getElementById('deleteCancelBtn');
  const deleteConfirmBtn = document.getElementById('deleteConfirmBtn');

  let bloqueIdToDelete = null;
  var carrerasLista = [];
  var cursosLista = [];
  var docentesLista = [];
  var salonesLista = [];
  // Load options for curso, docente, salon selects
  async function loadSelectOptions() {
    carrerasLista = [];
    cursosLista = [];
    docentesLista = [];
    salonesLista = [];
    try {
      const [cursosRes, docentesRes, salonesRes, carrerasRes] = await Promise.all([
        fetch('/api/cursos'),
        fetch('/api/docentes'),
        fetch('/api/salones'),
        fetch('/api/carreras'),
      ]);
      var cursos = await cursosRes.json();
      var docentes = await docentesRes.json();
      var salones = await salonesRes.json();
      var carreras = await carrerasRes.json();

      carrerasLista = carreras;
      cursosLista = cursos;
      docentesLista = docentes;
      salonesLista = salones;

      const carreraSelect = document.getElementById('carrera');
      const cursoSelect = document.getElementById('curso');
      const docenteSelect = document.getElementById('docente');
      const salonSelect = document.getElementById('salon');

      carreraSelect.innerHTML = '<option value="" disabled selected>Seleccione una carrera</option>';
      carreras.forEach(carrera => {
        const option = document.createElement('option');
        option.value = carrera._id;
        option.textContent = carrera.nombre;
        carreraSelect.appendChild(option);
      });


      cursoSelect.innerHTML = '<option value="" disabled selected>Selecciona un curso</option>';
      cursoSelect.disabled = true;
      /*cursos.forEach(curso => {
        const option = document.createElement('option');
        option.value = curso._id;
        option.textContent = curso.nombre;
        cursoSelect.appendChild(option);
      });*/

      // Initially disable docente select until curso is selected
      docenteSelect.innerHTML = '<option value="" disabled selected>Selecciona un docente</option>';
      docenteSelect.disabled = true;

      salonSelect.innerHTML = '<option value="" disabled selected>Selecciona un salón</option>';
      salones.forEach(salon => {
        const option = document.createElement('option');
        option.value = salon._id;
        option.textContent = salon.nombre;
        salonSelect.appendChild(option);
      });

      // Add event listener to curso select to load docentes filtered by Carrera
       carreraSelect.addEventListener('change', async () => {
        const selectedCarreraId = carreraSelect.value;
        if (!selectedCarreraId) {
          cursoSelect.innerHTML = '<option value="" disabled selected>Seleccione un curso</option>';
          cursoSelect.disabled = true;
          return;
        }
        try {
          const response = await fetch(`/api/cursos?carrera=${selectedCarreraId}`);
          if (!response.ok) throw new Error('Error fetching curso');
          const filteredCurso = await response.json();
          cursoSelect.innerHTML = '<option value="" disabled selected>Seleccione un curso</option>';
          filteredCurso.forEach(curso => {
            const option = document.createElement('option');
            option.value = curso._id;
            option.textContent = curso.nombre;
            cursoSelect.appendChild(option);
          });
          cursoSelect.disabled = false;
        } catch (error) {
          console.error('Error loading docentes filtered by curso:', error);
          cursoSelect.innerHTML = '<option value="" disabled selected>Selecciona un curso</option>';
          cursoSelect.disabled = true;
        }
      });


      // Add event listener to curso select to load docentes filtered by curso
      cursoSelect.addEventListener('change', async () => {
        const selectedCursoId = cursoSelect.value;
        if (!selectedCursoId) {
          docenteSelect.innerHTML = '<option value="" disabled selected>Selecciona un docente</option>';
          docenteSelect.disabled = true;
          return;
        }
        try {
          const response = await fetch(`/api/docentes?curso=${selectedCursoId}`);
          if (!response.ok) throw new Error('Error fetching docentes');
          const filteredDocentes = await response.json();
          docenteSelect.innerHTML = '<option value="" disabled selected>Selecciona un docente</option>';
          filteredDocentes.forEach(docente => {
            const option = document.createElement('option');
            option.value = docente._id;
            option.textContent = docente.nombre;
            docenteSelect.appendChild(option);
          });
          docenteSelect.disabled = false;
        } catch (error) {
          console.error('Error loading docentes filtered by curso:', error);
          docenteSelect.innerHTML = '<option value="" disabled selected>Selecciona un docente</option>';
          docenteSelect.disabled = true;
        }
      });
    } catch (error) {
      console.error('Error loading select options:', error);
    }
  }

  // Show modal for creating new bloque
  createBtn.addEventListener('click', () => {
    form.reset();
    delete form.dataset.id; // Clear edit id
    modal.classList.remove('hidden');
    document.getElementById('modalTitle').textContent = 'Nuevo Bloque';
  });

  // Close modal
  function closeModal() {
    modal.classList.add('hidden');
  }

  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  // Load bloques data
  async function loadBloques() {
    try {
      const response = await fetch('/api/bloques');
      const data = await response.json();
      console.log('Bloques data:', data);
      tableBody.innerHTML = '';
      if (!Array.isArray(data)) {
        console.error('Error: data no es un array:', data);
        return;
      }
      data.forEach(bloque => {
        const row = document.createElement('tr');
        const fechaInicioStr = bloque.fechaInicio ? new Date(bloque.fechaInicio).toLocaleDateString() : '';
        const fechaFinStr = bloque.fechaFin ? new Date(bloque.fechaFin).toLocaleDateString() : '';
        const diasSemanaStr = bloque.diasSemana ? bloque.diasSemana.join(', ') : '';
        
        var nombrecarrera = "";
        carrerasLista.forEach(carrera => {
          if(carrera._id == bloque.carrera){nombrecarrera = carrera.nombre ;}
        });

        const cursoNombre = bloque.curso && typeof bloque.curso === 'object' ? bloque.curso.nombre : '';
        var nombredocente = "";
        docentesLista.forEach(docente => {
          if(docente._id == bloque.docente){nombredocente = docente.Nombre + " "+ docente.Apellido;}
        });

        var nombresalon = "";
        salonesLista.forEach(salon => {
          if(salon._id == bloque.salon){nombresalon = salon.nombre ;}
        });
        //const docenteNombre = bloque.docente && typeof bloque.docente === 'object' ? bloque.docente.nombre : '';
        //const salonNombre = bloque.salon && typeof bloque.salon === 'object' ? bloque.salon.nombre : '';
        row.innerHTML = `
          <td>${bloque.nombre || ''}</td>
          <td>${fechaInicioStr}</td>
          <td>${fechaFinStr}</td>
          <td>${diasSemanaStr}</td>
          <td>${bloque.horaInicio}</td>
          <td>${bloque.horaFin}</td>
          <td>${nombrecarrera}</td>
          <td>${cursoNombre}</td>
          <td>${nombredocente}</td>
          <td>${nombresalon}</td>
          <td>${bloque.estado === 1 ? 'Activo' : 'Inactivo'}</td>
          <td>
            <button id="btnEditar" class="btn-edit" data-id="${bloque._id}">✏️ </button>
            <button id="btnEliminar" class="btn-delete" data-id="${bloque._id}">🗑️ </button>
          </td>
        `;
        tableBody.appendChild(row);
      });

      // Add event listeners for edit and delete buttons
      document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', handleEdit);
      });
      document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', handleDelete);
      });
    } catch (error) {
      console.error('Error loading bloques:', error);
    }
  }

  // Handle form submit for create or update
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data.estado = form.estado.checked ? 1 : 0;

    // Handle multiple select for diasSemana
    const diasSemanaSelect = document.getElementById('diasSemana');
    const selectedDias = Array.from(diasSemanaSelect.selectedOptions).map(option => option.value);
    data.diasSemana = selectedDias;

    const isEdit = form.dataset.id !== undefined;
    const url = isEdit ? `/api/bloques/${form.dataset.id}` : '/api/bloques';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Error en la solicitud');
      closeModal();
      loadBloques();
    } catch (error) {
      console.error('Error saving bloque:', error);
    }
  });

  // Handle edit button click
  async function handleEdit(e) {
    const id = e.target.dataset.id;
    try {
      const response = await fetch(`/api/bloques/${id}`);
      if (!response.ok) throw new Error('Bloque no encontrado');
      const bloque = await response.json();

      // Set form fields correctly
      form.fechaInicio.value = bloque.fechaInicio ? bloque.fechaInicio.split('T')[0] : '';
      form.fechaFin.value = bloque.fechaFin ? bloque.fechaFin.split('T')[0] : '';
      form.horaInicio.value = bloque.horaInicio || '';
      form.horaFin.value = bloque.horaFin || '';
      form.carrera.value = bloque.carrera ? bloque.carrera._id : '';
      form.curso.value = bloque.curso ? bloque.curso._id : '';
      form.docente.value = bloque.docente ? bloque.docente._id : '';
      form.salon.value = bloque.salon ? bloque.salon._id : '';
      form.estado.checked = bloque.estado === 1;

      // Set diasSemana multi-select
      const diasSemanaSelect = document.getElementById('diasSemana');
      if (diasSemanaSelect && bloque.diasSemana) {
        Array.from(diasSemanaSelect.options).forEach(option => {
          option.selected = bloque.diasSemana.includes(option.value);
        });
      }

      form.dataset.id = bloque._id;
      modal.classList.remove('hidden');
      document.getElementById('modalTitle').textContent = 'Editar Bloque';
    } catch (error) {
      console.error('Error loading bloque for edit:', error);
    }
  }

  // Handle delete button click
  function handleDelete(e) {
    bloqueIdToDelete = e.target.dataset.id;
    deleteConfirmModal.classList.remove('hidden');
  }

  // Close delete modal
  function closeDeleteModal() {
    deleteConfirmModal.classList.add('hidden');
    bloqueIdToDelete = null;
  }

  deleteModalCloseBtn.addEventListener('click', closeDeleteModal);
  deleteCancelBtn.addEventListener('click', closeDeleteModal);

  // Confirm delete
  deleteConfirmBtn.addEventListener('click', async () => {
    if (!bloqueIdToDelete) return;
    try {
      const response = await fetch(`/api/bloques/${bloqueIdToDelete}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error eliminando bloque');
      closeDeleteModal();
      loadBloques();
    } catch (error) {
      console.error('Error deleting bloque:', error);
      closeDeleteModal();
    }
  });

  // Initial load
  loadSelectOptions().then(loadBloques);
});
