/**
 * Imports
 */

import {MenuItem, Button} from 'vdux-containers'
import {Block, Menu, Icon} from 'vdux-ui'
import Loading from 'components/loading'
import {component, element} from 'vdux'
import mapValues from '@f/map-values'
import enroute from 'enroute'
import fire from 'vdux-fire'

const router = enroute({
	classList: (params, props) => <ClassList {...props}/>,
	studentList: (params, props) => <StudentList {...props}/>
})

/**
 * <Student Sign In/>
 */


export default component({
  render ({props, context}) {
  	const {classId} = props
  	const route = classId ? 'studentList' : 'classList'

    return (
      <Block>
        <Block fontFamily='"Press Start 2P"' fs='m' textAlign='center' pb='l'>
          PixelBots
        </Block> 
      	<Block column w={340} h={400} maxHeight={400} overflow='hidden' bgColor='white' boxShadow='0 1px 2px rgba(0,0,0,.3)' color='primary'>
      		{router(route, props)}
      	</Block>
      </Block>
    )
  }
})

const StudentList = fire(({classId}) => ({
	classInfo: {
		ref: `/classes/${classId}`,
		join: {
			ref: '/users',
			child: 'students',
			childRef: (val, ref) => mapValues((val, key) => ref.child(key), val.students)
		}
	},
}))(component({
  render ({props, context, actions, state}) {
  	const {classInfo, schoolId} = props
    const {loading} = state
  	if (classInfo.loading) return <span/>
    const disabledProps = loading 
      ? {opacity: .1, pointerEvents: 'none', userSelect: 'none'}
      : {}

    return (
      <Block relative h='100%'>
        <Block {...disabledProps}>
          <Block px='l' pt='l'>
            <Block fs='m' pb='s' bold align='start center'>
              <Block color='blue'>Select Your Name</Block>
            </Block>
            <Block fs='xs' pb textTransform='capitalize' align='start center'>
              <Icon mr='s' pointer name='arrow_back' onClick={context.setUrl(`/schools/${schoolId}`)}/>
              {classInfo.value.displayName}
            </Block>
          </Block>
          <Menu column overflowY='auto' h='296px'>
            {mapValues((val, key) => (
              <MenuItem  onClick={actions.getSignInToken(key)} key={key} align='start center' capitalize py='12' px='l'>
                <Block circle='30' mr bgImg={val.photoURL} backgroundSize='cover'  />
                {val.displayName}
              </MenuItem>
            ), classInfo.value.students)}
          </Menu>
        </Block>
        <Loading hide={!loading} absolute bottom='130px' />
      </Block>
    )
  },
  controller: {
    * getSignInToken ({context, actions}, uid) {
      yield actions.startLoading()
      const {value} = yield context.fetch('https://us-central1-artbot-dev.cloudfunctions.net/weoAuth', {
        method: 'POST',
        body: JSON.stringify({uid})
      })
      yield context.signInWithToken(value.token)
    }
  },
  reducer: {
    startLoading: () => ({loading: true})
  }
}))

const ClassList = fire(({schoolId}) => ({
	school: {
		ref: `/schools/${schoolId}`,
		join: {
			ref: '/classes',
			child: 'classes',
			childRef: (val, ref) => mapValues((val, key) => ref.child(key), val.classes)
		}
	},
}))(component({
  render ({props, context}) {
  	const {school} = props
  	if (school.loading) return <span/>

    return (
    	<Block>
    		<Block fs='m' p='l' pb color='blue' bold>Find Your Class</Block>
    		<Menu column h='328px'>
    			{mapValues((val, key) => (
    				<MenuItem onClick={context.setUrl(`/schools/abc1234/${key}`)} key={key} align='start center' capitalize py='12' px='l'>
              <Block circle='30px' align='center center' color='white' bgColor='green' mr>
              {val.displayName[0]}
              </Block>
              {val.displayName}
            </MenuItem>
    			), school.value.classes)}
    		</Menu>
    	</Block>
    )
  }
}))
