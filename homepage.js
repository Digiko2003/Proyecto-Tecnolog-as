import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAIPu41DmYUU39n5bncSFw7Kxr5cXO2vQI",
    authDomain: "demoda-c0655.firebaseapp.com",
    databaseURL: "https://demoda-c0655-default-rtdb.firebaseio.com",
    projectId: "demoda-c0655",
    storageBucket: "demoda-c0655.firebasestorage.app",
    messagingSenderId: "331052032037",
    appId: "1:331052032037:web:733e8b4faf7c06a059dfcc",
    measurementId: "G-W314Y46L4H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();

// Store login time and user data when user is authenticated
onAuthStateChanged(auth, (user) => {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    if (loggedInUserId) {
        console.log(user);
        const docRef = doc(db, "users", loggedInUserId);
        // Store login time in localStorage if not already set
        if (!localStorage.getItem('loginTime')) {
            const loginTime = new Date().toISOString();
            localStorage.setItem('loginTime', loginTime);
            document.getElementById('loginTime').innerText = new Date(loginTime).toLocaleString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        }

        getDoc(docRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    document.getElementById('loggedUserFName').innerText = userData.firstName;
                    document.getElementById('loggedUserEmail').innerText = userData.email;
                    document.getElementById('loggedUserLName').innerText = userData.lastName;
                    // Store user data in localStorage for use in session recording
                    localStorage.setItem('userData', JSON.stringify(userData));
                } else {
                    console.log("No document found matching id");
                }
            })
            .catch((error) => {
                console.log("Error getting document:", error);
            });
    } else {
        console.log("User ID not found in local storage");
    }
});

const stopSessionButton = document.getElementById('stopSession');
stopSessionButton.addEventListener('click', () => {
    const loginTime = localStorage.getItem('loginTime');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    if (loginTime && loggedInUserId) {
        const start = new Date(loginTime);
        const end = new Date();
        const logoutTime = end.toISOString();
        const durationMs = end - start;
        // Calculate duration in hours, minutes, seconds
        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
        const durationText = `${hours} horas, ${minutes} minutos, ${seconds} segundos`;

        // Display logout time and session duration
        document.getElementById('logoutTime').innerText = new Date(logoutTime).toLocaleString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        document.getElementById('sessionDuration').innerText = durationText;

        // Save session data to localStorage
        const sessionData = {
            userId: loggedInUserId,
            firstName: userData.firstName || 'Unknown',
            lastName: userData.lastName || 'Unknown',
            email: userData.email || 'Unknown',
            loginTime: new Date(loginTime).toLocaleString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }),
            logoutTime: new Date(logoutTime).toLocaleString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }),
            sessionDuration: durationText
        };

        // Retrieve existing sessions or initialize an empty array
        const sessions = JSON.parse(localStorage.getItem('allSessions') || '[]');
        sessions.push(sessionData);
        localStorage.setItem('allSessions', JSON.stringify(sessions));

        // Clear loginTime to allow starting a new session
        localStorage.removeItem('loginTime');
    } else {
        document.getElementById('sessionDuration').innerText = "No session start time recorded";
        document.getElementById('logoutTime').innerText = "No logout time recorded";
    }
});

const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', () => {
    localStorage.removeItem('loggedInUserId');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('userData');
    signOut(auth)
        .then(() => {
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error('Error signing out:', error);
        });
});