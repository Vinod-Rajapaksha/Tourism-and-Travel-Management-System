
export function clearAuthStorage() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
}

export function handleLogout() {
  clearAuthStorage();
}
