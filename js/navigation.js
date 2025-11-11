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
        });
        
        // Find and activate current link
        const currentLink = document.querySelector(`[data-page="${pageName}"]`);
        if (currentLink) {
            currentLink.classList.add('active');
        }
        
        this.currentPage = pageName;
        
        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
            document.getElementById('sidebar')?.classList.remove('visible');
        }
    },
    
    getCurrentPage() {
        return this.currentPage;
    }
};

// Initialize navigation when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Add click handlers to all nav links
    document.querySelectorAll('.nav-link[data-page]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            Navigation.showPage(page);
        });
    });
});