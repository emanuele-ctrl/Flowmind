// Authentication Manager
const Auth = {
    // Check if user is logged in
    isLoggedIn() {
        const user = localStorage.getItem('flowmind_user');
        return user !== null;
    },

    // Get current user
    getCurrentUser() {
        const user = localStorage.getItem('flowmind_user');
        return user ? JSON.parse(user) : null;
    },

    // Register new user
    register(name, email, password) {
        // Check if user already exists
        const existingUsers = this.getAllUsers();
        if (existingUsers.find(u => u.email === email)) {
            return {
                success: false,
                message: 'Un account con questa email esiste già'
            };
        }

        // Create new user
        const user = {
            id: Date.now().toString(),
            name: name,
            email: email,
            password: this.hashPassword(password),
            createdAt: new Date().toISOString(),
            avatar: this.getInitials(name)
        };

        // Save to users list
        existingUsers.push(user);
        localStorage.setItem('flowmind_users', JSON.stringify(existingUsers));

        // Log in the user
        this.login(email, password);

        return {
            success: true,
            message: 'Registrazione completata con successo!',
            user: user
        };
    },

    // Login user
    login(email, password) {
        const users = this.getAllUsers();
        const user = users.find(u =>
            u.email === email &&
            u.password === this.hashPassword(password)
        );

        if (user) {
            // Save current user session
            const userSession = {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                loginAt: new Date().toISOString()
            };
            localStorage.setItem('flowmind_user', JSON.stringify(userSession));

            return {
                success: true,
                message: 'Login effettuato con successo!',
                user: userSession
            };
        }

        return {
            success: false,
            message: 'Email o password non corretti'
        };
    },

    // Logout user
    logout() {
        localStorage.removeItem('flowmind_user');
        window.location.href = 'index.html';
    },

    // Get all users
    getAllUsers() {
        const users = localStorage.getItem('flowmind_users');
        let userList = users ? JSON.parse(users) : [];

        // Aggiungi utente di test se non esiste
        if (userList.length === 0) {
            const testUser = {
                id: 'test123',
                name: 'Emanuele Nasta',
                email: 'test@gmail.com',
                password: this.hashPassword('1234'),
                createdAt: new Date().toISOString(),
                avatar: 'EN'
            };
            userList.push(testUser);
            localStorage.setItem('flowmind_users', JSON.stringify(userList));
        }

        return userList;
    },

    // Simple password hash (in produzione usa bcrypt)
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    },

    // Get user initials for avatar
    getInitials(name) {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    },

    // Check authentication on protected pages
    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = 'index.html';
            return false;
        }
        return true;
    },

    // Update user info in app
    updateUserDisplay() {
        const user = this.getCurrentUser();
        if (user) {
            const avatarEl = document.querySelector('.user-avatar');
            const nameEl = document.querySelector('.user-info h4');
            const emailEl = document.querySelector('.user-info p');

            if (avatarEl) avatarEl.textContent = user.avatar;
            if (nameEl) nameEl.textContent = user.name;
            if (emailEl) emailEl.textContent = user.email.split('@')[0];
        }
    },
    skipAuth() {
        const demoUser = {
            id: 'demo123',
            name: 'Utente Demo',
            email: 'demo@flowmind.app',
            avatar: 'UD',
            loginAt: new Date().toISOString()
        };
        localStorage.setItem('flowmind_user', JSON.stringify(demoUser));
        return demoUser;
    },

    // Check if demo mode is enabled
    isDemoMode() {
        return localStorage.getItem('flowmind_demo_mode') === 'true';
    },

    // Enable demo mode
    enableDemoMode() {
        localStorage.setItem('flowmind_demo_mode', 'true');
        this.skipAuth();
    }
};
