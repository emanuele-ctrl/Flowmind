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
        document.querySelectorAll('.sound-card').forEach(card => {
            card.classList.remove('active');
            const slider = card.querySelector('.volume-slider');
            if (slider) slider.value = 0;
        });

        // Load preset
        const preset = this.state.presets[presetName];
        if (preset) {
            preset.forEach(sound => {
                this.state.activeSounds[sound.name] = sound.volume;

                // Update UI
                document.querySelectorAll('.sound-card').forEach(card => {
                    const onclick = card.getAttribute('onclick');
                    if (onclick && onclick.includes(sound.name)) {
                        card.classList.add('active');
                        const slider = card.querySelector('.volume-slider');
                        if (slider) slider.value = sound.volume;
                    }
                });
            });
            alert(`🎵 Preset "${presetName}" caricato!`);
        }
    },

    saveMix(mixName) {
        if (Object.keys(this.state.activeSounds).length === 0) {
            alert('⚠️ Seleziona almeno un suono prima di salvare il mix!');
            return false;
        }

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

// Sounds Page Functions
function toggleSoundCard(element, soundName) {
    const slider = element.querySelector(".volume-slider");

    if (element.classList.contains("active")) {
        element.classList.remove("active");
        slider.value = 0;
        SoundsPage.adjustVolume(soundName, 0);
    } else {
        element.classList.add("active");
        slider.value = 70;
        SoundsPage.adjustVolume(soundName, 70);
    }
}

function adjustSoundVolume(slider, soundName) {
    const volume = slider.value;
    const card = slider.closest(".sound-card");

    if (volume > 0) {
        card.classList.add("active");
    } else {
        card.classList.remove("active");
    }

    SoundsPage.adjustVolume(soundName, volume);
}

function saveSoundMix() {
    const mixName = prompt("Dai un nome al tuo mix personalizzato:");
    if (mixName) {
        SoundsPage.saveMix(mixName);
    }
}