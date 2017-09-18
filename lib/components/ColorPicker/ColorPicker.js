/**
 * Imports
 */

import {wrap, CSSContainer, Dropdown, Grid, Button} from 'vdux-containers'
import {Tooltip, Block} from 'vdux-ui'
import ColorSwatch from './ColorSwatch'
import {component, element} from 'vdux'
import noop from '@f/noop'

/**
 * <ColorPicker/>
 */

export default wrap(CSSContainer, {
  lingerProps: {
    showColor: true
  }
})(component({
  initialState: {
    mode: 'paint'
  },

  render ({props, state, actions}) {
    const {swatchSize = 20, clickHandler, showColor, paintColor, swatchProps = {}, colors, dropdownTip, ...rest} = props
    const color = colors.find((color) => color.name === paintColor) || {name: 'black', value: '#000000'}
    let close

    const btn = (
      <Button m={0} borderRadius={3} {...rest} w={props.w || props.h || 'auto'}>
        <Block
          border='1px solid #DDD'
          bg={color.value}
          bgSize='contain'
          sq={swatchSize}
          align='center center'
          {...swatchProps} />
      </Button>
    )

    return (
      <Block align='start stretch' pointerEvents={clickHandler ? 'normal' : 'none'}>
        <Dropdown zIndex={1000} left p={4} ref={function (api) { close = api.close }} btn={btn}>
          <Grid itemsPerRow='4'>
            {(
              colors.map(({value, name}) => <ColorSwatch
                pointer
                size={30}
                bg={value}
                bgSize='contain'
                close={close}
                name={name}
                border={value === '#FFFFFF' ? '1px solid divider' : ''}
                m={2}
                clickHandler={clickHandler || noop}/>)
            )}
          </Grid>
        </Dropdown>
        <Tooltip relative show={showColor && dropdownTip}>{paintColor}</Tooltip>
      </Block>
    )
  }
}))
