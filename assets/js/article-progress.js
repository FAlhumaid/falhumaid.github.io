document.addEventListener('DOMContentLoaded', () => {
  const main = document.querySelector('.article-main');
  if (!main) return;

  // Create progress bar container + bar
  const container = document.createElement('div');
  container.className = 'article-progress-container';

  const bar = document.createElement('div');
  bar.className = 'article-progress-bar';

  container.appendChild(bar);

  // Insert at top of main
  main.insertBefore(container, main.firstChild);

  function updateProgress() {
    const scrollTop = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }

  updateProgress();

  window.addEventListener('scroll', updateProgress);
  window.addEventListener('resize', updateProgress);
});
