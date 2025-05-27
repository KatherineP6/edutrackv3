/**
 * JavaScript for Docente menu and interactions
 * 
 * This script handles sidebar toggle, menu active state, and other UI interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebarClose = document.getElementById('sidebarClose');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const logoutButton = document.getElementById('logoutButton');

  // Toggle sidebar visibility
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('hidden');
  });

  // Close sidebar
  sidebarClose.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.add('hidden');
  });

  // Close sidebar when clicking outside
  overlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.add('hidden');
  });

  // Logout button click handler (optional)
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      window.location.href = '/logout';
    });
  }
});
