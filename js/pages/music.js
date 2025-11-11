// Music Page Module
const MusicPage = {
    state: {
        isPlaying: false,
        currentTrack: 0,
        currentMode: 'focus'
    },

    init() {
        console.log('Music page initialized');
        this.setupEventListeners();
    },

    setupEventListeners() {
        // Event listeners specifici per la pagina musica
    },

    selectMode(mode) {
        this.state.currentMode = mode;
        console.log('Selected music mode:', mode);
        alert(`Modalità ${mode} attivata! La AI sta generando la playlist perfetta...`);
    },

    generatePlaylist() {
        alert('🎵 Generazione nuova playlist AI in corso...');
    },

    playTrack(trackIndex) {
        this.state.currentTrack = trackIndex;
        // Rimuovi active da tutti
        document.querySelectorAll('.playlist-item').forEach(item => {
            item.classList.remove('active');
        });
        // Aggiungi active al selezionato
        const items = document.querySelectorAll('.playlist-item');
        if (items[trackIndex]) {
            items[trackIndex].classList.add('active');
        }
    },

    togglePlay() {
        this.state.isPlaying = !this.state.isPlaying;
        return this.state.isPlaying;
    },

    stop() {
        this.state.isPlaying = false;
    },

    nextTrack() {
        this.state.currentTrack++;
        alert('⏭️ Traccia successiva');
    },

    previousTrack() {
        this.state.currentTrack--;
        alert('⏮️ Traccia precedente');
    },

    getState() {
        return this.state;
    },

    setState(newState) {
        this.state = { ...this.state, ...newState };
    }
};

// Music Page Functions
function toggleMusicPlay() {
    const isPlaying = MusicPage.togglePlay();
    document.getElementById("musicPlayBtn").textContent = isPlaying
        ? "⏸️"
        : "▶️";
}

