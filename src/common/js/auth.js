
const TokenKey = 'Admin-Token';

export function getToken() {
  return localStorage.getItem(TokenKey);
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}


const historyPage='History-Page';

export function getHistoryPage() {
  return sessionStorage.getItem(historyPage);
}

export function setHistoryPage(page) {
  sessionStorage.setItem(historyPage,page);
}
export function removeHistoryPage() {
  sessionStorage.removeItem(historyPage);
}

