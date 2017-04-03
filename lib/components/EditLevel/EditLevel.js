/**
 * Imports
 */


import {component, element} from 'vdux'
import Grid from 'components/Grid'
import {Block} from 'vdux-ui'

/**
 * <Edit Grid/>
 */

export default component({
  render ({props, actions, children}) {
	  const {
	    clickHandler,
	    color = 'black',
	    size = '500px',
	    hideAnimal,
	    my = '1em',
	    paintMode,
	    painted,
	    grid,
	    game,
	    id,
	    ...restProps
	  } = props

	  return (
	    <Block my={my} textAlign='center'>
	      {children}
	      <Grid
	        editMode
	        paintMode={paintMode}
	        grid={grid}
	        id={id}
	        animals={hideAnimal ? [] : game.animals}
	        painted={painted}
	        levelSize={size}
	        w='auto'
	        h='auto'
	        clickHandler={actions.handleClick}
	        numRows={game.levelSize[0]}
	        numColumns={game.levelSize[1]}
	        {...restProps} />
	    </Block>
	  )
  },
  controller: {
  	* handleClick ({props}, coord) {
  		const {grid, color} = props
  		yield props.clickHandler({grid, coord, color})
  	}
  }
})
