document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("home-articles-grid");
  if (!container) return;

  const MAX_ARTICLES = 3; // how many to show on the home page

  fetch("/assets/json/articles.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load articles.json");
      }
      return response.json();
    })
    .then((articles) => {
      if (!Array.isArray(articles) || articles.length === 0) {
        container.innerHTML = '<p class="home-articles-placeholder">No articles available yet.</p>';
        return;
      }

      // Assume articles.json is ordered newest first; take the first few
      const recent = articles.slice(0, MAX_ARTICLES);

      container.innerHTML = ""; // clear placeholder

      recent.forEach((article) => {
        // expect: { title, slug, category, platform, summary }
        const card = document.createElement("article");
        card.className = "home-article-card";

        const meta = document.createElement("div");
        meta.className = "home-article-meta";

        if (article.category) {
          const cat = document.createElement("span");
          cat.className = "home-article-category";
          cat.textContent = article.category;
          meta.appendChild(cat);
        }

        if (article.platform) {
          if (article.category) {
            const dot = document.createElement("span");
            dot.className = "home-article-dot";
            dot.textContent = "•";
            meta.appendChild(dot);
          }
          const plat = document.createElement("span");
          plat.className = "home-article-platform";
          plat.textContent = article.platform;
          meta.appendChild(plat);
        }

        const titleLink = document.createElement("a");
        titleLink.className = "home-article-title";
        titleLink.textContent = article.title || "Untitled article";

        // assume slug corresponds to /articles/<slug>.html
        if (article.slug) {
          titleLink.href = "/articles/" + article.slug + ".html";
        } else {
          titleLink.href = "/articles/";
        }

        const summary = document.createElement("p");
        summary.className = "home-article-summary";
        summary.textContent =
          article.summary ||
          "DFIR artifact write-up. Content summary not provided.";

        card.appendChild(meta);
        card.appendChild(titleLink);
        card.appendChild(summary);

        container.appendChild(card);
      });
    })
    .catch((error) => {
      console.error(error);
      container.innerHTML =
        '<p class="home-articles-placeholder">Couldn’t load recent articles.</p>';
    });
});
