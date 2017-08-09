/**
 * Imports
 */

import {MenuItem, Button} from 'vdux-containers'
import {Block, Menu, Icon} from 'vdux-ui'
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
    	<Block column w='col_s' h={400} p='l' bgColor='white' boxShadow='0 1px 2px rgba(0,0,0,.3)'>
    		{router(route, props)}
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
  render ({props, context, actions}) {
  	const {classInfo, schoolId} = props
  	if (classInfo.loading) return <span/>

    return (
    	<Block>
    		<Block
    			onClick={context.setUrl(`/schools/${schoolId}`)}
    			cursor='pointer'
    			fs='m'
          pb
    			align='start center'>
            <Icon pr name='arrow_back'/>
    				{classInfo.value.displayName}
    		</Block>
    		<Block fs='s' pb>Select Your Name</Block>
				<Menu flex column>
    			{mapValues((val, key) => (
    				<MenuItem onClick={actions.getSignInToken(key)} key={key}>{val.displayName}</MenuItem>
    			), classInfo.value.students)}
    		</Menu>
    	</Block>
    )
  },
  controller: {
    * getSignInToken ({context}, uid) {
      const {value} = yield context.fetch('https://us-central1-artbot-dev.cloudfunctions.net/weoAuth', {
        method: 'POST',
        body: JSON.stringify({uid})
      })
      yield context.signInWithToken(value.token)
    }
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
    		<Block fs='m' pb='l'>Select Your Class</Block>
    		<Menu flex column>
    			{mapValues((val, key) => (
    				<MenuItem onClick={context.setUrl(`/schools/abc1234/${key}`)} key={key}>{val.displayName}</MenuItem>
    			), school.value.classes)}
    		</Menu>
    	</Block>
    )
  }
}))
