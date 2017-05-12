/**
 * Imports
 */

import EditableTextField from './EditableTextField'
import AnimalDropdown from 'components/AnimalDropdown'
import DropdownField from 'components/DropdownField'
import CodeDropdown from 'components/CodeDropdown'
import TypeDropdown from 'components/TypeDropdown'
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
  	const {animals, inputType, type} = props
	  const animalType = animals[0].type
	  const {onEdit} = actions

	  const rowProps = {
	  	fs: 's',
	  	py: 's',
	  	hoverProps: {bgColor: 'rgba(blue, .04)'},
	  	border: '1px solid #e0e0e0',
	  	borderBottomWidth: 0
	  }

	  return (
	    <Block wide mx='auto' maxWidth={750}>
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
	        <DropdownField label='Challenge Mode' {...rowProps}>
	          <TypeDropdown
	            btn={(val) => <DropdownButton text={val} />}
	            clickHandler={(type) => onEdit({
	            	type,
	            	initialPainted: null,
	              targetPainted: null,
	              painted: null,
	              animals: props.animals.map((a) => ({...a, sequence: []}))
	            })}
	            value={type}
	            name='setType' />
	        </DropdownField>
	        <DropdownField label='Code Type' {...rowProps} >
	          <CodeDropdown
	            name='inputType'
	            value={inputType}
	            btn={<DropdownButton text={
	            	inputType !== 'code' ? inputType : 'javascript'} />
	            }
	            setInputType={((type) => onEdit({
	              inputType: type,
	              'startCode': [],
	              'animals/0/sequence': []
	            }))} />
	        </DropdownField>
	        <DropdownField label='Animal' {...rowProps} borderBottomWidth='1'>
	          <AnimalDropdown
	            btn={<DropdownButton text={animalType} />}
	            clickHandler={(name) => onEdit({
	              'animals/0/type': name,
	              initialPainted: null,
	              targetPainted: null,
	              painted: null
	            })}
	            value={animalType}
	            name='setAnimal' />
	        </DropdownField>
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
      mode='write'
      painted={painted}
      animals={hideAnimal ? [] : game.animals}
      numRows={game.levelSize[0]}
      numColumns={game.levelSize[1]}
      levelSize='80px' />
  </Block>
}

const DropdownButton = component({
	render ({props}, children) {
		const {text} = props
		return (
	    <Button w='150px' fs='xs' bgColor='white' color='primary' hoverProps={{highlight: .02}} borderColor='#CCC' focusProps={{highlight: .04}}>
	      <Block wide align='space-between center'>
        	<Text textAlign='left' flex textTransform='capitalize'>{text}</Text>
	        <Icon relative right='0' mt='3px' fs='s' name='keyboard_arrow_down' />
	      </Block>
	    </Button>
		)
	}
})
