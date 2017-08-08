/**
 * Imports
 */

import AdvancedResults from 'components/AdvancedResults'
import PrintContainer from 'components/PrintContainer'
import GameOutput from 'components/GameOutput'
import GameEditor from 'components/GameEditor'
import {component, element} from 'vdux'
import Layout from 'layouts/MainLayout'
import {Block} from 'vdux-ui'
import omit from '@f/omit'

/**
 * <WritingChallenge/>
 */

export default component({
  initialState: {
    checking: false
  },
  render ({props, actions, children, context}) {
    const {playlist, animals, active, initialData, isDraft, type, savedGame, stretch = {}, running} = props
    const img = type === 'project' ? 'projectImage.png' : 'teacherBot.png'

    const badges = [
      {
        type: 'completed',
        limit: 1,
        earned: savedGame.completed
      },
      {
        type: stretch.type,
        limit: stretch.value,
        earned: savedGame.badges && savedGame.badges[stretch.type]
      }
    ]

    const gameDisplay = (
      <Block tall wide minHeight={600}>
        <Block display='flex' tall wide>
          <Block display='flex' tall>
            <GameOutput
              {...initialData}
              {...omit(['runners', 'activeLine'], props)}
              onComplete={actions.onComplete}
              savedGame={savedGame}
              size='350px' />
          </Block>
          <Block flex tall>
            <GameEditor
              {...initialData}
              {...omit(['steps', 'animals', 'painted', 'targetPainted'], props)}
              sequence={animals[active].sequence}
              initialData={initialData}
              canCode
              onChange={props.setSequence}
              resetGame={actions.resetGame} />
          </Block>
        </Block>
        {children}
      </Block>
  )

    if (isDraft) return gameDisplay

    const onComplete = (animals[active].sequence || []).length > 0 && actions.onComplete

    return (
      <Block tall>
        <PrintContainer code={animals[active].sequence} />
        <Layout
          badges={badges}
          bodyProps={{display: 'flex', px: '10px'}}
          navigation={[{
            category: playlist.title,
            title: props.title,
            onClick: context.setUrl(`/playlist/${playlist.ref}`)
          }]}
          titleImg={`/animalImages/${img}`}
          titleActions={playlist && playlist.actions(onComplete)}>
          {gameDisplay}
        </Layout>
      </Block>
    )
  },

  controller: {
    * onComplete ({props, context}) {
      const {type, stretch} = props
      const {indicator, value, label} = stretch || {}
      if (type === 'project') {
        return yield props.onComplete()
      }
      if (stretch && (stretch.hard && props[indicator] > value)) {
        yield context.openModal({header: 'Whoops!', body: <Block textAlign='center'>Your solution has too many {label.toLowerCase()}. Try again.</Block>})
      } else {
        yield context.openModal(() => <AdvancedResults {...props}/>)
      }
    }
  },
  reducer: {
    setChecksRes: (state, checksRes) => ({checksRes})
  }
})
