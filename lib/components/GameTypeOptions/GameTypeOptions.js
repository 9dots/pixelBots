
/**
 * Imports
 */

import CreateLayout from 'pages/Create/CreateLayout'
import GridOptions from 'components/GridOptions'
import StartCode from 'components/StartCode'
import {component, element} from 'vdux'
import setProp from '@f/set-prop'
import Switch from '@f/switch'
import {Block} from 'vdux-ui'
import reduce from '@f/reduce'

/**
 * <Grid Options/>
 */

function getPainted (state) {
  return {
    ...state,
    initialPainted: removeEmpty(state.initial.painted),
    targetPainted: removeEmpty(state.target.painted)
  }
}

function removeEmpty (paint) {
  return reduce((acc, val, key) => val
    ? ({...acc, [key]: val})
    : acc
  , {}, paint)
}

export default component({
  initialState: ({props}) => ({
		target: {
			painted: props.targetPainted || {},
			mode: 'paint',
			color: 'black'
		},
		initial: {
			painted: props.initialPainted || {},
			mode: 'paint',
			color: 'black'
		}
	}),
  render ({props, actions, children, state}) {
  	const {type, advanced} = props
    const paintState = !advanced ? getPainted(state) : {}

    return <CreateLayout {...props} {...paintState} step='create'>
      {
        Switch({
        	write: () => (
            <GridOptions actions={actions} save={props.updateGame} {...props} {...state}>
              {children}
            </GridOptions>
          ),
        	read: () => (
            <StartCodeOptions save={props.updateGame} {...props} {...state}>
              {children}
            </StartCodeOptions>
          ),
        	debug: () => (
            <GridOptions actions={actions} save={props.updateGame} {...props} {...state}>
              {children}
            </GridOptions>
          ),
        	project: () => <GridOptions actions={actions} isProject save={props.updateGame} {...props} {...state}/>,
        	default: () => <div> invalid </div>
        })(type)
      }
    </CreateLayout>
  },
  reducer: {
    setBulkPainted: (state, grid, painted) => setProp(`${grid}.painted`, state, painted),
    setPainted: (state, grid, location) => (
      setProp(`${grid}.painted.${location}`, state, state[grid].color)
    ),
    setMode: (state, grid, mode) => (
      setProp(`${grid}.mode`, state, mode)
    ),
    setColor: (state, grid, color) => (
      setProp(`${grid}.color`, state, color)
    ),
    erase: (state, grid, location) => (
      setProp(`${grid}.painted.${location}`, state, null)
    ),
  }
})

const StartCodeOptions = component({
	render ({props, actions, children}) {
		return (
      <Block wide>
			  <StartCode {...props} />
        {children}
     </Block>
		)
	}
})
