document.addEventListener('DOMContentLoaded', () => {
      console.log('Landing page script loaded');

      const authBtn = document.getElementById('authBtn');
      const userLabel = document.getElementById('userLabel');
      const authMessage = document.getElementById('authMessage');
      const profileIcon = document.getElementById('profileIcon');
      const profileMenu = document.getElementById('profileMenu');
      const profileDropdown = document.getElementById('profileDropdown');
      const profileUserName = document.getElementById('profileUserName');
      const profileSignOut = document.getElementById('profileSignOut');
      const profileSwitchAccount = document.getElementById('profileSwitchAccount');

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
        if (!authBtn || !userLabel || !profileIcon || !profileMenu || !profileDropdown || !profileUserName) return;
        if (user) {
          authBtn.style.display = 'none';
          profileMenu.style.display = 'inline-flex';
          profileUserName.textContent = user.displayName || user.email || 'Signed in';
          profileIcon.src = user.photoURL || './images/add.jpg';
          profileIcon.alt = user.displayName || user.email || 'Signed in user';
          profileIcon.title = user.displayName || user.email || 'Profile';
          profileSignOut.disabled = false;
          profileSwitchAccount.disabled = false;
          showAuthMessage('');
          console.log('User signed in:', user.email);
        } else {
          authBtn.style.display = 'inline-flex';
          profileMenu.style.display = 'inline-flex';
          profileUserName.textContent = 'Not signed in';
          profileIcon.src = './images/add.jpg';
          profileIcon.alt = 'Profile';
          profileIcon.title = 'Profile';
          profileDropdown.classList.remove('show');
          profileSignOut.disabled = true;
          profileSwitchAccount.disabled = true;
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

      function signInWithGoogle(promptSelect = false) {
        if (!authReady) {
          alert('Firebase is not configured yet. Please add your Firebase config in the script.');
          return;
        }
        showAuthMessage(promptSelect ? 'Choose an account...' : 'Opening Google sign-in...');
        const provider = new firebase.auth.GoogleAuthProvider();
        if (promptSelect) {
          provider.setCustomParameters({ prompt: 'select_account' });
        }
        firebase.auth().signInWithPopup(provider).then(result => {
          console.log('Sign-in successful:', result.user.email);
          showAuthMessage('');
        }).catch(error => {
          console.error('Sign-in error:', error);
          if (error.code === 'auth/popup-closed-by-user') {
            const msg = 'Google sign-in was canceled. Please try again if you still want to sign in.';
            showAuthMessage(msg);
            alert(msg);
          } else {
            showAuthMessage('Sign-in failed: ' + error.message);
            alert('Sign-in failed: ' + error.message);
          }
        });
      }

      if (authBtn) {
        authBtn.addEventListener('click', () => {
          console.log('Sign in button clicked');
          signInWithGoogle();
        });
      }

      if (profileMenu) {
        profileMenu.addEventListener('click', (event) => {
          const user = firebase.auth().currentUser;
          if (!user) {
            return;
          }
          event.stopPropagation();
          profileDropdown.classList.toggle('show');
        });
      }

      if (profileSignOut) {
        profileSignOut.addEventListener('click', (event) => {
          event.stopPropagation();
          profileDropdown.classList.remove('show');
          if (!authReady) {
            return;
          }
          showAuthMessage('Signing out...');
          firebase.auth().signOut().catch(error => {
            console.error('Sign-out error:', error);
            showAuthMessage('Sign-out failed: ' + error.message);
            alert('Sign-out failed: ' + error.message);
          });
        });
      }

      if (profileSwitchAccount) {
        profileSwitchAccount.addEventListener('click', (event) => {
          event.stopPropagation();
          profileDropdown.classList.remove('show');
          signInWithGoogle(true);
        });
      }

      if (profileDropdown) {
        profileDropdown.addEventListener('click', event => event.stopPropagation());
      }

      document.addEventListener('click', () => {
        if (profileDropdown) {
          profileDropdown.classList.remove('show');
        }
      });

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

      const searchForm = document.getElementById('searchForm');
      const searchInput = document.getElementById('searchInput');
      const searchIcon = document.getElementById('searchIcon');
      const aiBtn = document.getElementById('aiButton');
      const cameraBtn = document.getElementById('cameraButton');
      const micBtn = document.getElementById('micButton');

      if (searchIcon && searchForm) {
        searchIcon.addEventListener('click', () => {
          if (searchInput && searchInput.value.trim()) {
            searchForm.submit();
          } else {
            searchInput && searchInput.focus();
          }
        });
      }

      if (cameraBtn) {
        cameraBtn.addEventListener('click', () => {
          const query = searchInput ? searchInput.value.trim() : '';
          const url = query
            ? `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`
            : 'https://www.google.com/imghp';
          window.open(url, '_blank');
        });
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition;
      let recognition = null;
      let micListening = false;
      if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          micListening = true;
          if (micBtn) {
            micBtn.classList.add('active');
            micBtn.setAttribute('aria-label', 'Stop voice search');
          }
          showAuthMessage('Listening... speak now.');
        };

        recognition.onend = () => {
          micListening = false;
          if (micBtn) {
            micBtn.classList.remove('active');
            micBtn.setAttribute('aria-label', 'Voice search');
          }
          showAuthMessage('');
        };

        recognition.onerror = event => {
          micListening = false;
          if (micBtn) {
            micBtn.classList.remove('active');
            micBtn.setAttribute('aria-label', 'Voice search');
          }
          if (event.error !== 'no-speech') {
            alert('Voice search error: ' + event.error);
          }
          showAuthMessage('');
        };

        recognition.onresult = event => {
          const transcript = event.results[0][0].transcript;
          if (searchInput) {
            searchInput.value = transcript;
          }
          if (searchForm) {
            searchForm.submit();
          }
        };
      }

      if (micBtn) {
        micBtn.addEventListener('click', () => {
          if (!recognition) {
            alert('Voice search is not supported by this browser.');
            return;
          }
          if (micListening) {
            recognition.stop();
          } else {
            recognition.start();
          }
        });
      }

      if (aiBtn) {
        aiBtn.addEventListener('click', () => {
          alert('AI Mode Activated!');
        });
      }
    });