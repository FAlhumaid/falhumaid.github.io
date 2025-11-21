document.addEventListener("DOMContentLoaded", function () {
  const el = document.getElementById("dfir-rotating-snippet");
  if (!el) return;

  const snippets = [
    "NTFS $MFT – File Metadata & History",
    "Prefetch – Program Execution Traces",
    "Amcache.hve – Installed & Executed Programs",
    "USN Journal ($J) – File Change Records",
    "Jump Lists – Recent File & App Access",
    "ShellBags – Folder Traversal History",
    "LNK Shortcuts – Target + Timestamps",
    "ActivitiesCache.db – Windows Timeline",
    "SRUM – Network & Resource Usage",
    "Event Logs – Security.evtx (Core Forensics)",
    "Hiberfil.sys – RAM Snapshot Artifacts",
    "Pagefile.sys – Paged Memory Remnants",
    "Volume Shadow Copies – Historical Evidence",
    "WebCacheV01.dat – Browser & Cache Artifacts",
    "Browser History – Chromium/Edge",
    "MRU Lists – Recent Document Activity",
    "Registry Transaction Logs (.LOG/.LOG1/.LOG2)",
    "Recycle Bin ($I/$R) Metadata",
    "NTFS $LogFile – File System Transactions",
    "Cross-Artifact Timeline Correlation"
  ];

  let lastIndex = -1;
  const displayDuration = 3500; // ms on screen
  const fadeDuration = 250;     // ms fade in/out

  function getRandomIndex() {
    let random;
    do {
      random = Math.floor(Math.random() * snippets.length);
    } while (random === lastIndex); // prevent repeat
    lastIndex = random;
    return random;
  }

  // Set initial random snippet
  el.textContent = snippets[getRandomIndex()];
  el.style.opacity = 1;

  setInterval(() => {
    // fade out
    el.style.opacity = 0;

    setTimeout(() => {
      // fade in new random snippet
      el.textContent = snippets[getRandomIndex()];
      el.style.opacity = 1;
    }, fadeDuration);

  }, displayDuration);
});
