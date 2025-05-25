document.addEventListener('DOMContentLoaded', () => {
    const sessionTableBody = document.getElementById('sessionTableBody');
    const clearSessionsButton = document.getElementById('clearSessions');

    function loadSessions() {
        sessionTableBody.innerHTML = ''; // Clear existing table content
        // Retrieve all sessions
        const sessions = JSON.parse(localStorage.getItem('allSessions') || '[]');
        
        if (sessions.length === 0) {
            sessionTableBody.innerHTML = '<tr><td colspan="7">No hay sesiones registradas</td></tr>';
        } else {
            sessions.forEach(session => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${session.userId}</td>
                    <td>${session.firstName}</td>
                    <td>${session.lastName}</td>
                    <td>${session.email}</td>
                    <td>${session.loginTime}</td>
                    <td>${session.logoutTime}</td>
                    <td>${session.sessionDuration}</td>
                `;
                sessionTableBody.appendChild(row);
            });
        }
    }

    // Initial load of sessions
    loadSessions();

    // Clear all sessions when the button is clicked
    clearSessionsButton.addEventListener('click', () => {
        localStorage.removeItem('allSessions');
        loadSessions(); // Reload table to reflect cleared state
    });
});