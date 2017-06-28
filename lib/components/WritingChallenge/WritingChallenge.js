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
  render ({props, actions, children}) {
    const {playlist, animals, active, initialData, isDraft, type, savedGame, stretch = {}} = props
    const img = type === 'project' ? 'projectImage.png' : 'teacherBot.png'

    const gameDisplay = (
      <Block tall wide minHeight={600}>
        <Block display='flex' tall wide>
          <Block display='flex' tall>
            <GameOutput
              {...initialData}
              {...omit('runners', props)}
              onComplete={actions.onComplete}
              savedGame={savedGame}
              size='350px' />
          </Block>
          <Block flex tall>
            <GameEditor
              {...initialData}
              {...props}
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

    return (
      <Block tall>
        <PrintContainer code={animals[active].sequence} />
        <Layout
          badges={{completed: 1, [stretch.type]: stretch.value}}
          bodyProps={{display: 'flex', px: '10px'}}
          navigation={[{category: playlist.title, title: props.title}]}
          titleImg={`/animalImages/${img}`}
          titleActions={playlist && playlist.actions}>
          {gameDisplay}
        </Layout>
      </Block>
    )
  },

  controller: {
    * onComplete ({props, context}) {
      if (props.type === 'project') {
        return yield props.onComplete()
      }

      yield context.openModal(() => <AdvancedResults {...props}/>)
    }
  },
  reducer: {
    setChecksRes: (state, checksRes) => ({checksRes})
  }
})
