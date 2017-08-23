/**
 * Imports
 */

import {Block, Icon, Text, Image} from 'vdux-ui'
import {component, element} from 'vdux'
import palette from 'utils/palette'
import Card from 'components/Card'
import {images} from 'animalApis'
import reduce from '@f/reduce'
import fire from 'vdux-fire'
import map from '@f/map'

/**
 * <Featured Feed/>
 */

export default fire((props) => ({
  coursesVal: '/courses#bindAs=object'
}))(component({
  render ({props, context, state}) {
    const {coursesVal} = props
    const {value, loading} = coursesVal

    if (loading) return <span />

    const courses = map((course, key) => (
      {...course, color: palette[Object.keys(value).indexOf(key)].value}
    ), value)

    return (
      <Block m='0 auto' w='980px'>
        <Block wide>
          <Block py flexWrap='wrap' align='start start'>
            {reduce(reduceToCards, [], courses)}
          </Block>
        </Block>
      </Block>
    )
  }
}))

function reduceToCards (arr, feature, key) {
  return arr.concat(
    <FeaturedCard feature={feature} ref={`/course/${key}`} />
  )
}

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
        mx='8'
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
