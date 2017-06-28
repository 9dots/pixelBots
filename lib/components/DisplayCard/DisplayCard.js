/**
 * Imports
 */

import IndeterminateProgress from 'components/IndeterminateProgress'
import {Block, Card, Icon, Flex, Image, Text} from 'vdux-ui'
import ShowcaseButton from 'components/ShowcaseButton'
import fire, {set, transaction} from 'vdux-fire'
import Loading from 'components/Loading'
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
  	const {game, saved, imageSize = '420px', userProfile, saveRef, ...restProps} = props
  	const {username, uid} = context

 		if (game.loading || saved.loading) return <IndeterminateProgress />

		const value = {...game.value, ...saved.value}
    const likedByMe = value.likedBy && !!value.likedBy[username]

    return (
    	<Block id={saveRef} boxSizing='content-box' bgColor='white' w={imageSize} border='1px solid #e0e0e0' {...restProps}>
        <Flex p='20px'>
          <Box fontWeight='700' flex>
            <Text cursor='pointer' onClick={context.setUrl(`/${value.username}`)}>{value.username}</Text>
          </Box>
          <Box color='#999'>
            {moment(value.lastEdited).fromNow()}
          </Box>
        </Flex>
        <Block align='center center' border='1px solid #e0e0e0' borderWidth='1px 0'>
          {
            value.animatedGif
              ? <video src={value.animatedGif} autoplay loop type='video/mp4' width={imageSize} height={imageSize}/>
              : <Block sq={imageSize} align='center center' bgColor='#FCFCFC'>
                  <Loading wide message='Building Gif Check Back Soon!' position='static' sq='auto' />
                </Block>
          }
        </Block>
        <Flex p='20px'>
          <Box align='start center' flex>
            {
							likedByMe
								?	<Icon onClick={actions.removeLike} name='favorite' color='red' cursor='pointer' />
								: <Icon
									  onClick={actions.addLike}
									  name='favorite_border'
									  cursor='pointer' />
						}
            <Text display='block' ml='6px'>{value.likes}</Text>
          </Box>
          <Box
            align='center center'
            fontWeight='700'
            flex>
            {value.title}
          </Box>
          <Block flex align='end center'>
            <ShowcaseButton saveRef={saveRef} gameRef={props.gameRef} shared={true} hide={!props.mine}>
              Remove
            </ShowcaseButton>
          </Block>
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
        yield context.firebaseSet(`${ref}/likedBy/${username}`, true)
	  		yield context.firebaseTransaction(`${ref}/likes`, (val = 0) => val + 1)
        yield context.firebaseSet(`users/${uid}/likes/${saveRef}`, true)
  		}
  	},
  	* removeLike ({props, context}) {
  		const {saveRef} = props
  		const {username, uid} = context
  		const ref = `/saved/${saveRef}/meta`
      yield context.firebaseSet(`${ref}/likedBy/${username}`, false)
  		yield context.firebaseTransaction(`${ref}/likes`, (val = 0) => val - 1)
      yield context.firebaseSet(`users/${uid}/likes/${saveRef}`, null)
  	}
  }
}))
