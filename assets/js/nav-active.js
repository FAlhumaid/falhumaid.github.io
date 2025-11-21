document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname || '/';

  const homeLink = document.querySelector('.nav-link-home');
  const articlesLink = document.querySelector('.nav-link-articles');

  // Active link logic
  if (homeLink && (path === '/' || path === '/index.html')) {
    homeLink.classList.add('nav-link-active');
  }

  if (articlesLink && path.startsWith('/articles')) {
    articlesLink.classList.add('nav-link-active');
  }

  // Navbar scroll shadow + background
  const navbarContainer = document.querySelector('.navbar-container');

  function updateNavbarShadow() {
    if (!navbarContainer) return;
    if (window.scrollY > 8) {
      navbarContainer.classList.add('navbar-scrolled');
    } else {
      navbarContainer.classList.remove('navbar-scrolled');
    }
  }

  updateNavbarShadow();
  window.addEventListener('scroll', updateNavbarShadow);
});
