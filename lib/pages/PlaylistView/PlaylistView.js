/**
 * Imports
 */

import IndeterminateProgress from 'components/IndeterminateProgress'
import PlaylistGameLoader from 'components/PlaylistGameLoader'
import PlaylistOptions from 'components/PlaylistOptions'
import {Box, Block, Flex, Menu, Text} from 'vdux-ui'
import Description from 'components/Description'
import LinkModal from 'components/LinkModal'
import {component, element} from 'vdux'
import Layout from 'layouts/MainLayout'
import Button from 'components/Button'
import findIndex from '@f/find-index'
import splice from '@f/splice'
import fire from 'vdux-fire'

/**
 * <Playlist View/>
 */

export default fire((props) => ({
  playlist: `/playlists/${props.activeKey}`
}))(component({
	initialState: {
		target: null,
		dragTarget: null
	},
  render ({props, context, actions, state}) {
	  const {playlist, activeKey, userProfile, ...restProps} = props
	  const {target, dragTarget} = state
	  const {uid, username} = context

	  if (playlist.loading) {
	    return <IndeterminateProgress />
	  }

	  const {
	    sequence,
	    name,
	    followedBy = [],
	    creatorID,
	    imageUrl,
	    creatorUsername,
	    shortLink,
	    description
	  } = playlist.value

	  const mine = uid === creatorID
	  const followed = followedBy[props.username]
	  const modalFooter = (
	    <Block>
	      <Button ml='m' onClick={context.closeModal()}>Done</Button>
	    </Block>
	  )

	  const titleActions = (
	    <PlaylistOptions
	      mine={mine}
	      creatorID={creatorID}
	      creatorUsername={creatorUsername}
	      followed={followed}
	      myLists={userProfile.lists}
	      play={actions.play}
	      name={name}
	      shortLink={shortLink}
	      description={description}
	      activeKey={activeKey}
	      setModal={context.openModal(() => <LinkModal
	        header='Share Code'
	        code={shortLink}
	        footer={modalFooter} />)}/>
	  )
	  return (
	    <Layout
	      navigation={[{category: 'playlist', title: name}]}
	      titleImg={imageUrl}
	      titleActions={titleActions}>
	      <Block mx='20px'>
	        <Block p='15px' wide bgColor='white' border='1px solid #e0e0e0'>
	          <Text color='#666' display='block' fs='m'>Description:</Text>
	          {
	            description
	              ? <Description wide mt='10px' content={description} />
	              : <Text display='block' mt='15px'>This playlist does not have a description yet.</Text>
	          }
	        </Block>
	      </Block>
	      <Menu mx='20px' column>
	        <Block
	          color='#999'
	          mt='1em'
	          fontWeight='800'
	          align='start center'
	          bgColor='transparent'
	          p='8px 14px 8px 65px'
	          mb='4px'>
	          <Text flex minWidth='200px'>CHALLENGE NAME</Text>
	          <Text minWidth='180px' w='180px'>ANIMAL</Text>
	          <Text minWidth='180px' w='180px'>CODE TYPE</Text>
	          <Block minWidth='180px' w='180px' />
	        </Block>
	        <PlaylistGameLoader
				    myLists={userProfile.lists}
				    dragTarget={dragTarget}
				    dropTarget={target}
				    listActions={actions}
				    activeKey={activeKey}
				    mine={mine}
				    uid={uid}
				    creatorID={creatorID}
				    sequence={sequence} />
	      </Menu>
	    </Layout>
	  )
  },
  controller: {
  	* drop ({props, context, state, actions}, idx) {
  		const {sequence} = props.playlist.value
  		const {dragTarget} = state
  		const {activeKey} = props
  		const removeIdx = findIndex(sequence, (val) => val === dragTarget)
  		yield context.firebaseTransaction(`/playlists/${activeKey}/sequence`, (seq) => {
			 	return seq
          ? splice(splice(seq, removeIdx, 1), removeIdx > idx ? idx : idx - 1, 0, dragTarget)
          : 0
  		})
  		yield actions.handleDrop()
  	},
	  * play ({props, context}, current = 0) {
			const {userProfile, activeKey} = props
	    if (!userProfile.lists || !userProfile.lists[activeKey]) {
	      const {key} = yield context.firebaseTask('create_playlist_instance', {
	        playlistKey: activeKey,
	        current,
	        uid
	      })
	      yield context.firebaseOnce(`/queue/tasks/${key}`, 'child_remove')
	    }
	    yield setUrl(`/playSequence/${activeKey}`)
	  },
	  * removeChallenge ({props, context}, gameRef) {
	  	yield context.firebaseTransaction(
	  		`/playlists/${props.activeKey}`,
	  		(val) => ({...val, sequence: val.sequence.filter((ref) => ref !== gameRef)})
	  	)
	  }
	},
  reducer: {
	  handleDragEnd: (state) => ({target: null, dragTarget: null}),
	  handleDrop: (state) => ({target: null, dragTarget: null}),
	  handleDragStart: (state, dragTarget) => ({dragTarget}),
	  handleDragEnter: (state, target) => ({target})
  }
}))
