export const saveUserSession = res => {
  res.accessToken = res.accessToken || res.access_token;
  sessionStorage.setItem('uAT', res.accessToken);
}

export const clearUserSession = () => {
  sessionStorage.removeItem('uAT');
}

// export const eventTypes = {
//   CLOSE_DROPDOWNS : 'CLOSE_DROPDOWNS'
}
// export const events = {
//   closeDropdowns : (
//     // new CustomEvent(eventTypes.CLOSE_DROPDOWNS, { detail : })
//   )
// }