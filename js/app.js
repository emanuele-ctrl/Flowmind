// Main App Initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('%c🧠 Flowmind Web App Loaded', 'color: #667eea; font-size: 20px; font-weight: bold;');
    console.log('%cTrova il tuo ritmo, conquista il tuo tempo.', 'color: #764ba2; font-size: 14px;');

    // Initialize app
    initializeApp();
    loadState();
    setupEventListeners();
    requestNotificationPermission();
    loadUserProfile();

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

    // Setup mobile bottom navigation listeners
    document.querySelectorAll('.mobile-nav-btn').forEach(button => {
        button.addEventListener('click', function() {
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

    // Profile form handler
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveUserProfile();
        });
    }
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

function getInitials(name) {
    if (!name) return 'FM';
    const parts = name.trim().split(' ').filter(Boolean);
    const first = parts[0] ? parts[0][0] : '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase() || 'FM';
}

function applyUserProfile(profile) {
    const avatarText = profile.avatar || getInitials(profile.name);
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const userPlan = document.getElementById('userPlan');
    const profileAvatar = document.getElementById('profileAvatar');
    const profileDisplayName = document.getElementById('profileDisplayName');
    const profileDisplayPlan = document.getElementById('profileDisplayPlan');

    if (userAvatar) userAvatar.textContent = avatarText;
    if (userName) userName.textContent = profile.name || 'Flowmind User';
    if (userPlan) userPlan.textContent = profile.plan || 'Free';
    if (profileAvatar) profileAvatar.textContent = avatarText;
    if (profileDisplayName) profileDisplayName.textContent = profile.name || 'Flowmind User';
    if (profileDisplayPlan) profileDisplayPlan.textContent = profile.plan || 'Free';

    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profilePlan = document.getElementById('profilePlan');
    const profileGoal = document.getElementById('profileGoal');

    if (profileName && profile.name) profileName.value = profile.name;
    if (profileEmail && profile.email) profileEmail.value = profile.email;
    if (profilePlan && profile.plan) profilePlan.value = profile.plan;
    if (profileGoal && profile.goal) profileGoal.value = profile.goal;
}

function loadUserProfile() {
    const saved = Storage.load(Storage.keys.USER);
    const defaultProfile = {
        name: 'Emanuele Nasta',
        email: 'emanuele@email.com',
        plan: 'Premium Member',
        goal: ''
    };
    const profile = saved ? { ...defaultProfile, ...saved } : defaultProfile;
    applyUserProfile(profile);
}

function saveUserProfile() {
    const name = document.getElementById('profileName')?.value.trim();
    const email = document.getElementById('profileEmail')?.value.trim();
    const plan = document.getElementById('profilePlan')?.value;
    const goal = document.getElementById('profileGoal')?.value.trim();

    const profile = {
        name: name || 'Flowmind User',
        email: email || '',
        plan: plan || 'Free',
        goal: goal || '',
        avatar: getInitials(name)
    };

    Storage.save(Storage.keys.USER, profile);
    applyUserProfile(profile);

    if (typeof showNotification === 'function') {
        showNotification('✅ Profilo aggiornato', 'Le modifiche sono state salvate.');
    }
}

function toggleSoundCard(element, soundName) {
    SoundsPage.toggleSound(soundName, element);
}

function adjustSoundVolume(input, soundName) {
    const volume = parseInt(input.value, 10) || 0;
    SoundsPage.adjustVolume(soundName, volume);
}

function saveSoundMix() {
    const mixName = prompt('Nome del mix personalizzato:');
    if (!mixName) return;
    SoundsPage.saveMix(mixName);
}

// Timer & Focus global toggle functions
function toggleTimerPlay() {
    TimerPage.toggle();
    const btn = document.getElementById('timerPlayBtn');
    if (btn) {
        btn.textContent = TimerPage.state.isRunning ? '⏸️' : '▶️';
    }
}

function toggleFocusPlay() {
    FocusPage.toggle();
    const btn = document.getElementById('focusPlayBtn');
    if (btn) {
        btn.textContent = FocusPage.state.isActive ? '⏸️' : '▶️';
    }
}

function setTimerPreset(minutes, event) {
    TimerPage.setTimer(minutes);
    // Update active preset button
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }
    // Reset play button
    const btn = document.getElementById('timerPlayBtn');
    if (btn) btn.textContent = '▶️';
}

function toggleBlockerSwitch(element, blockerName) {
    element.classList.toggle('active');
    FocusPage.toggleBlocker(blockerName);
}

function toggleMusicPlay() {
    MusicPage.togglePlay();
    const btn = document.getElementById('musicPlayBtn');
    if (btn) {
        btn.textContent = MusicPage.state && MusicPage.state.isPlaying ? '⏸️' : '▶️';
    }
}
