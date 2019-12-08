export default {
  setRoutePageUrl(routePageUrl) {
    localStorage.setItem('routePageUrl', routePageUrl);
  },

  getRoutePageUrl() {
    return localStorage.getItem('routePageUrl') || '';
  },
};
