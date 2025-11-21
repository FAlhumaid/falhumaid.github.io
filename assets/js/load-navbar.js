document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('navbar-root');
  if (!container) return;

  fetch('/assets/html/navbar.html')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load navbar.html');
      }
      return response.text();
    })
    .then(html => {
      container.innerHTML = html;
      // Let other scripts know the navbar is ready
      document.dispatchEvent(new Event('navbarReady'));
    })
    .catch(err => {
      console.error('Error loading navbar:', err);
    });
});
