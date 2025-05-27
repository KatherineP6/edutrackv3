const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarClose = document.getElementById('sidebarClose');
const overlay = document.getElementById('overlay');

function openSidebar() {
  sidebar.classList.remove('closed');
  overlay.classList.remove('hidden');
  overlay.classList.add('visible');
}

function closeSidebar() {
  sidebar.classList.add('closed');
  overlay.classList.remove('visible');
  overlay.classList.add('hidden');
}

sidebarToggle.addEventListener('click', openSidebar);
sidebarClose.addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);

// Logout button
const logoutButton = document.getElementById('logoutButton');
logoutButton.addEventListener('click', async () => {
  try {
    const response = await fetch('/logout', {
      method: 'POST',
      credentials: 'include'
    });
    if (response.ok) {
      window.location.href = '/login';
    } else {
      alert('Error al cerrar sesión');
    }
  } catch (error) {
    console.error('Logout error:', error);
    alert('Error al cerrar sesión');
  }
});

// Redirection function
function redirectTo(url) {
  window.location.href = url;
}

// Add redirection to menu items
const menuLinks = document.querySelectorAll('#menuItems .menu-link');
menuLinks.forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    const url = link.getAttribute('href');
    redirectTo(url);
  });
});
