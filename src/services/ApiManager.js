import config from './../configs/config._BUILD_TARGET_'
import axios from 'axios'

const generateGrid = (lat1, lng1, lat2, lng2) => {
  const latMin = Math.min(lat1, lat2)
  const latMax = Math.max(lat1, lat2)
  const lngMin = Math.min(lng1, lng2)
  const lngMax = Math.max(lng1, lng2)
  const latStep = Math.abs((latMax - latMin) / 5)
  const lngStep = Math.abs((lngMax - lngMin) / 9)
  const res = []
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 10; j++) {
      res.push({
        lat: latMin + latStep * i,
        lng: lngMin + lngStep * j,
      })
    }
  }
  return res
}

const ApiManager = {

  async getWeatherPointsForBBox({ northEast, southWest }) {
    const grid = generateGrid(southWest.lat, southWest.lng, northEast.lat, northEast.lng)
    const responses = await Promise.all(grid.map(item => axios.get(config.api(item))))
    if (responses.some(r => r.status !== 200 || !r.data || !r.data.cod === 200 || !r.data.main || Number.isFinite(!r.data.main.temp))) {
      throw 'RETRY'
    }
    const points = grid.map((item, index) => ({ ...item, temp: responses[index].data.main.temp }))
    return {
      type: 'FeatureCollection',
      features: points.map(p => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [p.lng, p.lat],
        },
        properties: {
          temperature: p.temp,
        },
      })),
    }
  },

  /*
async getWeatherPointsForBBox({ northEast, southWest }) {

  return JSON.parse(
    '{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[29.915771484375004,51.781435604431195]},"properties":{"temperature":4.31}},{"type":"Feature","geometry":{"type":"Point","coordinates":[31.489257812500004,51.781435604431195]},"properties":{"temperature":4.29}},{"type":"Feature","geometry":{"type":"Point","coordinates":[33.062744140625,51.781435604431195]},"properties":{"temperature":3.4}},{"type":"Feature","geometry":{"type":"Point","coordinates":[34.63623046875,51.781435604431195]},"properties":{"temperature":0.91}},{"type":"Feature","geometry":{"type":"Point","coordinates":[36.209716796875,51.781435604431195]},"properties":{"temperature":0.86}},{"type":"Feature","geometry":{"type":"Point","coordinates":[37.783203125,51.781435604431195]},"properties":{"temperature":0.62}},{"type":"Feature","geometry":{"type":"Point","coordinates":[39.356689453125,51.781435604431195]},"properties":{"temperature":2}},{"type":"Feature","geometry":{"type":"Point","coordinates":[40.93017578125,51.781435604431195]},"properties":{"temperature":0.58}},{"type":"Feature","geometry":{"type":"Point","coordinates":[42.503662109375,51.781435604431195]},"properties":{"temperature":0.11}},{"type":"Feature","geometry":{"type":"Point","coordinates":[44.0771484375,51.781435604431195]},"properties":{"temperature":0.72}},{"type":"Feature","geometry":{"type":"Point","coordinates":[29.915771484375004,53.022110087392925]},"properties":{"temperature":3.42}},{"type":"Feature","geometry":{"type":"Point","coordinates":[31.489257812500004,53.022110087392925]},"properties":{"temperature":2}},{"type":"Feature","geometry":{"type":"Point","coordinates":[33.062744140625,53.022110087392925]},"properties":{"temperature":1.31}},{"type":"Feature","geometry":{"type":"Point","coordinates":[34.63623046875,53.022110087392925]},"properties":{"temperature":0.22}},{"type":"Feature","geometry":{"type":"Point","coordinates":[36.209716796875,53.022110087392925]},"properties":{"temperature":0.62}},{"type":"Feature","geometry":{"type":"Point","coordinates":[37.783203125,53.022110087392925]},"properties":{"temperature":2.36}},{"type":"Feature","geometry":{"type":"Point","coordinates":[39.356689453125,53.022110087392925]},"properties":{"temperature":3}},{"type":"Feature","geometry":{"type":"Point","coordinates":[40.93017578125,53.022110087392925]},"properties":{"temperature":2.07}},{"type":"Feature","geometry":{"type":"Point","coordinates":[42.503662109375,53.022110087392925]},"properties":{"temperature":1.97}},{"type":"Feature","geometry":{"type":"Point","coordinates":[44.0771484375,53.022110087392925]},"properties":{"temperature":0.77}},{"type":"Feature","geometry":{"type":"Point","coordinates":[29.915771484375004,54.262784570354654]},"properties":{"temperature":2.42}},{"type":"Feature","geometry":{"type":"Point","coordinates":[31.489257812500004,54.262784570354654]},"properties":{"temperature":1.69}},{"type":"Feature","geometry":{"type":"Point","coordinates":[33.062744140625,54.262784570354654]},"properties":{"temperature":1.15}},{"type":"Feature","geometry":{"type":"Point","coordinates":[34.63623046875,54.262784570354654]},"properties":{"temperature":0.71}},{"type":"Feature","geometry":{"type":"Point","coordinates":[36.209716796875,54.262784570354654]},"properties":{"temperature":-1}},{"type":"Feature","geometry":{"type":"Point","coordinates":[37.783203125,54.262784570354654]},"properties":{"temperature":0.14}},{"type":"Feature","geometry":{"type":"Point","coordinates":[39.356689453125,54.262784570354654]},"properties":{"temperature":1.92}},{"type":"Feature","geometry":{"type":"Point","coordinates":[40.93017578125,54.262784570354654]},"properties":{"temperature":2.22}},{"type":"Feature","geometry":{"type":"Point","coordinates":[42.503662109375,54.262784570354654]},"properties":{"temperature":0.85}},{"type":"Feature","geometry":{"type":"Point","coordinates":[44.0771484375,54.262784570354654]},"properties":{"temperature":1.87}},{"type":"Feature","geometry":{"type":"Point","coordinates":[29.915771484375004,55.50345905331639]},"properties":{"temperature":3.54}},{"type":"Feature","geometry":{"type":"Point","coordinates":[31.489257812500004,55.50345905331639]},"properties":{"temperature":4.24}},{"type":"Feature","geometry":{"type":"Point","coordinates":[33.062744140625,55.50345905331639]},"properties":{"temperature":2.64}},{"type":"Feature","geometry":{"type":"Point","coordinates":[34.63623046875,55.50345905331639]},"properties":{"temperature":1.8}},{"type":"Feature","geometry":{"type":"Point","coordinates":[36.209716796875,55.50345905331639]},"properties":{"temperature":2}},{"type":"Feature","geometry":{"type":"Point","coordinates":[37.783203125,55.50345905331639]},"properties":{"temperature":2.35}},{"type":"Feature","geometry":{"type":"Point","coordinates":[39.356689453125,55.50345905331639]},"properties":{"temperature":1.07}},{"type":"Feature","geometry":{"type":"Point","coordinates":[40.93017578125,55.50345905331639]},"properties":{"temperature":1.25}},{"type":"Feature","geometry":{"type":"Point","coordinates":[42.503662109375,55.50345905331639]},"properties":{"temperature":2.57}},{"type":"Feature","geometry":{"type":"Point","coordinates":[44.0771484375,55.50345905331639]},"properties":{"temperature":3.34}},{"type":"Feature","geometry":{"type":"Point","coordinates":[29.915771484375004,56.74413353627812]},"properties":{"temperature":4.73}},{"type":"Feature","geometry":{"type":"Point","coordinates":[31.489257812500004,56.74413353627812]},"properties":{"temperature":4.03}},{"type":"Feature","geometry":{"type":"Point","coordinates":[33.062744140625,56.74413353627812]},"properties":{"temperature":2.83}},{"type":"Feature","geometry":{"type":"Point","coordinates":[34.63623046875,56.74413353627812]},"properties":{"temperature":2.54}},{"type":"Feature","geometry":{"type":"Point","coordinates":[36.209716796875,56.74413353627812]},"properties":{"temperature":3.53}},{"type":"Feature","geometry":{"type":"Point","coordinates":[37.783203125,56.74413353627812]},"properties":{"temperature":2.67}},{"type":"Feature","geometry":{"type":"Point","coordinates":[39.356689453125,56.74413353627812]},"properties":{"temperature":4.17}},{"type":"Feature","geometry":{"type":"Point","coordinates":[40.93017578125,56.74413353627812]},"properties":{"temperature":4.03}},{"type":"Feature","geometry":{"type":"Point","coordinates":[42.503662109375,56.74413353627812]},"properties":{"temperature":3.19}},{"type":"Feature","geometry":{"type":"Point","coordinates":[44.0771484375,56.74413353627812]},"properties":{"temperature":5.19}},{"type":"Feature","geometry":{"type":"Point","coordinates":[29.915771484375004,57.98480801923985]},"properties":{"temperature":6.13}},{"type":"Feature","geometry":{"type":"Point","coordinates":[31.489257812500004,57.98480801923985]},"properties":{"temperature":5.72}},{"type":"Feature","geometry":{"type":"Point","coordinates":[33.062744140625,57.98480801923985]},"properties":{"temperature":5.74}},{"type":"Feature","geometry":{"type":"Point","coordinates":[34.63623046875,57.98480801923985]},"properties":{"temperature":4.22}},{"type":"Feature","geometry":{"type":"Point","coordinates":[36.209716796875,57.98480801923985]},"properties":{"temperature":5.07}},{"type":"Feature","geometry":{"type":"Point","coordinates":[37.783203125,57.98480801923985]},"properties":{"temperature":3.15}},{"type":"Feature","geometry":{"type":"Point","coordinates":[39.356689453125,57.98480801923985]},"properties":{"temperature":5}},{"type":"Feature","geometry":{"type":"Point","coordinates":[40.93017578125,57.98480801923985]},"properties":{"temperature":5}},{"type":"Feature","geometry":{"type":"Point","coordinates":[42.503662109375,57.98480801923985]},"properties":{"temperature":2.94}},{"type":"Feature","geometry":{"type":"Point","coordinates":[44.0771484375,57.98480801923985]},"properties":{"temperature":3.3}}]}'
  )
}
*/

}

export default ApiManager

