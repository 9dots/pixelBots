/**
 * Imports
 */

import checkCorrect from 'pages/Game/utils/checkCorrect'
import AdvancedResults from 'components/AdvancedResults'
import PrintContainer from 'components/PrintContainer'
import {createFrames} from 'utils/frameReducer'
import GameOutput from 'components/GameOutput'
import GameEditor from 'components/GameEditor'
import linesOfCode from 'utils/linesOfCode'
import {component, element} from 'vdux'
import Layout from 'layouts/MainLayout'
import {teacherBot} from 'animalApis'
import {Text, Block} from 'vdux-ui'
import omit from '@f/omit'

/**
 * <WritingChallenge/>
 */

export default component({
  initialState: {
    checking: false
  },
  * onUpdate (prev, next) { 
    if(prev.props.speed > next.props.speed)
      yield next.props.incrementSlowdowns()
  },
  render ({props, actions, children}) {
    const {advanced, onComplete, playlist, animals, active, initialData, isDraft} = props

    const gameDisplay = (
      <Block tall wide minHeight={600}>
        <Block display='flex' tall wide>
          <Block display='flex' tall>
            <GameOutput
              {...initialData}
              {...omit('runners', props)}
              onComplete={actions.onComplete}
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
          bodyProps={{display: 'flex', px: '10px'}}
          navigation={[
            playlist && {category: 'playlist', title: playlist.title},
            {category: 'challenge', title: props.title}
          ]}
          titleActions={playlist && playlist.actions}
          titleImg={playlist ? playlist.img : props.imageUrl}>
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
      yield props.incrementAttempts()
      yield context.openModal(() => <AdvancedResults {...props}/>)
    }
  },
  reducer: {
    setChecksRes: (state, checksRes) => ({checksRes})
  }
})
