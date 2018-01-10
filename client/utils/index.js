export const saveUserSession = res => {
  res.accessToken = res.accessToken || res.access_token;
  sessionStorage.setItem('uAT', res.accessToken);
}

export const clearUserSession = () => {
  sessionStorage.removeItem('uAT');
}