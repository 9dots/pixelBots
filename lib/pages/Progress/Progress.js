/**
 * Imports
 */

import PlaylistItem from 'components/PlaylistItem'
import EmptyState from 'components/EmptyState'
import {Block} from 'vdux-ui'
import {component, element} from 'vdux'
import fire from 'vdux-fire'

/**
 * <Progress/>
 */

export default fire((props) => ({
  coursesVal: '/courses#bindAs=object',
  inProgress: {
    ref: `/playlistsByUser/${props.uid}/inProgress#orderByChild=lastEdited`,
    join: {
      ref: '/playlistInstances',
      child: 'playlistValue',
      childRef: (val, ref) => val.map(v => ref.child(v.key))
    }
  },
  completed: {
    ref: `/playlistsByUser/${props.uid}/completed#orderByChild=lastEdited`,
    join: {
      ref: '/playlistInstances',
      child: 'playlistValue',
      childRef: (val, ref) => val.map(v => ref.child(v.key))
    }
  }
}))(component({
  render ({props, context}) {
    const {inProgress, coursesVal, completed} = props
    const {loading} = coursesVal
    const {value: inProgressValue, loading: inProgressLoading} = inProgress
    const {value: completedValue, loading: completedLoading} = completed

    if (loading || inProgressLoading || completedLoading) return <span />
    const orderedLists = (inProgressValue || []).reverse()
    const orderedCompleted = (completedValue || []).reverse()

    const pinned = orderedLists.filter(({playlistValue}) => playlistValue.pinned)
    const slicedLists = orderedLists.filter(({playlistValue}) => !playlistValue.pinned)
    const length = slicedLists.length + orderedCompleted.length
    const onlyCompleted = !orderedLists.length && orderedCompleted.length

    return (
      <Block bg='#f0f0f0' align='center' >
        <Block p='l' pt flex maxWidth='1100' mt={length <= 1 ? 75 : 0}>
          <Block align='start'>
            <Block flex pt='l'>
              {
                length
                  ? <Block>
                      <Lists lists={pinned} title='Pinned' />
                      {
                        onlyCompleted
                          ? <EmptyState mt={length <= 1 ? -75 : 0} icon='access_time' title='In Progress Playlists' description={'Playlists you have started will will appear here. Playlists you\'ve completed are below.'} />
                          : <Lists lists={slicedLists} title='Up Next' />
                      }
                      <Lists divider={false} lists={orderedCompleted} title='Completed' />
                    </Block>
                  : <EmptyState icon='access_time' title='In Progress Playlists' description={'Playlists that you have started will will appear here so you can continue where you left off!'} />
              }

            </Block>
          </Block>
        </Block>
      </Block>
    )
  }
}))

const Lists = component({
  render ({props, context, children}) {
    const {lists, title, divider = true} = props

    if (!lists.length) return <span />

    return (
      <Block>
        <Block pb='20' fs='l' color='blue'>{title}</Block>
        {
          lists.map((list, i) =>
            <PlaylistItem
              pinned={list.playlistValue.pinned}
              assigned={list.playlistValue.assigned}
              key={list.key}
              uid={context.uid}
              instanceRef={list.key}
              myProgress={list}
              lastEdited={list.lastEdited}
              playlistRef={list.playlistRef}
              mb={0}
              borderTopWidth={i ? 0 : 1} />
          )
        }
        <Block hide={!divider} borderBottom='1px solid divider' my='l' />
      </Block>
    )
  }
})
