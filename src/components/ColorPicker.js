/** @jsx element */

import element from 'vdux/element'
import {Block, Dropdown, Grid} from 'vdux-containers'

function render ({props, local}) {
  const {btn, clickHandler, palette, swatchSize = '24px'} = props

  let close

  return (
    <Dropdown ref={(api) => close = api.close} btn={btn} {...props}>
      <Grid itemsPerRow='4' rowAlign='center center' columnAlign='start center'>
        {palette.map(({value, name}) => <Block
          onClick={[(e) => close(), (e) => clickHandler(name)]}
          h={swatchSize}
          hoverProps={{border: '1px solid black'}}
          w={swatchSize}
          m='5px'
          bgColor={value}/>
        )}
      </Grid>
    </Dropdown>
  )
}

export default {
  render
}
