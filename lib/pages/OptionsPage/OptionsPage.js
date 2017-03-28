/**
 * Imports
 */

import EditableTextField from './EditableTextField'
import EditableLevelItem from './EditableLevelItem'
import PermissionsField from './PermissionsField'
import AnimalDropdown from 'components/AnimalDropdown'
import DropdownField from 'components/DropdownField'
import maybeAddToArray from 'utils/maybeAddToArray'
// import StartCodeItem from './StartCodeItem'
import CodeDropdown from 'components/CodeDropdown'
import {Block, Icon, Text} from 'vdux-ui'
import {component, element} from 'vdux'
import Button from 'components/Button'
import validator from 'schema/level'
import Grid from 'components/Grid'

/**
 * <Options Page/>
 */

export default component({
  render ({props, actions, children}) {
  	const {animals, inputType} = props
	  const type = animals[0].type
	  const {onEdit} = actions

	  const animalBtn = (
	    <Button w='150px' fs='xs' bgColor='white' color='primary' hoverProps={{highlight: .02}} borderColor='#CCC' focusProps={{highlight: .04}}>
	      <Block wide align='space-between center'>
	        <Text textAlign='left' flex textTransform='capitalize'>{type}</Text>
	        <Icon relative right='0' mt='3px' fs='s' name='keyboard_arrow_down' />
	      </Block>
	    </Button>
	  )

	  const dropdownBtn = (
	    <Button w='150px' fs='xs' bgColor='white' color='primary' hoverProps={{highlight: .02}} borderColor='#CCC' focusProps={{highlight: .04}}>
	      <Block wide align='space-between center'>
	        <Text textAlign='left' flex textTransform='capitalize'>
	        	{inputType !== 'code' ? inputType : 'javascript'}
        	</Text>
	        <Icon float='right' mt='3px' fs='s' name='keyboard_arrow_down' />
	      </Block>
	    </Button>
	  )

	  const rowProps = {
	  	fs: 's',
	  	py: 's',
	  	hoverProps: {bgColor: 'rgba(blue, .04)'},
	  	border: '1px solid #e0e0e0',
	  	borderBottomWidth: 0 
	  }

	  return (
	    <Block wide mx='20px' maxWidth={750}>
	      <Block bgColor='white'>
	        <EditableTextField
	          onSubmit={({title}) => onEdit({title})}
	          value={props.title}
	          validate={({title}) => validator.title(title)}
	          field='title'
	          label='Name' 
	          {...rowProps} />
	        <EditableTextField
	          onSubmit={({description}) => onEdit({description})}
	          value={props.description}
	          validate={({description}) => validator.description(description)}
	          placeholder=''
	          textarea
	          field='description'
	          label='Description'
	          {...rowProps} />
	        <EditableTextField
	          onSubmit={(({levelSize}) => onEdit({
	            levelSize: [levelSize, levelSize],
	            'animals/0/current/location': [0, 0],
	            'animals/0/initial/location': [0, 0]
	          }))}
	          value={props.levelSize[0]}
	          validate={({levelSize}) => validator.levelSize(isNaN(levelSize) ? levelSize : Number(levelSize))}
	          field='levelSize'
	          label='Grid Size'
	          {...rowProps} />
	        <DropdownField label='Code Type' {...rowProps} >
	          <CodeDropdown
	            name='inputType'
	            value={inputType}
	            btn={dropdownBtn}
	            setInputType={((type) => onEdit({
	              inputType: type,
	              'startCode': [],
	              'animals/0/sequence': []
	            }))} />
	        </DropdownField>
	        <DropdownField label='Animal' {...rowProps}>
	          <AnimalDropdown
	            btn={animalBtn}
	            clickHandler={(name) => onEdit({
	              'animals/0/type': name,
	              initialPainted: 0,
	              targetPainted: 0,
	              painted: 0
	            })}
	            value={type}
	            name='setAnimal' />
	        </DropdownField>
	        <EditableLevelItem
	          game={props}
	          label='Target Grid'
	          title='Click to paint the target grid'
	          field='targetPainted'
	          painted={props.targetPainted}
	          onSubmit={(data) => onEdit({targetPainted: data})}
	          colorPicker
	          value={getLevel({painted: props.targetPainted, hideAnimal: true, game: props})}
	          {...rowProps} />
	        <EditableLevelItem
	          game={props}
	          label='Start Grid'
	          title='Click to paint the starting grid'
	          field='initialPainted'
	          painted={props.initialPainted}
	          onSubmit={(data) => onEdit({initialPainted: data, painted: data})}
	          colorPicker
	          value={getLevel({painted: props.initialPainted, hideAnimal: true, game: props})}
	          {...rowProps} />
	        <EditableLevelItem
	          title='Click the grid to set the starting position'
	          game={props}
	          label='Initial Position'
	          field='initPosition'
	          clickHandler={({coord}) => onEdit({
	            'animals/0/current/location': coord,
	            'animals/0/initial/location': coord
	          })}
	          value={getLevel({painted: [], game: props})}
	          {...rowProps} />
	        <PermissionsField
	          label='Student Permissions'
	          handleClick={(field) => onEdit({
	            permissions: maybeAddToArray(field, props.permissions)
	          })}
	          checked={props.permissions}
	          fields={['Run Button', 'Edit Code', 'Tracer Paint']}
	          {...rowProps}
	          borderBottomWidth='1' />
	      </Block>
	      {children}
	    </Block>
	  )
  },
  controller: {
	  * onEdit ({context, props}, data) {
	  	yield context.firebaseUpdate(props.ref, {
	  		lastEdited: Date.now(),
	  		...data
	  	})
	  }
  }
})


const OptionButton = component({
	render ({children}) {
		<Button w='160px' fs='s' bgColor='white' color='primary' hoverProps={{highlight: .02}} borderColor='#CCC' focusProps={{highlight: .04}}>
	      <Block wide align='space-between center'>
	        <Text textAlign='left' flex textTransform='capitalize'>
	        	{children}
        	</Text>
	        <Icon float='right' mt='3px' name='keyboard_arrow_down' />
	      </Block>
	    </Button>
	}
})

function getLevel ({painted, hideAnimal, game}) {
  return <Block display='block' w='82px'>
    <Grid
      my='0'
      painted={painted}
      animals={hideAnimal ? [] : game.animals}
      numRows={game.levelSize[0]}
      numColumns={game.levelSize[1]}
      levelSize='80px' />
  </Block>
}
