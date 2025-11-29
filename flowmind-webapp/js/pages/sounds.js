// Ambient Sounds Page Module
const SoundsPage = {
    state: {
        activeSounds: {},
        presets: {
            focus: [
                { name: 'rain', volume: 60 },
                { name: 'whitenoise', volume: 40 },
                { name: 'fire', volume: 30 }
            ],
            relax: [
                { name: 'waves', volume: 70 },
                { name: 'forest', volume: 50 },
                { name: 'wind', volume: 40 }
            ],
            study: [
                { name: 'cafe', volume: 60 },
                { name: 'rain', volume: 40 }
            ],
            sleep: [
                { name: 'night', volume: 70 },
                { name: 'waves', volume: 50 },
                { name: 'fire', volume: 30 }
            ]
        }
    },

    init() {
        console.log('Sounds page initialized');
    },

    toggleSound(soundName, element) {
        if (this.state.activeSounds[soundName]) {
            delete this.state.activeSounds[soundName];
            element.classList.remove('active');
        } else {
            this.state.activeSounds[soundName] = 70;
            element.classList.add('active');
        }
        console.log('Active sounds:', this.state.activeSounds);
    },

    adjustVolume(soundName, volume) {
        if (volume > 0) {
            this.state.activeSounds[soundName] = volume;
        } else {
            delete this.state.activeSounds[soundName];
        }
        console.log(`${soundName} volume: ${volume}%`);
    },

    loadPreset(presetName) {
        // Reset all sounds
        this.state.activeSounds = {};

        // Load preset
        const preset = this.state.presets[presetName];
        if (preset) {
            preset.forEach(sound => {
                this.state.activeSounds[sound.name] = sound.volume;
            });
            alert(`🎵 Preset "${presetName}" caricato!`);
        }
    },

    saveMix(mixName) {
        if (Object.keys(this.state.activeSounds).length === 0) {
            alert('⚠️ Seleziona almeno un suono prima di salvare il mix!');
            return false;
        }

        // Save to localStorage
        const customMixes = Storage.load('custom_mixes') || {};
        customMixes[mixName] = { ...this.state.activeSounds };
        Storage.save('custom_mixes', customMixes);

        alert(`✅ Mix "${mixName}" salvato con successo!`);
        return true;
    },

    getState() {
        return {
            activeSounds: this.state.activeSounds
        };
    },

    setState(newState) {
        if (newState.activeSounds) {
            this.state.activeSounds = newState.activeSounds;
        }
    }
};

