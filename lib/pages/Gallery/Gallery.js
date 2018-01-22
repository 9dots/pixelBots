/**
 * Imports
 */

import { initialSandboxState } from 'utils/initialGameState'
import { component, element, stopPropagation } from 'vdux'
import ConfirmDelete from 'components/ConfirmDelete'
import EmptyState from 'components/EmptyState'
import DetailInfo from 'components/DetailInfo'
import { CSSContainer, wrap, Tooltip } from 'vdux-containers'
import CardFeed from 'components/CardFeed'
import ListItem from 'components/ListItem'
import Button from 'components/Button'
import { Text, Block, Icon, Grid } from 'vdux-ui'
import mapValues from '@f/map-values'
import sortBy from 'lodash/orderBy'
import fire from 'vdux-fire'
import moment from 'moment'

/**
 * <SandboxItem/>
 */

const SandboxItem = wrap(CSSContainer, {
  hoverProps: {
    hovering: true
  }
})(
  fire(props => ({
    sandbox: `/sandbox/${props.sandboxRef}`
  }))(
    component({
      initialState: {
        selected: []
      },
      render ({ props, context, actions, state }) {
        const { id, sandbox, sandboxRef, hovering } = props
        const { loading, value } = sandbox

        if (loading) return <span />
        if (!value) return <div />
        const { title, lastEdited, imageUrl } = value
        const width = document.getElementById(id)
          ? document.getElementById(id).offsetWidth
          : 0
        const numColumns = Math.floor(width / 200)
        const blockSize = width / numColumns - 16
        return (
          <Block
            m='8px'
            flex={`0 0 ${100 / numColumns}%`}
            maxWidth={blockSize}
            align='center center'>
            <Block
              display='flex'
              onClick={context.setUrl(`/sandbox/${sandboxRef}/view`)}
              sq={blockSize}
              backgroundSize='contain'
              backgroundRepeat='no-repeat'
              bgImg={imageUrl || '/animalImages/projectImage.png'}>
              <Block
                bgColor='#FFFFFFCC'
                flex
                display='flex'
                column
                opacity={hovering ? 1 : 0}
                pointer={hovering}
                transition='opacity .25s'>
                <Text
                  flex='2 1 auto'
                  fs='l'
                  p='s'
                  color='primary'
                  textAlign='center'
                  align='center center'>
                  {title}
                </Text>
                {props.mine && (
                  <Block flex='1 1 auto' align='center start'>
                    <Button
                      circle='40'
                      color='white'
                      bgColor='primary'
                      mx='m'
                      onClick={[
                        context.setUrl(`/sandbox/${sandboxRef}/edit`),
                        stopPropagation
                      ]}
                      hoverProps={{ opacity: 0.8 }}
                      focusProps={{ opacity: 0.8 }}>
                      <Icon name='edit' fs='m' />
                    </Button>
                    <Button
                      circle='40'
                      color='white'
                      bgColor='primary'
                      mx='m'
                      onClick={[
                        context.openModal(() => (
                          <ConfirmDelete
                            header={`Delete "${title}"?`}
                            message='delete this animation? All of your code will be deleted.'
                            dismiss={context.closeModal}
                            action={actions.removeSandbox} />
                        )),
                        stopPropagation
                      ]}
                      hoverProps={{ opacity: 0.8 }}
                      focusProps={{ opacity: 0.8 }}>
                      <Icon name='delete' fs='m' />
                    </Button>
                  </Block>
                )}
              </Block>
            </Block>
          </Block>
        )
      },

      controller: {
        * removeSandbox ({ props, context }) {
          yield context.firebaseSet(
            `/saved/${props.sandbox.value.saveRef}`,
            null
          )
          yield context.firebaseSet(`/sandbox/${props.sandboxRef}`, null)
          yield context.firebaseSet(
            `/users/${context.uid}/sandbox/${props.sandboxRef}`,
            null
          )
        }
      }
    })
  )
)

/**
 * <SandboxFeed />
 */

const SandboxFeed = component({
  render ({ props, actions }) {
    const { id, sandboxItems = {} } = props

    return (
      <Block id={id} display='flex' flexFlow='row wrap' wide>
        {sandboxItems &&
          sortBy(
            mapValues((time, key) => ({ time, key }), sandboxItems),
            'time',
            'desc'
          ).map(item => (
            <SandboxItem
              {...props}
              key={`sandbox-item-${item.key}`}
              sandboxRef={item.key} />
          ))}
      </Block>
    )
  }
})

