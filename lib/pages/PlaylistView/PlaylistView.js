/**
 * Imports
 */

import IndeterminateProgress from 'components/IndeterminateProgress'
import PlaylistGameLoader from 'components/PlaylistGameLoader'
import PlaylistOptions from 'components/PlaylistOptions'
import Description from 'components/Description'
import EmptyState from 'components/EmptyState'
import LinkModal from 'components/LinkModal'
import { Block, Menu, Image } from 'vdux-ui'
import { component, element } from 'vdux'
import Layout from 'layouts/MainLayout'
import Button from 'components/Button'
import objEqual from '@f/equal-obj'
import filter from '@f/filter'
import fire from 'vdux-fire'
import map from '@f/map'

/**
 * <Playlist View/>
 */

export default fire(props => ({
  playlist: `/playlists/${props.playlistRef}`,
  myProgress: {
    ref: `/playlistsByUser/${props.uid}/byPlaylistRef/${props.playlistRef}`,
    join: {
      ref: `/playlistInstances`,
      child: 'progressValue',
      childRef: 'instanceRef'
    }
  }
}))(
  component({
    initialState: {
      target: null,
      dragTarget: undefined
    },

    render ({ props, context, actions, state }) {
      const { playlist, playlistRef, userProfile, myProgress } = props
      const { value: myProgressValue, loading: myProgressLoading } = myProgress
      const { target, dragTarget } = state
      const { uid } = context
      const editable = props.editable === 'edit'

      if (playlist.loading || myProgressLoading) {
        return <IndeterminateProgress />
      }

      const { progressValue = { current: 0 } } = myProgressValue || {}
      const { current, completedChallenges = [] } = progressValue

      const {
        sequence = {},
        name,
        followedBy = [],
        creatorID,
        imageUrl,
        creatorUsername,
        shortLink,
        description
      } = playlist.value

      const sequenceLength = Object.keys(sequence).length

      const percent = completedChallenges.length / sequenceLength * 100 + '%'
      const mine = uid === creatorID
      const followed = followedBy[props.username]
      const modalFooter = (
        <Block>
          <Button ml='m' onClick={context.closeModal}>
            Done
          </Button>
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
          playable={sequenceLength > 0}
          shortLink={shortLink}
          description={description}
          activeKey={playlistRef}
          setModal={context.openModal(() => (
            <LinkModal
              header='Share Code'
              code={shortLink}
              footer={modalFooter} />
          ))} />
      )

      return (
        <Layout bodyProps={{ maxWidth: 980, mx: 'auto', mb: 'l' }}>
          <Block mx='20px'>
            <Block align='start' mb='l'>
              <Image
                src={imageUrl || '/animalImages/teacherBot.png'}
                border='1px solid divider'
                sq={150}
                mr='l' />
              <Block
                column
                align='space-around'
                h={150}
                overflowY='auto'
                flex
                mr='l'>
                <Block fs='l'>{name}</Block>
                <Description wide content={description} />
                <Block
                  pill
                  bgColor='#DADADA'
                  relative
                  h={23}
                  overflow='hidden'
                  w='66%'
                  align='center center'>
                  <Block absolute tall left bgColor='blue' w={percent} />
                  <Block relative bold color='white'>
                    {completedChallenges.length} / {sequenceLength}
                  </Block>
                </Block>
              </Block>
              <Block column align='start end'>
                {titleActions}
              </Block>
            </Block>
          </Block>
          {sequenceLength ? (
            <Menu mx='20px' column>
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
                savedRefs={progressValue.savedChallenges}
                creatorID={creatorID}
                sequence={sequence} />
            </Menu>
          ) : (
            <EmptyState
              title='Empty Playlist'
              description={
                "This playlist doesn't have any challenges in it yet."
              } />
          )}
        </Layout>
      )
    },

    * onUpdate (prev, { actions, props }) {
      if (props.update) {
        const { myProgress } = props
        if (prev.props.myProgress.loading && !myProgress.loading) {
          const { value = [] } = myProgress
          const current = value.length ? value[0].current : 0

          yield actions.play(current)
        }
      }
    },

    controller: {
      * drop ({ props, context, state, actions }, idx) {
        const { sequence } = props.playlist.value
        const { dragTarget } = state
        const { playlistRef } = props

        const newSequence = map(
          game => ({
            ...game,
            order: getNewOrder(game.order, idx, dragTarget.order)
          }),
          sequence
        )

        console.log(newSequence)

        yield actions.handleDrop()
        yield context.firebaseUpdate(
          `/playlists/${playlistRef}/sequence`,
          newSequence
        )
      },

      * copyChallenge ({ props, context, actions }, { gameRef, order }) {
        const { playlistRef, playlist = {} } = props
        const { sequence = [] } = playlist.value || {}
        const snap = yield context.firebaseOnce(`/games/${gameRef}`)
        const { key } = yield context.firebasePush('/games', snap.val())
        yield context.firebaseSet(
          `/playlists/${playlistRef}/sequence`,
          map(
            game => ({
              ...game,
              order: game.order > order ? game.order + 1 : game.order
            }),
            sequence
          )
        )
        yield context.firebasePush(`/playlists/${playlistRef}/sequence`, {
          gameRef: key,
          order: order + 1
        })
      },

      * play ({ props, context }, current = 0) {
        const { playlistRef } = props

        yield context.setUrl(`/activity/${playlistRef}/${current}`)
      },

      * removeChallenge ({ props, context }, deleteRef) {
        const { sequence } = props.playlist.value
        const removeIdx = deleteRef.order
        const removed = filter(game => !objEqual(game, deleteRef), sequence)
        const newSequence = map(
          val => ({
            ...val,
            order: val.order > removeIdx ? val.order - 1 : val.order
          }),
          removed
        )
        yield context.firebaseSet(
          `/playlists/${props.playlistRef}/sequence`,
          newSequence
        )
      }
    },
    reducer: {
      handleDragEnd: state => ({ target: undefined, dragTarget: undefined }),
      handleDrop: state => ({ target: undefined, dragTarget: undefined }),
      handleDragStart: (state, dragTarget) => ({ dragTarget }),
      handleDragEnter: (state, target) => ({ target })
    }
  })
)

function getNewOrder (pos, changeIdx, oldIdx) {
  if (oldIdx > changeIdx) return movedDownOrder()
  return movedUpOrder()

  function movedDownOrder () {
    if (pos === oldIdx) return changeIdx
    return pos >= changeIdx && pos <= oldIdx ? pos + 1 : pos
  }

  function movedUpOrder () {
    if (pos === oldIdx) return changeIdx - 1
    return pos >= oldIdx && pos < changeIdx ? pos - 1 : pos
  }
}

const initPlaylist = (ref, uid, update = null) => ({
  completedChallenges: [],
  lastEdited: Date.now(),
  savedChallenges: {},
  assigned: false,
  playlist: ref,
  current: 0,
  update,
  uid
})
