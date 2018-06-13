/**
 * Imports
 */

import EditorBar, { BarButton } from 'components/EditorBar'
import { Block, Dropdown, DropdownMenu } from 'vdux-ui'

/**
 * <BlockEditorBar/>
 */

export default component({
  render ({ props }) {
    const { sequence } = props
    const selectable = sequence.filter(b => b.type !== 'block_end')

    return (
      <EditorBar
        {...actions}
        bgColor='#A7B4CB'
        canAutoComplete={canAutoComplete}
        sequence={sequence}
        selected={selected}
        canUndo={editorState.length > 0}
        clipboard={clipboard}
        initialData={initialData}
        saveRef={saveRef}
        saved={saved}
        loc={sequence.length}>
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
          </Block>
        </Block>
      </EditorBar>
    )
  }
})
