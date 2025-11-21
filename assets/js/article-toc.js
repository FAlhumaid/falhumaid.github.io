// /assets/js/article-toc.js
document.addEventListener('DOMContentLoaded', () => {
  const articleMain = document.querySelector('.article-main');
  const articleContent = document.querySelector('.article-content');

  if (!articleMain || !articleContent) return;

  // 1) Collect headings
  const headings = Array.from(
    articleContent.querySelectorAll('h2, h3')
  );
  if (!headings.length) return;

  // 2) Ensure each heading has a unique ID
  headings.forEach((h, index) => {
    if (!h.id) {
      const base = h.textContent
        .trim()
        .toLowerCase()
        .replace(/[^\w]+/g, '-')
        .replace(/^-+|-+$/g, '');

      let id = base || `section-${index + 1}`;
      let suffix = 1;
      while (document.getElementById(id)) {
        id = `${base || 'section'}-${suffix++}`;
      }
      h.id = id;
    }
  });

  // 3) Build the TOC element
  const toc = document.createElement('nav');
  toc.className = 'article-toc';

  const title = document.createElement('div');
  title.className = 'article-toc-title';
  title.textContent = 'On this page';

  const ul = document.createElement('ul');

  headings.forEach(h => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${h.id}`;
    a.textContent = h.textContent.trim();

    // Slight visual nesting for h3
    if (h.tagName.toLowerCase() === 'h3') {
      li.style.marginLeft = '0.6rem';
      a.style.fontSize = '0.88rem';
      a.style.opacity = '0.9';
    }

    li.appendChild(a);
    ul.appendChild(li);
  });

  toc.appendChild(title);
  toc.appendChild(ul);

  // Insert TOC as the first child in .article-main
  articleMain.insertBefore(toc, articleMain.firstChild);

  const links = Array.from(toc.querySelectorAll('a'));

  // 4) Smooth scrolling that respects the fixed navbar height
  const NAV_OFFSET = 90;   // tweak if your navbar is taller/shorter
  const ACTIVE_OFFSET = 140; // how far below the top a heading must be
                             // before it's treated as "current"

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = decodeURIComponent(link.hash.substring(1));
      const target = document.getElementById(id);
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const scrollY = window.scrollY + rect.top - NAV_OFFSET;

      window.scrollTo({
        top: scrollY,
        behavior: 'smooth'
      });
    });
  });

  // 5) Update active TOC link based on scroll position
  function updateActive() {
    const scrollY = window.scrollY;
    let currentId = headings[0].id;

    for (const h of headings) {
      const headingTop = h.offsetTop;

      // When the heading is above a band under the navbar,
      // we treat it as the "current" section.
      if (headingTop - scrollY <= ACTIVE_OFFSET) {
        currentId = h.id;
      } else {
        break;
      }
    }

    links.forEach(link => {
      const id = decodeURIComponent(link.hash.substring(1));
      if (id === currentId) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });
  }

  updateActive();
  window.addEventListener('scroll', updateActive, { passive: true });
  window.addEventListener('resize', updateActive);
});
