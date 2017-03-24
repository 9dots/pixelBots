/**
 * Imports
 */

import IndeterminateProgress from 'components/IndeterminateProgress'
import {Block, Card, Icon, Flex, Image, Text} from 'vdux-ui'
import fire, {set, transaction} from 'vdux-fire'
import {component, element} from 'vdux'
import {Box} from 'vdux-containers'
import moment from 'moment'


/**
 * <Display Card/>
 */

export default fire((props) => ({
  game: `/games/${props.gameRef}/meta`,
  saved: `/saved/${props.saveRef}/meta`
}))(component({
  render ({props, context, children, actions}) {
  	const {game, saved, imageSize = '500px', userProfile, saveRef, ...restProps} = props
  	const {username, uid} = context

    console.log(userProfile.likes)
  	const likedByMe = userProfile && userProfile.likes && !!userProfile.likes[props.saveRef]

 		if (game.loading || saved.loading) return <IndeterminateProgress />

		const value = {...game.value, ...saved.value}
    return (
    	<Block id={saveRef} bgColor='white' w='500px' border='1px solid #e0e0e0' {...restProps}>
        <Flex p='20px'>
          <Box fontWeight='700' flex>
            <Text cursor='pointer' onClick={context.setUrl(`/${value.username}`)}>{value.username}</Text>
          </Box>
          <Box color='#999'>
            {moment(value.lastEdited).fromNow()}
          </Box>
        </Flex>
        <Block align='center center' border='1px solid #e0e0e0' borderWidth='1px 0'>
          <Image sq={imageSize} boxSizing='content-box' src={value.animatedGif} />
        </Block>
        <Flex p='20px'>
          <Box align='start center'>
            {
							likedByMe
								?	<Icon onClick={actions.removeLike()} name='favorite' color='red' cursor='pointer' />
								: <Icon
									  onClick={actions.addLike()}
									  name='favorite_border'
									  cursor='pointer' />
						}
            <Text display='block' ml='6px'>{value.likes}</Text>
          </Box>
          <Box
            cursor='pointer'
            hoverProps={{color: 'link'}}
            onClick={context.setUrl(`/games/${props.gameRef}`)}
            align='center center'
            fontWeight='700'
            flex>
            {value.title}
          </Box>
          <Box align='center center'>
            <Icon name='more_horiz' cursor='pointer' />
          </Box>
        </Flex>
        {children}
      </Block>
    )
  },
  controller: {
  	* addLike ({props, context}) {
  		if (context.isAnonymous) {
  			yield context.openModal({header: 'Sign In', body: 'You must be signed in to like a project.'})
  		} else {
  			const {saveRef} = props
	  		const {username, uid} = context
	  		const ref = `/saved/${saveRef}/meta`
	  		yield context.firebaseSet(`users/${uid}/likes/${saveRef}`, true)
	  		yield context.firebaseTransaction(`${ref}/likes`, (val = 0) => val + 1)
	  		yield context.firebaseSet(`${ref}/likedBy/${username}`, true)
  		}
  	},
  	* removeLike ({props, context}) {
  		const {saveRef} = props
  		const {username, uid} = context
  		const ref = `/saved/${saveRef}/meta`
  		yield context.firebaseSet(`users/${uid}/likes/${saveRef}`, null)
  		yield context.firebaseTransaction(`${ref}/likes`, (val = 0) => val - 1)
  		yield context.firebaseSet(`${ref}/likedBy/${username}`, false)
  	}
  }
}))