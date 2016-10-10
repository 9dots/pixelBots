/** @jsx element */

import element from 'vdux/element'
import {Block, Tooltip} from 'vdux-ui'
import {Input} from 'vdux-containers'
import createAction from '@f/create-action'
import html from 'hypervdux'
import marked from 'marked'
import {Dropdown, MenuItem} from 'vdux-containers'
import {palette} from '../utils'
import ColorPicker from './ColorPicker'

const showTooltip = createAction('SHOW_TOOLTIP')
const hideTooltip = createAction('HIDE_TOOLTIP')

function initialState () {
  return {
    show: false
  }
}

function render ({props, local, state}) {
  const {arg, changeHandler, argument} = props
  const {name, type, values, description} = arg
  const {show} = state

  let close

  function getInput (propogate) {
    return (
      <Input
        autofocus
        mb='0'
        fs='12px'
        maxWidth='300px'
        h='20px'
        color='#333'
        p='10px'
        onFocus={local(showTooltip)}
        onBlur={local(hideTooltip)}
        inputProps={{textAlign: 'center', w: 'auto'}}
        value={argument}
        onClick={(e) => !propogate && e.stopPropagation()}
        onKeyup={(e) => keyUpHandler(e.target.value)} />
    )
  }

  const getDropdown = () => (
    values === 'color'
      ? (<ColorPicker
        w='200px'
        btn={<Block wide tall align='center center'>{getInput(true)}</Block>}
        clickHandler={(value) => keyUpHandler(`'${value}'`)}
        palette={palette}
      />)
      : (<Dropdown
        ref={function (api) { close = api.close }}
        zIndex='999'
        btn={<Block wide tall align='center center'>{getInput(true)}</Block>}>
        {values.map((value) => (
          <MenuItem onClick={[(e) => close(), () => keyUpHandler(value)]} fs='s'>{value}</MenuItem>
        ))}
      </Dropdown>)
  )

  return (
    <Block onClick={(e) => e.stopPropagation()} absolute left='100%' bgColor='#333' tall minWidth='80px' align='center center'>
      {values ? getDropdown() : getInput(false)}
      {!values && <Tooltip
        zIndex='999'
        p='10px'
        whiteSpace='wrap'
        w='300px'
        placement='top'
        show={show}>
        <Block fontFamily='code'>
          <Block fs='m'>{html(marked(name))}</Block>
          <Block fs='14px' fontWeight='800' my='10px' fontFamily='ornate'>{type}</Block>
          <Block fs='14px'>{description}</Block>
        </Block>
      </Tooltip>}
    </Block>
  )

  function keyUpHandler (eValue) {
    const value = eValue === '' || isNaN(eValue)
      ? eValue
      : Number(eValue)
    return changeHandler(value)
  }
}

function reducer (state, action) {
  switch (action.type) {
    case showTooltip.type:
      return {
        ...state,
        show: true
      }
    case hideTooltip.type:
      return {
        ...state,
        show: false
      }
  }
  return state
}

export default {
  initialState,
  reducer,
  render
}
