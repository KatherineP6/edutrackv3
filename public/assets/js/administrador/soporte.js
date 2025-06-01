document.addEventListener('DOMContentLoaded', () => {
  const soporteTableBody = document.querySelector('#soporteSectionTable tbody');
  const createBtn = document.getElementById('createSoporteBtn');
  const modal = document.getElementById('modalSoporteContainer');
  const modalTitle = document.getElementById('modalSoporteTitle');
  const closeModalBtn = document.getElementById('modalSoporteCloseBtn');
  const cancelBtn = document.getElementById('cancelSoporteBtn');
  const form = document.getElementById('formSoporte');
  const deleteModal = document.getElementById('deleteSoporteModal');
  const deleteCloseBtn = document.getElementById('deleteSoporteCloseBtn');
  const cancelDeleteBtn = document.getElementById('cancelDeleteSoporteBtn');
  const confirmDeleteBtn = document.getElementById('confirmDeleteSoporteBtn');

  let editingId = null;
  let deletingId = null;

  async function loadSoportes() {
    try {
      const response = await fetch('/api/soportes');
      if (!response.ok) throw new Error('Error al cargar agentes de soporte');
      const soportes = await response.json();

      soporteTableBody.innerHTML = '';
      soportes.forEach(soporte => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${soporte.nombre || ''}</td>
          <td>${soporte.apellido || ''}</td>
          <td>${soporte.correo}</td>
          <td>${soporte.telefono || ''}</td>
          <td>${soporte.direccion || ''}</td>
          <td>${soporte.estado === 1 ? 'Activo' : 'Inactivo'}</td>
          <td>
            <button class="btn-edit" data-id="${soporte._id}">Editar</button>
            <button class="btn-delete" data-id="${soporte._id}">Eliminar</button>
          </td>
        `;
        soporteTableBody.appendChild(row);
      });

      attachEventListeners();
    } catch (error) {
      console.error(error);
      alert('Error al cargar los agentes de soporte.');
    }
  }

  function attachEventListeners() {
    document.querySelectorAll('.btn-edit').forEach(button => {
      button.addEventListener('click', async (e) => {
        editingId = e.target.dataset.id;
        try {
          const response = await fetch(`/api/soportes/${editingId}`);
          if (!response.ok) throw new Error('Error al obtener datos del agente');
          const soporte = await response.json();

          modalTitle.textContent = 'Editar Agente de Soporte';
          form.nombreSoporte.value = soporte.nombre || '';
          form.apellidoSoporte.value = soporte.apellido || '';
          form.correoSoporte.value = soporte.correo || '';
          form.passwordSoporte.value = '';
          form.telefonoSoporte.value = soporte.telefono || '';
          form.direccionSoporte.value = soporte.direccion || '';
          form.estadoSoporte.checked = soporte.estado === 1;

          openModal();
        } catch (error) {
          console.error(error);
          alert('Error al cargar datos del agente.');
        }
      });
    });

    document.querySelectorAll('.btn-delete').forEach(button => {
      button.addEventListener('click', (e) => {
        deletingId = e.target.dataset.id;
        openDeleteModal();
      });
    });
  }

  function openModal() {
    modal.classList.remove('hidden');
  }
  function closeModal() {
    modal.classList.add('hidden');
    form.reset();
    editingId = null;
  }
  function openDeleteModal() {
    deleteModal.classList.remove('hidden');
  }
  function closeDeleteModal() {
    deleteModal.classList.add('hidden');
    deletingId = null;
  }

  closeModalBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  deleteCloseBtn.addEventListener('click', closeDeleteModal);
  cancelDeleteBtn.addEventListener('click', closeDeleteModal);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      nombre: form.nombreSoporte.value.trim(),
      apellido: form.apellidoSoporte.value.trim(),
      correo: form.correoSoporte.value.trim(),
      password: form.passwordSoporte.value,
      telefono: form.telefonoSoporte.value.trim(),
      direccion: form.direccionSoporte.value.trim(),
      estado: form.estadoSoporte.checked ? 1 : 0
    };

    try {
      let response;
      if (editingId) {
        response = await fetch(`/api/soportes/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      } else {
        response = await fetch('/api/soportes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      }

      if (!response.ok) throw new Error('Error al guardar agente de soporte');

      alert(editingId ? 'Agente actualizado correctamente' : 'Agente creado correctamente');
      closeModal();
      loadSoportes();
    } catch (error) {
      console.error(error);
      alert('Error al guardar agente de soporte.');
    }
  });

  confirmDeleteBtn.addEventListener('click', async () => {
    if (!deletingId) return;
    try {
      const response = await fetch(`/api/soportes/${deletingId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar agente de soporte');
      alert('Agente eliminado correctamente');
      closeDeleteModal();
      loadSoportes();
    } catch (error) {
      console.error(error);
      alert('Error al eliminar agente de soporte.');
    }
  });

  loadSoportes();

  createBtn.addEventListener('click', () => {
    editingId = null;
    modalTitle.textContent = 'Nuevo Agente de Soporte';
    form.reset();
    openModal();
  });
});
