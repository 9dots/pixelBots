/**
 * Imports
 */

import { component, element } from 'vdux'
import Badge from 'components/Badge'
import { Block } from 'vdux-ui'
import fire from 'vdux-fire'
import getProp from '@f/get-prop'

/**
 * <Playlist Badges/>
 */

export default fire(({ uid, playlist }) => ({
  myProgress: {
    ref: `/playlistsByUser/${uid}/byPlaylistRef/${playlist.ref}`,
    join: {
      ref: `/playlistInstances`,
      child: 'progressValue',
      childRef: 'instanceRef'
    }
  }
}))(
  component({
    render ({ props }) {
      const { myProgress, sequence } = props
      if (myProgress.loading) return <span />

      const value = myProgress.value.progressValue || {}
      const saved = value.savedChallenges || {}
      const completed = value.completedChallenges || []

      return (
        <Block align='start center' flexWrap='wrap'>
          {sequence.map((ref, i) => (
            <GameBadges
              idx={i}
              ref={ref}
              isComplete={completed.indexOf(ref.gameRef) !== -1}
              saveRef={saved[ref.key]} />
          ))}
        </Block>
      )
    }
  })
)

const GameBadges = fire(({ ref, saveRef }) => ({
  game: `/games/${ref}/meta`,
  savedGame: saveRef && `/saved/${saveRef}/meta`
}))(
  component({
    render ({ props }) {
      const size = 48
      const { savedGame, game, isComplete } = props

      if (savedGame.loading || game.loading) return <span />

      const stretchType = getProp('value.stretch.type', game)
      const completeType = 'completed'
      const count = getProp(`value.badges.${stretchType}`, savedGame) || 0

      return (
        <Block align='center center' my>
          <Badge
            type={completeType}
            size={size}
            hideTitle
            effects={false}
            count={isComplete}
            description={false}
            mx='s' />
          <Badge
            type={stretchType}
            size={size}
            hideTitle
            effects={false}
            count={count}
            description={false}
            mx='s' />
        </Block>
      )
    }
  })
)
