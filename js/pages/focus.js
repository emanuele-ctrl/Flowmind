// Focus Mode Page Module
const FocusPage = {
    state: {
        isActive: false,
        seconds: 2700, // 45 minutes
        option: 2700,
        interval: null,
        blockers: {
            notifications: true,
            socialMedia: true,
            email: true,
            chat: true,
        },
    },

    init() {
        console.log("Focus mode initialized");
        const savedDefault = parseInt(
            localStorage.getItem("focusDefaultDuration"), 10);
        if (!isNaN(savedDefault)) {
            this.state.defaultDuration = savedDefault;
            this.state.seconds = savedDefault;
        }
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
        showNotification(
            "🎯 Modalità Focus Attivata",
            "Tutte le distrazioni sono bloccate"
        );

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
        this.state.seconds = this.state.option;
        this.updateDisplay();
    },

    complete() {
        this.pause();
        this.state.isActive = false;
        showNotification(
            "🎉 Sessione Focus Completata!",
            "Hai fatto un lavoro eccellente!"
        );
        this.end();
    },

    setDuration(minutes) {
        this.end();
        this.state.seconds = minutes * 60;
        this.state.option = minutes * 60;
        localStorage.setItem("focusDefaultDuration", seconds); // salva
        this.updateDisplay();
    },

    updateDisplay() {
        const minutes = Math.floor(this.state.seconds / 60);
        const seconds = this.state.seconds % 60;
        const display = document.getElementById("focusTimer");
        if (display) {
            display.textContent = `${String(minutes).padStart(2, "0")}:${String(
                seconds
            ).padStart(2, "0")}`;
        }
    },

    toggleBlocker(blockerName) {
        this.state.blockers[blockerName] = !this.state.blockers[blockerName];
        console.log("Blockers:", this.state.blockers);
    },

    isActive() {
        return this.state.isActive;
    },

    getState() {
        return {
            seconds: this.state.seconds,
            isActive: this.state.isActive,
            blockers: this.state.blockers,
        };
    },

    setState(newState) {
        if (newState.seconds) this.state.seconds = newState.seconds;
        if (newState.blockers) this.state.blockers = newState.blockers;
        this.updateDisplay();
    },
};
