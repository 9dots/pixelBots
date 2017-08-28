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
    const students = mapValues((val, key) => ({...val, key}), classInfo.value.students)
    const sorted = students.slice().sort((a, b) => {
      const nameA = a.displayName.toLowerCase()
      const nameB = b.displayName.toLowerCase()
      if (nameA < nameB) return -1
      if (nameA > nameB) return 1
      return 0
    })

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
              <MenuItem  onClick={actions.getSignInToken(val.key)} key={val.key} align='start center' capitalize py='20' px='l' borderTop={parseInt(key) ? 0 : '1px solid divider'} borderBottom='1px solid divider'>
                {
                  val.photoURL 
                    ? <Block circle='30' mr bgImg={val.photoURL} backgroundSize='cover'  />
                    : <Block circle='30px' align='center center' color='white' bgColor='blue' mr>
                        {val.displayName[0]}
                      </Block>
                }
                {val.displayName}
              </MenuItem>
            ), sorted)}
          </Menu>
        </Block>
        <Loading hide={!loading} absolute bottom='130px' />
      </Block>
    )
  },
  controller: {
    * getSignInToken ({context, actions}, uid) {
      yield actions.setLoading(true)
      const {value} = yield context.fetch(`${process.env.CLOUD_FUNCTIONS}/weoAuth`, {
        method: 'POST',
        headers: {'CONTENT-TYPE': 'application/json'},
        body: JSON.stringify({uid})
      })
      if (value.status === 'success') {
        yield context.signInWithToken(value.payload)
      } else {
        yield actions.setLoading(false)
        yield context.toast(value.payload)
      }
    }
  },
  reducer: {
    setLoading: (state, loading) => ({loading})
  }
}))

const ClassList = fire(({schoolId}) => ({
	school: {
		ref: `/schools/${schoolId}/classes#orderByValue`,
		join: {
			ref: '/classes',
			child: 'classInfo',
			childRef: (val, ref) => val.map(({key}) => ref.child(key))
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
    			{mapValues(({classInfo, key}, i) => (
    				<MenuItem onClick={context.setUrl(`/schools/${props.schoolId}/${key}`)} key={key} align='start center' capitalize py='20' px='l' borderTop={parseInt(i) ? '' : '1px solid divider'} borderBottom='1px solid divider'>
              <Block circle='30px' align='center center' color='white' bgColor='green' mr>
              {classInfo.displayName[0]}
              </Block>
              {classInfo.displayName}
            </MenuItem>
    			), school.value)}
    		</Menu>
    	</Block>
    )
  }
}))
