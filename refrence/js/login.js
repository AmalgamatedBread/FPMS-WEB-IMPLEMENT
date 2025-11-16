// Mock user database (in real app, this would be on backend)
let users = JSON.parse(localStorage.getItem('universityUsers')) || {
    'faculty1': { 
        password: 'faculty123', 
        role: 'faculty', 
        name: 'Dr. John Smith',
        department: 'Computer Science',
        email: 'john.smith@university.edu',
        employeeId: 'F001'
    },
    'depthead1': { 
        password: 'depthead123', 
        role: 'department_head', 
        name: 'Prof. Jane Doe',
        department: 'Computer Science',
        email: 'jane.doe@university.edu',
        employeeId: 'DH001'
    },
    'dean1': { 
        password: 'dean123', 
        role: 'dean', 
        name: 'Dr. Robert Brown',
        department: null,
        email: 'robert.brown@university.edu',
        employeeId: 'D001'
    }
};

// Save users to localStorage
function saveUsers() {
    localStorage.setItem('universityUsers', JSON.stringify(users));
}

// Role-based dashboard URLs or content
const roleDashboards = {
    faculty: {
        title: 'Faculty Dashboard',
        features: [
            'View Teaching Schedule',
            'Submit Grades',
            'Student Management',
            'Course Materials',
            'Attendance Tracking'
        ],
        theme: '#3498db'
    },
    department_head: {
        title: 'Department Head Dashboard',
        features: [
            'Faculty Management',
            'Approve Leave Requests',
            'Department Reports',
            'Budget Management',
            'Schedule Oversight'
        ],
        theme: '#e67e22'
    },
    dean: {
        title: 'Dean Dashboard',
        features: [
            'Institutional Overview',
            'Department Performance',
            'Strategic Planning',
            'Policy Management',
            'Budget Approval',
            'Academic Planning'
        ],
        theme: '#9b59b6'
    }
};

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const selectedRole = document.getElementById('role').value;
    
    const errorElement = document.getElementById('errorMessage');
    
    // Reset error message
    errorElement.style.display = 'none';
    
    // Validation
    if (!username || !password || !selectedRole) {
        showError('Please fill in all fields');
        return;
    }
    
    // Check if user exists
    const user = users[username];
    
    if (!user) {
        showError('Invalid username');
        return;
    }
    
    // Check password
    if (user.password !== password) {
        showError('Invalid password');
        return;
    }
    
    // Check role match
    if (user.role !== selectedRole) {
        showError(`User ${username} is not registered as ${selectedRole}`);
        return;
    }
    
    // Successful login - show dashboard
    showDashboard(user);
});

function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function showDashboard(user) {
    const dashboard = roleDashboards[user.role];
    
    // Create dashboard HTML
    document.body.innerHTML = `
        <div class="dashboard" style="background: ${dashboard.theme}">
            <nav class="navbar">
                <div class="nav-content">
                    <h1>${dashboard.title}</h1>
                    <div class="user-info">
                        <span>Welcome, ${user.name}</span>
                        ${user.department ? `<span>Department: ${user.department}</span>` : ''}
                        <button onclick="logout()" class="logout-btn">Logout</button>
                    </div>
                </div>
            </nav>
            
            <div class="dashboard-content">
                <div class="welcome-section">
                    <h2>Hello, ${user.name}!</h2>
                    <p>Role: ${user.role.replace('_', ' ').toUpperCase()}</p>
                    <p>Employee ID: ${user.employeeId}</p>
                </div>
                
                <div class="features-grid">
                    ${dashboard.features.map(feature => `
                        <div class="feature-card">
                            <h3>${feature}</h3>
                            <button onclick="handleFeature('${feature}')">Access</button>
                        </div>
                    `).join('')}
                </div>
                
                <div class="quick-stats">
                    <h3>Quick Statistics</h3>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <h4>Notifications</h4>
                            <p class="stat-number">${Math.floor(Math.random() * 10) + 1}</p>
                        </div>
                        <div class="stat-card">
                            <h4>Pending Tasks</h4>
                            <p class="stat-number">${Math.floor(Math.random() * 5) + 1}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add dashboard styles
    addDashboardStyles();
}

function addDashboardStyles() {
    const styles = `
        <style>
            .dashboard {
                min-height: 100vh;
                color: white;
            }
            
            .navbar {
                background: rgba(0,0,0,0.1);
                padding: 1rem 0;
            }
            
            .nav-content {
                max-width: 1200px;
                margin: 0 auto;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 2rem;
            }
            
            .user-info {
                display: flex;
                gap: 1rem;
                align-items: center;
            }
            
            .logout-btn {
                padding: 0.5rem 1rem;
                background: rgba(255,255,255,0.2);
                border: 1px solid white;
                color: white;
                border-radius: 5px;
                cursor: pointer;
            }
            
            .dashboard-content {
                max-width: 1200px;
                margin: 0 auto;
                padding: 2rem;
            }
            
            .welcome-section {
                text-align: center;
                margin-bottom: 3rem;
            }
            
            .features-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1.5rem;
                margin-bottom: 3rem;
            }
            
            .feature-card {
                background: rgba(255,255,255,0.1);
                padding: 1.5rem;
                border-radius: 10px;
                text-align: center;
                backdrop-filter: blur(10px);
            }
            
            .feature-card button {
                margin-top: 1rem;
                padding: 0.5rem 1rem;
                background: white;
                color: #333;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
            
            .quick-stats {
                background: rgba(255,255,255,0.1);
                padding: 2rem;
                border-radius: 10px;
                backdrop-filter: blur(10px);
            }
            
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
                margin-top: 1rem;
            }
            
            .stat-card {
                background: rgba(255,255,255,0.2);
                padding: 1rem;
                border-radius: 5px;
                text-align: center;
            }
            
            .stat-number {
                font-size: 2rem;
                font-weight: bold;
                margin: 0.5rem 0;
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
}

function handleFeature(feature) {
    alert(`Accessing: ${feature}\n\nIn a real application, this would open the ${feature} module.`);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        location.reload();
    }
}

// Check if user is already logged in
window.addEventListener('load', function() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        showDashboard(user);
    }
});