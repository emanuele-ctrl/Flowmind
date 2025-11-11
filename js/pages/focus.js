// Focus Mode Page Module
const FocusPage = {
    state: {
        isActive: false,
        seconds: 2700,
        interval: null,
        selectedDuration: 45,
        blockers: {
            notifications: true,
            socialMedia: true,
            email: true,
            chat: true
        }
    },

    init() {
        console.log('Focus mode initialized');
        this.updateDisplay();
    },

    toggle() {
        this.state.isActive = !this.state.isActive;

        if (this.state.isActive) {
            this.start();
        } else {
            this.pause();
        }
    },

    start() {
        showNotification('🎯 Modalità Focus Attivata', 'Tutte le distrazioni sono bloccate');

        this.state.interval = setInterval(() => {
            if (this.state.seconds > 0) {
                this.state.seconds--;
                this.updateDisplay();
            } else {
                this.complete();
            }
        }, 1000);
    },

    pause() {
        if (this.state.interval) {
            clearInterval(this.state.interval);
            this.state.interval = null;
        }
    },

    end() {
        this.pause();
        this.state.isActive = false;
        this.state.seconds = this.state.selectedDuration * 60;
        this.updateDisplay();

        const btn = document.getElementById('focusPlayBtn');
        if (btn) btn.textContent = '▶️';
    },

    complete() {
        this.pause();
        this.state.isActive = false;
        showNotification('🎉 Sessione Focus Completata!', 'Hai fatto un lavoro eccellente!');
        this.end();
    },

    setDuration(minutes) {
        this.pause();
        this.state.isActive = false;
        this.state.selectedDuration = parseInt(minutes);
        this.state.seconds = minutes * 60;
        this.updateDisplay();

        const btn = document.getElementById('focusPlayBtn');
        if (btn) btn.textContent = '▶️';
    },

    updateDisplay() {
        const minutes = Math.floor(this.state.seconds / 60);
        const seconds = this.state.seconds % 60;
        const display = document.getElementById('focusTimer');
        if (display) {
            display.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    },

    toggleBlocker(blockerName) {
        this.state.blockers[blockerName] = !this.state.blockers[blockerName];
        console.log('Blockers:', this.state.blockers);
    },

    isActive() {
        return this.state.isActive;
    },

    getState() {
        return {
            seconds: this.state.seconds,
            isActive: this.state.isActive,
            selectedDuration: this.state.selectedDuration,
            blockers: this.state.blockers
        };
    },

    setState(newState) {
        if (newState.seconds) this.state.seconds = newState.seconds;
        if (newState.selectedDuration) this.state.selectedDuration = newState.selectedDuration;
        if (newState.blockers) this.state.blockers = newState.blockers;
        this.updateDisplay();
    }
};


// Focus Page Functions
function toggleFocusPlay() {
    FocusPage.toggle();
    const btn = document.getElementById("focusPlayBtn");
    btn.textContent = FocusPage.isActive() ? "⏸️" : "▶️";
}

function toggleBlockerSwitch(element, blockerName) {
    element.classList.toggle("active");
    FocusPage.toggleBlocker(blockerName);
}
