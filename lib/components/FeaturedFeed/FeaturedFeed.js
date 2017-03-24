/**
 * Imports
 */

// import IndeterminateProgress from '../components/IndeterminateProgress'
import ModalMessage from 'components/ModalMessage'
import ShowcaseView from '../components/ShowcaseView'
import {Block, Icon, Text} from 'vdux-ui'
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
  coursesVal: '/courses'
}))(component({
  render ({props, context, state}) {
    const {coursesVal, project} = props
    const {value, loading} = coursesVal

    if (loading) return <span />

    const courses = map((course, key) => (
      {...course, color: palette[Object.keys(value).indexOf(key) + 5].value}
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
      <Block m='0 auto' w='980px' align='start center' column>
        <Text fs='xl'>Courses</Text>
        <Text display='block' mt='0.5em' fontWeight='200' fs='m'>
          Use these courses to get started in pixelBots.
        </Text>
        <Block wide>
          <Block py='2em' flexWrap='wrap' align='space-between start'>
            {reduce(reduceToCards, [], courses)}
          </Block>
        </Block>
      </Block>
    )
  }
}))

function reduceToCards (arr, feature, key) {
  return arr.concat(
    <FeaturedCard feature={feature} ref={key} />
  )
}

const FeaturedCard = component({
  render ({props, context}) {
    const {ref, feature} = props
    const {setUrl} = context
    return (
      <Card
        w='310px'
        h='auto'
        my='10px'
        minHeight='200px'
        cursor='pointer'
        hoverProps={{boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 2px 0px'}}
        onClick={setUrl(`/featured/${ref}`)}
        cardTitle={feature.title}
        cardFooter={
          <Block fs='xs' align='start center'>
            <Icon fs='m' name='collections' />
            <Text ml='6px'>{feature.playlists.length} playlists</Text>
          </Block>
        }
        borderRadius={3}
        headerColor={feature.color}>
        <Text>{feature.description}</Text>
      </Card>
    )
  }
})
