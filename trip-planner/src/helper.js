/**
 * Returns token if present, otherwise returns null 
 */
export function checkLoginStatus() {
    return sessionStorage.token;
}