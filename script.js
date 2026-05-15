document.addEventListener('DOMContentLoaded', () => {
      console.log('Landing page script loaded');

      const authBtn = document.getElementById('authBtn');
      const userLabel = document.getElementById('userLabel');
      const authMessage = document.getElementById('authMessage');
      const profileIcon = document.querySelector('.profile-icon');

      // Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyByCfRWvtuIMKSDDudhHQSV-CmPfN25mXA",
  authDomain: "mylanding-page-97a65.firebaseapp.com",
  projectId: "mylanding-page-97a65",
  storageBucket: "mylanding-page-97a65.firebasestorage.app",
  messagingSenderId: "483860392772",
  appId: "1:483860392772:web:46c81a8c68c402679fc511",
  measurementId: "G-MNSCEWHVHB"
};

      let authReady = false;
      try {
        firebase.initializeApp(firebaseConfig);
        console.log('Firebase initialized successfully');
        authReady = true;
      } catch (error) {
        console.error('Firebase init failed:', error);
      }

      function updateAuthUI(user) {
        if (!authBtn || !userLabel || !profileIcon) return;
        if (user) {
          authBtn.textContent = 'Sign out';
          userLabel.textContent = '';
          profileIcon.src = user.photoURL || './images/add.jpg';
          profileIcon.alt = user.displayName || user.email || 'Signed in user';
          profileIcon.title = user.displayName || user.email || 'Profile';
          showAuthMessage('');
          console.log('User signed in:', user.email);
        } else {
          authBtn.textContent = 'Sign in';
          userLabel.textContent = '';
          profileIcon.src = './images/add.jpg';
          profileIcon.alt = 'Profile';
          profileIcon.title = 'Profile';
          console.log('User signed out');
        }
      }

      function showAuthMessage(text) {
        if (authMessage) authMessage.textContent = text;
      }

      if (authReady) {
        firebase.auth().onAuthStateChanged(user => {
          updateAuthUI(user);
        });
        console.log('Auth state listener set up');
      } else {
        if (userLabel) {
          userLabel.textContent = 'Firebase not configured';
        }
        showAuthMessage('Firebase not configured');
      }

      if (authBtn) {
        authBtn.addEventListener('click', () => {
          console.log('Sign in button clicked');
          showAuthMessage('Processing...');
          if (!authReady) {
            alert('Firebase is not configured yet. Please add your Firebase config in the script.');
            return;
          }

          const user = firebase.auth().currentUser;
          if (user) {
            console.log('Signing out user');
            showAuthMessage('Signing out...');
            firebase.auth().signOut().catch(error => {
              console.error('Sign-out error:', error);
              showAuthMessage('Sign-out failed: ' + error.message);
              alert('Sign-out failed: ' + error.message);
            });
          } else {
            console.log('Starting sign-in with Google');
            showAuthMessage('Opening Google sign-in...');
            const provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider).then(result => {
              console.log('Sign-in successful:', result.user.email);
              showAuthMessage('');
            }).catch(error => {
              console.error('Sign-in error:', error);
              showAuthMessage('Sign-in failed: ' + error.message);
              alert('Sign-in failed: ' + error.message);
            });
          }
        });
      }

      // --- 1. 3-DOT MENU LOGIC ---
      document.addEventListener('click', (e) => {
        const menuBtn = e.target.closest('.menu-btn');

        if (menuBtn) {
          e.preventDefault();
          e.stopPropagation();

          const dropdown = menuBtn.nextElementSibling;
          document.querySelectorAll('.menu-dropdown').forEach(menu => {
            if (menu !== dropdown) menu.classList.remove('show');
          });

          dropdown.classList.toggle('show');
        } else {
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
            if (shortcut.dataset.userShortcut === 'true') {
              persistShortcuts();
            }
          }
        }

        if (e.target.classList.contains('edit-btn')) {
          const shortcut = e.target.closest('.shortcut');
          const currentName = shortcut.querySelector('span').innerText;
          const newName = prompt('Enter new name:', currentName);
          if (newName) {
            shortcut.querySelector('span').innerText = newName;
            if (shortcut.dataset.userShortcut === 'true') {
              persistShortcuts();
            }
          }
        }
      });

      // --- 3. MODAL LOGIC (Add Shortcut) ---
      const STORAGE_KEY = 'octaviaShortcuts';
      const modal = document.getElementById('addShortcutModal');
      const addBtn = document.querySelector('.add-shortcut');
      const cancelBtn = document.getElementById('cancelShortcut');
      const saveBtn = document.getElementById('saveShortcut');

      function getSavedShortcuts() {
        const saved = localStorage.getItem(STORAGE_KEY);
        try {
          return saved ? JSON.parse(saved) : [];
        } catch (error) {
          return [];
        }
      }

      function persistShortcuts() {
        const shortcuts = Array.from(document.querySelectorAll('.shortcut[data-user-shortcut]')).map(el => ({
          name: el.querySelector('span').textContent,
          url: el.dataset.url
        }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(shortcuts));
      }

      function loadSavedShortcuts() {
        const savedShortcuts = getSavedShortcuts();
        const shortcutsContainer = document.querySelector('.shortcuts');
        if (!shortcutsContainer || !addBtn) return;

        savedShortcuts.forEach(shortcut => {
          const newShortcut = createShortcutElement(shortcut.name, shortcut.url);
          shortcutsContainer.insertBefore(newShortcut, addBtn);
        });
      }

      if (addBtn) {
        addBtn.addEventListener('click', () => {
          modal.style.display = 'block';
        });
      }

      loadSavedShortcuts();

      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
          modal.style.display = 'none';
        });
      }

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
          return './images/add.jpg';
        }
      }

      function createShortcutElement(name, url) {
        const shortcut = document.createElement('div');
        shortcut.className = 'shortcut';
        shortcut.dataset.userShortcut = 'true';
        shortcut.dataset.url = url;

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
            persistShortcuts();
            alert('Shortcut saved: ' + name);
            modal.style.display = 'none';
            document.getElementById('shortcutName').value = '';
            document.getElementById('shortcutURL').value = '';
          } else {
            alert('Please fill in both fields.');
          }
        });
      }

      const aiBtn = document.getElementById('aiButton');
      if (aiBtn) {
        aiBtn.addEventListener('click', () => {
          alert('AI Mode Activated!');
        });
      }
    });