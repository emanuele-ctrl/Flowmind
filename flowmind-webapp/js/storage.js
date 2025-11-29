// LocalStorage Manager
const Storage = {
    keys: {
        TIMER: 'flowmind_timer',
        FOCUS: 'flowmind_focus',
        SOUNDS: 'flowmind_sounds',
        STATS: 'flowmind_stats',
        MUSIC: 'flowmind_music',
        USER: 'flowmind_user'
    },

    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Error saving to localStorage:', e);
            return false;
        }
    },

    load(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error loading from localStorage:', e);
            return null;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Error removing from localStorage:', e);
            return false;
        }
    },

    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('Error clearing localStorage:', e);
            return false;
        }
    }
};

function saveState() {
    Storage.save(Storage.keys.TIMER, TimerPage.getState());
    Storage.save(Storage.keys.FOCUS, FocusPage.getState());
    Storage.save(Storage.keys.SOUNDS, SoundsPage.getState());
    Storage.save(Storage.keys.MUSIC, MusicPage.getState());
}

function loadState() {
    const timerState = Storage.load(Storage.keys.TIMER);
    const focusState = Storage.load(Storage.keys.FOCUS);
    const soundsState = Storage.load(Storage.keys.SOUNDS);
    const musicState = Storage.load(Storage.keys.MUSIC);

    if (timerState) TimerPage.setState(timerState);
    if (focusState) FocusPage.setState(focusState);
    if (soundsState) SoundsPage.setState(soundsState);
    if (musicState) MusicPage.setState(musicState);
}
