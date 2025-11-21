document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('footer-root');
  if (!container) return;

  fetch('/assets/html/footer.html')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load footer.html');
      }
      return response.text();
    })
    .then(html => {
      container.innerHTML = html;
    })
    .catch(err => {
      console.error('Error loading footer:', err);
    });
});