/**
 * <Gallery/>
 */

export default component({
  initialState: {
    draftItems: {},
    publishedItems: {}
  },
  * onCreate ({ props, actions, state }) {
    const sandboxItems = props.profile.sandbox
    let draft = {}
    let published = {}
    for (const key in sandboxItems) {
      if (yield actions.isSandboxDraft(key)) {
        draft[key] = sandboxItems[key]
      } else {
        published[key] = sandboxItems[key]
      }
    }
    yield actions.setDraftItems(draft)
    yield actions.setPublishedItems(published)
  },
  * onUpdate (prev, { props, actions, state }) {
    const sandboxItems = props.profile.sandbox
    let draft = {}
    let published = {}
    for (const key in sandboxItems) {
      if (yield actions.isSandboxDraft(key)) {
        draft[key] = sandboxItems[key]
      } else {
        published[key] = sandboxItems[key]
      }
    }
    yield actions.setDraftItems(draft)
    yield actions.setPublishedItems(published)
  },
  render ({ props, actions, state }) {
    const items = props.profile.showcase
    return (
      <Block>
        <Button
          hide={!props.mine}
          float='right'
          mr='8px'
          mt='8px'
          bgColor='#FDFDFD'
          color='blue'
          borderColor='blue'
          fs='xs'
          onClick={actions.createGame}
          hoverProps={{ highlight: 0.02 }}
          focusProps={{ highlight: 0.02 }}
          p='4px 12px'>
          <Icon name='add' fs='s' mr='s' /> Create new animation
        </Button>
        {state.publishedItems &&
          Object.keys(state.publishedItems).length !== 0 && (
            <Block mb='l'>
              <Text
                fs='s'
                ml='s'
                lineHeight={3}
                fontFamily='&quot;Press Start 2P&quot;'>
                Published Animations
              </Text>
              <SandboxFeed
                {...props}
                sandboxItems={state.publishedItems}
                id='published-feed' />
            </Block>
          )}
        {props.mine && (
          <Block mb='l'>
            {/* <Block
              absolute
              bottom
              right
              align='start start'
              mx='xl'
              my='l'
              z='99'>
              <Tooltip
                message='Create new animation'
                placement='left'
                tooltipProps={{ fs: 'xs' }}>
                <Button
                  onClick={actions.createGame}
                  bgColor='blue'
                  circle='70px'
                  boxShadow='0 0 4px rgba(0,0,0,.14), 0 4px 8px rgba(0,0,0,.28)'>
                  <Icon name='add' fs='28px' />
                </Button>
              </Tooltip>
            </Block> */}
            <Text
              fs='s'
              ml='s'
              lineHeight={3}
              fontFamily='&quot;Press Start 2P&quot;'>
              Drafts ({state.draftItems
                ? Object.keys(state.draftItems).length
                : 0})
            </Text>
            {state.draftItems &&
              Object.keys(state.draftItems).length !== 0 && (
                <SandboxFeed
                  isDraft
                  {...props}
                  sandboxItems={state.draftItems}
                  id='draft-feed' />
              )}
          </Block>
        )}
        {items && Object.keys(items).length ? (
          <CardFeed items={items} {...props} />
        ) : (
          state.publishedItems &&
          Object.keys(state.publishedItems).length === 0 && (
            <EmptyState
              icon='collections'
              title='No Gallery Items'
              description='There are currently no gallery items.  When this user shares some of their work, it will appear here!' />
          )
        )}
      </Block>
    )
  },
  controller: {
    * createGame ({ context }) {
      const saved = yield context.firebasePush('/saved', {
        uid: context.uid,
        ...initialSandboxState
      })
      const sandbox = yield context.firebasePush('/sandbox', {
        creatorID: context.uid,
        saveRef: saved.key,
        lastEdited: Date.now(),
        isDraft: true,
        title: 'New Draft Animation',
        description: 'Use code to make an animation.'
      })
      yield context.firebaseSet(
        `/users/${context.uid}/sandbox/${sandbox.key}`,
        Date.now()
      )
      yield context.setUrl(`/sandbox/${sandbox.key}/edit`)
    },

    * isSandboxDraft ({ context }, key) {
      const snap = yield context.firebaseOnce(`/sandbox/${key}`)
      return snap.val() ? snap.val().isDraft : false
    }
  },
  reducer: {
    setDraftItems: (state, draftItems) => ({ draftItems }),
    setPublishedItems: (state, publishedItems) => ({ publishedItems })
  }
})
