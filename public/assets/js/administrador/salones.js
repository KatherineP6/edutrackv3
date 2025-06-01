document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('modalContainer');
  const form = document.getElementById('formSalon');
  const createBtn = document.getElementById('createClassroomBtn');
  const cancelBtn = document.getElementById('CancelBtn');
  const closeBtn = document.getElementById('modalCloseBtn');
  const tableBody = document.querySelector('#classroomsSectionTable tbody');

  // Delete confirmation modal elements
  const deleteConfirmModal = document.getElementById('deleteConfirmModal');
  const deleteModalCloseBtn = document.getElementById('deleteModalCloseBtn');
  const deleteCancelBtn = document.getElementById('deleteCancelBtn');
  const deleteConfirmBtn = document.getElementById('deleteConfirmBtn');

  let salonIdToDelete = null;

  // Mostrar modal para crear nuevo salón
  createBtn.addEventListener('click', () => {
    form.reset();
    delete form.dataset.id; // Limpiar id de edición
    modal.classList.remove('hidden');
    document.getElementById('modalTitle').textContent = 'Nuevo Salón';
  });

  // Cerrar modal
  function closeModal() {
    modal.classList.add('hidden');
  }

  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  // Cargar datos de salones
  function loadClassrooms() {
    fetch('/api/salones')
      .then(response => response.json())
      .then(data => {
        tableBody.innerHTML = '';
        data.forEach(classroom => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${classroom.nombre}</td>
            <td>${classroom.ubicacion}</td>
            <td>${classroom.capacidad}</td>
              <td>${classroom.descripcion}</td>
            <td>
              <button class="btn-edit" data-id="${classroom._id}">✏️</button>
              <button class="btn-delete" data-id="${classroom._id}">🗑️</button>
            </td>
          `;
          tableBody.appendChild(row);
        });

        // Agregar eventos para editar y eliminar
        document.querySelectorAll('.btn-edit').forEach(btn => {
          btn.addEventListener('click', handleEdit);
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
          btn.addEventListener('click', handleDelete);
        });
      })
      .catch(error => console.error('Error:', error));
  }

  // Manejar envío del formulario
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const isEdit = form.dataset.id !== undefined;
    
    const url = isEdit ? `/api/salones/${form.dataset.id}` : '/api/salones';
    const method = isEdit ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(() => {
        closeModal();
        loadClassrooms();
      })
      .catch(error => console.error('Error:', error));
  });

  // Manejar edición
  function handleEdit(e) {
    const id = e.target.dataset.id;
    
    fetch(`/api/salones/${id}`)
      .then(response => response.json())
      .then(classroom => {
        document.getElementById('nombre').value = classroom.nombre;
        document.getElementById('ubicacion').value = classroom.ubicacion;
        document.getElementById('capacidad').value = classroom.capacidad;
        document.getElementById('descripcion').value = classroom.descripcion;
        form.dataset.id = classroom._id;
        
        modal.classList.remove('hidden');
        document.getElementById('modalTitle').textContent = 'Editar Salón';
      })
      .catch(error => console.error('Error:', error));
  }

  // Manejar eliminación con modal de confirmación
  function handleDelete(e) {
    salonIdToDelete = e.target.dataset.id;
    deleteConfirmModal.classList.remove('hidden');
  }

  // Cerrar modal de confirmación de eliminación
  function closeDeleteModal() {
    deleteConfirmModal.classList.add('hidden');
    salonIdToDelete = null;
  }

  deleteModalCloseBtn.addEventListener('click', closeDeleteModal);
  deleteCancelBtn.addEventListener('click', closeDeleteModal);

  // Confirmar eliminación
  deleteConfirmBtn.addEventListener('click', () => {
    if (!salonIdToDelete) return;

    fetch(`/api/salones/${salonIdToDelete}`, {
      method: 'DELETE'
    })
      .then(() => {
        closeDeleteModal();
        loadClassrooms();
      })
      .catch(error => {
        console.error('Error:', error);
        closeDeleteModal();
      });
  });

  // Cargar datos iniciales
  loadClassrooms();
});
