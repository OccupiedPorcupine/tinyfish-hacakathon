/**
 * Auth utilities for session management
 * In production, this would use a proper auth library (NextAuth.js, Auth.js, etc.)
 */

export function setAuthToken(email: string, expiryDays = 30) {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + expiryDays);
  document.cookie = `auth-token=${email}; path=/; expires=${expiryDate.toUTCString()}`;
}

export function getAuthToken(): string | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'auth-token') {
      return decodeURIComponent(value);
    }
  }
  return null;
}

export function clearAuthToken() {
  document.cookie = 'auth-token=; path=/; max-age=0';
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

export function getUserEmail(): string | null {
  return getAuthToken();
}

/**
 * Server-side auth check for middleware
 */
export function checkAuthServer(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'auth-token') {
      return decodeURIComponent(value);
    }
  }
  return null;
}
