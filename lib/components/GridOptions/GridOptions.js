/**
 * Imports
 */

import GridSizeSelector from 'components/GridSizeSelector'
import TurnSelector from 'components/TurnSelector'
import ColorPicker from 'components/ColorPicker'
import EraseButton from 'components/EraseButton'
import StartCode from 'components/StartCode'
import filterPaint from 'utils/filterPaint'
import {Button} from 'vdux-containers'
import {component, element} from 'vdux'
import mapValues from '@f/map-values'
import {Block, Icon} from 'vdux-ui'
import Grid from 'components/Grid'
import setProp from '@f/set-prop'
import Switch from '@f/switch'
import filter from '@f/filter'

/**
 * <Grid Options/>
 */

export default component({
	initialState ({props}) {
		return {
			targetPainted: {
				painted: props.targetPainted,
				mode: 'paint',
				color: 'black'
			},
			initialPainted: {
				painted: props.initialPainted,
				mode: 'paint',
				color: 'black'
			},
			targetGrid: true
		}
	},
  render ({props, state, actions}) {
  	const {type, animals, levelSize, ...restProps} = props
  	const {targetPainted, initialPainted, targetGrid, startGrid, startCode} = state
  	const {toggleStart, toggleCode, toggleTarget} = actions

  	const btnProps = {
  		bgColor: '#FAFAFA', 
  		border: '1px solid #CACACA', 
  		sq: 40,
  		color: 'black'
  	}

    return (
    	<Block column align='start center' wide minWidth='1132'>
    		<Block mb wide pb borderBottom='1px solid divider'>
    			<TabButton active={startGrid} text='Start Grid' borderRadius='3px 0 0 3px' onClick={toggleStart} borderRightWidth={0} />
    			<TabButton active={targetGrid} text='Target Grid' borderRadius={0} onClick={toggleTarget} />
    			<TabButton active={startCode} text='Start Code' borderRadius='0 3px 3px 0' onClick={toggleCode} borderLeftWidth={0} />
    		</Block>
    		<Block align='center start' flexWrap='wrap' wide>
    			<GridBlock 
    				{...props}
    				gridState={initialPainted}
    				grid='initialPainted'
    				info={'The student\'s grid will start like the grid below.'}
    				title='Paint Your Start Grid'
    				actions={actions} 
    				mr={10} 
    				maxWidth='50%'
    				hide={!startGrid} />
    			<GridBlock 
    				{...props} 
    				gridState={targetPainted}
    				grid='targetPainted'
    				info='Students will use code to create the grid below.'
    				title='Paint Your Target Grid'
    				actions={actions}
    				mr={10}
    				maxWidth='50%'
    				enableMove={false}
    				hide={!targetGrid} />
    			<Block maxWidth='900px' flex wide h='600px' hide={!startCode}>
	    			<StartCode 
	    				hideGrid
	    				wide
	    				{...props} />
  				</Block>
  			</Block>
      </Block>
    )
  },
  * onRemove ({actions, props, context, state}) {
  	yield props.save({
  		targetPainted: filterPaint(state.targetPainted.painted) || null,
  		initialPainted: filterPaint(state.initialPainted.painted) || null
  	})
  },
  controller: {
  	* setSize ({props, state, context, actions}, size) {
      const {animals} = props
  		yield context.firebaseUpdate(props.ref, {
  			levelSize: [size, size],
        animals: animals.map((a) => ({
          ...a,
          current: {...a.current, location: [size - 1, 0]},
          initial: {...a.initial, location: [size - 1, 0]}
        }))
      })
  		yield actions.setBulkPainted('targetPainted', filter((val, key) => (
        key.split(',').every((v) => v <= size - 1)
      ), state.targetPainted.painted))
  		yield actions.setBulkPainted('initialPainted', filter((val, key) => (
        key.split(',').every((v) => v <= size - 1)
      ), state.initialPainted.painted))

  	},
    * moveAnimal ({state, context, props}, grid, location) {
      const {animals, ref} = props
      yield context.firebaseUpdate(ref, {
        animals: animals.map((a) => ({
          ...a,
          current: {...a.current, location},
          initial: {...a.initial, location}
        }))
      })
    },
    * turn ({state, context, props}, grid, rot) {
      const {animals, ref} = props
      yield context.firebaseUpdate(ref, {
        animals: animals.map((a) => ({
          ...a,
          current: {...a.current, rot},
          initial: {...a.initial, rot}
        }))
      })
    }
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
  	toggleTarget: (state) => ({targetGrid: !state.targetGrid}),
  	toggleStart: (state) => ({startGrid: !state.startGrid}),
  	toggleCode: (state) => ({startCode: !state.startCode})
  }
})


