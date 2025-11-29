// AI Calendar Page Module
const AIPage = {
    state: {
        currentWeek: 0,
        selectedWeekdays: [], // Per la selezione multipla giorni
        tasks: [
            {
                id: 1,
                title: 'Riunione Team',
                duration: 90,
                priority: 'alta',
                time: '09:00',
                frequency: 'weekly',
                category: 'lavoro',
                completed: false,
                weekdays: [1], // Lunedì
                specificDate: null
            },
            {
                id: 2,
                title: 'Studio React',
                duration: 60,
                priority: 'media',
                time: '11:00',
                frequency: 'daily',
                category: 'studio',
                completed: false,
                weekdays: [1, 2, 3, 4, 5], // Lun-Ven
                specificDate: null
            },
            {
                id: 3,
                title: 'Palestra',
                duration: 90,
                priority: 'media',
                time: '18:00',
                frequency: 'multiple',
                category: 'sport',
                completed: false,
                weekdays: [1, 3, 5], // Lun, Mer, Ven
                specificDate: null
            },
            {
                id: 4,
                title: 'Compleanno Marco',
                duration: 180,
                priority: 'alta',
                time: '19:00',
                frequency: 'once',
                category: 'personale',
                completed: false,
                weekdays: [],
                specificDate: '2025-12-15' // Data specifica
            }
        ],
        aiSuggestions: [
            {
                type: 'optimal_time',
                title: '🎯 Momento Ottimale Rilevato',
                message: 'Basandoci sui tuoi pattern, le ore 10:00-12:00 sono ideali per attività che richiedono alta concentrazione.'
            },
            {
                type: 'overload_warning',
                title: '⚠️ Sovraccarico Previsto',
                message: 'Giovedì hai 6 ore di impegni consecutivi. Considera di spostare qualche attività a bassa priorità.'
            }
        ]
    },

    init() {
        console.log('AI Calendar initialized');
        this.renderWeeklyCalendar();
        this.renderTodayTasks();
        this.renderAISuggestions();
        this.setMinDate();
    },

    // Set minimum date to today
    setMinDate() {
        const dateInput = document.getElementById('taskDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
        }
    },

    // Handle frequency change
    handleFrequencyChange() {
        const frequency = document.getElementById('taskFrequency').value;
        const specificDateField = document.getElementById('specificDateField');
        const weekDaysField = document.getElementById('weekDaysField');

        // Reset selections
        this.selectedWeekdays = [];
        document.querySelectorAll('.weekday-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show/hide fields based on frequency
        if (frequency === 'once') {
            specificDateField.style.display = 'block';
            weekDaysField.style.display = 'none';
        } else if (frequency === 'weekly' || frequency === 'multiple') {
            specificDateField.style.display = 'none';
            weekDaysField.style.display = 'block';
        } else {
            specificDateField.style.display = 'none';
            weekDaysField.style.display = 'none';
        }
    },

    // Toggle weekday selection
    toggleWeekday(button) {
        const day = parseInt(button.getAttribute('data-day'));
        
        if (button.classList.contains('active')) {
            button.classList.remove('active');
            this.selectedWeekdays = this.selectedWeekdays.filter(d => d !== day);
        } else {
            button.classList.add('active');
            this.selectedWeekdays.push(day);
        }

        console.log('Selected weekdays:', this.selectedWeekdays);
    },

    // Modal Management
    openTaskModal() {
        const form = document.getElementById('quickAddForm');
        if (form) {
            form.style.display = 'block';
            this.setMinDate();
        }
    },

    closeTaskModal() {
        const form = document.getElementById('quickAddForm');
        if (form) {
            form.style.display = 'none';
            this.clearForm();
        }
    },

    clearForm() {
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskDuration').value = '';
        document.getElementById('taskTime').value = '';
        document.getElementById('taskDate').value = '';
        document.getElementById('taskPriority').value = 'media';
        document.getElementById('taskFrequency').value = 'once';
        document.getElementById('taskCategory').value = 'lavoro';
        
        // Reset weekdays selection
        this.selectedWeekdays = [];
        document.querySelectorAll('.weekday-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Hide conditional fields
        document.getElementById('specificDateField').style.display = 'none';
        document.getElementById('weekDaysField').style.display = 'none';
    },

    // Task Management
    addTask() {
        const title = document.getElementById('taskTitle').value;
        const duration = parseInt(document.getElementById('taskDuration').value);
        const priority = document.getElementById('taskPriority').value;
        const time = document.getElementById('taskTime').value;
        const frequency = document.getElementById('taskFrequency').value;
        const category = document.getElementById('taskCategory').value;
        const specificDate = document.getElementById('taskDate').value;

        // Validations
        if (!title || !duration) {
            alert('⚠️ Inserisci almeno titolo e durata!');
            return;
        }

        // Validate frequency-specific fields
        if (frequency === 'once' && !specificDate) {
            alert('⚠️ Seleziona una data per l\'evento!');
            return;
        }

        if ((frequency === 'weekly' || frequency === 'multiple') && this.selectedWeekdays.length === 0) {
            alert('⚠️ Seleziona almeno un giorno della settimana!');
            return;
        }

        // Determine weekdays based on frequency
        let weekdays = [];
        if (frequency === 'daily') {
            weekdays = [1, 2, 3, 4, 5]; // Lun-Ven by default
        } else if (frequency === 'weekly' || frequency === 'multiple') {
            weekdays = [...this.selectedWeekdays];
        }

        const newTask = {
            id: Date.now(),
            title,
            duration,
            priority,
            time: time || null,
            frequency,
            category,
            completed: false,
            weekdays,
            specificDate: specificDate || null
        };

        this.state.tasks.push(newTask);

        // AI suggestion
        if (!time) {
            const suggestedTime = this.suggestOptimalTime(duration, priority);
            newTask.time = suggestedTime;
            alert(`✨ L'AI suggerisce di programmare "${title}" alle ore ${suggestedTime} per massimizzare la produttività!`);
        }

        // Success message
        let frequencyMsg = '';
        if (frequency === 'once') {
            frequencyMsg = `per il ${this.formatDate(specificDate)}`;
        } else if (frequency === 'multiple') {
            frequencyMsg = `nei giorni: ${this.getWeekdaysNames(weekdays)}`;
        } else {
            frequencyMsg = `con frequenza ${frequency}`;
        }

        this.closeTaskModal();
        this.renderWeeklyCalendar();
        this.renderTodayTasks();

        showNotification('✅ Impegno Aggiunto', `"${title}" è stato aggiunto ${frequencyMsg}`);
    },

    suggestOptimalTime(duration, priority) {
        // AI logic per suggerire orario ottimale
        const optimalSlots = {
            alta: ['09:00', '10:00', '11:00'],
            media: ['14:00', '15:00', '16:00'],
            bassa: ['17:00', '18:00', '19:00']
        };

        const slots = optimalSlots[priority] || optimalSlots.media;
        return slots[Math.floor(Math.random() * slots.length)];
    },

    completeTask(taskId) {
        const task = this.state.tasks[taskId];
        if (task) {
            task.completed = true;
            showNotification('✅ Completato!', `"${task.title}" segnato come completato`);
            this.renderTodayTasks();
        }
    },

    editTask(taskId) {
        alert('✏️ Funzione di modifica in sviluppo...');
    },

    deleteTask(taskId) {
        if (confirm('Sei sicuro di voler eliminare questo impegno?')) {
            const task = this.state.tasks[taskId];
            showNotification('🗑️ Eliminato', `"${task.title}" è stato rimosso`);
            this.state.tasks.splice(taskId, 1);
            this.renderTodayTasks();
            this.renderWeeklyCalendar();
        }
    },

    // Calendar Navigation
    previousWeek() {
        this.state.currentWeek--;
        this.renderWeeklyCalendar();
    },

    nextWeek() {
        this.state.currentWeek++;
        this.renderWeeklyCalendar();
    },

    // Check if task should appear on a specific day
    shouldShowTaskOnDay(task, dayIndex, date) {
        // For specific date events
        if (task.frequency === 'once' && task.specificDate) {
            const taskDate = new Date(task.specificDate);
            return taskDate.toDateString() === date.toDateString();
        }

        // For daily events (Mon-Fri)
        if (task.frequency === 'daily') {
            return dayIndex >= 0 && dayIndex <= 4; // Lun-Ven
        }

        // For weekly/multiple events
        if (task.frequency === 'weekly' || task.frequency === 'multiple') {
            return task.weekdays.includes(dayIndex);
        }

        // Monthly - show on the same day of month
        if (task.frequency === 'monthly') {
            // Logic for monthly can be implemented later
            return false;
        }

        return false;
    },

    // Rendering
    renderWeeklyCalendar() {
        const container = document.getElementById('weeklyCalendar');
        if (!container) return;

        const days = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
        const today = new Date();
        const currentDay = today.getDay();
        
        // Calculate week start date
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1) + (this.state.currentWeek * 7));

        let html = '';
        days.forEach((day, index) => {
            const date = new Date(weekStart);
            date.setDate(weekStart.getDate() + index);
            
            const isToday = date.toDateString() === today.toDateString();
            const dayTasks = this.state.tasks.filter(task => 
                this.shouldShowTaskOnDay(task, index, date)
            );

            html += `
                <div class="day-column">
                    <div class="day-header ${isToday ? 'today' : ''}">
                        ${day} ${date.getDate()}/${date.getMonth() + 1}
                        ${isToday ? '<br>(Oggi)' : ''}
                    </div>
                    ${dayTasks.length === 0 ? 
                        '<p style="text-align: center; color: var(--text-secondary); padding: 1rem; font-size: 0.85rem;">Nessun impegno</p>' :
                        dayTasks.map(task => `
                            <div class="calendar-task priority-${task.priority}" 
                                 title="${task.title} - ${task.duration} min">
                                <div style="font-weight: 600; margin-bottom: 0.2rem;">
                                    ${this.getCategoryIcon(task.category)} ${task.title}
                                </div>
                                <div style="font-size: 0.75rem; color: var(--text-secondary);">
                                    ${task.time || 'Suggerito AI'} • ${task.duration}min
                                </div>
                            </div>
                        `).join('')
                    }
                </div>
            `;
        });

        container.innerHTML = html;
    },

    renderTodayTasks() {
        const container = document.getElementById('todayTasks');
        if (!container) return;

        const today = new Date();
        const dayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1; // Convert to 0=Mon, 6=Sun

        const todayTasks = this.state.tasks.filter(task => 
            !task.completed && this.shouldShowTaskOnDay(task, dayIndex, today)
        );

        if (todayTasks.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">Nessun impegno per oggi! 🎉</p>';
            return;
        }

        container.innerHTML = todayTasks.map((task, index) => `
            <div class="task-item priority-${task.priority}">
                <div class="task-time">
                    ${task.time ? `${task.time} - ${this.calculateEndTime(task.time, task.duration)}` : `Suggerito: ${this.suggestOptimalTime(task.duration, task.priority)}`}
                </div>
                <div class="task-content">
                    <h4>${this.getCategoryIcon(task.category)} ${task.title}</h4>
                    <p>${this.getCategoryName(task.category)} • ${task.duration} minuti
                    ${task.frequency === 'multiple' ? ' • ' + this.getWeekdaysNames(task.weekdays) : ''}
                    ${task.specificDate ? ' • ' + this.formatDate(task.specificDate) : ''}
                    </p>
                </div>
                <div class="task-actions">
                    <button onclick="AIPage.completeTask(${index})" title="Completa">✓</button>
                    <button onclick="AIPage.editTask(${index})" title="Modifica">✏️</button>
                    <button onclick="AIPage.deleteTask(${index})" title="Elimina">🗑️</button>
                </div>
            </div>
        `).join('');
    },

    renderAISuggestions() {
        const container = document.getElementById('aiSuggestions');
        if (!container) return;

        container.innerHTML = this.state.aiSuggestions.map(suggestion => `
            <div class="ai-suggestion">
                <h4>${suggestion.title}</h4>
                <p>${suggestion.message}</p>
            </div>
        `).join('');
    },

    // Helper Functions
    calculateEndTime(startTime, duration) {
        const [hours, minutes] = startTime.split(':').map(Number);
        const endMinutes = minutes + duration;
        const endHours = hours + Math.floor(endMinutes / 60);
        const finalMinutes = endMinutes % 60;

        return `${String(endHours).padStart(2, '0')}:${String(finalMinutes).padStart(2, '0')}`;
    },

    getCategoryIcon(category) {
        const icons = {
            lavoro: '💼',
            studio: '📚',
            personale: '🏠',
            sport: '⚡',
            hobby: '🎨'
        };
        return icons[category] || '📌';
    },

    getCategoryName(category) {
        const names = {
            lavoro: 'Lavoro',
            studio: 'Studio',
            personale: 'Personale',
            sport: 'Sport',
            hobby: 'Hobby'
        };
        return names[category] || 'Altro';
    },

    getWeekdaysNames(weekdays) {
        const names = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
        return weekdays.sort().map(d => names[d]).join(', ');
    },

    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('it-IT', options);
    },

    // AI Analysis
    analyzeSchedule() {
        // Analisi AI del carico di lavoro
        const totalHours = this.state.tasks.reduce((sum, task) => sum + task.duration, 0) / 60;
        const highPriorityCount = this.state.tasks.filter(t => t.priority === 'alta').length;

        if (totalHours > 8) {
            this.state.aiSuggestions.push({
                type: 'overload',
                title: '⚠️ Sovraccarico Rilevato',
                message: `Hai programmato ${totalHours.toFixed(1)} ore di impegni. Considera di riprogrammare alcune attività.`
            });
        }

        if (highPriorityCount > 5) {
            this.state.aiSuggestions.push({
                type: 'priority',
                title: '🎯 Troppe Priorità Alte',
                message: 'Hai molti impegni ad alta priorità. Valuta se alcuni possono essere riprogrammati.'
            });
        }
    },

    getState() {
        return this.state;
    },

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.renderWeeklyCalendar();
        this.renderTodayTasks();
        this.renderAISuggestions();
    }
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('ai-page')) {
        AIPage.init();
    }
});