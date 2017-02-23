/** @jsx element */

import Loading from '../components/Loading'
import ModalMessage from '../components/ModalMessage'
import ShowcaseView from '../components/ShowcaseView'
import {setUrl} from 'redux-effects-location'
import {Block, Icon, Text} from 'vdux-ui'
import Card from '../components/Card'
import element from 'vdux/element'
import {palette} from '../utils'
import reduce from '@f/reduce'
import fire from 'vdux-fire'
import map from '@f/map'

function render ({props}) {
  const {project, coursesVal} = props
  const {loading, value} = coursesVal

  if (loading) return <Loading />

  const courses = map((course, key) => (
    {...course, color: palette[Object.keys(value).indexOf(key) + 5].value}
  ), value)

  return (
    <Block color='#333' m='0 auto' w='980px' align='start center' column>
      {project && getModal(courses[project])}
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

function getModal (project) {
  return <ModalMessage
    fullscreen
    headerColor='#666'
    bgColor='#FAFAFA'
    header={project.title}
    dismiss={() => setUrl('/featured')}
    noFooter
    body={<ShowcaseView color={project.color} playlists={project.playlists} />} />
}

function reduceToCards (arr, feature, key) {
  return arr.concat(
    <Card
      w='310px'
      h='auto'
      my='10px'
      minHeight='200px'
      cursor='pointer'
      hoverProps={{boxShadow: 'rgba(0, 0, 0, 0.40) 0px 1px 7px 0px'}}
      onClick={() => setUrl(`/featured/${key}`)}
      cardTitle={feature.title}
      cardFooter={
        <Block fs='xs' align='start center'>
          <Icon fs='m' name='collections' />
          <Text ml='6px'>{feature.playlists.length} playlists</Text>
        </Block>
      }
      borderRadius='2px'
      headerColor={feature.color}>
      <Text>{feature.description}</Text>
    </Card>
  )
}

export default fire((props) => ({
  coursesVal: '/courses'
}))({
  render
})
