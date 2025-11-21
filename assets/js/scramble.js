document.addEventListener("DOMContentLoaded", function () {
  const scrambleChars = "01x";
  const scrambleDelay = 60;      // how fast characters change
  const scrambleRange = 2;       // how many characters on each side of the hovered one
  const delayBeforeRestore = 250;

  const activeIntervals = new Map();
  const pendingTimeouts = new Map();

  document.querySelectorAll(".scrambled-container").forEach((container) => {
    const text = container.textContent;

    // Split into tokens: words + whitespace (spaces/newlines)
    const tokens = text.split(/(\s+)/);

    const html = tokens
      .map((token) => {
        // pure whitespace (spaces, tabs, newlines) – keep as-is
        if (/^\s+$/.test(token)) {
          return token;
        }

        // non-whitespace = a word -> wrap the word, then wrap each char
        const chars = token.split("");
        const inner = chars
          .map(
            (char) =>
              `<span class="char" data-original="${char}">${char}</span>`
          )
          .join("");

        return `<span class="scramble-word">${inner}</span>`;
      })
      .join("");

    container.innerHTML = html;

    const spans = container.querySelectorAll(".char");

    function startScrambling(index) {
      for (let i = index - scrambleRange; i <= index + scrambleRange; i++) {
        if (i < 0 || i >= spans.length) continue;
        const span = spans[i];

        // cancel pending restore
        if (pendingTimeouts.has(span)) {
          clearTimeout(pendingTimeouts.get(span));
          pendingTimeouts.delete(span);
        }
        // already scrambling
        if (activeIntervals.has(span)) continue;

        const interval = setInterval(() => {
          const randomChar =
            scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          span.textContent = randomChar;
        }, scrambleDelay);

        activeIntervals.set(span, interval);
      }
    }

    function stopScrambling(index) {
      for (let i = index - scrambleRange; i <= index + scrambleRange; i++) {
        if (i < 0 || i >= spans.length) continue;
        const span = spans[i];

        if (pendingTimeouts.has(span)) continue;

        const timeout = setTimeout(() => {
          if (activeIntervals.has(span)) {
            clearInterval(activeIntervals.get(span));
            span.textContent = span.dataset.original;
            activeIntervals.delete(span);
          }
          pendingTimeouts.delete(span);
        }, delayBeforeRestore);

        pendingTimeouts.set(span, timeout);
      }
    }

    spans.forEach((span, i) => {
      span.addEventListener("mouseenter", () => startScrambling(i));
      span.addEventListener("mouseleave", () => stopScrambling(i));
    });
  });
});
