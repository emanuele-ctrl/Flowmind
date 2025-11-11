// ============================================
// FUNZIONE GLOBALE SIDEBAR - DEVE ESSERE PRIMA DI TUTTO
// ============================================

function toggleSidebar() {
    console.log('🔘 toggleSidebar chiamata!');
    
    const sidebar = document.getElementById('sidebar');
    
    if (!sidebar) {
        console.error('❌ Sidebar non trovata!');
        return;
    }
    
    // Toggle della classe visible
    sidebar.classList.toggle('visible');
    
    const isOpen = sidebar.classList.contains('visible');
    console.log('📱 Sidebar ora è:', isOpen ? 'APERTA ✅' : 'CHIUSA ❌');
    console.log('📋 Classi sidebar:', sidebar.className);
}

// Rendi la funzione accessibile globalmente
window.toggleSidebar = toggleSidebar;

console.log('✅ toggleSidebar caricata e globale:', typeof window.toggleSidebar);

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Flowmind App inizializzata');
    
    // Check authentication
    if (typeof Auth !== 'undefined') {
        if (!Auth.isDemoMode && !Auth.isLoggedIn()) {
            console.log('⚠️ Autenticazione richiesta');
            // Commenta la riga sotto per testare senza auth
            // window.location.href = 'index.html';
            // return;
        }
        
        if (Auth.updateUserDisplay) {
            Auth.updateUserDisplay();
        }
    }
    
    // Initialize app
    initializeApp();
    
    if (typeof loadState === 'function') {
        loadState();
    }
    
    setupEventListeners();
    
    if (typeof requestNotificationPermission === 'function') {
        requestNotificationPermission();
    }
    
    if (typeof setupLogoutButton === 'function') {
        setupLogoutButton();
    }
    
    // Auto-save
    setInterval(function() {
        if (typeof saveState === 'function') {
            saveState();
        }
    }, 5000);
    
    console.log('✅ App completamente caricata');
});

function initializeApp() {
    console.log('📱 Inizializzazione navigazione...');
    
    // Show first page
    if (typeof Navigation !== 'undefined') {
        Navigation.showPage('music');
    }
    
    // Add click handlers to nav links
    document.querySelectorAll('.nav-link[data-page]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            console.log('🔄 Navigazione a:', page);
            if (page && typeof Navigation !== 'undefined') {
                Navigation.showPage(page);
            }
        });
    });
    
    console.log('✅ Navigazione inizializzata');
}

function setupEventListeners() {
    console.log('🎧 Setup event listeners...');
    
    // IMPORTANTE: Aggiungi listener ai pulsanti menu    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('resize', handleResize);
    
    console.log('✅ Event listeners configurati');
}

function handleKeyboardShortcuts(e) {
    if (e.code === 'Space' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        if (typeof Navigation !== 'undefined') {
            const currentPage = Navigation.getCurrentPage();
            
            if (currentPage === 'timer' && typeof TimerPage !== 'undefined') {
                TimerPage.toggle();
            } else if (currentPage === 'focus' && typeof FocusPage !== 'undefined') {
                FocusPage.toggle();
            } else if (currentPage === 'music' && typeof MusicPage !== 'undefined') {
                MusicPage.togglePlay();
            }
        }
    }
    
    if (e.code === 'Escape') {
        if (typeof TimerPage !== 'undefined') TimerPage.reset();
        if (typeof FocusPage !== 'undefined') FocusPage.end();
        if (typeof MusicPage !== 'undefined') MusicPage.stop();
    }
}

function handleBeforeUnload(e) {
    if ((typeof TimerPage !== 'undefined' && TimerPage.isRunning()) || 
        (typeof FocusPage !== 'undefined' && FocusPage.isActive())) {
        e.preventDefault();
        e.returnValue = 'Hai una sessione attiva. Sei sicuro di voler uscire?';
        return e.returnValue;
    }
}

function handleResize() {
    if (window.innerWidth > 768) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.remove('visible');
        }
    }
}

function setupLogoutButton() {
    const userSection = document.querySelector('.user-section');
    if (userSection && typeof Auth !== 'undefined') {
        const logoutBtn = document.createElement('div');
        logoutBtn.style.cssText = 'position: absolute; top: 1rem; right: 1rem; cursor: pointer; opacity: 0.8; transition: opacity 0.3s;';
        logoutBtn.innerHTML = '🚪';
        logoutBtn.title = 'Logout';
        logoutBtn.onmouseover = () => logoutBtn.style.opacity = '1';
        logoutBtn.onmouseout = () => logoutBtn.style.opacity = '0.8';
        logoutBtn.onclick = handleLogout;
        userSection.style.position = 'relative';
        userSection.appendChild(logoutBtn);
    }
}

function handleLogout() {
    if (confirm('Sei sicuro di voler uscire?')) {
        if (typeof Auth !== 'undefined') {
            Auth.logout();
        }
    }
}

function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

function showNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
            body: body,
            icon: '🧠',
            badge: '🧠'
        });
    }
}

function simulateAIAnalysis() {
    console.log('🤖 AI analyzing user patterns...');
}

// Debug function
window.debugSidebar = function() {
    console.log('=== 🔍 SIDEBAR DEBUG ===');
    console.log('toggleSidebar esiste?', typeof window.toggleSidebar);
    console.log('Larghezza finestra:', window.innerWidth);
    console.log('È mobile?', window.innerWidth <= 768);
    
    const sidebar = document.getElementById('sidebar');
    console.log('Sidebar trovata?', sidebar !== null);
    
    if (sidebar) {
        console.log('Classi sidebar:', sidebar.className);
        console.log('Sidebar visibile?', sidebar.classList.contains('visible'));
        console.log('Transform:', window.getComputedStyle(sidebar).transform);
    }
    
    const buttons = document.querySelectorAll('.menu-toggle');
    console.log('Pulsanti menu trovati:', buttons.length);
    
    console.log('======================');
};

console.log('📄 app.js caricato completamente');

