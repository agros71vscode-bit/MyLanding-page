document.querySelector("#aiButton").addEventListener("click", () => {
  alert("AI Mode activated!");
});
// This Script is for handling the shortcuts functionality on the landing page. It allows users to add custom shortcuts with a name and URL, which are displayed as clickable tiles on the page. The script also manages the modal dialog for adding shortcuts and ensures that the shortcuts are interactive.
document.addEventListener("DOMContentLoaded", () => {
  const shortcutsContainer = document.querySelector(".shortcuts");
  const addShortcutBtn = document.querySelector(".add-shortcut");
  const modal = document.getElementById("addShortcutModal");
  const saveBtn = document.getElementById("saveShortcut");
  const cancelBtn = document.getElementById("cancelShortcut");

  // Open modal when "Add shortcut" clicked
  addShortcutBtn.addEventListener("click", () => {
    modal.style.display = "block";
  });

  // Close modal
  cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Save shortcut
  saveBtn.addEventListener("click", () => {
    const name = document.getElementById("shortcutName").value.trim();
    const url = document.getElementById("shortcutURL").value.trim();

    if (name && url) {
      const shortcut = document.createElement("div");
      shortcut.classList.add("shortcut");

      const icon = document.createElement("div");
      icon.classList.add("icon");
      const img = document.createElement("img");
      img.src = `https://www.google.com/s2/favicons?domain=${url}`; // Place holder icon

      img.alt = name;
      icon.appendChild(img);

      const label = document.createElement("span");
      label.textContent = name;

      shortcut.appendChild(icon);
      shortcut.appendChild(label);

      shortcut.addEventListener("click", () => {
        window.location.href = url;
      });

      shortcutsContainer.insertBefore(shortcut, addShortcutBtn);
      modal.style.display = "none"; // close modal
      document.getElementById("shortcutName").value = "";
      document.getElementById("shortcutURL").value = "";
    }
  });

  // Close modal if clicking outside
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});
