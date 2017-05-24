/**
 * Imports
 */

import {Table, TableHeader, TableRow, TableCell, Block, Icon, Text} from 'vdux-ui'
import AnimalDropdown from 'components/AnimalDropdown'
import DropdownField from 'components/DropdownField'
import palette, {blackAndWhite} from 'utils/palette'
import maybeAddToArray from 'utils/maybeAddToArray'
import EditableTextField from './EditableTextField'
import EditableLevelItem from './EditableLevelItem'
import CodeDropdown from 'components/CodeDropdown'
import TypeDropdown from 'components/TypeDropdown'
import PermissionsField from './PermissionsField'
import ColorPicker from 'components/ColorPicker'
import {Checkbox, Toggle} from 'vdux-containers'
import {component, element} from 'vdux'
import Button from 'components/Button'
import validator from 'schema/level'
import Grid from 'components/Grid'

/**
 * Constants
 */

const rowProps = {
 	fs: 's',
 	py: 's',
 	hoverProps: {bgColor: 'rgba(blue, .04)'},
 	border: '1px solid #e0e0e0',
	borderBottomWidth: 0
}

/**
 * <OptionsPage/>
 */

export default component({
  render ({props, actions, children}) {
  	const {animals, inputType, type, updateGame, capabilities = {}} = props
	  if (!animals) return <span/>

	  const animalType = animals[0].type
		const checkProps = {checkProps: {borderRadius: 5, mr: true, sq: 24, fs: 's', bold: true}}

	  return (
	    <Block wide mx='auto' maxWidth={750}>
	      <Block>
	        <EditableTextField
	          onSubmit={({title}) => updateGame({title})}
	          value={props.title}
	          validate={({title}) => validator.title(title)}
	          field='title'
	          label='Name'
	          {...rowProps} />
	        <EditableTextField
	          onSubmit={({description}) => updateGame({description})}
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
	            clickHandler={(type) => updateGame({
	            	type,
	            	initialPainted: null,
	              targetPainted: null,
	              painted: null,
	              advanced: false,
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
	            setInputType={((type) => updateGame({
	              inputType: type,
	              'startCode': [],
	              'animals': animals.map(a => ({...a, sequence: type === 'code' ? '' : []})),
	              'solution': (props.solution || []).map(a => ({...a, sequence: type === 'code' ? '' : []}))
	            }))} />
	        </DropdownField>
	        <DropdownField label='Animal' {...rowProps} borderBottomWidth={1} mb='l'>
	          <AnimalDropdown
	            btn={<DropdownButton text={animalType} />}
	            clickHandler={(name) => updateGame({
	              'animals/0/type': name,
                'solution/0/type': name
	            })}
	            value={animalType}
	            name='setAnimal' />
	        </DropdownField>
	        <DropdownField label='Colors' {...rowProps}>
	        	<Checkbox {...checkProps}
	        		label='Paint Colors'
	        		checked={capabilities.paint[0].length > 2}
	        		onChange={updateGame({
	        			capabilities: {
	        				...capabilities,
	        				paint: capabilities.paint && capabilities.paint[0].length === 2
	        					? [palette]
	        					: [blackAndWhite]
	        			}
	        		})} />
	        </DropdownField>
	        <DropdownField label='Movement' {...rowProps} align='start start'>
	        	<Table w='60%' ml={-12} borderCollapse='collapse' border='1px solid divider'>
	        		<TableRow>
	        			<TableHeader py='s' px textAlign='left' fw='normal'>
	        				Direction
	        			</TableHeader>
	        			<TableHeader py='s' px textAlign='right'>
	        				Enable Arguments
	        			</TableHeader>
	        		</TableRow>
		        	{
		        		['up', 'down', 'left', 'right', 'forward'].map((dir, i) => (
		        			<TableRow bgColor={i % 2 ?  'white' : '#FAFAFA'}>
		        				<TableCell py='s' px fontFamily='monospace'>
		        					<Checkbox {...checkProps} checked={!!capabilities[dir]} onChange={updateGame({
		        						capabilities: {
		        							...capabilities,
		        							[dir]: capabilities[dir] ? false : true
		        						}
		        					})} label={dir} />
		        				</TableCell>
		        				<TableCell py='s' pl>
		        					<Toggle
		        						float='right'
		        						checked={Array.isArray(capabilities[dir])}
		        						disabled={!capabilities[dir]}
		        						opacity={capabilities[dir] ? 1 : .4}
		        						pointerEvents={capabilities[dir] ? 'all' : 'none'}
		        						onChange={updateGame({
		        						capabilities: {
		        							...capabilities,
		        							[dir]: Array.isArray(capabilities[dir]) ? true : [true]
		        						}
		        					})} />
		        				</TableCell>
		        			</TableRow>
		        		))
		        	}
		        </Table>
	        </DropdownField>
	        <DropdownField label='Turning' {...rowProps}>
		        <Table w='60%' ml={-12} borderCollapse='collapse' border='1px solid divider'>
		        	<TableRow>
		        		<TableHeader py='s' px textAlign='left' fw='normal'>
		        			Direction
		        		</TableHeader>
		        	</TableRow>
		        	{
		        		['turnLeft', 'turnRight'].map((dir, i) => (
		        			<TableRow bgColor={i % 2 ?  'white' : '#FAFAFA'}>
		        				<TableCell py='s' px fontFamily='monospace'>
		        					<Checkbox {...checkProps} checked={!!capabilities[dir]} onChange={updateGame({
		        						capabilities: {
		        							...capabilities,
		        							[dir]: capabilities[dir] ? false : true
		        						}
		        					})} label={dir} />
		        				</TableCell>
		        			</TableRow>
		        		))
		        	}
		        </Table>
	        </DropdownField>
	        <DropdownField label='Structural' {...rowProps} borderBottomWidth='1'>
	        	<Table>
	        		<TableRow>
	        			<TableCell>
	        				<Checkbox {...checkProps} pb checked={!!capabilities.ifColor} onChange={updateGame({
	        					capabilities: {
	        						...capabilities,
	        						ifColor: capabilities.ifColor ? false : [true]
	        					}
	        				})} label={<Text>Conditionals <Text fontFamily='monospace'>(if)</Text></Text>} />
	        			</TableCell>
	        		</TableRow>
	        		<TableRow>
	        			<TableCell>
	        				<Checkbox {...checkProps} checked={!!capabilities.repeat} onChange={updateGame({
	        					capabilities: {
	        						...capabilities,
	        						repeat: capabilities.repeat ? false : [true]
	        					}
	        				})} label={<Text>Loops <Text fontFamily='monospace'>(repeat)</Text></Text>} />
	        			</TableCell>
	        		</TableRow>
	        	</Table>
	        </DropdownField>
	      </Block>
	      <Block mt='l'>
	      	{children}
	      </Block>
	    </Block>
	  )
  },
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
