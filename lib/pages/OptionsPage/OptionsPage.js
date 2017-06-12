/**
 * Imports
 */

import {Table, TableHeader, TableRow, TableCell, Block, Icon, Text} from 'vdux-ui'
import AnimalDropdown from 'components/AnimalDropdown'
import CreateLayout from 'pages/Create/CreateLayout'
import DropdownField from 'components/DropdownField'
import colors, {blackAndWhite} from 'utils/palette'
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
import Switch from '@f/switch'

/**
 * Constants
 */

const paints = [
  'paint',
  'paint O',
  'paint I',
  'paint S',
  'paint Z',
  'paint L',
  'paint J',
  'paint T',
]

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
  	const {animals, inputType, type, updateGame, palette, capabilities = {}} = props
	  if (!animals) return <span/>

	  const animalType = animals[0].type
		const checkProps = {checkProps: {borderRadius: 5, mr: true, sq: 24, fs: 's', bold: true}}

	  return (
	    <Block wide mx='auto' maxWidth={750}>
	      <Block>
	        <EditableTextField
	          onSubmit={actions.update(({title}) => ({title}))}
	          value={props.title}
	          validate={({title}) => validator.title({title})}
	          field='title'
	          label='Name'
	          {...rowProps} />
	        <EditableTextField
	          onSubmit={actions.update(({description}) => ({description}))}
	          value={props.description}
	          validate={({description}) => validator.description({description})}
	          placeholder=''
	          textarea
	          field='description'
	          label='Description'
	          {...rowProps} />
	        <DropdownField label='Challenge Mode' {...rowProps}>
	          <TypeDropdown
	            btn={(val) => <DropdownButton text={val} />}
	            clickHandler={actions.update((type) => ({
                type,
                imageUrl: getImageUrl(type),
	            	initialPainted: null,
	              targetPainted: null,
	              painted: null,
	              advanced: false,
	              animals: props.animals.map((a) => ({...a, sequence: []}))
	            }))}
	            value={type}
	            name='setType' />
	        </DropdownField>
	        <DropdownField label='Code Type' {...rowProps}>
	          <CodeDropdown
	            name='inputType'
	            value={inputType}
	            btn={<DropdownButton text={
	            	inputType !== 'code' ? inputType : 'javascript'} />
	            }
	            setInputType={actions.update((type) => ({
	              inputType: type,
	              'startCode': [],
	              'animals': animals.map(a => ({...a, sequence: inputType === 'code' ? '' : []})),
	              'solution': (props.solution || []).map(a => ({...a, sequence: type === 'code' ? '' : []}))
	            }))} />
	        </DropdownField>
          <EditableTextField
          	borderBottomWidth='1'
            disabled={type !== 'write'}
            onSubmit={actions.update(({lineLimit}) => ({lineLimit: Number(lineLimit)}))}
	          value={props.lineLimit}
	          validate={({lineLimit}) => validator.lineLimit({lineLimit: Number(lineLimit)})}
	          field='lineLimit'
	          label='Suggested Lines'
	          {...rowProps} />

	        <DropdownField mt label='Colors' {...rowProps}>
            <Checkbox {...checkProps}
              label='Paint Colors'
              checked={palette.length > 2}
              onChange={updateGame({
                capabilities: {
                  ...capabilities,
                  ...paints.reduce((acc, paint) => {
                    const name = paint.replace(' ', '')
                    return {
                      ...acc,
                      [name]: capabilities[name]
                        ? palette && palette.length === 2 ? [true] : true
                        : null
                    }
                  }, {})
                },
                palette: palette && palette.length === 2
                  ? colors
                  : blackAndWhite
              })} />
          </DropdownField>
          <DropdownField label='Paints' {...rowProps}>
            <Table w='60%' ml={-12} borderCollapse='collapse' border='1px solid divider'>
            {
              paints.map((paint, i) => {
                const name = paint.replace(' ', '')
                return (
                  <TableRow bgColor={i % 2 ?  'white' : '#FAFAFA'}>
		        				<TableCell py='s' px fontFamily='monospace'>
                      <Checkbox {...checkProps}
                        label={paint.split('').map((chr, i) => i === 0 ? chr.toUpperCase() : chr)}
                        checked={props.capabilities[name]}
                        onChange={updateGame({
                          capabilities: {
                            ...capabilities,
                            [name]: capabilities[name]
                              ? null
                              : palette && palette.length === 2
                                ? true
                                : [true]
                          }
                        })} />
                      </TableCell>
                    </TableRow>
                  )
                })
              }
            </Table>
          </DropdownField>
	        <DropdownField label='Movement' {...rowProps} align='start start'>
	        	<Table w='60%' ml={-12} borderCollapse='collapse' border='1px solid divider'>
	        		<TableRow>
	        			<TableHeader py='s' px textAlign='left' fw='normal'>
	        				Direction
	        			</TableHeader>
	        			<TableHeader py='s' px textAlign='right' fw='normal'>
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
		        							[dir]: capabilities[dir] ? null : true
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
		        	<TableRow bgColor={'white'}>
        				<TableCell py='s' px fontFamily='monospace'>
        					<Checkbox {...checkProps} checked={!!capabilities.moveTo} onChange={updateGame({
        						capabilities: {
        							...capabilities,
        							moveTo: capabilities.moveTo ? null : [true, true]
        						}
        					})} label='moveTo' />
        				</TableCell>
        				<TableCell py='s' pl />
        			</TableRow>
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
		        							[dir]: capabilities[dir] ? null : true
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
	        						ifColor: capabilities.ifColor ? null : [true]
	        					}
	        				})} label={<Text>Conditionals <Text fontFamily='monospace'>(if)</Text></Text>} />
	        			</TableCell>
	        		</TableRow>
	        		<TableRow>
	        			<TableCell>
	        				<Checkbox {...checkProps} checked={!!capabilities.repeat} onChange={updateGame({
	        					capabilities: {
	        						...capabilities,
	        						repeat: capabilities.repeat ? null : [true]
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
  controller: {
    * update ({props}, fn, type) {
      const data = fn(type)
      yield props.updateGame({
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

function getImageUrl (type) {
  const base = '/animalImages/'
  switch (type) {
    case 'read':
      return base + 'readImage.png'
    case 'project':
      return base + 'projectImage.png'
    default:
      return base + 'teacherBot.png'
  }
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
