// Get users from localStorage or initialize
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

document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        username: document.getElementById('regUsername').value,
        password: document.getElementById('regPassword').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        role: document.getElementById('regRole').value,
        department: document.getElementById('department').value,
        employeeId: document.getElementById('employeeId').value
    };
    
    const errorElement = document.getElementById('errorMessage');
    const successElement = document.getElementById('successMessage');
    
    // Reset messages
    errorElement.style.display = 'none';
    successElement.style.display = 'none';
    
    // Validation
    const validation = validateRegistration(formData);
    if (!validation.isValid) {
        showError(validation.message);
        return;
    }
    
    // Check if username already exists
    if (users[formData.username]) {
        showError('Username already exists. Please choose a different username.');
        return;
    }
    
    // Check if employee ID already exists
    const existingUser = Object.values(users).find(user => user.employeeId === formData.employeeId);
    if (existingUser) {
        showError('Employee ID already registered. Please check your Employee ID.');
        return;
    }
    
    // Create new user
    users[formData.username] = {
        password: formData.password,
        role: formData.role,
        name: formData.fullName,
        department: formData.role === 'dean' ? null : formData.department,
        email: formData.email,
        employeeId: formData.employeeId
    };
    
    // Save to localStorage
    localStorage.setItem('universityUsers', JSON.stringify(users));
    
    // Show success message
    showSuccess('Registration successful! Redirecting to login...');
    
    // Redirect to login after 2 seconds
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
});

function validateRegistration(data) {
    // Check all fields are filled
    if (!data.fullName || !data.email || !data.username || !data.password || 
        !data.confirmPassword || !data.role || !data.employeeId) {
        return { isValid: false, message: 'Please fill in all required fields.' };
    }
    
    // Check password length
    if (data.password.length < 8) {
        return { isValid: false, message: 'Password must be at least 8 characters long.' };
    }
    
    // Check password match
    if (data.password !== data.confirmPassword) {
        return { isValid: false, message: 'Passwords do not match.' };
    }
    
    // Check department for non-dean roles
    if (data.role !== 'dean' && !data.department) {
        return { isValid: false, message: 'Please select a department.' };
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return { isValid: false, message: 'Please enter a valid email address.' };
    }
    
    return { isValid: true, message: '' };
}

function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function showSuccess(message) {
    const successElement = document.getElementById('successMessage');
    successElement.textContent = message;
    successElement.style.display = 'block';
}

// Show/hide department field based on role
document.getElementById('regRole').addEventListener('change', function() {
    const departmentGroup = document.getElementById('departmentGroup');
    if (this.value === 'dean') {
        departmentGroup.style.display = 'none';
        document.getElementById('department').required = false;
    } else {
        departmentGroup.style.display = 'block';
        document.getElementById('department').required = true;
    }
});

// Password strength indicator (optional enhancement)
document.getElementById('regPassword').addEventListener('input', function() {
    const password = this.value;
    const strengthBar = document.createElement('div');
    strengthBar.className = 'password-strength';
    
    if (!this.parentNode.querySelector('.password-strength')) {
        this.parentNode.appendChild(strengthBar);
    }
    
    const existingBar = this.parentNode.querySelector('.password-strength');
    const bar = existingBar.querySelector('.strength-bar') || document.createElement('div');
    bar.className = 'strength-bar';
    
    let strength = 'strength-weak';
    if (password.length >= 12) {
        strength = 'strength-strong';
    } else if (password.length >= 8) {
        strength = 'strength-medium';
    }
    
    bar.className = `strength-bar ${strength}`;
    existingBar.innerHTML = '';
    existingBar.appendChild(bar);
});

// Initialize department field visibility
document.addEventListener('DOMContentLoaded', function() {
    const roleSelect = document.getElementById('regRole');
    if (roleSelect.value === 'dean') {
        document.getElementById('departmentGroup').style.display = 'none';
    }
});