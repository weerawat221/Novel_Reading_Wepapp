// Cookie utility functions
export const setCookie = (name, value, days = 365) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
};

export const getCookie = (name) => {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length);
    }
  }
  return null;
};

export const deleteCookie = (name) => {
  setCookie(name, '', -1);
};

// Check if novel view has been counted in this session
export const hasViewedNovel = (novelID) => {
  return getCookie(`novel_${novelID}_viewed`) !== null;
};

// Mark novel as viewed
export const markNovelAsViewed = (novelID) => {
  setCookie(`novel_${novelID}_viewed`, 'true', 365);
};
