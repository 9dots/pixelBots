/**
 * Imports
 */

import checkCorrect from 'pages/Game/utils/checkCorrect'
import PrintContainer from 'components/PrintContainer'
import GameOutput from 'components/GameOutput'
import GameEditor from 'components/GameEditor'
import linesOfCode from 'utils/linesOfCode'
import {component, element} from 'vdux'
import Layout from 'layouts/MainLayout'
import mapValues from '@f/map-values'
import deepEqual from '@f/deep-equal'
import {Text, Block} from 'vdux-ui'
import omit from '@f/omit'

/**
 * <WritingChallenge/>
 */

export default component({
  render ({props, actions, children}) {
  	const {playlist, animals, active, initialData, isDraft} = props

  	const gameDisplay = (
  		<Block tall wide minHeight={600}>
	  		<Block display='flex' tall wide>
		  		<Block display='flex' tall>
		    		<GameOutput
		    			{...initialData}
		    			{...omit('runners', props)}
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
	    	<PrintContainer code={animals[active].sequence}/>
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

  * onUpdate (prev, {props, actions}) {
    const {painted, hasRun, targetPainted} = props

    if (hasRun && prev.props.painted !== painted && checkCorrect(painted, targetPainted)) {
      yield actions.onComplete()
    }
  },

  controller: {
  	* onComplete ({props, context}) {
  		const {levelSize, frames, animals} = props
      const loc = linesOfCode(animals[0].sequence)
      yield context.openModal(winMessage(`You wrote ${loc} lines of code to draw this picture!`))

  		if (!props.draft) {
  			yield props.onComplete()
  		}
  	}
  }
})

/**
 * Helpers
 */

function winMessage (msg) {
  const body = <Block>
    <Text>{msg}</Text>
  </Block>

  return {
    header: 'Congratulations',
    type: 'win',
    body
  }
}
