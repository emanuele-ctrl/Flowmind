// Timer Page Module
const TimerPage = {
    state: {
        isRunning: false,
        seconds: 1500, // 25 minutes
        interval: null
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
        this.state.seconds = 1500;
        this.updateDisplay();
    },

    complete() {
        this.pause();
        this.state.isRunning = false;
        showNotification('⏰ Timer Completato', 'Sessione completata! Ottimo lavoro!');
        this.reset();
    },

    setTimer(minutes) {
        this.reset();
        this.state.seconds = minutes * 60;
        this.updateDisplay();
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
            isRunning: this.state.isRunning
        };
    },

    setState(newState) {
        if (newState.seconds) this.state.seconds = newState.seconds;
        this.updateDisplay();
    }
};
