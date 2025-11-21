// Image Zoom Modal
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("img-modal");
  const modalImg = document.getElementById("img-modal-img");
  const captionText = document.getElementById("img-modal-caption");
  const closeBtn = document.querySelector(".img-modal-close");

  // Add click event to all article images
  document.querySelectorAll(".article-figure img").forEach(img => {
    img.style.cursor = "zoom-in";

    img.onclick = function () {
      modal.style.display = "block";
      modalImg.src = this.src;
      captionText.innerHTML = this.alt || "";
    };
  });

  // Close button
  closeBtn.onclick = function () {
    modal.style.display = "none";
  };

  // Click anywhere outside image closes modal
  modal.onclick = function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  };
});
