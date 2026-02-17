const SESSION_KEY = 'gamehub_session';

export function saveSession(data) {
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(data)); } catch (e) {}
}

export function loadSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch (e) { return null; }
}

export function clearSession() {
    try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
}
