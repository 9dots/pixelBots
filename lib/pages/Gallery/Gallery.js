/**
 * Imports
 */

import { initialSandboxState } from 'utils/initialGameState'
import { component, element, stopPropagation } from 'vdux'
import ConfirmDelete from 'components/ConfirmDelete'
import EmptyState from 'components/EmptyState'
import DetailInfo from 'components/DetailInfo'
import CardFeed from 'components/CardFeed'
import ListItem from 'components/ListItem'
import Button from 'components/Button'
import { Text, Block, Icon } from 'vdux-ui'
import mapValues from '@f/map-values'
import sortBy from 'lodash/orderBy'
import fire from 'vdux-fire'
import moment from 'moment'

/**
 * <SandboxItem/>
 */

const SandboxItem = fire(props => ({
  sandbox: `/sandbox/${props.sandboxRef}`
}))(
  component({
    initialState: {
      selected: []
    },
    render ({ props, context, actions, state }) {
      const { sandbox, sandboxRef } = props
      const { loading, value } = sandbox

      if (loading) return <span />
      if (!value) return <div />
      const { title, lastEdited } = value

      return (
        <ListItem
          wide
          onClick={context.setUrl(`/sandbox/${sandboxRef}/edit`)}
          fontWeight='300'
          align='start center'
          p>
          <Block
            mr='14px'
            sq={50}
            border='1px solid grey'
            bgImg={props.profile.photoURL}
            backgroundSize='cover' />
          <Block flex ellipsis>
            {title}
          </Block>
          <DetailInfo
            w={280}
            align='start center'
            icon='date_range'
            label={`Created: ${moment(lastEdited).fromNow()}`} />{' '}
          {props.mine && (
            <Block>
              <Icon
                name='slideshow'
                hoverProps={{ opacity: '.8' }}
                fs='m'
                color='primary'
                onClick={[
                  context.setUrl(`/sandbox/${sandboxRef}/view`),
                  stopPropagation
                ]}
                circle='40'
                lh='40px'
                textAlign='center' />
              <Icon
                name='delete'
                hoverProps={{ opacity: '.8' }}
                fs='m'
                color='primary'
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
                circle='40'
                lh='40px'
                textAlign='center' />
            </Block>
          )}
        </ListItem>
      )
    },

    controller: {
      * removeSandbox ({ props, context }) {
        yield context.firebaseSet(`/saved/${props.sandbox.value.saveRef}`, null)
        yield context.firebaseSet(`/sandbox/${props.sandboxRef}`, null)
        yield context.firebaseSet(
          `/users/${context.uid}/sandbox/${props.sandboxRef}`,
          null
        )
      }
    }
  })
)

/**
 * <SandboxFeed />
 */

const SandboxFeed = component({
  render ({ props, actions }) {
    const { sandboxItems = {} } = props

    return (
      <Block wide bgColor='white' mb='l'>
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
              <Block wide bgColor='white'>
                <SandboxFeed {...props} sandboxItems={state.publishedItems} />
              </Block>
            </Block>
          )}
        {props.mine && (
          <Block mb='s' display='flex'>
            <Block flex align='start center'>
              <Text fs='s' ml='s' fontFamily='&quot;Press Start 2P&quot;'>
                Drafts
              </Text>
            </Block>
            <Block flex align='end center'>
              <Button onClick={actions.createGame} bgColor='blue' py='s' fs='s'>
                <Icon name='add_box' fs='m' mr='s' />
                Create new Sandbox Project
              </Button>
            </Block>
          </Block>
        )}
        {props.mine &&
          state.draftItems &&
          Object.keys(state.draftItems).length !== 0 && (
            <Block wide bgColor='white' mb='l'>
              <SandboxFeed isDraft {...props} sandboxItems={state.draftItems} />
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
