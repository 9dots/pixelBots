/**
 * Imports
 */

import Description from 'components/Description'
import {Block, Flex, Icon, Text} from 'vdux-ui'
import LinkModal from 'components/LinkModal'
import Solutions from 'components/Solutions'
import Loading from 'components/Loading'
import Layout from 'layouts/MainLayout'
import {component, element} from 'vdux'
import Button from 'components/Button'
import fire from 'vdux-fire'

/**
 * <Project Page/>
 */

export default fire((props) => ({
  project: `/games/${props.gameRef}`
}))(component({
  render ({props, context, actions}) {
	  const {project} = props
	  if (project.loading) return <Loading />
	  const game = project.value
	  const navigation = [
			{title: game.title, category: 'challenge'}
	  ]
	  const modalFooter = (
		  <Block>
		    <Button ml='m' onClick={context.closeModal()}>Done</Button>
		  </Block>
		)
	  const titleActions = (
	    <Flex w='220px' align='space-between center'>
	      <Button onClick={actions.play()} align='space-between' bgColor='blue'>
	        <Icon ml='-6px' mr='8px' name='play_arrow' />
	        <Text>PLAY</Text>
	      </Button>
	      <Button
	        onClick={context.openModal(
	        	() => <LinkModal code={game.shortLink} footer={modalFooter} />
	        )}
	        align='space-between'
	        bgColor='green'>
	        <Icon ml='-6px' mr='8px' name='link' />
	        <Text>LINK</Text>
	      </Button>
	    </Flex>
		)
	  return (
	    <Layout
	      title={game.title}
	      titleImg={game.imageUrl}
	      navigation={navigation}
	      titleActions={titleActions}>
	      <Block m='20px'>
	        <Block p='15px' wide bgColor='white' border='1px solid #e0e0e0'>
	          <Text color='#666' display='block' fs='m'>Description:</Text>
	          {
							game.description
								? <Description wide mt='10px' content={game.description} />
								: <Text display='block' myt='15px'>This game does not have a description yet.</Text>
						}
	        </Block>
	        <Block my='1em' p='15px' wide bgColor='white' border='1px solid #e0e0e0'>
	          <Text color='#666' display='block' fs='m'>Solutions:</Text>
	          <Solutions gameRef={props.gameRef} />
	        </Block>
	      </Block>
	    </Layout>
	  )
  },
  controller: {
  	* play ({props, context}, current = 0) {
  		if (!props.playlistRef) {
  			return yield context.setUrl(`/play/${props.gameRef}`)
  		}
			const {userProfile, playlistRef} = props
			const {uid} = context
    	yield context.firebaseUpdate(`/users/${uid}/lists/${playlistRef}`, {
    		playlistKey: playlistRef,
    		lastEdited: Date.now(),
    		current: Number(props.current)
    	})
    	yield context.firebaseTransaction(
    		`/playlists/${playlistRef}/plays`,
    		(plays) => plays + 1
    	)
	    yield context.setUrl(`/playlist/${playlistRef}/${current}`)
	  },
  }
}))
