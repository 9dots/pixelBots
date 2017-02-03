import IndeterminateProgress from './IndeterminateProgress'
import PlaylistItem from './PlaylistItem'
import element from 'vdux/element'
import reduce from '@f/reduce'
import {Block} from 'vdux-ui'
import fire from 'vdux-fire'
import filter from '@f/filter'
import omit from '@f/omit'
import Window from 'vdux/window'

function render ({props}) {
  const {
    sequence,
    currentUser,
    creatorID,
    activeKey,
    mine,
    listActions,
    dropTarget,
    dragTarget,
    ...challenges
  } = props

  if (Object.keys(challenges).length === 0 || !sequence || sequence.length === 0) {
    return <div />
  }

  for (let c in challenges) {
    if (challenges[c] && challenges[c].loading) {
      return <IndeterminateProgress />
    }
  }

  const items = sequence.map((key) => challenges[key]).filter((challenge, i) => challenge && challenge.name !== dragTarget)

  return (
    <Window onDrop={[(e) => e.stopPropagation(), (e) => listActions.drop(sequence.indexOf(dropTarget))]} onDragOver={(e) => e.preventDefault()}>
      <Block key={activeKey}>
        {
					items.map((challenge, i) => (
							challenge && <Block>
              {challenge.name === dropTarget && getPlaceHolder(challenge.name, i)}
                <PlaylistItem
                  idx={i}
                  listActions={listActions}
                  playlistKey={activeKey}
                  key={challenge.name}
                  game={challenge.value}
                  mine={mine && currentUser.uid === creatorID}
                  ref={challenge.name} />
            	</Block>
						)
					)
				}
      </Block>
    </Window>
  )

  function getPlaceHolder (key, idx) {
    return (
      <Block
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => listActions.drop(idx)}
        onDragEnter={(e) => listActions.dragEnter(key)}
        wide
        bgColor='lightblue'
        h='67px' />
    )
  }
}

function getProps (props, context) {
  return {
    ...props,
    currentUser: context.currentUser,
    username: context.username
  }
}

export default fire(({sequence}) =>
	sequence && sequence.length > 0
		? sequence.reduce((cur, challenge) => ({
        ...cur,
        [challenge]: `/games/${challenge}`
      }), {})
		: {}
)({
  getProps,
  render
})
