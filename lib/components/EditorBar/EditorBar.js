/**
 * Imports
 */

import {Block, Icon, Button, Tooltip} from 'vdux-containers'
import {component, element} from 'vdux'
import BarButtons from './BarButtons'
import BarButton from './BarButton'
import {Checkbox} from 'vdux-ui'

/**
 * Constants
 */

const btnProps = {bgColor: 'white', color: '#666'}

/**
 * <EditorBar/>
 */

export default component({
  render ({props, context}) {
    const {
      invertSelection,
      removeSelected,
      copySelection,
      cutSelection,
      saveRef = '',
      inputType,
      clipboard,
      selected = [],
      sequence = [],
      canUndo,
      saved,
      paste,
      undo,
      loc,
      ...restProps
    } = props

    const isSelected = selected.length > 0
    const selectable = inputType === 'icons' && sequence.filter(b => b.type !== 'block_end')

    return (
      <Block
        border='1px solid rgba(white, .2)'
        borderColor={isSelected ? 'rgba(black, .1)' : 'rgba(white, .2)'}
        boxShadow={isSelected ? '0 6px 8px -3px rgba(0,0,0,.28)' : '0 0'}
        align='end center'
        zIndex='999'
        bottom='0'
        py='5px'
        wide
        {...restProps}
        bgColor={isSelected ? '#666' : props.bgColor}
        >
        <Block flex  pl='s'>
          <Block align='start center' hide={inputType !== 'icons'} >
            {
              isSelected
                ? <BarButton color='white' text='Clear Selection' mr={4} ml={2} onClick={invertSelection} icon='clear' />
                : <BarButton color='white' text='Select All' mr={4} ml={2} onClick={invertSelection} disabled={!selectable.length} icon='done_all' />
            }
            <Block align='start stretch'>
              <BarButton
                icon='content_copy'
                text='Copy'
                disabled={!isSelected}
                {...btnProps}
                onClick={copySelection} />
              <BarButton
                disabled={!isSelected}
                icon='content_cut'
                text='Cut'
                {...btnProps}
                onClick={cutSelection} />
              <BarButton
                disabled={!clipboard || !clipboard.length}
                icon='content_paste'
                text='Paste'
                {...btnProps}
                onClick={paste} />
              <BarButton
                icon='undo'
                text='Undo'
                disabled={!canUndo}
                {...btnProps}
                onClick={undo} />
              <BarButton
                disabled={!isSelected}
                icon='delete'
                text='Delete'
                {...btnProps}
                onClick={removeSelected} />
            </Block>
          </Block>
        </Block>
        <Block fs='s' fontWeight='800' flex textAlign='center'>
          {
            isSelected
              ? selected.length + ' selected'
              : loc + pluralize(' line', loc)
          }
        </Block>
        <Block flex align='end center'>
          <Block pl='1em' fs='s' mr fontWeight='800'>
            {saved ? 'saved' : ''}
          </Block>
          <BarButtons {...props} hide={isSelected} />
        </Block>
      </Block>
    )
  }
})

/**
 * Helpers
 */

const pluralize = (noun, num) => num === 0 || num > 1 ? `${noun}s` : noun
