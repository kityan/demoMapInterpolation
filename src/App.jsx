import React, { Component } from 'react'
import { Map, RequestButton, TempLegend } from './components'
import { Dialog, Classes } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import ApiManager from './services/ApiManager'
import * as turf from '@turf/turf'
import { scaleLinear } from 'd3-scale'
import { perc2color } from './3dparty/colorScale'

const world = {
  northEast: { lat: 80, lng: 179.9 },
  southWest: { lat: -80, lng: -179.9 },
}

class App extends Component {

  state = {
    markersData: null,
    rectsData: null,
    bounds: null,
    minTemp: null,
    maxTemp: null,
    errorDialogIsOpen: false,
  }

  render() {
    const { minTemp, maxTemp } = this.state

    return (
      <React.Fragment>
        <RequestButton onRequest={this.request} />
        {minTemp != null && maxTemp != null && <TempLegend minTemp={minTemp} maxTemp={maxTemp} />}
        <Map
          markersData={this.state.markersData}
          rectsData={this.state.rectsData}
          onBoundsChange={this.saveCurrentBounds}
        />
        <Dialog
          icon={IconNames.ERROR}
          onClose={() => this.setState({ errorDialogIsOpen: false })}
          title="Ошибка"
          isOpen={this.state.errorDialogIsOpen}
          canEscapeKeyClose={true}
          usePortal={true}
          portalClassName="movedToFront"
        >
          <div className={Classes.DIALOG_BODY}>
            <p>Не удалось загрузить данные, попробуйте повторить через минуту.</p>
          </div>
        </Dialog>
      </React.Fragment>
    )
  }

  saveCurrentBounds = bounds => this.setState({ bounds })

  request = async type => {
    const bbox = (type === 'VISIBLE_BBOX') ? this.state.bounds : world
    try {
      const data = await ApiManager.getWeatherPointsForBBox(bbox)
      this.setState({ markersData: data })
      const options = { gridType: 'square', property: 'temperature', units: 'kilometers', weight: 3 }
      setTimeout(() => {
        const rectsData = turf.interpolate(data, this.calcCellSize(data), options)
        const [minTemp, maxTemp] = this.getTempBounds(rectsData.features)
        const linear = scaleLinear().domain([minTemp, maxTemp]).range([0, 100])
        rectsData.features = rectsData.features.map(f => ({ ...f, properties: { color: perc2color(100 - linear(f.properties.temperature)) } }))
        this.setState({ rectsData, maxTemp, minTemp })
      }, 100)
    }
    catch (error) {
      this.setState({ errorDialogIsOpen: true })
    }
  }

  getTempBounds = features => {
    let max = Number.NEGATIVE_INFINITY
    let min = Number.POSITIVE_INFINITY
    for (let i = 0, qty = features.length; i < qty; i++) {
      let t = features[i].properties.temperature
      if (t > max) { max = t }
      if (t < min) { min = t }
    }
    return [min, max]
  }

  calcCellSize(data) {
    const distance = turf.distance(data.features[0], data.features[1], { units: 'kilometers' })
    return distance / 12
  }

}

export default App
