// Main App Initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('%c🧠 Flowmind Web App Loaded', 'color: #667eea; font-size: 20px; font-weight: bold;');
    console.log('%cTrova il tuo ritmo, conquista il tuo tempo.', 'color: #764ba2; font-size: 14px;');

    // Initialize app
    initializeApp();
    loadState();
    setupEventListeners();
    requestNotificationPermission();

    // Start auto-save
    setInterval(saveState, 5000);

    // Start AI analysis simulation
    setInterval(simulateAIAnalysis, 300000);
});

function initializeApp() {
    // Load first page
    Navigation.showPage('music');

    // Setup navigation listeners
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            Navigation.showPage(page);
        });
    });
}

function setupEventListeners() {
    // Menu toggle for mobile
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('visible');
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);

    // Prevent accidental page leave
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Window resize handler
    window.addEventListener('resize', handleResize);
}

function handleKeyboardShortcuts(e) {
    // Space to toggle timer/focus mode
    if (e.code === 'Space' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        const currentPage = Navigation.getCurrentPage();

        if (currentPage === 'timer') {
            TimerPage.toggle();
        } else if (currentPage === 'focus') {
            FocusPage.toggle();
        } else if (currentPage === 'music') {
            MusicPage.togglePlay();
        }
    }

    // ESC to stop everything
    if (e.code === 'Escape') {
        TimerPage.reset();
        FocusPage.end();
        MusicPage.stop();
    }
}

function handleBeforeUnload(e) {
    if (TimerPage.isRunning() || FocusPage.isActive()) {
        e.preventDefault();
        e.returnValue = 'Hai una sessione attiva. Sei sicuro di voler uscire?';
        return e.returnValue;
    }
}

function handleResize() {
    if (window.innerWidth > 768) {
        document.getElementById('sidebar').classList.remove('visible');
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
    console.log('AI analyzing user patterns...');
}
