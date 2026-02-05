const SESSION_KEY = 'gamehub_session';

export function saveSession(data) {
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(data)); } catch (e) {}
}

export function loadSession() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)); } catch (e) { return null; }
}

export function clearSession() {
    try { sessionStorage.removeItem(SESSION_KEY); } catch (e) {}
}
