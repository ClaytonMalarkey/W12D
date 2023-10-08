// app.js

// Login form submission
document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Perform login API request (replace with your API endpoint)
    const loginSuccess = await performLogin(email, password);

    if (loginSuccess) {
        // Redirect to home.html on successful login
        window.location.href = '/home.html';
    } else {
        document.getElementById('loginStatus').textContent = 'Invalid login credentials';
    }
});

// Check if the user is logged in (session token cookie)
if (checkSessionToken()) {
    // User is logged in, show the home page
    const username = getUsernameFromCookie(); // Implement this function
    document.getElementById('username').textContent = username;

    // Fetch and display colors
    fetchColors(); // Implement this function

    // Add logout functionality
    document.getElementById('logoutBtn').addEventListener('click', function () {
        deleteSessionToken(); // Implement this function
        window.location.href = '/index.html'; // Redirect to login page
    });
} else {
    // User is not logged in, show a message and redirect to login page
    document.getElementById('username').textContent = 'No one is logged in';
    document.getElementById('colorList').textContent = '';
    document.getElementById('logoutBtn').style.display = 'none';
}
// Function to perform login (replace with your actual API endpoint)
async function performLogin(email, password) {
    try {
        const response = await fetch('https://reqres.in/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            // Login was successful, set a session token cookie (replace 'your_token_key')
            document.cookie = 'sessionToken=your_actual_token; path=/'; // Replace 'your_actual_token' with the actual token
            return true;
        } else {
            // Login failed
            return false;
        }
    } catch (error) {
        console.error('Error during login:', error);
        return false; // Handle the error appropriately
    }
}

// Function to check if the user is logged in (session token cookie)
function checkSessionToken() {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === 'sessionToken' && value !== '') {
            return true;
        }
    }
    return false;
}

// Function to get the username from the cookie (replace 'username_key')
function getUsernameFromCookie() {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === 'username_key') {
            return decodeURIComponent(value);
        }
    }
    return '';
}

// Function to fetch and display colors from the API (replace with your API endpoint)
async function fetchColors() {
    try {
        const response = await fetch('https://reqres.in/api/unknown');
        const data = await response.json();

        const colorList = document.getElementById('colorList');
        colorList.innerHTML = '';

        data.data.forEach((color) => {
            const colorBox = document.createElement('div');
            colorBox.className = 'color-box';
            colorBox.style.backgroundColor = color.color;

            const colorInfo = document.createElement('div');
            colorInfo.className = 'color-info';
            colorInfo.innerHTML = `
                <p>Name: ${color.name}</p>
                <p>Year: ${color.year}</p>
            `;

            colorBox.appendChild(colorInfo);
            colorList.appendChild(colorBox);
        });
    } catch (error) {
        console.error('Error fetching colors:', error);
    }
}

// Function to delete the session token cookie
function deleteSessionToken() {
    document.cookie = 'sessionToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}