const TabButton = component({
	render ({props}) {
		const {active, text, ...rest} = props 
		const style = {highlight: .06}
		const activeProps = active 
			? {
					...style,
					hoverProps: style,
					activeProps: style,
					focusProps: style,
				}
			: {}
		return ( 
			<Button 
				bgColor='white'
				color='#666'
				fs='xs' 
				py='s' 
				px
				borderColor='divider'
				hoverProps={{highlight: .01}}
				activeProps={{highlight: .01}}
				focusProps={{highlight: 0}}
				{...activeProps}
				{...rest}>
      	{text}
    	</Button>
  	)
	}
})

const GridBlock = component({
	render ({props}) {
		const {
			type, 
			grid,
      animals,
			levelSize,
			actions,
			gridState,
			title, 
			info,
			enablePaint = true,
			enableMove = true,
			enableSize = true,
			...restProps
		} = props
  	const btnProps = {
  		bgColor: '#FAFAFA', 
  		border: '1px solid #CACACA', 
  		sq: 40,
  		color: 'black'
  	}

  	const {mode, color, painted} = gridState
  	const clickHandler = Switch({
  		paint: () => actions.setPainted(grid),
  		erase: () => actions.erase(grid),
  		animal: () => actions.moveAnimal(grid)
  	})(mode)

		return (
			<Block {...restProps}>
				<Block mt textAlign='center'>
	  			<Block fs='m'color='blue'>{title}</Block>
	  			<Block fs='xs' my>
	  				{info}
	  			</Block>
	  		</Block>
	  		<Block align='center start'>
	    		<Block pb='xl'>
	    			<Block bgColor='white' p='1em' border='1px solid divider' borderBottomWidth={0} z='999' relative>
	    				<Block align='start center'>
		          	<ColorPicker
		              zIndex='999'
		              active={mode === 'paint'}
		              animalType={animals[0].type}
		              dropdownHandler={actions.setColor(grid)}
		              clickHandler={actions.setMode(grid, 'paint')}
		              paintColor={color}
		              {...btnProps}
		              hide={!enablePaint} />
		            <EraseButton
		            	{...btnProps}
		            	active={mode === 'erase'}
		            	clickHandler={actions.setMode(grid, 'erase')}
		            	hide={!enablePaint} />
		            <Button {...btnProps} ml='s' highlight={mode === 'animal'} onClick={actions.setMode(grid, 'animal')} hide={!enableMove}>
		            	<Icon name='open_with' />
		            </Button>
		            <TurnSelector ml='s' animals={animals} hide={!enableMove} clickHandler={actions.turn(grid)}/>
		            <Block flex />

		            <GridSizeSelector setSize={actions.setSize} size={levelSize[0]} {...btnProps} hide={!enableSize} />
	          	</Block>
	          </Block>
			    	<Grid
			    		clickHandler={clickHandler}
			      	mode='edit'
			        paintMode
			        animals={grid === 'initialPainted' ? animals : []}
			        painted={painted}
			        levelSize='400px'
			        numRows={props.levelSize[0]}
			        numColumns={props.levelSize[1]}
			        />
	        </Block>
	      </Block>
      </Block>
		)
	}
})