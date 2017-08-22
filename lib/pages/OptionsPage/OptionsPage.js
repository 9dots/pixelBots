/**
 * Imports
 */

import {Table, TableHeader, TableRow, TableCell, Block, Icon, Text, Input} from 'vdux-ui'
import StretchDropdown from 'components/StretchDropdown'
import DropdownField from 'components/DropdownField'
import colors, {blackAndWhite} from 'utils/palette'
import EditableTextField from './EditableTextField'
import CodeDropdown from 'components/CodeDropdown'
import TypeDropdown from 'components/TypeDropdown'
import {Checkbox, Toggle} from 'vdux-containers'
import BlockIcon from 'components/BlockIcon'
import {component, element, decodeValue} from 'vdux'
import Button from 'components/Button'
import validator from 'schema/level'
import Grid from 'components/Grid'

const stretchGoals = {
  write: {
    lineLimit: {
      label: 'Lines',
      indicator: 'lloc'
    },
    stepLimit: {
      label: 'Steps',
      indicator: 'steps'
    }
  },
  debug: {
    modLimit: {
      label: 'Modifications',
      indicator: 'modifications'
    }
  },
  read: {
    errorLimit: {
      label: 'Errors',
      indicator: 'invalidCount'
    }
  }
}

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
  'paint T'
]

const rowProps = {
 	fs: 's',
 	py: 's',
 	hoverProps: {bgColor: 'rgba(blue, .04)'},
 	border: '1px solid #e0e0e0',
	borderBottomWidth: 0
}

const inputProps = {
	placeholder: '--',
	inputProps: {p: 5, textAlign: 'center', h: 32},
	m: '0 0 0 12px',
 	w: 60
}

/**
 * <OptionsPage/>
 */

export default component({
  render ({props, actions, children}) {
  	const {animals, inputType, showModal, type, updateGame, palette, capabilities = {}, stretch = {}} = props
    const {hard} = stretch
	  if (!animals) return <span/>

	  console.log(capabilities)

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
          <DropdownField label='Directions modal' {...rowProps}>
            <Toggle
              checked={showModal}
              onChange={updateGame({showModal: !showModal})} />
          </DropdownField>
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
                stretch: null,
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
	        <DropdownField disabled={!stretchGoals[type]} label='Stretch Goal' {...rowProps}>
	          <StretchDropdown
              options={stretchGoals[type]}
	            btn={<DropdownButton text={
	            	stretch.type
	            		? stretchGoals[type][stretch.type].label
	            		: 'None'
	            	} />
	            }
	            onSelect={actions.update((stretchType) => ({stretch: {...stretchGoals[type][stretchType], type: stretchType, value: null}}))
	          	}/>
	            <Input hide={!stretch.type} {...inputProps} onKeyUp={decodeValue(actions.setStretch)} value={stretch.value} />
	        </DropdownField>
          <DropdownField disabled={!stretchGoals[type] || !stretch.type} label='Enforce Stretch Goal' {...rowProps} borderBottomWidth='1'>
            <Toggle
              checked={hard}
              onChange={updateGame({'stretch/hard': !hard})} />
          </DropdownField>
	        <DropdownField mt label='Colors' {...rowProps}>
            <Checkbox {...checkProps}
              label='Paint Colors'
              checked={palette.length > 2}
              ml='s'
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
                const value = capabilities[name]
                  ? null
                  : [true]
                return (
                  <TableRow bgColor={i % 2 ? 'white' : '#FAFAFA'}>
		        				<TableCell py='s' px fontFamily='monospace'>
                      <Checkbox {...checkProps}
                        label={<Block my={-4} align='start center'>Paint <BlockIcon ml='s' type={name} color='#555' /></Block>}
                        checked={props.capabilities[name]}
                        onChange={updateGame({
                          capabilities: {
                            ...capabilities,
                            [name]: value
                          }
                        })} />
                      </TableCell>
                    </TableRow>
                  )
                })
              }
              <TableRow bgColor='#FAFAFA'>
        				<TableCell py='s' px fontFamily='monospace'>
                  <Checkbox {...checkProps}
                    label={<Block my={-4} align='start center'>Toggle </Block>}
                    checked={props.capabilities.toggle}
                    onChange={updateGame({
                      capabilities: {
                        ...capabilities,
                        toggle: capabilities.toggle ? null : true
                      }
                    })} />
                  </TableCell>
              </TableRow>
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
		        		['turnLeft', 'turnRight', 'faceNorth'].map((dir, i) => (
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
	        				<Checkbox {...checkProps} pb checked={!!capabilities.repeat} onChange={updateGame({
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
    },
    * setStretch ({actions, props}, value) {
    	yield actions.update(() =>
        ({
          stretch: {
            ...props.stretch,
            value
          }
        })
    	)
    }
  }
})


const OptionButton = component({
	render ({children}) {
		<Button w='160px' fs='s' bgColor='white' color='primary' hoverProps={{highlight: 0.02}} borderColor='#CCC' focusProps={{highlight: .04}}>
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
    case 'debug':
      return base + 'debugImage.png'
    default:
      return base + 'teacherBot.png'
  }
}

const DropdownButton = component({
	render ({props}, children) {
		const {text} = props
		return (
	    <Button w='150px' fs='xs' bgColor='white' color='primary' hoverProps={{highlight: 0.02}} borderColor='#CCC' focusProps={{highlight: 0.04}}>
	      <Block wide align='space-between center'>
        	<Text textAlign='left' flex textTransform='capitalize'>{text}</Text>
	        <Icon relative right='0' mt='3px' fs='s' name='keyboard_arrow_down' />
	      </Block>
	    </Button>
		)
	}
})
