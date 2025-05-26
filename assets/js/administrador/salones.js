document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('modalContainer');
  const form = document.getElementById('formSalon');
  const createBtn = document.getElementById('createClassroomBtn');
  const cancelBtn = document.getElementById('CancelBtn');
  const closeBtn = document.getElementById('modalCloseBtn');
  const tableBody = document.querySelector('#classroomsSectionTable tbody');

  // Mostrar modal para crear nuevo salón
  createBtn.addEventListener('click', () => {
    form.reset();
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
            <td>${classroom.bloque}</td>
            <td>${classroom.ubicacion}</td>
            <td>${classroom.capacidad}</td>
            <td>
              <button class="btn-edit" data-id="${classroom.id}">✏️</button>
              <button class="btn-delete" data-id="${classroom.id}">🗑️</button>
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
    const isEdit = form.dataset.id;
    
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
        document.getElementById('bloque').value = classroom.bloque;
        document.getElementById('ubicacion').value = classroom.ubicacion;
        document.getElementById('capacidad').value = classroom.capacidad;
        form.dataset.id = classroom.id;
        
        modal.classList.remove('hidden');
        document.getElementById('modalTitle').textContent = 'Editar Salón';
      })
      .catch(error => console.error('Error:', error));
  }

  // Manejar eliminación
  function handleDelete(e) {
    if (confirm('¿Estás seguro de eliminar este salón?')) {
      const id = e.target.dataset.id;
      
      fetch(`/api/salones/${id}`, {
        method: 'DELETE'
      })
        .then(() => {
          loadClassrooms();
        })
        .catch(error => console.error('Error:', error));
    }
  }

  // Cargar datos iniciales
  loadClassrooms();
});