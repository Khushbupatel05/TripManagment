

document.addEventListener("DOMContentLoaded", () => {

  const toggle  = document.getElementById("sidebarToggle");
  const sidebar = document.getElementById("sidebar");

  if (toggle && sidebar) {
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      sidebar.classList.toggle("open");
    });
    document.addEventListener("click", (e) => {
      if (sidebar.classList.contains("open") &&
          !sidebar.contains(e.target) && e.target !== toggle) {
        sidebar.classList.remove("open");
      }
    });
  }

  
  document.querySelectorAll(".alert.show").forEach((el) => {
    setTimeout(() => {
      const instance = bootstrap.Alert.getOrCreateInstance(el);
      if (instance) instance.close();
    }, 4500);
  });

  // ── Delete confirmation ─────────────────────
  document.querySelectorAll(".delete-form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      if (!confirm("⚠️  Delete this trip?\nThis action cannot be undone.")) {
        e.preventDefault();
      }
    });
  });

  const imageInput        = document.getElementById("imageInput");
  const uploadArea        = document.getElementById("uploadArea");
  const uploadPlaceholder = document.getElementById("uploadPlaceholder");
  const uploadPreview     = document.getElementById("uploadPreview");
  const previewImg        = document.getElementById("previewImg");
  const removeImageBtn    = document.getElementById("removeImage");

  if (imageInput) {
    imageInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        alert("File too large. Maximum allowed size is 5 MB.");
        imageInput.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        previewImg.src = ev.target.result;
        uploadPlaceholder.style.display = "none";
        uploadPreview.style.display     = "block";
      };
      reader.readAsDataURL(file);
    });

    
    ["dragover", "dragenter"].forEach((evt) => {
      uploadArea.addEventListener(evt, (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = "var(--clr-primary)";
        uploadArea.style.background  = "var(--clr-primary-lt)";
      });
    });
    ["dragleave", "drop"].forEach((evt) => {
      uploadArea.addEventListener(evt, () => {
        uploadArea.style.borderColor = "";
        uploadArea.style.background  = "";
      });
    });
  }

  if (removeImageBtn) {
    removeImageBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      imageInput.value                = "";
      previewImg.src                  = "";
      uploadPlaceholder.style.display = "block";
      uploadPreview.style.display     = "none";
    });
  }

});
