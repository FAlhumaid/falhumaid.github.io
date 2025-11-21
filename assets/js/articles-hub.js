document.addEventListener('DOMContentLoaded', function () {
  const grid = document.getElementById('articles-grid');
  const searchInput = document.getElementById('articles-search');
  const countEl = document.getElementById('articles-count');

  const viewToggle = document.querySelector('.articles-view-toggle');
  const viewButtons = viewToggle ? viewToggle.querySelectorAll('.view-toggle-btn') : [];

  if (!grid) return;

  let allArticles = [];
  let currentFilter = '';
  let currentView = 'grid'; // "grid" or "list"

  function renderArticles(filterText = currentFilter) {
    currentFilter = (filterText || '').trim().toLowerCase();

    const filtered = allArticles.filter(article => {
      if (!currentFilter) return true;

      const haystack = [
        article.title || '',
        article.summary || '',
        article.category || '',
        article.platform || '',
        article.fullText || ''
      ].join(' ').toLowerCase();

      return haystack.includes(currentFilter);
    });

    grid.innerHTML = '';

    if (!filtered.length) {
      grid.innerHTML = '<p style="color:#9ca3af;">No articles found.</p>';
    } else {
      filtered.forEach(article => {
        const card = document.createElement('article');
        card.className = 'article-card';
        if (currentView === 'list') {
          card.classList.add('article-card-list');
        }

        const title = document.createElement('div');
        title.className = 'article-card-title';
        title.textContent = article.title;

        const meta = document.createElement('div');
        meta.className = 'article-card-meta';

        const catSpan = document.createElement('span');
        catSpan.textContent = article.category || 'Article';

        const platSpan = document.createElement('span');
        platSpan.textContent = article.platform || 'Unknown';

        meta.appendChild(catSpan);
        meta.appendChild(platSpan);

        const desc = document.createElement('p');
        desc.className = 'article-card-desc';
        desc.textContent = article.summary || '';

        const link = document.createElement('a');
        link.className = 'article-card-link';
        link.href = `/articles/${article.slug}.html`;
        link.textContent = 'Read article →';

        card.appendChild(title);
        card.appendChild(meta);
        card.appendChild(desc);
        card.appendChild(link);

        grid.appendChild(card);
      });
    }

    // Container layout class
    grid.classList.toggle('articles-grid-list', currentView === 'list');

    // Count label
    if (countEl) {
      const total = allArticles.length;
      if (!currentFilter) {
        countEl.textContent = `${total} article${total === 1 ? '' : 's'}`;
      } else {
        countEl.textContent = `${filtered.length} of ${total} article${total === 1 ? '' : 's'}`;
      }
    }
  }

  function fetchArticleContent(article) {
    const url = `/articles/${article.slug}.html`;

    return fetch(url)
      .then(resp => {
        if (!resp.ok) {
          throw new Error(`Failed to fetch article HTML: ${url}`);
        }
        return resp.text();
      })
      .then(htmlText => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        const mainEl = doc.querySelector('main.article-main') || doc.body;
        const text = mainEl ? (mainEl.textContent || '') : '';

        return {
          ...article,
          fullText: text.replace(/\s+/g, ' ').trim()
        };
      })
      .catch(err => {
        console.error('Error fetching article content for', article.slug, err);
        return {
          ...article,
          fullText: ''
        };
      });
  }

  // Load metadata + full content
  fetch('/assets/json/articles.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load articles.json');
      }
      return response.json();
    })
    .then(articles => {
      if (!Array.isArray(articles)) {
        throw new Error('articles.json is not an array');
      }
      return Promise.all(articles.map(fetchArticleContent));
    })
    .then(articlesWithContent => {
      allArticles = articlesWithContent || [];
      renderArticles('');
    })
    .catch(err => {
      console.error('Error building articles hub:', err);
      grid.innerHTML = '<p style="color:#9ca3af;">Unable to load articles.</p>';
      if (countEl) countEl.textContent = '';
    });

  // Search
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      renderArticles(this.value);
    });
  }

  // View toggle buttons
  if (viewButtons.length) {
    viewButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const desiredView = btn.getAttribute('data-view') || 'grid';
        if (desiredView === currentView) return;

        currentView = desiredView;

        viewButtons.forEach(b => b.classList.remove('view-toggle-btn-active'));
        btn.classList.add('view-toggle-btn-active');

        renderArticles(currentFilter);
      });
    });
  }
});
