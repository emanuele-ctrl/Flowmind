// Navigation Manager
const Navigation = {
    currentPage: 'music',

    showPage(pageName) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show selected page
        const targetPage = document.getElementById(pageName + '-page');
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageName) {
                link.classList.add('active');
            }
        });

        // Update mobile nav buttons
        document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-page') === pageName) {
                btn.classList.add('active');
            }
        });

        this.currentPage = pageName;

        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
            document.getElementById('sidebar').classList.remove('visible');
        }

        // Call page-specific initialization
        this.initializePage(pageName);
    },

    initializePage(pageName) {
        switch(pageName) {
            case 'music':
                MusicPage.init();
                SoundsPage.init();
                break;
            case 'timer':
                TimerPage.init();
                FocusPage.init();
                break;
            case 'calendar':
                AIPage.init();
                break;
            case 'student':
                StudentPage.init();
                break;
            case 'profile':
                if (typeof loadUserProfile === 'function') {
                    loadUserProfile();
                }
                break;
        }
    },

    getCurrentPage() {
        return this.currentPage;
    }
};