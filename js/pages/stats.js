// Stats Page Module
const StatsPage = {
    state: {
        streak: 14,
        totalTime: 28,
        sessionsCompleted: 47,
        weeklyData: [5.5, 4.5, 6, 5, 4, 3, 2.5]
    },

    init() {
        console.log('Stats page initialized');
        this.updateCharts();
    },

    updateCharts() {
        // Logic per aggiornare i grafici
        console.log('Updating charts with data:', this.state.weeklyData);
    },

    getWeeklyStats() {
        return this.state.weeklyData;
    },

    addSession(duration) {
        this.state.sessionsCompleted++;
        this.state.totalTime += duration;
    },

    incrementStreak() {
        this.state.streak++;
    },

    resetStreak() {
        this.state.streak = 0;
    },

    getState() {
        return this.state;
    },

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.updateCharts();
    }
};
