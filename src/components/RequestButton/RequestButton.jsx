import React, { useState } from 'react'
import { Button, Classes, MenuItem } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import { Select } from '@blueprintjs/select'
import classes from './RequestButton.scss'

const items = [
  // { label: '60 точек равномерно по карте мира', requestType: 'WORLD' },
  { label: '60 точек равномерно по текущему bbox', requestType: 'VISIBLE_BBOX' },
]

const itemRenderer = (item, { handleClick, modifiers, query }) => (
  <MenuItem
    active={modifiers.active}
    disabled={modifiers.disabled}
    key={item.requestType}
    onClick={handleClick}
    text={item.label.toString()}
  />
)

const RequestButton = props => {

  const [selectedItem, selectItem] = useState(items[0])

  return (
    <div className={classes.wrapper}>
      <Select
        filterable={false}
        items={items}
        onItemSelect={selectItem}
        itemRenderer={itemRenderer}
        popoverProps={{ minimal: true, usePortal: false }}
      >
        <Button text={selectedItem.label} rightIcon={IconNames.CARET_DOWN} className={Classes.LARGE} />
      </Select>
      <Button
        type="button"
        intent="primary"
        icon={IconNames.DOWNLOAD}
        className={Classes.LARGE}
        onClick={() => props.onRequest(selectedItem.requestType)}
        text="Показать температуру"
      />
    </div >
  )
}

export default RequestButton
