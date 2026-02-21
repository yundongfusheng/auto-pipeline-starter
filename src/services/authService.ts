import { User } from '../types/auth';

const MOCK_USERS = [
  { id: '1', username: 'admin', password: 'admin123' },
  { id: '2', username: 'demo', password: 'demo123' },
];

const TOKEN_KEY = 'aps:auth_token';
const USER_KEY = 'aps:auth_user';

export const authService = {
  login(username: string, password: string): { token: string; user: User } {
    const found = MOCK_USERS.find(
      (u) => u.username === username && u.password === password,
    );
    if (!found) throw new Error('用户名或密码错误');
    const token = `mock-token-${found.id}-${Date.now()}`;
    const user: User = { id: found.id, username: found.username };
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return { token, user };
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },
};
