// Global state
let currentUser = null;  // will store { email, firstName, lastName, role, verified, ... }

// Database (will be loaded from localStorage)
window.db = {
    accounts: [],
    departments: [],
    employees: [],
    requests: []
};

const STORAGE_KEY = 'ipt_demo_v1';

// Helper functions
function navigateTo(hash) {
    window.location.hash = hash;
}

function handleRouting() {
    let hash = window.location.hash || '#/';
    // Remove the leading '#' and split
    const path = hash.slice(1); // e.g., '/login' or '/profile'

    // Hide all pages
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));

    // Determine which page to show
    let pageId = '';
    if (path === '/' || path === '') {
        pageId = 'home-page';
    } else {
        // Remove leading slash and map to page id
        const route = path.substring(1); // 'login' -> 'login-page'
        pageId = route + '-page';
    }

    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        // Check authentication for protected routes
        const protectedRoutes = ['profile', 'requests'];
        const adminRoutes = ['employees', 'accounts', 'departments'];

        if (protectedRoutes.includes(route) && !currentUser) {
            // Not logged in, redirect to home
            navigateTo('#/');
            handleRouting(); // re-run after hash change
            return;
        }

        if (adminRoutes.includes(route) && (!currentUser || currentUser.role !== 'admin')) {
            // Not admin, redirect to home
            navigateTo('#/');
            handleRouting();
            return;
        }

        targetPage.classList.add('active');
        // Call page-specific render functions if needed
        if (route === 'profile') renderProfile();
        if (route === 'accounts') renderAccountsList();
        if (route === 'employees') renderEmployeesTable();
        if (route === 'departments') renderDepartmentsList();
        if (route === 'requests') renderRequestsList();
    } else {
        // 404 - go home
        navigateTo('#/');
        handleRouting();
    }
}

// Listen to hash changes
window.addEventListener('hashchange', handleRouting);

// Initial load
window.addEventListener('load', () => {
    loadFromStorage();
    if (!window.location.hash) {
        navigateTo('#/');
    } else {
        handleRouting();
    }
});