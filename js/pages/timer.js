// Timer Page Module
const TimerPage = {
    state: {
        isRunning: false,
        seconds: 1500,
        interval: null,
        selectedPreset: 25
    },

    init() {
        console.log('Timer page initialized');
        this.updateDisplay();
    },

    toggle() {
        this.state.isRunning = !this.state.isRunning;

        if (this.state.isRunning) {
            this.start();
        } else {
            this.pause();
        }
    },

    start() {
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

    reset() {
        this.pause();
        this.state.isRunning = false;
        this.state.seconds = this.state.selectedPreset * 60;
        this.updateDisplay();

        const btn = document.getElementById('timerPlayBtn');
        if (btn) btn.textContent = '▶️';
    },

    complete() {
        this.pause();
        this.state.isRunning = false;
        showNotification('⏰ Timer Completato', 'Sessione completata! Ottimo lavoro!');
        this.reset();
    },

    setTimer(minutes) {
        this.pause();
        this.state.isRunning = false;
        this.state.selectedPreset = minutes;
        this.state.seconds = minutes * 60;
        this.updateDisplay();

        const btn = document.getElementById('timerPlayBtn');
        if (btn) btn.textContent = '▶️';
    },

    updateDisplay() {
        const minutes = Math.floor(this.state.seconds / 60);
        const seconds = this.state.seconds % 60;
        const display = document.getElementById('timerDisplay');
        if (display) {
            display.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    },

    isRunning() {
        return this.state.isRunning;
    },

    getState() {
        return {
            seconds: this.state.seconds,
            isRunning: this.state.isRunning,
            selectedPreset: this.state.selectedPreset
        };
    },

    setState(newState) {
        if (newState.seconds) this.state.seconds = newState.seconds;
        if (newState.selectedPreset) this.state.selectedPreset = newState.selectedPreset;
        this.updateDisplay();
    }
};


// Timer Page Functions
function toggleTimerPlay() {
    TimerPage.toggle();
    const btn = document.getElementById("timerPlayBtn");
    btn.textContent = TimerPage.isRunning() ? "⏸️" : "▶️";
}

function setTimerPreset(minutes, event) {
    TimerPage.setTimer(minutes);
    document
        .querySelectorAll(".preset-btn")
        .forEach((btn) => btn.classList.remove("active"));
    event.target.classList.add("active");
}
