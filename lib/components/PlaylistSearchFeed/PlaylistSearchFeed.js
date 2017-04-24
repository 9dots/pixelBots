/**
 * Imports
 */

import {component, element, stopPropagation} from 'vdux'
import {Block, Flex, Image, Text} from 'vdux-ui'
import Card from 'components/Card'
import reduce from '@f/reduce'

/**
 * <Playlist Search Feed/>
 */

export default component({
  render ({props, context}) {
	  const {playlists} = props

	  return (
	    <Flex flexWrap='wrap' align='center'>
	      {reduce((cur, body) => body && cur.concat(
	        <Card
	          m='15px'
	          w='192px'
	          h='auto'
	          onClick={context.setUrl(`/playlist/${body.ref}`)}
	          cursor='pointer'
	          cardImage={<Image display='block' h='150px' w='150px' src={body.imageUrl} />}
	          cardFooter={<CardFooter follows={body.follows}/>}
	          cardTitle={body.name}>
	          <Block mt='-10px' fontWeight='800' fs='xxs'>
	            <a onClick={stopPropagation} href={`/${body.creatorUsername}/authored/playlists`}>
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
})

/** @jsx element */

const CardFooter = component({
	render ({props}) {
		const {follows = 0} = props
		return (
	    <Block p='10px' align='space-between'>
	      <Text fs='xxs'>
	        {follows} {follows === 1 ? 'FOLLOW' : 'FOLLOWS'}
	      </Text>
	    </Block>
	  )
	}
})