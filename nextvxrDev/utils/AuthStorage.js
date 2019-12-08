import isEmpty from 'lodash.isempty';

export default {
  isTokenValid() {
    const accessToken = isEmpty(localStorage.getItem('accessToken')) ? false : localStorage.getItem('accessToken');

    const isValid = accessToken && Number(localStorage.getItem('expiresAt')) > (new Date().getTime() / 1000);

    return isValid;
  },

  setToken(token) {
    if (!isEmpty(token)) {
      const { access_token, refresh_token, expires_in } = token;
      const expiredAt = (new Date().getTime() / 1000) + expires_in;

      if (localStorage) {
        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('refreshToken', refresh_token);
        localStorage.setItem('expiresAt', expiredAt);
        localStorage.setItem('expiresIn', expires_in);

        return true;
      }
    }

    return false;
  },

  getToken() {
    return {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
      expiresAt: localStorage.getItem('expiresAt'),
    };
  },
};
