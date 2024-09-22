//(initial data check)
const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

// Function to store users in localStorage
function saveUsers() {
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
}

// Registration Form Submission
document.getElementById('registrationFormElement').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    // Check if the email is already registered
    const existingUser = registeredUsers.find(user => user.email === email);
    if (existingUser) {
        alert(`Email ${email} is already registered. Please use a different email.`);
    } else {
        // Add the new user to the registered users list
        registeredUsers.push({ email: email, password: password });
        saveUsers(); // Save updated users to localStorage
        alert(`Registered with Name: ${name}, Email: ${email}`);
        document.getElementById('regName').value = '';
        document.getElementById('regEmail').value = '';
        document.getElementById('regPassword').value = '';
    }
});

// Show Registration Form
document.getElementById('showRegister').addEventListener('click', function() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registrationForm').style.display = 'block';
});

// Show Login Form
document.getElementById('showLogin').addEventListener('click', function() {
    document.getElementById('registrationForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
});

// Login Validation
document.getElementById('loginFormElement').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorMessage = document.getElementById('loginError');

    // Clear previous error message
    errorMessage.style.display = 'none';
    
    // Check if user is registered
    const user = registeredUsers.find(user => user.email === email && user.password === password);

    if (user) {
        // Redirect to success page on valid login
        window.location.href = 'items.html';
    } else {
        errorMessage.textContent = 'Invalid email or username';
        errorMessage.style.display = 'block';
    }
});

// Log Out Functionality
function logOut() {
    // Clear session and redirect to login
    // Optionally, you can clear user data or keep it for future use
    alert("You have logged out.");
    window.location.href = 'index.html'; // Redirect to login page
}

// This function can be called on the success page to log out
document.getElementById('logoutButton')?.addEventListener('click', logOut);
