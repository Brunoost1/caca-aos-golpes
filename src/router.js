const routes = {
  "": "#/jogar",
  "#/": "#/jogar",
  "#/jogar": "#/jogar",
  "#/sobre": "#/sobre",
  "#/admin": "#/admin"
};

export function getRoute() {
  const hash = window.location.hash || "#/jogar";
  return routes[hash] ? routes[hash] : "#/jogar";
}

export function onRouteChange(cb) {
  window.addEventListener("hashchange", () => cb(getRoute()));
}

export function navigate(hash) {
  window.location.hash = hash;
}