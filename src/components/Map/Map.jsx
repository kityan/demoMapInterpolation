import React from 'react'
import classes from './Map.scss'
import L from 'leaflet'
import config from './../../configs/config._BUILD_TARGET_'

class Map extends React.Component {

  mapElementRef = React.createRef()
  markers = []
  rects = null

  render() {
    return (
      <div className={classes.map} ref={this.mapElementRef}></div>
    )
  }

  componentDidMount() {
    this.createMap(this.mapElementRef.current)

  }

  componentWillUnmount() {
    this.map.off('moveend')
    this.map.off('movestart')
    this.map.off('resize')
  }

  componentDidUpdate(prevProps) {
    if (this.props.markersData && this.props.markersData !== prevProps.markersData) {

      console.log(JSON.stringify(
        this.props.markersData.features.map(item => {
          const { x, y } = this.map.latLngToContainerPoint([item.geometry.coordinates[1], item.geometry.coordinates[0]])
          return [x, y, item.properties.temperature]
        })
      ))

      // this.placeMarkers(this.props.markersData)
    }
    if (this.props.rectsData && this.props.rectsData !== prevProps.rectsData) {
      this.placeRects(this.props.rectsData)
    }
  }

  placeMarkers(data) {
    this.markers.forEach(marker => this.map.removeLayer(marker))
    this.markers = []
    const centerLng = this.map.getCenter().lng
    const options = { icon: new L.HtmlIcon({ html: `<div class="${classes.marker}"></div>` }) }
    data.features.forEach(point => {
      const [lng, lat] = point.geometry.coordinates
      const marker = L.marker([lat, L.Util.wrapNum(lng, [-180 + centerLng, 180 + centerLng], true)], options)
      this.map.addLayer(marker)
      this.markers.push(marker)
    })
  }

  placeRects(data) {
    if (this.rects) {
      this.map.removeLayer(this.rects)
    }
    this.rects = L.geoJSON(data, {
      style: function (feature) {
        return {
          fillColor: feature.properties.color,
          fillOpacity: 0.6,
          opacity: 0,
        }
      },
    })
    this.map.addLayer(this.rects)
  }

  createMap(placeholder) {
    this.map = L.map(placeholder, { ...config.map.initialOptions, renderer: L.canvas() })
    L.tileLayer(config.map.tileLayer.tilesSource, config.map.tileLayer.initialOptions).addTo(this.map)
    this.map.on('moveend', this.onMoveEnd)
    this.map.on('movestart', this.onMoveStart)
    this.map.on('resize', this.onResize)
    this.handleBoundsUpdate()
  }

  onMoveStart = () => { }
  onMoveEnd = () => this.handleBoundsUpdate()
  onResize = () => this.handleBoundsUpdate()

  handleBoundsUpdate = () => {
    if (typeof this.props.onBoundsChange === 'function') {
      const bounds = this.map.getBounds()
      let { lat, lng } = bounds.getNorthEast()
      const northEast = { lat, lng };
      ({ lat, lng } = bounds.getSouthWest())
      const southWest = { lat, lng }
      this.props.onBoundsChange({ northEast, southWest })
    }
  }
}

export default Map

L.HtmlIcon = L.Icon.extend({
  options: {},
  initialize: function (options) {
    L.Util.setOptions(this, options)
  },
  createIcon: function () {
    var div = document.createElement('div')
    div.innerHTML = this.options.html
    return div
  },
  createShadow: function () {
    return null
  }
})
