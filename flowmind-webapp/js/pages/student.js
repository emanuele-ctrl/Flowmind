// Student Plan Page Module
const StudentPage = {
    state: {
        studyPlans: [],
        completedExams: [],
        currentQuiz: null,
        quizQuestions: [],
        currentQuestionIndex: 0,
        stats: {
            totalStudyHours: 0,
            completedSessions: 0,
            studyStreak: 0,
            grades: []
        }
    },

    init() {
        console.log('Student Plan initialized');
        this.loadData();
        this.renderActivePlans();
        this.renderTodaySessions();
        this.renderCompletedExams();
        this.updateStats();
        this.setMinExamDate();
    },

    setMinExamDate() {
        const dateInput = document.getElementById('examDate');
        if (dateInput) {
            const today = new Date();
            today.setDate(today.getDate() + 1); // Minimo domani
            dateInput.min = today.toISOString().split('T')[0];
        }
    },

    // Modal Management
    openExamModal() {
        const form = document.getElementById('examForm');
        if (form) {
            form.style.display = 'block';
            this.setMinExamDate();
        }
    },

    closeExamModal() {
        const form = document.getElementById('examForm');
        if (form) {
            form.style.display = 'none';
            this.clearExamForm();
        }
    },

    clearExamForm() {
        document.getElementById('examSubject').value = '';
        document.getElementById('examType').value = 'verifica';
        document.getElementById('examDate').value = '';
        document.getElementById('examTopics').value = '';
        document.getElementById('studyHoursPerDay').value = '2';
        document.getElementById('practiceHoursPerDay').value = '1';
        document.getElementById('examDifficulty').value = 'media';
    },

    // Generate Study Plan with AI
    generateStudyPlan() {
        console.log('🎓 generateStudyPlan() called');

        // Get form values
        const subject = document.getElementById('examSubject').value.trim();
        const type = document.getElementById('examType').value;
        const date = document.getElementById('examDate').value;
        const topicsInput = document.getElementById('examTopics').value.trim();
        const studyHours = parseFloat(document.getElementById('studyHoursPerDay').value);
        const practiceHours = parseFloat(document.getElementById('practiceHoursPerDay').value);
        const difficulty = document.getElementById('examDifficulty').value;

        console.log('Form data:', { subject, type, date, topicsInput, studyHours, practiceHours, difficulty });

        // Validations
        if (!subject || !date || !topicsInput) {
            alert('⚠️ Compila tutti i campi obbligatori (Materia, Data, Argomenti)!');
            return;
        }

        if (isNaN(studyHours) || studyHours <= 0) {
            alert('⚠️ Le ore di studio devono essere maggiori di 0!');
            return;
        }

        if (isNaN(practiceHours) || practiceHours < 0) {
            alert('⚠️ Le ore di esercitazione non possono essere negative!');
            return;
        }

        // Parse topics
        const topics = topicsInput.split(',').map(t => t.trim()).filter(t => t.length > 0);

        if (topics.length === 0) {
            alert('⚠️ Inserisci almeno un argomento da studiare!');
            return;
        }

        console.log('Parsed topics:', topics);

        // Calculate days until exam
        const examDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        examDate.setHours(0, 0, 0, 0);

        const daysUntilExam = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));

        console.log('Days until exam:', daysUntilExam);

        if (daysUntilExam <= 0) {
            alert('⚠️ La data dell\'esame deve essere futura!');
            return;
        }

        // AI generates study schedule
        console.log('Generating AI schedule...');
        const schedule = this.generateAISchedule(topics, daysUntilExam, studyHours, practiceHours, difficulty);
        console.log('Schedule generated:', schedule);

        // Create new plan object
        const newPlan = {
            id: Date.now(),
            subject: subject,
            type: type,
            examDate: date,
            topics: topics,
            studyHoursPerDay: studyHours,
            practiceHoursPerDay: practiceHours,
            difficulty: difficulty,
            schedule: schedule,
            completed: false,
            grade: null,
            createdAt: new Date().toISOString()
        };

        console.log('New plan created:', newPlan);

        // Add to state
        this.state.studyPlans.push(newPlan);
        console.log('Total plans now:', this.state.studyPlans.length);
        console.log('All plans:', this.state.studyPlans);

        // Save data
        this.saveData();

        // Close modal
        this.closeExamModal();

        // Re-render UI
        console.log('Rendering UI...');
        this.renderActivePlans();
        this.renderTodaySessions();
        this.updateQuizSubjects();
        this.updateStats();

        // Show success notification
        if (typeof showNotification === 'function') {
            showNotification('✨ Piano Generato!', `Piano di studio per ${subject} creato con successo. ${schedule.length} giorni di preparazione.`);
        } else {
            alert(`✨ Piano Generato!\n\nPiano di studio per ${subject} creato con successo.\n${schedule.length} giorni di preparazione.`);
        }

        console.log('✅ generateStudyPlan() completed successfully');
    },

    generateAISchedule(topics, days, studyHours, practiceHours, difficulty) {
        const schedule = [];
        const topicsPerDay = Math.ceil(topics.length / days);

        // Difficulty multipliers
        const difficultyMultipliers = {
            'facile': 0.8,
            'media': 1,
            'difficile': 1.3,
            'molto-difficile': 1.6
        };

        const multiplier = difficultyMultipliers[difficulty] || 1;
        const adjustedStudyHours = studyHours * multiplier;

        let topicIndex = 0;
        const today = new Date();

        for (let day = 0; day < days; day++) {
            const date = new Date(today);
            date.setDate(today.getDate() + day);

            const dayTopics = [];
            for (let i = 0; i < topicsPerDay && topicIndex < topics.length; i++) {
                dayTopics.push(topics[topicIndex]);
                topicIndex++;
            }

            // Last day: review all topics
            if (day === days - 1) {
                schedule.push({
                    date: date.toISOString().split('T')[0],
                    type: 'review',
                    topics: ['Ripasso Generale di tutti gli argomenti'],
                    studyHours: adjustedStudyHours,
                    practiceHours: practiceHours * 1.5,
                    completed: false
                });
            }
            // Second to last day: intensive practice
            else if (day === days - 2) {
                schedule.push({
                    date: date.toISOString().split('T')[0],
                    type: 'practice',
                    topics: ['Esercitazioni Intensive'],
                    studyHours: adjustedStudyHours * 0.5,
                    practiceHours: practiceHours * 2,
                    completed: false
                });
            }
            // Regular study days
            else if (dayTopics.length > 0) {
                schedule.push({
                    date: date.toISOString().split('T')[0],
                    type: 'study',
                    topics: dayTopics,
                    studyHours: adjustedStudyHours,
                    practiceHours: practiceHours,
                    completed: false
                });
            }
        }

        return schedule;
    },

    // Complete Exam and Add Grade
    completeExam(planId) {
        const plan = this.state.studyPlans.find(p => p.id === planId);
        if (!plan) return;

        const grade = prompt(`Inserisci il voto ottenuto per ${plan.subject}:\n(es. 8, 7.5, 28, 30L)`);

        if (grade === null) return; // Cancelled

        if (!grade || grade.trim() === '') {
            alert('⚠️ Inserisci un voto valido!');
            return;
        }

        // Parse grade
        const numericGrade = parseFloat(grade.replace('L', ''));

        if (isNaN(numericGrade)) {
            alert('⚠️ Formato voto non valido!');
            return;
        }

        // Calculate if grade met expectations based on study plan adherence
        const completedSessions = plan.schedule.filter(s => s.completed).length;
        const totalSessions = plan.schedule.length;
        const adherence = (completedSessions / totalSessions) * 100;

        // AI feedback based on grade and adherence
        const feedback = this.generateGradeFeedback(numericGrade, adherence, plan);

        plan.completed = true;
        plan.grade = grade;
        plan.feedback = feedback;
        plan.adherence = adherence;

        this.state.completedExams.push({
            ...plan,
            completedAt: new Date().toISOString()
        });

        this.state.stats.grades.push(numericGrade);

        // Remove from active plans
        this.state.studyPlans = this.state.studyPlans.filter(p => p.id !== planId);

        this.saveData();
        this.renderActivePlans();
        this.renderCompletedExams();
        this.updateStats();

        showNotification('🎉 Prova Completata!', `${plan.subject}: ${grade} - ${feedback.title}`);
    },

    generateGradeFeedback(grade, adherence, plan) {
        let feedback = {
            title: '',
            message: '',
            suggestions: []
        };

        // Grade-based feedback (assuming 1-10 or 18-30 scale)
        const isUniversityScale = grade >= 18;
        const normalizedGrade = isUniversityScale ? ((grade - 18) / 12) * 10 : grade;

        if (normalizedGrade >= 9) {
            feedback.title = '🌟 Eccellente!';
            feedback.message = 'Ottimo risultato! Il tuo metodo di studio è molto efficace.';
        } else if (normalizedGrade >= 7) {
            feedback.title = '👍 Buon Lavoro!';
            feedback.message = 'Buon risultato! Continua così.';
        } else if (normalizedGrade >= 6) {
            feedback.title = '✅ Sufficiente';
            feedback.message = 'Risultato sufficiente, ma c\'è margine di miglioramento.';
        } else {
            feedback.title = '💪 Da Migliorare';
            feedback.message = 'Il risultato non è quello sperato. Analizziamo come migliorare.';
        }

        // Adherence-based suggestions
        if (adherence < 50) {
            feedback.suggestions.push('Hai completato meno della metà delle sessioni programmate. Prova ad essere più costante nello studio.');
        } else if (adherence < 80) {
            feedback.suggestions.push('Hai saltato alcune sessioni. Cerca di seguire il piano più rigorosamente.');
        }

        // Difficulty-based suggestions
        if (normalizedGrade < 7 && plan.difficulty === 'facile') {
            feedback.suggestions.push('Il risultato suggerisce che la materia era più difficile del previsto. Dedica più tempo alle prossime verifiche simili.');
        }

        if (normalizedGrade >= 8 && plan.difficulty === 'molto-difficile') {
            feedback.suggestions.push('Ottimo! Hai gestito bene una materia difficile. Il tuo metodo è efficace per argomenti complessi.');
        }

        // Study hours suggestions
        if (normalizedGrade < 6 && plan.studyHoursPerDay < 2) {
            feedback.suggestions.push('Considera di aumentare le ore di studio giornaliere per le prossime prove.');
        }

        if (feedback.suggestions.length === 0) {
            feedback.suggestions.push('Mantieni questo approccio allo studio!');
        }

        return feedback;
    },

    // View detailed study plan
    viewStudyPlan(planId) {
        const plan = this.state.studyPlans.find(p => p.id === planId);
        if (!plan) return;

        let scheduleHTML = '<div class="study-schedule"><h4>📅 Programma Dettagliato</h4><div class="schedule-timeline">';

        plan.schedule.forEach((day, index) => {
            const isCompleted = day.completed;
            const typeIcons = {
                study: '📖',
                practice: '✍️',
                review: '🔄'
            };

            scheduleHTML += `
                <div class="schedule-day ${isCompleted ? 'completed' : ''}">
                    <div class="schedule-date">${this.formatDate(day.date)}</div>
                    <div class="schedule-content">
                        <div class="schedule-topics">
                            ${typeIcons[day.type]} ${day.topics.join(', ')}
                        </div>
                        <div class="schedule-time">
                            📚 ${day.studyHours}h studio • ✍️ ${day.practiceHours}h pratica
                        </div>
                    </div>
                    <input type="checkbox" class="schedule-checkbox" 
                           ${isCompleted ? 'checked' : ''} 
                           onchange="StudentPage.toggleSessionComplete(${planId}, ${index})">
                </div>
            `;
        });

        scheduleHTML += '</div></div>';

        // Show in a modal or expanded view
        const planCard = document.querySelector(`[data-plan-id="${planId}"]`);
        if (planCard) {
            const existing = planCard.querySelector('.study-schedule');
            if (existing) {
                existing.remove();
            } else {
                planCard.insertAdjacentHTML('beforeend', scheduleHTML);
            }
        }
    },

    toggleSessionComplete(planId, sessionIndex) {
        const plan = this.state.studyPlans.find(p => p.id === planId);
        if (!plan || !plan.schedule[sessionIndex]) return;

        plan.schedule[sessionIndex].completed = !plan.schedule[sessionIndex].completed;

        if (plan.schedule[sessionIndex].completed) {
            this.state.stats.completedSessions++;
            this.state.stats.totalStudyHours += plan.schedule[sessionIndex].studyHours + plan.schedule[sessionIndex].practiceHours;
        } else {
            this.state.stats.completedSessions--;
            this.state.stats.totalStudyHours -= plan.schedule[sessionIndex].studyHours + plan.schedule[sessionIndex].practiceHours;
        }

        this.saveData();
        this.updateStats();
        this.renderTodaySessions();
    },

    deletePlan(planId) {
        const plan = this.state.studyPlans.find(p => p.id === planId);
        if (!plan) return;

        if (confirm(`Sei sicuro di voler eliminare il piano di studio per ${plan.subject}?`)) {
            this.state.studyPlans = this.state.studyPlans.filter(p => p.id !== planId);
            this.saveData();
            this.renderActivePlans();
            this.renderTodaySessions();
            this.updateQuizSubjects();
            showNotification('🗑️ Piano Eliminato', `Piano di studio per ${plan.subject} rimosso`);
        }
    },

    // AI Quiz Functionality
    updateQuizSubjects() {
        const select = document.getElementById('quizSubject');
        if (!select) return;

        const subjects = [...new Set(this.state.studyPlans.map(p => p.subject))];

        select.innerHTML = '<option value="">-- Scegli una materia --</option>';
        subjects.forEach(subject => {
            select.innerHTML += `<option value="${subject}">${subject}</option>`;
        });
    },

    startAIQuiz() {
        const subject = document.getElementById('quizSubject').value;

        if (!subject) {
            alert('⚠️ Seleziona prima una materia!');
            return;
        }

        const plan = this.state.studyPlans.find(p => p.subject === subject);
        if (!plan) {
            alert('⚠️ Piano di studio non trovato!');
            return;
        }

        // Generate questions based on topics
        this.state.quizQuestions = this.generateQuizQuestions(plan);
        this.state.currentQuestionIndex = 0;
        this.state.currentQuiz = {
            subject,
            planId: plan.id,
            answers: [],
            startTime: new Date()
        };

        document.getElementById('quizContainer').style.display = 'block';
        document.getElementById('quizArea').style.display = 'block';
        document.getElementById('startQuizBtn').style.display = 'none';

        this.showQuestion();
    },

    generateQuizQuestions(plan) {
        const questions = [];

        // Question templates
        const templates = [
            'Spiega il concetto di {topic} e fai degli esempi pratici.',
            'Quali sono gli aspetti principali di {topic}?',
            'Come si applica {topic} nella pratica?',
            'Descrivi {topic} con parole tue.',
            'Quali collegamenti puoi fare tra {topic} e altri argomenti correlati?'
        ];

        plan.topics.forEach(topic => {
            const template = templates[Math.floor(Math.random() * templates.length)];
            questions.push({
                topic,
                question: template.replace('{topic}', topic),
                answer: null,
                score: null,
                feedback: null
            });
        });

        // Shuffle questions
        return questions.sort(() => Math.random() - 0.5);
    },

    showQuestion() {
        if (this.state.currentQuestionIndex >= this.state.quizQuestions.length) {
            this.endQuiz();
            return;
        }

        const question = this.state.quizQuestions[this.state.currentQuestionIndex];
        document.getElementById('quizQuestion').textContent = question.question;
        document.getElementById('quizAnswer').value = '';
        document.getElementById('quizFeedback').style.display = 'none';
    },

    submitAnswer() {
        const answer = document.getElementById('quizAnswer').value.trim();

        if (!answer) {
            alert('⚠️ Scrivi una risposta prima di inviare!');
            return;
        }

        const question = this.state.quizQuestions[this.state.currentQuestionIndex];

        // AI evaluation (simulated)
        const evaluation = this.evaluateAnswer(answer, question.topic);

        question.answer = answer;
        question.score = evaluation.score;
        question.feedback = evaluation.feedback;

        this.state.currentQuiz.answers.push({
            question: question.question,
            answer,
            score: evaluation.score
        });

        // Show feedback
        this.showFeedback(evaluation);
    },

    evaluateAnswer(answer, topic) {
        // Simulated AI evaluation
        // In production, this would call the Anthropic API

        const wordCount = answer.split(/\s+/).length;
        const hasKeywords = answer.toLowerCase().includes(topic.toLowerCase());
        const hasExamples = /esempio|per esempio|ad esempio|come/i.test(answer);

        let score = 5; // Base score
        let feedback = [];

        // Length evaluation
        if (wordCount > 100) {
            score += 2;
            feedback.push('✅ Risposta completa e articolata');
        } else if (wordCount > 50) {
            score += 1;
            feedback.push('✅ Risposta adeguata');
        } else {
            feedback.push('⚠️ Risposta troppo breve, approfondisci maggiormente');
        }

        // Keywords evaluation
        if (hasKeywords) {
            score += 1;
            feedback.push('✅ Hai menzionato i concetti chiave');
        } else {
            score -= 1;
            feedback.push('⚠️ Mancano riferimenti espliciti all\'argomento');
        }

        // Examples evaluation
        if (hasExamples) {
            score += 2;
            feedback.push('✅ Ottimo uso di esempi pratici');
        } else {
            feedback.push('💡 Suggerimento: aggiungi esempi pratici per migliorare');
        }

        // Cap score at 10
        score = Math.min(10, Math.max(1, score));

        return {
            score,
            feedback: feedback.join('\n')
        };
    },

    showFeedback(evaluation) {
        const feedbackDiv = document.getElementById('quizFeedback');
        const isGood = evaluation.score >= 6;

        feedbackDiv.innerHTML = `
            <div class="quiz-feedback-box ${!isGood ? 'negative' : ''}">
                <h4>📊 Valutazione AI</h4>
                <div class="quiz-score">${evaluation.score}/10</div>
                <div class="quiz-evaluation">
                    <h5>Feedback:</h5>
                    <p style="white-space: pre-line; line-height: 1.8;">${evaluation.feedback}</p>
                </div>
            </div>
        `;

        feedbackDiv.style.display = 'block';
    },

    nextQuestion() {
        this.state.currentQuestionIndex++;
        this.showQuestion();
    },

    endQuiz() {
        if (!this.state.currentQuiz) return;

        const totalScore = this.state.quizQuestions.reduce((sum, q) => sum + (q.score || 0), 0);
        const averageScore = (totalScore / this.state.quizQuestions.length).toFixed(1);

        const endTime = new Date();
        const duration = Math.round((endTime - this.state.currentQuiz.startTime) / 1000 / 60);

        alert(`🎓 Interrogazione Completata!\n\nVoto Medio: ${averageScore}/10\nDomande: ${this.state.quizQuestions.length}\nDurata: ${duration} minuti\n\nContinua ad esercitarti per migliorare!`);

        // Reset quiz
        document.getElementById('quizContainer').style.display = 'none';
        document.getElementById('quizArea').style.display = 'none';
        document.getElementById('startQuizBtn').style.display = 'block';
        document.getElementById('quizSubject').value = '';

        this.state.currentQuiz = null;
        this.state.quizQuestions = [];
        this.state.currentQuestionIndex = 0;
    },

    // Rendering Functions
    renderActivePlans() {
        console.log('📋 renderActivePlans() called');

        const container = document.getElementById('activePlans');
        if (!container) {
            console.error('❌ Container #activePlans not found!');
            return;
        }

        console.log('Container found:', container);
        console.log('Total plans in state:', this.state.studyPlans.length);

        const activePlans = this.state.studyPlans.filter(p => !p.completed);
        console.log('Active plans (not completed):', activePlans.length);

        if (activePlans.length === 0) {
            console.log('No active plans, showing empty state');
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📚</div>
                    <h4>Nessun Piano Attivo</h4>
                    <p>Crea il tuo primo piano di studio per iniziare!</p>
                </div>
            `;
            return;
        }

        console.log('Rendering', activePlans.length, 'active plans...');

        const htmlContent = activePlans.map((plan, index) => {
            console.log(`Rendering plan ${index + 1}:`, plan.subject);

            const daysUntil = this.calculateDaysUntil(plan.examDate);
            const progress = this.calculateProgress(plan);

            console.log(`  - Days until: ${daysUntil}`);
            console.log(`  - Progress: ${progress}%`);

            return `
                <div class="study-plan-card" data-plan-id="${plan.id}">
                    <div class="study-plan-header">
                        <div class="study-plan-title">
                            <h4>${this.getExamTypeIcon(plan.type)} ${plan.subject}</h4>
                            <div class="study-plan-meta">
                                <span>📅 ${this.formatDate(plan.examDate)}</span>
                                <span>⏰ ${daysUntil} giorni</span>
                                <span class="difficulty-badge difficulty-${plan.difficulty}">
                                    ${this.getDifficultyLabel(plan.difficulty)}
                                </span>
                            </div>
                        </div>
                        <div class="plan-actions">
                            <button class="btn-view-plan" onclick="StudentPage.viewStudyPlan(${plan.id})">
                                👁️ Vedi Piano
                            </button>
                            <button class="btn-complete-exam" onclick="StudentPage.completeExam(${plan.id})">
                                ✅ Completa
                            </button>
                            <button class="btn-delete-plan" onclick="StudentPage.deletePlan(${plan.id})">
                                🗑️
                            </button>
                        </div>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${progress}%"></div>
                    </div>
                    <div class="progress-label">
                        <span>Progresso</span>
                        <span>${progress}%</span>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = htmlContent;
        console.log('✅ renderActivePlans() completed');
    },

    renderTodaySessions() {
        const container = document.getElementById('todaySessions');
        if (!container) return;

        const today = new Date().toISOString().split('T')[0];
        const sessions = [];

        this.state.studyPlans.forEach(plan => {
            const todaySession = plan.schedule.find(s => s.date === today && !s.completed);
            if (todaySession) {
                sessions.push({
                    ...todaySession,
                    planId: plan.id,
                    subject: plan.subject
                });
            }
        });

        if (sessions.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="padding: 2rem;">
                    <div class="empty-state-icon">✨</div>
                    <p>Nessuna sessione programmata per oggi</p>
                </div>
            `;
            return;
        }

        container.innerHTML = sessions.map(session => {
            const typeIcons = {
                study: '📖',
                practice: '✍️',
                review: '🔄'
            };

            return `
                <div class="session-item ${session.type}">
                    <div class="session-icon">${typeIcons[session.type]}</div>
                    <div class="session-info">
                        <h5>${session.subject} - ${session.topics.join(', ')}</h5>
                        <p>📚 ${session.studyHours}h studio • ✍️ ${session.practiceHours}h pratica</p>
                    </div>
                    <div class="session-action">
                        <button onclick="StudentPage.completeSession('${session.planId}', '${session.date}')">
                            ✓ Completata
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    },

    completeSession(planId, date) {
        const plan = this.state.studyPlans.find(p => p.id == planId);
        if (!plan) return;

        const sessionIndex = plan.schedule.findIndex(s => s.date === date);
        if (sessionIndex === -1) return;

        this.toggleSessionComplete(planId, sessionIndex);
        this.renderTodaySessions();
        showNotification('✅ Sessione Completata!', 'Ottimo lavoro! Continua così!');
    },

    completeSession(planId, date) {
        const plan = this.state.studyPlans.find(p => p.id == planId);
        if (!plan) return;

        const sessionIndex = plan.schedule.findIndex(s => s.date === date);
        if (sessionIndex === -1) return;

        this.toggleSessionComplete(planId, sessionIndex);
        this.renderTodaySessions();
        showNotification('✅ Sessione Completata!', 'Ottimo lavoro! Continua così!');
    },

    renderCompletedExams() {
        const container = document.getElementById('completedExams');
        if (!container) return;

        if (this.state.completedExams.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🎯</div>
                    <p>Nessuna prova completata ancora</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.state.completedExams.map(exam => {
            const gradeNum = parseFloat(exam.grade.replace('L', ''));
            const gradeClass = gradeNum >= 8 || gradeNum >= 27 ? '' : gradeNum >= 6 || gradeNum >= 24 ? 'medium' : 'low';

            return `
                <div class="exam-result-card">
                    <div class="exam-result-header">
                        <div>
                            <h5>${this.getExamTypeIcon(exam.type)} ${exam.subject}</h5>
                            <p style="font-size: 0.85rem; color: var(--text-secondary);">
                                ${this.formatDate(exam.examDate)}
                            </p>
                        </div>
                        <div class="exam-grade ${gradeClass}">${exam.grade}</div>
                    </div>
                    <div class="exam-result-body">
                        <p><strong>Adesione al piano:</strong> ${exam.adherence.toFixed(0)}%</p>
                        <p><strong>Argomenti:</strong> ${exam.topics.slice(0, 2).join(', ')}${exam.topics.length > 2 ? '...' : ''}</p>
                        ${exam.feedback ? `
                            <div class="exam-improvements">
                                <strong>${exam.feedback.title}</strong>
                                <p style="margin-top: 0.5rem;">${exam.feedback.message}</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    },

    updateStats() {
        // Total study hours
        document.getElementById('totalStudyHours').textContent =
            this.state.stats.totalStudyHours.toFixed(1) + 'h';

        // Completed sessions
        document.getElementById('completedSessions').textContent =
            this.state.stats.completedSessions;

        // Average grade
        if (this.state.stats.grades.length > 0) {
            const avg = this.state.stats.grades.reduce((a, b) => a + b, 0) / this.state.stats.grades.length;
            document.getElementById('averageGrade').textContent = avg.toFixed(1);
        } else {
            document.getElementById('averageGrade').textContent = '-';
        }

        // Study streak
        document.getElementById('studyStreak').textContent = this.state.stats.studyStreak;
    },

    // Helper Functions
    calculateDaysUntil(dateString) {
        const examDate = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        examDate.setHours(0, 0, 0, 0);

        const diff = examDate - today;
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    },

    calculateProgress(plan) {
        if (!plan || !plan.schedule) return 0;
        const completed = plan.schedule.filter(s => s.completed).length;
    },

    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('it-IT', options);
    },

    getExamTypeIcon(type) {
        const icons = {
            verifica: '📝',
            interrogazione: '🗣️',
            compito: '📄',
            esame: '🎯'
        };
        return icons[type] || '📋';
    },

    getDifficultyLabel(difficulty) {
        const labels = {
            'facile': 'Facile',
            'media': 'Media',
            'difficile': 'Difficile',
            'molto-difficile': 'Molto Difficile'
        };
        return labels[difficulty] || difficulty;
    },

    // Data Persistence
    saveData() {
        if (typeof Storage !== 'undefined') {
            try {
                localStorage.setItem('flowmind_student_plans', JSON.stringify(this.state.studyPlans));
                localStorage.setItem('flowmind_completed_exams', JSON.stringify(this.state.completedExams));
                localStorage.setItem('flowmind_student_stats', JSON.stringify(this.state.stats));
            } catch (e) {
                console.error('Error saving student data:', e);
            }
        }
    },

    loadData() {
        if (typeof Storage !== 'undefined') {
            try {
                const plans = localStorage.getItem('flowmind_student_plans');
                const exams = localStorage.getItem('flowmind_completed_exams');
                const stats = localStorage.getItem('flowmind_student_stats');

                if (plans) this.state.studyPlans = JSON.parse(plans);
                if (exams) this.state.completedExams = JSON.parse(exams);
                if (stats) this.state.stats = JSON.parse(stats);
            } catch (e) {
                console.error('Error loading student data:', e);
            }
        }
    },

    getState() {
        return this.state;
    },

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.renderActivePlans();
        this.renderTodaySessions();
        this.renderCompletedExams();
        this.updateStats();
    },
    // AI Quiz Functionality
    updateQuizSubjects() {
        console.log('🔄 updateQuizSubjects() called');
        
        const select = document.getElementById('quizSubject');
        if (!select) {
            console.error('❌ Quiz subject select not found');
            return;
        }

        // Estrai materie uniche dai piani attivi
        const subjects = [...new Set(this.state.studyPlans.map(p => p.subject))];
        
        console.log('📚 Available subjects:', subjects);

        // Reset select
        select.innerHTML = '<option value="">-- Scegli una materia --</option>';
        
        // Aggiungi opzioni
        subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject;
            option.textContent = subject;
            select.appendChild(option);
        });

        console.log('✅ Quiz subjects updated:', subjects.length, 'subjects');
    },

    startAIQuiz() {
        console.log('🎯 startAIQuiz() called');
        
        const select = document.getElementById('quizSubject');
        if (!select) {
            console.error('❌ Quiz subject select not found');
            return;
        }

        const subject = select.value;
        
        if (!subject) {
            alert('⚠️ Seleziona prima una materia da interrogare!');
            return;
        }

        console.log('📖 Selected subject:', subject);

        // Trova il piano corrispondente
        const plan = this.state.studyPlans.find(p => p.subject === subject);
        if (!plan) {
            alert('⚠️ Piano di studio non trovato per questa materia!');
            console.error('Plan not found for subject:', subject);
            return;
        }

        console.log('📋 Found plan:', plan);

        // Genera domande basate sugli argomenti del piano
        this.state.quizQuestions = this.generateQuizQuestions(plan);
        this.state.currentQuestionIndex = 0;
        this.state.currentQuiz = {
            subject: subject,
            planId: plan.id,
            answers: [],
            startTime: new Date()
        };

        console.log('❓ Generated', this.state.quizQuestions.length, 'questions');

        // Mostra interfaccia quiz
        const quizContainer = document.getElementById('quizContainer');
        const quizArea = document.getElementById('quizArea');
        const startBtn = document.getElementById('startQuizBtn');

        if (quizContainer) quizContainer.style.display = 'block';
        if (quizArea) quizArea.style.display = 'block';
        if (startBtn) startBtn.style.display = 'none';
        
        // Mostra prima domanda
        this.showQuestion();

        console.log('✅ AI Quiz started for', subject);
    },

    generateQuizQuestions(plan) {
        console.log('🔨 generateQuizQuestions() called for', plan.subject);
        
        const questions = [];
        
        // Template di domande variegate
        const templates = [
            'Spiega il concetto di {topic} e fornisci degli esempi pratici.',
            'Quali sono gli aspetti principali di {topic}?',
            'Come si applica {topic} nella pratica? Fai degli esempi.',
            'Descrivi {topic} con parole tue, come lo spiegheresti a un amico.',
            'Quali collegamenti puoi fare tra {topic} e altri argomenti che hai studiato?',
            'Quali sono le differenze principali tra {topic} e concetti simili?',
            'Perché {topic} è importante? In quali contesti viene utilizzato?'
        ];

        // Genera una domanda per ogni argomento
        plan.topics.forEach(topic => {
            const template = templates[Math.floor(Math.random() * templates.length)];
            questions.push({
                topic: topic,
                question: template.replace('{topic}', topic),
                answer: null,
                score: null,
                feedback: null
            });
        });

        // Mescola le domande per variare l'ordine
        const shuffled = questions.sort(() => Math.random() - 0.5);
        
        console.log('✅ Generated', shuffled.length, 'questions');
        return shuffled;
    },

    showQuestion() {
        console.log('📝 showQuestion() called');
        
        // Controlla se ci sono ancora domande
        if (this.state.currentQuestionIndex >= this.state.quizQuestions.length) {
            console.log('✅ All questions answered, ending quiz');
            this.endQuiz();
            return;
        }

        const question = this.state.quizQuestions[this.state.currentQuestionIndex];
        const questionEl = document.getElementById('quizQuestion');
        const answerEl = document.getElementById('quizAnswer');
        const feedbackEl = document.getElementById('quizFeedback');

        if (questionEl) {
            questionEl.textContent = question.question;
        }

        if (answerEl) {
            answerEl.value = '';
        }

        if (feedbackEl) {
            feedbackEl.style.display = 'none';
        }

        console.log(`Question ${this.state.currentQuestionIndex + 1}/${this.state.quizQuestions.length}:`, question.question);
    },

    submitAnswer() {
        console.log('📤 submitAnswer() called');
        
        const answerEl = document.getElementById('quizAnswer');
        if (!answerEl) {
            console.error('❌ Answer textarea not found');
            return;
        }

        const answer = answerEl.value.trim();
        
        if (!answer) {
            alert('⚠️ Scrivi una risposta prima di inviare!');
            return;
        }

        console.log('📝 Answer submitted:', answer.substring(0, 50) + '...');

        const question = this.state.quizQuestions[this.state.currentQuestionIndex];
        
        // AI valuta la risposta
        const evaluation = this.evaluateAnswer(answer, question.topic);
        
        console.log('📊 Evaluation:', evaluation);

        // Salva risposta e valutazione
        question.answer = answer;
        question.score = evaluation.score;
        question.feedback = evaluation.feedback;

        this.state.currentQuiz.answers.push({
            question: question.question,
            answer: answer,
            score: evaluation.score
        });

        // Mostra feedback
        this.showFeedback(evaluation);
    },

    evaluateAnswer(answer, topic) {
        console.log('🤖 evaluateAnswer() called');
        
        // Simulazione valutazione AI (in produzione userebbe API Anthropic)
        const wordCount = answer.split(/\s+/).length;
        const hasKeywords = answer.toLowerCase().includes(topic.toLowerCase());
        const hasExamples = /esempio|per esempio|ad esempio|come|infatti|ad es/i.test(answer);
        const hasExplanation = /perché|poiché|dato che|siccome|in quanto/i.test(answer);
        
        let score = 5; // Base score
        let feedback = [];

        // Valutazione lunghezza
        if (wordCount > 150) {
            score += 2;
            feedback.push('✅ Risposta molto completa e articolata');
        } else if (wordCount > 80) {
            score += 1.5;
            feedback.push('✅ Risposta completa');
        } else if (wordCount > 40) {
            score += 1;
            feedback.push('✅ Risposta adeguata');
        } else {
            feedback.push('⚠️ Risposta troppo breve, approfondisci maggiormente');
        }

        // Valutazione keywords
        if (hasKeywords) {
            score += 1;
            feedback.push('✅ Hai menzionato i concetti chiave dell\'argomento');
        } else {
            score -= 1;
            feedback.push('⚠️ Mancano riferimenti espliciti all\'argomento richiesto');
        }

        // Valutazione esempi
        if (hasExamples) {
            score += 2;
            feedback.push('✅ Ottimo uso di esempi pratici per chiarire i concetti');
        } else {
            feedback.push('💡 Suggerimento: aggiungi esempi concreti per migliorare la risposta');
        }

        // Valutazione spiegazione
        if (hasExplanation) {
            score += 1;
            feedback.push('✅ Buona spiegazione delle cause/motivazioni');
        }

        // Limita score tra 1 e 10
        score = Math.min(10, Math.max(1, Math.round(score)));

        const evaluation = {
            score: score,
            feedback: feedback.join('\n')
        };

        console.log('📊 Final score:', score + '/10');
        return evaluation;
    },

    showFeedback(evaluation) {
        console.log('💬 showFeedback() called');
        
        const feedbackDiv = document.getElementById('quizFeedback');
        if (!feedbackDiv) {
            console.error('❌ Feedback div not found');
            return;
        }

        const isGood = evaluation.score >= 6;
        
        feedbackDiv.innerHTML = `
            <div class="quiz-feedback-box ${!isGood ? 'negative' : ''}">
                <h4>📊 Valutazione AI</h4>
                <div class="quiz-score">${evaluation.score}/10</div>
                <div class="quiz-evaluation">
                    <h5>Feedback Dettagliato:</h5>
                    <p style="white-space: pre-line; line-height: 1.8;">${evaluation.feedback}</p>
                </div>
            </div>
        `;
        
        feedbackDiv.style.display = 'block';
        console.log('✅ Feedback displayed');
    },

    nextQuestion() {
        console.log('⏭️ nextQuestion() called');
        this.state.currentQuestionIndex++;
        this.showQuestion();
    },

    endQuiz() {
        console.log('🏁 endQuiz() called');
        
        if (!this.state.currentQuiz) {
            console.warn('⚠️ No active quiz to end');
            return;
        }

        // Calcola statistiche
        const totalScore = this.state.quizQuestions.reduce((sum, q) => sum + (q.score || 0), 0);
        const averageScore = (totalScore / this.state.quizQuestions.length).toFixed(1);
        
        const endTime = new Date();
        const duration = Math.round((endTime - this.state.currentQuiz.startTime) / 1000 / 60);

        console.log('📊 Quiz stats:', {
            average: averageScore,
            questions: this.state.quizQuestions.length,
            duration: duration
        });

        alert(`🎓 Interrogazione Completata!\n\n` +
              `Materia: ${this.state.currentQuiz.subject}\n` +
              `Voto Medio: ${averageScore}/10\n` +
              `Domande: ${this.state.quizQuestions.length}\n` +
              `Durata: ${duration} minuti\n\n` +
              `Continua ad esercitarti per migliorare!`);

        // Reset quiz UI
        const quizContainer = document.getElementById('quizContainer');
        const quizArea = document.getElementById('quizArea');
        const startBtn = document.getElementById('startQuizBtn');
        const select = document.getElementById('quizSubject');

        if (quizContainer) quizContainer.style.display = 'none';
        if (quizArea) quizArea.style.display = 'none';
        if (startBtn) startBtn.style.display = 'block';
        if (select) select.value = '';
        
        // Reset state
        this.state.currentQuiz = null;
        this.state.quizQuestions = [];
        this.state.currentQuestionIndex = 0;

        console.log('✅ Quiz ended and reset');
    },
}
