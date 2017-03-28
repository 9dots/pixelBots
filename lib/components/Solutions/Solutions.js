/**
 * Imports
 */

import CardFeed from 'components/CardFeed'
import Loading from 'components/Loading'
import {component, element} from 'vdux'
import {Block} from 'vdux-ui'
import fire from 'vdux-fire'
import map from '@f/map'

/**
 * <Solutions/>
 */

export default fire((props) => ({
  solutions: `/solutions/${props.gameRef}`
}))(component({
  render ({props}) {
  	const {solutions = {}} = props
	  if (solutions.loading) return <Loading />
	  return solutions.value
			?	<CardFeed
				  w='400px'
				  imageSize='400px'
				  items={map((s, key) => ({...s, gameRef: props.gameRef}), solutions.value)} />
			: <Block mt='10px'> No Solutions Yet </Block>
	  }
}))
