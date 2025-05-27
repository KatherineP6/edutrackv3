/*document.addEventListener('DOMContentLoaded', function () {
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebarClose = document.getElementById('sidebarClose');
  const overlay = document.getElementById('overlay');

  function openSidebar() {
    sidebar.classList.remove('closed');
    overlay.classList.remove('hidden');
  }

  function closeSidebar() {
    sidebar.classList.add('closed');
    overlay.classList.add('hidden');
  }

  function renderUserInfo() {
  const user = window.user || null;
    if (!user) return;

    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const headerUserAvatar = document.getElementById('headerUserAvatar');
    const headerUserName = document.getElementById('headerUserName');
    const headerUserEmail = document.getElementById('headerUserEmail');

    if (userAvatar) userAvatar.textContent = user.name ? user.name.charAt(0).toUpperCase() : 'U';
    if (userName) userName.textContent = user.name || 'Usuario';
    if (userEmail) userEmail.textContent = user.email || 'usuario@ejemplo.com';
    if (headerUserAvatar) headerUserAvatar.textContent = user.name ? user.name.charAt(0).toUpperCase() : 'U';
    if (headerUserName) headerUserName.textContent = user.name || 'Usuario';
    if (headerUserEmail) headerUserEmail.textContent = user.email || 'usuario@ejemplo.com';
  }
  sidebarToggle.addEventListener('click', function () {
    if (sidebar.classList.contains('closed')) {
      openSidebar();
    } else {
      closeSidebar();
    }
  });

  sidebarClose.addEventListener('click', function () {
    closeSidebar();
  });

  overlay.addEventListener('click', function () {
    closeSidebar();
  });

  // Close sidebar on window resize if width > 768px
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      sidebar.classList.remove('closed');
      overlay.classList.add('hidden');
    } else {
      sidebar.classList.add('closed');
      overlay.classList.add('hidden');
    }
  });

  // Initialize sidebar state based on window width
  if (window.innerWidth <= 768) {
    sidebar.classList.add('closed');
    overlay.classList.add('hidden');
  }
});
*/
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarClose = document.getElementById('sidebarClose');
const overlay = document.getElementById('overlay');

function openSidebar() {
  sidebar.classList.remove('closed');
  overlay.classList.remove('hidden');
}

function closeSidebar() {
  sidebar.classList.add('closed');
  overlay.classList.add('hidden');
}

sidebarToggle.addEventListener('click', openSidebar);
sidebarClose.addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);

// User info rendering
function renderUserInfo() {
  const user = window.user || null;
  if (!user) return;

  const userAvatar = document.getElementById('userAvatar');
  const userName = document.getElementById('userName');
  const userEmail = document.getElementById('userEmail');
  const headerUserAvatar = document.getElementById('headerUserAvatar');
  const headerUserName = document.getElementById('headerUserName');
  const headerUserEmail = document.getElementById('headerUserEmail');

  if (userAvatar) userAvatar.textContent = user.name ? user.name.charAt(0).toUpperCase() : 'U';
  if (userName) userName.textContent = user.name || 'Usuario';
  if (userEmail) userEmail.textContent = user.email || 'usuario@ejemplo.com';
  if (headerUserAvatar) headerUserAvatar.textContent = user.name ? user.name.charAt(0).toUpperCase() : 'U';
  if (headerUserName) headerUserName.textContent = user.name || 'Usuario';
  if (headerUserEmail) headerUserEmail.textContent = user.email || 'usuario@ejemplo.com';
}

// Tab switching
// Disabled tab switching logic because navigation is server-side with full page reloads
// const menuButtons = document.querySelectorAll('.menu-button');
// const tabSections = document.querySelectorAll('.tab-section');

// function setActiveTab(tabId) {
//   menuButtons.forEach(btn => {
//     btn.classList.toggle('active', btn.dataset.tab === tabId);
//   });
//   tabSections.forEach(section => {
//     section.classList.toggle('active', section.id === tabId);
//   });
//   if (window.innerWidth < 1024) {
//     closeSidebar();
//   }
//   if (tabId === 'salones') {
//     // fetchClassrooms() will be called from salones.js
//   } else if (tabId === 'estudiantes') {
//     // fetchStudents() will be called from estudiantes.js
//   } else if (tabId === 'docentes') {
//     // fetchTeachers() will be called from docentes.js
//   }
// }

// menuButtons.forEach(button => {
//   button.addEventListener('click', () => {
//     setActiveTab(button.dataset.tab);
//   });
// });

// Logout button
const logoutButton = document.getElementById('logoutButton');
logoutButton.addEventListener('click', async () => {
  try {
    const response = await fetch('/logout', {
      method: 'POST',
      credentials: 'include'
    });
    if (response.ok) {
      window.location.href = '/';
    } else {
      alert('Error al cerrar sesión');
    }
  } catch (error) {
    console.error('Logout error:', error);
    alert('Error al cerrar sesión');
  }
});
