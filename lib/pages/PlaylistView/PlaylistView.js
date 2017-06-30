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
  playlist: `/playlists/${props.playlistRef}`,
  myProgress: {
    ref: `/playlistsByUser/${props.uid}/byPlaylistRef/${props.playlistRef}`,
    join: {
      ref: `/playlistInstances`,
      child: `progressValue`,
      childRef: (val, ref) => {
        return ref.child(val.instanceRef)
      }
    }
  }
}))(component({
	initialState: {
		target: null,
		dragTarget: null
	},
  render ({props, context, actions, state}) {
	  const {playlist, playlistRef, userProfile, myProgress, ...restProps} = props
    const {value: myProgressValue, loading: myProgressLoading} = myProgress
	  const {target, dragTarget} = state
	  const {uid, username} = context
	  const editable = props.editable === 'edit'

	  if (playlist.loading || myProgressLoading) {
	    return <IndeterminateProgress />
	  }

    const {progressValue = [{current: 0}]} = (myProgressValue || {})
    const {current, completedChallenges} = progressValue[0]

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
	      mine={mine && editable}
	      creatorID={creatorID}
	      creatorUsername={creatorUsername}
	      followed={followed}
	      myLists={userProfile && userProfile.lists}
	      play={actions.play(current)}
	      name={name}
	      playable={sequence && sequence.length > 0}
	      shortLink={shortLink}
	      description={description}
	      activeKey={playlistRef}
	      setModal={context.openModal(() => <LinkModal
	        header='Share Code'
	        code={shortLink}
	        footer={modalFooter} />)}/>
	  )

	  return (
	    <Layout
	      navigation={[{category: 'playlist', title: name}]}
	      titleImg={imageUrl}
	      titleActions={titleActions}
	      bodyProps={{maxWidth: 980, mx: 'auto', mb: 'l'}}>
	      <Block mx='20px'>
	        <Block wide hide={!description}>
	          <Description wide my content={description} />
	        </Block>
	      </Block>
	      <Menu mx='20px' column>
	        <Block
	          mt='1em'
	          fontWeight='800'
	          align='start center'
	          bgColor='white'
	          border='1px solid divider'
	          borderBottomWidth='0'
	          p='12px 14px 12px 0'>
	          <Text w='40%' pl={40} minWidth={300}>TITLE</Text>
	          <Text flex>MODE</Text>
	          <Text flex>CODE TYPE</Text>
	          <Block w={40} />
	        </Block>
	        <PlaylistGameLoader
	        	completed={completedChallenges}
				    myLists={userProfile && userProfile.lists}
				    dragTarget={dragTarget}
				    dropTarget={target}
            instanceRef={props.instanceRef}
				    listActions={actions}
				    activeKey={playlistRef}
				    mine={mine && editable}
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
  		const {playlistRef} = props
  		const removeIdx = findIndex(sequence, (val) => val === dragTarget)

  		if(sequence.length === 1) {
  			yield actions.handleDrop()
  		} else {
	  		yield context.firebaseTransaction(`/playlists/${playlistRef}/sequence`, (seq) => {
				 	return seq
	          ? splice(splice(seq, removeIdx, 1), removeIdx > idx ? idx : idx - 1, 0, dragTarget)
	          : 0
	  		})
	  		yield actions.handleDrop()
  		}

  	},
    * copyChallenge ({props, context, actions}, ref) {
      const {playlistRef, playlist = {}} = props
      const {sequence = []} = playlist.value || {}
      const insertIdx = sequence.indexOf(ref) + 1
      const snap = yield context.firebaseOnce(`/games/${ref}`)
      const {key} = yield context.firebasePush('/games', snap.val())
      yield context.firebaseSet(`/playlists/${playlistRef}/sequence`, splice(sequence, insertIdx, 0, key))
    },
	  * play ({props, context}, current = 0) {
			const {userProfile, playlistRef, myProgress} = props
			const {uid} = context
      var instanceRef = (myProgress.value || {}).instanceRef
      if (!myProgress.value) {
        const res = yield context.firebasePush(
          `/playlistInstances`,
          initPlaylist(playlistRef, context.uid)
        )
        instanceRef = res.key
      }
	    yield context.setUrl(`/playlist/${playlistRef}/play/${instanceRef}/${current}`)
	  },
	  * removeChallenge ({props, context}, gameRef) {
	  	yield context.firebaseTransaction(
	  		`/playlists/${props.playlistRef}`,
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

const initPlaylist = (ref, uid) => ({
	completedChallenges: [],
	lastEdited: Date.now(),
	savedChallenges: {},
	playlist: ref,
	current: 0,
	uid
})
