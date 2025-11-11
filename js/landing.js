// Landing Page Authentication
document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    if (Auth.isLoggedIn()) {
        const user = Auth.getCurrentUser();
        console.log('Already logged in as:', user.email);
    }
    
    // Setup modal handlers
    setupModals();
});

function setupModals() {
    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            closeAllModals();
        }
    }
}

function openLoginModal() {
    closeAllModals();
    document.getElementById('loginModal').classList.add('active');
}

function openRegisterModal() {
    closeAllModals();
    document.getElementById('registerModal').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        showError('Compila tutti i campi');
        return;
    }
    
    const result = Auth.login(email, password);
    
    if (result.success) {
        showSuccess(result.message);
        setTimeout(() => {
            window.location.href = 'app.html';
        }, 1000);
    } else {
        showError(result.message);
    }
}

function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    
    if (!name || !email || !password) {
        showError('Compila tutti i campi');
        return;
    }
    
    if (password.length < 6) {
        showError('La password deve essere di almeno 6 caratteri');
        return;
    }
    
    const result = Auth.register(name, email, password);
    
    if (result.success) {
        showSuccess(result.message);
        setTimeout(() => {
            window.location.href = 'app.html';
        }, 1000);
    } else {
        showError(result.message);
    }
}

function socialLogin(provider) {
    showInfo(`Login con ${provider} non ancora implementato. Usa email/password.`);
}

function showError(message) {
    alert('❌ ' + message);
}

function showSuccess(message) {
    alert('✅ ' + message);
}

function showInfo(message) {
    alert('ℹ️ ' + message);
}

function loginDemo() {
    Auth.enableDemoMode();
    showSuccess('Accesso demo attivato!');
    setTimeout(() => {
        window.location.href = 'app.html';
    }, 1000);
}