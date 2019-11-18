export default {
  api: ({ lat, lng }) => `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&APPID=3794c3f5df42da1f9672d29116d0bf56&units=metric`,
  map: {
    initialOptions: {
      center: [55, 37],
      zoom: 7,
      zoomAnimation: true,
      zoomControl: false,
    },
    tileLayer: {
      tilesSource: 'http://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
      initialOptions: {
        attribution: 'Map data &copy; <a href="http://osm.org">OpenStreetMap</a> contributors | <a href="https://www.hotosm.org/updates/2013-09-29_a_new_window_on_openstreetmap_data" title="Couche humanitaire par Yohan Boniface et HOT" target="_blank"><b><nobr>Y. Boniface</nobr> &amp; HOT</b></a> | <a href="https://www.openstreetmap.fr/mentions-legales/" title="OpenStreetMap France - mentions légales" target="_blank"><b>OSM France</b></a>',
        maxZoom: 18,
        detectRetina: false,
        updateWhenZooming: false,
        updateWhenIdle: true,
        reuseTiles: true,
      },
    },
  },
}
