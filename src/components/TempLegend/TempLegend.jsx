import React, { useState } from 'react'
import classes from './TempLegend.scss'
import { perc2color } from './../../3dparty/colorScale'
import { scaleLinear } from 'd3-scale'

const TempLegend = props => {

  const ticks = 5
  const colorTicks = 50

  const arr1 = []
  for (let k = 0; k <= colorTicks; k++) {
    arr1.push(<div key={k} style={{ backgroundColor: perc2color(100 - k * 100 / colorTicks) }}></div>)
  }

  const arr2 = []
  const linear = scaleLinear().domain([0, 100]).range([props.minTemp, props.maxTemp])
  for (let k = 0; k <= ticks; k++) {
    arr2.push(<div key={k} className={classes.tick}><div className={classes.text}>{linear(k * 100 / ticks).toFixed(1)}</div></div>)
  }

  return (
    <div className={classes.wrapper}>
      <div className={classes.scale}>{arr1}</div>
      <div className={classes.ticks}>{arr2}</div>
    </div >
  )
}

export default TempLegend
