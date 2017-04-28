/**
 * Imports
 */

import {Block} from 'vdux-ui'
import {component, element} from 'vdux'

/**
 * <Win Graphic/>
 */

export default component({
  render ({props}) {
    return (
      <Block mt='-18px'>
        <svg class='badge' xmlns='http://www.w3.org/2000/svg' height='100' width='100' viewBox='-40 -40 440 440'>
          <circle class='outer' fill='#F9D535' stroke='#fff' stroke-width='8' stroke-linecap='round' cx='180' cy='180' r='157' />
          <circle class='inner' fill='#DFB828' stroke='#fff' stroke-width='8' cx='180' cy='180' r='108.3' />
          <path class='inline' d='M89.4 276.7c-26-24.2-42.2-58.8-42.2-97.1 0-22.6 5.6-43.8 15.5-62.4m234.7.1c9.9 18.6 15.4 39.7 15.4 62.2 0 38.3-16.2 72.8-42.1 97' stroke='#CAA61F' stroke-width='7' stroke-linecap='round' fill='none' />
          <g class='star'>
            <path fill='#F9D535' stroke='#fff' stroke-width='4' stroke-linecap='round' stroke-linejoin='round' d='M180 107.8l16.9 52.1h54.8l-44.3 32.2 16.9 52.1-44.3-32.2-44.3 32.2 16.9-52.1-44.3-32.2h54.8z' />
            <circle fill='#DFB828' stroke='#fff' stroke-width='4' stroke-linecap='round' stroke-linejoin='round' cx='180' cy='107.8' r='4.4' />
            <circle fill='#DFB828' stroke='#fff' stroke-width='4' stroke-linecap='round' stroke-linejoin='round' cx='223.7' cy='244.2' r='4.4' />
            <circle fill='#DFB828' stroke='#fff' stroke-width='4' stroke-linecap='round' stroke-linejoin='round' cx='135.5' cy='244.2' r='4.4' />
            <circle fill='#DFB828' stroke='#fff' stroke-width='4' stroke-linecap='round' stroke-linejoin='round' cx='108.3' cy='160.4' r='4.4' />
            <circle fill='#DFB828' stroke='#fff' stroke-width='4' stroke-linecap='round' stroke-linejoin='round' cx='251.7' cy='160.4' r='4.4' />
          </g>
        </svg>
      </Block>
    )
  }
})
