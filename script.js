// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Mock user state
    let currentUser = {
        isLoggedIn: false,
        username: '',
        email: '',
        fullName: '',
        role: 'user' // 'user' or 'admin'
    };
    
    // Get the navigation links container
    const navLinks = document.getElementById('navLinks');
    const body = document.body;
    
    // Function to update navigation based on login state
    function updateNavigation() {
        // Clear current links
        navLinks.innerHTML = '';
        
        if (currentUser.isLoggedIn) {
            // Update body class for authenticated state
            body.className = 'authenticated';
            if (currentUser.role === 'admin') {
                body.classList.add('is-admin');
            }
            
            // Logged in view with dropdown
            const loggedInHtml = `
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" 
                       data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-person-circle"></i> ${currentUser.username}
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                        <li><h6 class="dropdown-header">Signed in as ${currentUser.role}</h6></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="#" onclick="showPage('profile'); return false;"><i class="bi bi-person"></i> Profile</a></li>
                        <li><a class="dropdown-item" href="#" onclick="showPage('requests'); return false;"><i class="bi bi-list-check"></i> My Requests</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li class="role-admin"><h6 class="dropdown-header role-admin">Admin Panel</h6></li>
                        <li><a class="dropdown-item role-admin" href="#" onclick="showPage('employees'); return false;"><i class="bi bi-people"></i> Employees</a></li>
                        <li><a class="dropdown-item role-admin" href="#" onclick="showPage('accounts'); return false;"><i class="bi bi-bank"></i> Accounts</a></li>
                        <li><a class="dropdown-item role-admin" href="#" onclick="showPage('departments'); return false;"><i class="bi bi-building"></i> Departments</a></li>
                        <li class="role-admin"><hr class="dropdown-divider admin-divider role-admin"></li>
                        <li><a class="dropdown-item text-danger" href="#" onclick="logout(); return false;"><i class="bi bi-box-arrow-right"></i> Logout</a></li>
                    </ul>
                </li>
            `;
            
            navLinks.innerHTML = loggedInHtml;
            
            // Update profile information
            updateProfileInfo();
            
        } else {
            // Update body class for not authenticated state
            body.className = 'not-authenticated';
            
            // Logged out view
            const loggedOutHtml = `
                <li class="nav-item"><a class="nav-link" href="#" onclick="showPage('login'); return false;"><i class="bi bi-box-arrow-in-right"></i> Login</a></li>
                <li class="nav-item"><a class="nav-link" href="#" onclick="showPage('register'); return false;"><i class="bi bi-person-plus"></i> Register</a></li>
            `;
            
            navLinks.innerHTML = loggedOutHtml;
        }
    }
    
    // Function to show a specific page
    window.showPage = function(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show the selected page
        const selectedPage = document.getElementById(`${pageId}-page`);
        if (selectedPage) {
            selectedPage.classList.add('active');
        }
        
        // Update page-specific content if needed
        updatePageContent(pageId);
    };
    
    // Function to update page content based on page and user state
    function updatePageContent(pageId) {
        if (pageId === 'profile' && currentUser.isLoggedIn) {
            updateProfileInfo();
        } else if (pageId === 'home') {
            const welcomeMessage = document.getElementById('welcome-message');
            if (welcomeMessage && currentUser.isLoggedIn) {
                welcomeMessage.textContent = `Welcome back, ${currentUser.fullName || currentUser.username}!`;
            }
        }
    }
    
    // Function to update profile information
    function updateProfileInfo() {
        if (currentUser.isLoggedIn) {
            document.getElementById('profile-name').textContent = currentUser.fullName || currentUser.username;
            document.getElementById('profile-email').textContent = currentUser.email || 'user@example.com';
            document.getElementById('profile-role').textContent = currentUser.role === 'admin' ? 'Administrator' : 'Regular User';
            document.getElementById('profile-role').className = `badge bg-${currentUser.role === 'admin' ? 'warning' : 'info'}`;
            
            // Update profile form
            document.getElementById('profile-fullname').value = currentUser.fullName || currentUser.username;
            document.getElementById('profile-email-input').value = currentUser.email || 'user@example.com';
        }
    }
    
    // Helper function to show Bootstrap alerts
    function showAlert(message, type) {
        // Remove any existing alerts
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());
        
        // Create alert element
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show mt-3`;
        alertDiv.role = 'alert';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        // Insert alert at the top of the active page
        const activePage = document.querySelector('.page.active .row');
        if (activePage) {
            activePage.insertBefore(alertDiv, activePage.firstChild);
        }
        
        // Auto dismiss after 3 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 3000);
    }
    
    // Handle login form submission
    window.handleLogin = function(event) {
        event.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Mock login - in real app, this would validate against backend
        if (email && password) {
            // Check if it's the admin email
            const isAdmin = email.includes('admin');
            
            setUserRole(isAdmin ? 'admin' : 'user', email.split('@')[0], email);
        } else {
            showAlert('Please enter both email and password', 'danger');
        }
    };
    
    // Handle register form submission
    window.handleRegister = function(event) {
        event.preventDefault();
        
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        
        if (password !== confirmPassword) {
            showAlert('Passwords do not match!', 'danger');
            return;
        }
        
        // Mock registration - show verification page
        showAlert('Registration successful! Please verify your email.', 'success');
        showPage('verify-email');
    };
    
    // Handle profile update
    window.handleProfileUpdate = function(event) {
        event.preventDefault();
        
        currentUser.fullName = document.getElementById('profile-fullname').value;
        currentUser.email = document.getElementById('profile-email-input').value;
        
        updateProfileInfo();
        showAlert('Profile updated successfully!', 'success');
    };
    
    // Resend verification email
    window.resendVerification = function() {
        showAlert('Verification email resent! Please check your inbox.', 'info');
    };
    
    // Show forgot password (mock)
    window.showForgotPassword = function() {
        showAlert('Password reset link would be sent to your email.', 'info');
    };
    
    // Create new request (mock)
    window.createNewRequest = function() {
        showAlert('New request creation form would open here.', 'info');
    };
    
    // Admin functions
    window.addNewEmployee = function() {
        showAlert('Add new employee form would open here.', 'info');
    };
    
    window.addNewDepartment = function() {
        showAlert('Add new department form would open here.', 'info');
    };
    
    window.addNewAccount = function() {
        showAlert('Create new account form would open here.', 'info');
    };
    
    // Function to set user role
    window.setUserRole = function(role, username = 'user', email = null) {
        currentUser = {
            isLoggedIn: true,
            username: username,
            email: email || `${username}@example.com`,
            fullName: username.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            role: role
        };
        
        updateNavigation();
        showPage('home');
        showAlert(`Logged in as ${role} (${username})`, role === 'admin' ? 'warning' : 'success');
    };
    
    // Function to logout
    window.logout = function() {
        currentUser = {
            isLoggedIn: false,
            username: '',
            email: '',
            fullName: '',
            role: 'user'
        };
        updateNavigation();
        showPage('home');
        showAlert('You have been logged out', 'info');
    };
    
    // Initialize navigation
    updateNavigation();
    
    // Show home page by default
    showPage('home');
    
    console.log('App initialized. Use the demo controls to test different user roles.');
    console.log('Functions available:');
    console.log('- setUserRole("user", "username") - Login as regular user');
    console.log('- setUserRole("admin", "username") - Login as admin');
    console.log('- logout() - Logout current user');
    console.log('- showPage("page-name") - Navigate to specific page');
});