// trelloMainPage.js

document.addEventListener('DOMContentLoaded', function () {
  const userBtn = document.getElementById('user-btn');
  const userMenu = document.getElementById('user-menu');
  let user = null;

  function checkAuth() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setGuest();
      return;
    }
    fetch('/api/auth/me/', {
      method: 'GET',
      headers: { 'Authorization': `Token ${token}` }
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        user = data;
        setUser(data.username || data.user?.username || "Пользователь");
      })
      .catch(() => setGuest());
  }

  function setGuest() {
    userBtn.textContent = 'Гость';
    if (userMenu) {
      userMenu.innerHTML = `
                <button onclick="openAuthModal('login')" class="dropdown-item">Войти</button>
                <button onclick="openAuthModal('register')" class="dropdown-item">Зарегистрироваться</button>
            `;
    }
  }

  function setUser(username) {
    userBtn.textContent = username;
    if (userMenu) {
      userMenu.innerHTML = '';
      const logout = document.createElement('button');
      logout.textContent = 'Выйти';
      logout.className = 'dropdown-item';
      logout.onclick = function () {
        localStorage.removeItem('authToken');
        window.location.replace('/');
      };
      userMenu.appendChild(logout);
    }
  }

  userBtn.addEventListener('click', function () {
    userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
  });
  document.body.addEventListener('click', function (e) {
    if (!userBtn.contains(e.target) && !userMenu.contains(e.target)) {
      userMenu.style.display = 'none';
    }
  }, true);

  checkAuth();
});
