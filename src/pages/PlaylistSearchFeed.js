/** @jsx element */

import element from 'vdux/element'
import {Block, Flex, Image, Text} from 'vdux-ui'
import Card from '../components/Card'
import {setUrl} from 'redux-effects-location'
import reduce from '@f/reduce'

function render ({props}) {
  const {playlists} = props

  return (
    <Flex wide flexWrap='wrap'>
      {reduce((cur, {body, ref}) => body && cur.concat(
        <Card
          m='15px'
          w='192px'
          h='auto'
          onClick={() => setUrl(`/playlist/${ref}`)}
          cursor='pointer'
          cardImage={<Image h='150px' w='150px' src={body.imageUrl} />}
          cardFooter={getCardFooter(body)}
          cardTitle={body.name}>
          <Block mt='-10px' fontWeight='800' fs='xxs'>
            <a onClick={(e) => e.stopPropagation()} href={`/${body.creatorUsername}/playlists`}>
              {body.creatorUsername.toUpperCase()}
            </a>
          </Block>
          <Block py='10px' fontWeight='500'>
            {body.description}
          </Block>
        </Card>
			), [], playlists)}
    </Flex>
  )
}

function getCardFooter (playlist) {
  return (
    <Block p='10px' align='space-between'>
      <Text fs='xxs'>
        {playlist.follows || 0} {playlist.follows === 1 ? 'FOLLOW' : 'FOLLOWS'}
      </Text>
    </Block>
  )
}

export default {
  render
}
