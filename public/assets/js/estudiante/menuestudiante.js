document.addEventListener('DOMContentLoaded', function () {
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
