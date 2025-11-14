function openAuthModal(tab = "login") {
    document.getElementById("authModal").style.display = "flex";
    switchAuthTab(tab);
}
window.openAuthModal = openAuthModal;

function closeAuthModal() {
    document.getElementById("authModal").style.display = "none";
}
window.closeAuthModal = closeAuthModal;

function switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(form => form.classList.add('hidden'));
    if (tab === "register") {
        document.querySelector('.auth-tab:nth-child(2)').classList.add('active');
        document.getElementById('registerForm').classList.remove('hidden');
    } else {
        document.querySelector('.auth-tab:nth-child(1)').classList.add('active');
        document.getElementById('loginForm').classList.remove('hidden');
    }
}
window.switchAuthTab = switchAuthTab;

// AJAX Login
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');
    const btn = document.getElementById('login-submit-btn');
    const spinner = document.getElementById('login-spinner');
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
    spinner.style.display = 'inline-block';
    btn.disabled = true;

    fetch('/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
        .then(res => res.json())
        .then(data => {
            spinner.style.display = 'none';
            btn.disabled = false;
            if (data.token) {
                localStorage.setItem('authToken', data.token);
                closeAuthModal();
                window.location.reload();
            } else {
                errorDiv.textContent = data.detail || 'Неправильный email или пароль';
                errorDiv.style.display = 'block';
            }
        })
        .catch(() => {
            spinner.style.display = 'none';
            btn.disabled = false;
            errorDiv.textContent = 'Ошибка авторизации';
            errorDiv.style.display = 'block';
        });
}

// AJAX Register + email validation
function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const password2 = document.getElementById('register-password2').value;
    const errorDiv = document.getElementById('register-error');
    const btn = document.getElementById('register-submit-btn');
    const spinner = document.getElementById('register-spinner');
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';

    if (!email.includes('@')) {
        errorDiv.textContent = 'Email должен содержать символ @';
        errorDiv.style.display = 'block';
        document.getElementById('register-email').focus();
        return false;
    }
    if (password !== password2) {
        errorDiv.textContent = 'Пароли должны совпадать';
        errorDiv.style.display = 'block';
        document.getElementById('register-password2').focus();
        return false;
    }

    spinner.style.display = 'inline-block';
    btn.disabled = true;

    fetch('/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name, email, password })
    })
        .then(res => res.json())
        .then(data => {
            spinner.style.display = 'none';
            btn.disabled = false;
            if (data.token) {
                localStorage.setItem('authToken', data.token);
                closeAuthModal();
                window.location.reload();
            } else {
                errorDiv.textContent = data.detail || 'Ошибка регистрации.';
                errorDiv.style.display = 'block';
            }
        })
        .catch(() => {
            spinner.style.display = 'none';
            btn.disabled = false;
            errorDiv.textContent = 'Ошибка регистрации';
            errorDiv.style.display = 'block';
        });
}