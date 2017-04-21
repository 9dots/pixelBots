/**
 * Imports
 */

// import IndeterminateProgress from '../components/IndeterminateProgress'
import ModalMessage from 'components/ModalMessage'
import ShowcaseView from 'components/ShowcaseView'
import {Block, Icon, Text, Image} from 'vdux-ui'
import {component, element} from 'vdux'
import Card from 'components/Card'
import palette from 'utils/palette'
import reduce from '@f/reduce'
import fire from 'vdux-fire'
import map from '@f/map'

/**
 * <Featured Feed/>
 */

export default fire((props) => ({
  coursesVal: '/courses',
  recent: {
    // ref: '/users/JmQFPY4ZgkNa17hvhlfXHoUvo3d2/games',
    ref: '/games',
    updates: [
      {method: 'orderByChild', value: 'creatorID'},
      {method: 'equalTo', value: 'kvkXjds5fRh0jliRNfji3LTFMbI3'},
      {method: 'limitToLast', value: 3}
    ]
  }
}))(component({
  render ({props, context, state}) {
    const {coursesVal, project, recent} = props
    const {value, loading} = coursesVal

    if (loading || recent.loading) return <span />

    const courses = map((course, key) => (
      {...course, color: palette[Object.keys(value).indexOf(key)].value}
    ), value)
    
    const recents = map((recent, i) => (
      {...recent, color: palette[(i + 6)].value}
    ), recent.value.reverse())

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
        <Text fs='l'>
          RECENT
        </Text>
        <Text display='block' mt='0.5em' fontWeight='200' fs='m'>
          Check out some recently added challenges!
        </Text>
        <Block wide>
          <Block py='2em' flexWrap='wrap' align='space-between start'>
            {map((recent => <FeaturedCard ref={`/games/${recent.key}`} feature={recent} />), recents)}
          </Block>
        </Block>
      </Block>
    )
  }
}))

function reduceToCards (arr, feature, key) {
  return arr.concat(
    <FeaturedCard feature={feature} ref={`/featured/${key}`} />
  )
}

const FeaturedCard = component({
  render ({props, context}) {
    const {ref, feature} = props
    const {title, playlists, imageUrl, description, color} = feature
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
              playlists && [
                <Icon fs='m' name='collections' />,
                <Text ml='6px'>{playlists.length} playlists</Text>
              ]
            }
            {
              imageUrl && 
                <Block align='center center' pt='l'>
                  <Image src={imageUrl} w={100} border='1px solid divider' />
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

