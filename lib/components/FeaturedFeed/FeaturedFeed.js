/**
 * Imports
 */

// import IndeterminateProgress from '../components/IndeterminateProgress'
import ModalMessage from 'components/ModalMessage'
import ShowcaseView from 'components/ShowcaseView'
import {Block, Icon, Text, Image} from 'vdux-ui'
import {component, element} from 'vdux'
import mapValues from '@f/map-values'
import palette from 'utils/palette'
import Card from 'components/Card'
import reduce from '@f/reduce'
import fire from 'vdux-fire'
import map from '@f/map'
import animalApis, {images} from 'animalApis'

/**
 * <Featured Feed/>
 */

export default fire((props) => ({
  coursesVal: '/courses#bindAs=object'
}))(component({
  render ({props, context, state}) {
    const {coursesVal, project} = props
    const {value, loading} = coursesVal

    if (loading) return <span />

    const courses = map((course, key) => (
      {...course, color: palette[Object.keys(value).indexOf(key)].value}
    ), value)

    if (project) {
      return <ModalMessage
        fullscreen
        headerColor='#666'
        bgColor='#fafafa'
        header={courses[project].title}
        dismiss={context.setUrl('/featured')}
        noFooter
        body={<ShowcaseView
          color={courses[project].color}
          playlists={courses[project].playlists} />} />
    }

    return (
      <Block m='0 auto' w='980px'>
        <Text fs='l'>
          COURSES
        </Text>
        <Text display='block' mt='0.5em' fontWeight='200' fs='m'>
          Use these courses to get started in PixelBots.
        </Text>
        <Block wide>
          <Block py='2em' flexWrap='wrap' align='space-between start'>
            {reduce(reduceToCards, [], courses)}
          </Block>
        </Block>
        <RecentCards />
      </Block>
    )
  }
}))

function reduceToCards (arr, feature, key) {
  return arr.concat(
    <FeaturedCard feature={feature} ref={`/featured/${key}`} />
  )
}

const RecentCards = fire((props) => ({
  recent: {
    // ref: '/users/JmQFPY4ZgkNa17hvhlfXHoUvo3d2/games',
    ref: '/users/kvkXjds5fRh0jliRNfji3LTFMbI3/games#orderByChild=lastEdited&limitToLast=3',
    join: {ref: '/games', child: 'gameVal', childRef: (val, ref) =>
      mapValues(v => ref.child(v.ref), val)
    }
  }
}))(component({
  render ({props}) {
    const {recent} = props
    const {value, loading} = recent

    if (loading) return <span />

    const recents = (value) => map((recent, i) => (
      {...recent, ...recent.gameVal, color: palette[(i + 6)].value}
    ), (value || []).reverse())

    return (
      <Block>
        <Text fs='l'>
          RECENT
        </Text>
        <Text display='block' mt='0.5em' fontWeight='200' fs='m'>
          Check out some recently added challenges!
        </Text>
        <Block wide py='2em' flexWrap='wrap' align='space-between start'>
          {
            !loading &&
              map((recent => <FeaturedCard ref={`/games/${recent.key}`} feature={recent} />), recents(value))
          }
        </Block>
      </Block>
    )
  }
}))

const FeaturedCard = component({
  render ({props, context}) {
    const {ref, feature} = props
    const {title, playlists, imageUrl, description, color, animal} = feature
    const {setUrl} = context
    const w = 310

    return (
      <Card
        w={w}
        h='auto'
        my='10px'
        minHeight='200px'
        cursor='pointer'
        hoverProps={{boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 2px 0px'}}
        onClick={setUrl(ref)}
        cardTitle={title}
        cardFooter={
          <Block fs='xs' align='start center'>
            {
              playlists
                ? [
                    <Icon fs='m' name='collections' />,
                    <Text ml='6px'>{playlists.length} playlists</Text>
                  ]
                : <Block align='center center' pt='l'>
                      <Image src={imageUrl || images[animal]} sq={100} border='1px solid divider' />
                  </Block>
            }
          </Block>
        }
        borderRadius={3}
        headerColor={color}>
        <Text>{description || 'No description'}</Text>
      </Card>
    )
  }
})
