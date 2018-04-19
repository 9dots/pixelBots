/**
 * Imports
 */

import LineCounts from 'components/LineCounts'
import { component, element } from 'vdux'
import { Block } from 'vdux-containers'
import BarButtons from './BarButtons'
import BarButton from './BarButton'

/**
 * Constants
 */

const btnProps = { bgColor: 'white', color: '#666' }

/**
 * <EditorBar/>
 */

export default component({
  render ({ props, context }) {
    const {
      modifications = 0,
      invertSelection,
      removeSelected,
      changeRestriction,
      copySelection,
      cutSelection,
      inputType,
      clipboard,
      selected = [],
      sequence = [],
      stretch = {},
      canUndo,
      saved,
      paste,
      undo,
      lloc,
      startCode,
      ...restProps
    } = props

    const isSelected = selected.length > 0
    const allLocked = selected.reduce((acc, block) => acc && block.restriction === 'locked', true)
    const allHidden = selected.reduce((acc, block) => acc && block.restriction === 'hidden', true)
    const selectable =
      inputType === 'icons' && sequence.filter(b => b.type !== 'block_end')
    const restrictionButtons = [
      <BarButton
        disabled={!isSelected}
        key={'lock'}
        icon={allLocked ? 'lock_open' : 'lock'}
        text={allLocked ? 'Unlock' : 'Lock'}
        {...btnProps}
        onClick={allLocked ? changeRestriction('none') : changeRestriction('locked')} />,
      <BarButton
        key={'hide'}
        disabled={!isSelected}
        icon={allHidden ? 'visibility' : 'visibility_off'}
        text={allHidden ? 'Unhide' : 'Hide'}
        {...btnProps}
        onClick={allHidden ? changeRestriction('none') : changeRestriction('hidden')} /> ]
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
        bgColor={isSelected ? '#666' : props.bgColor}>
        <Block flex pl='s'>
          <Block align='start center' hide={inputType !== 'icons'}>
            {isSelected ? (
              <BarButton
                color='white'
                text='Clear Selection'
                mr={4}
                ml={2}
                onClick={invertSelection}
                icon='clear' />
            ) : (
              <BarButton
                color='white'
                text='Select All'
                mr={4}
                ml={2}
                onClick={invertSelection}
                disabled={!selectable.length}
                icon='done_all' />
            )}
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
              {startCode && restrictionButtons}
            </Block>
          </Block>
        </Block>
        <Block fs='s' fontWeight='800' flex textAlign='center'>
          {isSelected && selected.length + ' selected'}
          {!isSelected &&
            (stretch.type === 'lineLimit' || stretch.type === 'modLimit') && (
              <LineCounts
                hard={stretch.hard}
                limit={stretch.value}
                name={stretch.type === 'lineLimit' ? 'line' : 'change'}
                value={stretch.type === 'lineLimit' ? lloc : modifications} />
            )}
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
