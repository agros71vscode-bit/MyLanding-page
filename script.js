document.addEventListener('DOMContentLoaded', () => {
  // --- 1. 3-DOT MENU LOGIC ---
  
  // Toggle the dropdown when clicking the 3 dots
  document.addEventListener('click', (e) => {
    const menuBtn = e.target.closest('.menu-btn');
    
    // If clicking a menu button
    if (menuBtn) {
      e.preventDefault();
      e.stopPropagation(); // Stops the shortcut from opening
      
      const dropdown = menuBtn.nextElementSibling;
      
      // Close all other open menus first
      document.querySelectorAll('.menu-dropdown').forEach(menu => {
        if (menu !== dropdown) menu.classList.remove('show');
      });
      
      // Toggle the current menu
      dropdown.classList.toggle('show');
    } else {
      // If clicking anywhere else, close all menus
      document.querySelectorAll('.menu-dropdown').forEach(menu => {
        menu.classList.remove('show');
      });
    }
  });

  // --- 2. MENU ITEM ACTIONS (Edit/Delete) ---
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const shortcut = e.target.closest('.shortcut');
      if (confirm('Are you sure you want to delete this shortcut?')) {
        shortcut.remove();
      }
    }
    
    if (e.target.classList.contains('edit-btn')) {
      const shortcut = e.target.closest('.shortcut');
      const currentName = shortcut.querySelector('span').innerText;
      const newName = prompt('Enter new name:', currentName);
      if (newName) {
        shortcut.querySelector('span').innerText = newName;
      }
    }
  });

  // --- 3. MODAL LOGIC (Add Shortcut) ---
  const modal = document.getElementById('addShortcutModal');
  const addBtn = document.querySelector('.add-shortcut');
  const cancelBtn = document.getElementById('cancelShortcut');
  const saveBtn = document.getElementById('saveShortcut');

  // Open Modal
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      modal.style.display = 'block';
    });
  }

  // Close Modal (Cancel)
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  // Close Modal (Clicking outside)
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  function getFaviconUrl(url) {
    try {
      const parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
      return `https://www.google.com/s2/favicons?sz=64&domain=${parsedUrl.hostname}`;
    } catch (error) {
      return 'images/add.jpg';
    }
  }

  function createShortcutElement(name, url) {
    const shortcut = document.createElement('div');
    shortcut.className = 'shortcut';

    const hoverBox = document.createElement('div');
    hoverBox.className = 'hover-box';

    const menuContainer = document.createElement('div');
    menuContainer.className = 'menu-container';
    menuContainer.innerHTML = `
      <button class="menu-btn">⋮</button>
      <div class="menu-dropdown">
        <div class="menu-item edit-btn">Edit</div>
        <div class="menu-item delete-btn">Delete</div>
      </div>
    `;

    const icon = document.createElement('div');
    icon.className = 'icon';

    const img = document.createElement('img');
    img.alt = name;
    img.src = getFaviconUrl(url);
    img.onerror = () => {
      img.src = './images/add.jpg';
    };

    icon.appendChild(img);

    const label = document.createElement('span');
    label.textContent = name;

    shortcut.appendChild(hoverBox);
    shortcut.appendChild(menuContainer);
    shortcut.appendChild(icon);
    shortcut.appendChild(label);

    shortcut.addEventListener('click', (event) => {
      if (!event.target.closest('.menu-container')) {
        window.open(url.startsWith('http') ? url : `https://${url}`, '_blank');
      }
    });

    return shortcut;
  }

  // Save Shortcut Logic
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const name = document.getElementById('shortcutName').value.trim();
      const url = document.getElementById('shortcutURL').value.trim();
      const shortcutsContainer = document.querySelector('.shortcuts');

      if (name && url) {
        const newShortcut = createShortcutElement(name, url);
        if (shortcutsContainer && addBtn) {
          shortcutsContainer.insertBefore(newShortcut, addBtn);
        }

        alert('Shortcut saved: ' + name);
        modal.style.display = 'none';
        document.getElementById('shortcutName').value = '';
        document.getElementById('shortcutURL').value = '';
      } else {
        alert('Please fill in both fields.');
      }
    });
  }
  
  // --- 4. AI MODE BUTTON ---
  const aiBtn = document.getElementById('aiButton');
  if (aiBtn) {
    aiBtn.addEventListener('click', () => {
      alert('AI Mode Activated!');
      // Add your custom AI logic here
    });
  }
});