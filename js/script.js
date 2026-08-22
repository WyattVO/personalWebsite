(function () {
  const menuItems = Array.from(document.querySelectorAll('.menu-list li'));
  const cursor = document.querySelector('.menu-cursor');
  const screen = document.querySelector('.screen');
  const popups = Array.from(document.querySelectorAll('.popup'));
  const closeButtons = Array.from(document.querySelectorAll('.close-btn'));

  let selectedIndex = 0;
  let activePopup = null;

  function updateCursor() {
    const item = menuItems[selectedIndex];
    const offsetTop = item.offsetTop;
    cursor.style.transform = `translateY(${offsetTop}px)`;
  }

  function moveSelection(direction) {
    if (activePopup) return;
    selectedIndex = (selectedIndex + direction + menuItems.length) % menuItems.length;
    updateCursor();
  }

  function flashScreen() {
    screen.classList.add('flash');
    setTimeout(() => screen.classList.remove('flash'), 100);
  }

  function openPopup(target) {
    if (activePopup) return;
    const popup = document.getElementById(target);
    if (!popup) return;

    flashScreen();

    const screenRect = screen.getBoundingClientRect();
    const originX = screenRect.left + screenRect.width / 2;
    const originY = screenRect.top + screenRect.height / 2;

    popup.style.transformOrigin = `${originX}px ${originY}px`;

    requestAnimationFrame(() => {
      popup.classList.add('open');
    });

    activePopup = popup;
  }

  function closePopup() {
    if (!activePopup) return;
    activePopup.classList.remove('open');
    activePopup = null;
  }

  function selectCurrentItem() {
    if (activePopup) return;
    const target = menuItems[selectedIndex].dataset.target;
    openPopup(target);
  }

  // D-pad click handlers
  document.querySelector('.dpad-up').addEventListener('click', () => moveSelection(-1));
  document.querySelector('.dpad-down').addEventListener('click', () => moveSelection(1));

  // A/B button click handlers
  document.querySelector('.btn-a').addEventListener('click', selectCurrentItem);
  document.querySelector('.btn-b').addEventListener('click', closePopup);

  // START button resets to first menu item
  document.querySelector('.start-btn').addEventListener('click', () => {
    if (activePopup) return;
    selectedIndex = 0;
    updateCursor();
  });

  // Menu items clickable directly
  menuItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      if (activePopup) return;
      selectedIndex = index;
      updateCursor();
      selectCurrentItem();
    });
  });

  // Close buttons inside popups
  closeButtons.forEach((btn) => {
    btn.addEventListener('click', closePopup);
  });

  // Keyboard controls
  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        moveSelection(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        moveSelection(1);
        break;
      case 'Enter':
      case 'a':
      case 'A':
        e.preventDefault();
        selectCurrentItem();
        break;
      case 'Escape':
      case 'b':
      case 'B':
        e.preventDefault();
        closePopup();
        break;
    }
  });

  // Initialize cursor position
  updateCursor();
})();
