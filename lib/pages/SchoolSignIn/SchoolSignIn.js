/**
 * Imports
 */

import { Button, Grid } from 'vdux-containers'
import { Block, Icon } from 'vdux-ui'
import Loading from 'components/Loading'
import { component, element } from 'vdux'
import mapValues from '@f/map-values'
import enroute from 'enroute'
import fire from 'vdux-fire'
import { auth } from 'firebase'

const router = enroute({
  classList: (params, props) => <ClassList {...props} />,
  studentList: (params, props) => <StudentList {...props} />
})

/**
 * <Student Sign In/>
 */

const colors = ['green', '#8242b3', '#f9cb3e', '#fd686f', 'blue', '#555']

export default component({
  render ({ props, context }) {
    const { classId } = props
    const route = classId ? 'studentList' : 'classList'

    return (
      <Block>
        <Block
          fontFamily='&quot;Press Start 2P&quot;'
          fs='m'
          textAlign='center'
          pb='l'>
          PixelBots
        </Block>
        <Block
          column
          minWidth={300}
          maxHeight={600}
          overflow='hidden'
          bgColor='white'
          boxShadow='0 1px 2px rgba(0,0,0,.3)'
          color='primary'>
          {router(route, props)}
        </Block>
      </Block>
    )
  }
})

const StudentList = fire(({ classId }) => ({
  classInfo: {
    ref: `/classes/${classId}`,
    join: {
      ref: '/users',
      child: 'students',
      childRef: (val, ref) =>
        mapValues((val, key) => ref.child(key), val.students)
    }
  }
}))(
  component({
    render ({ props, context, actions, state }) {
      const { classInfo, schoolId } = props
      const { loading } = state
      if (classInfo.loading) return <span />
      const disabledProps = loading
        ? { opacity: 0.1, pointerEvents: 'none', userSelect: 'none' }
        : {}
      const students = mapValues((val, key) => val, classInfo.value.students)
      const sorted = students.slice().sort((a, b) => {
        const nameA = a.displayName.toLowerCase()
        const nameB = b.displayName.toLowerCase()
        if (nameA < nameB) return -1
        if (nameA > nameB) return 1
        return 0
      })

      const cols = getCols(sorted.length)

      return (
        <Block relative h='100%'>
          <Block {...disabledProps}>
            <Block px='l' pt='l'>
              <Block fs='m' pb='s' bold align='start center'>
                <Block>Select Your Name</Block>
              </Block>
              <Block fs='xs' pb textTransform='capitalize' align='start center'>
                <Icon
                  mr='s'
                  pointer
                  name='arrow_back'
                  onClick={context.setUrl(`/schools/${schoolId}`)} />
                {classInfo.value.displayName}
              </Block>
            </Block>
            <Grid itemsPerRow={cols} pb px align='center start'>
              {mapValues(
                (val, key) => (
                  <Button
                    px='s'
                    py
                    m='s'
                    textAlign='center'
                    bold
                    w={175}
                    bgColor={colors[key % cols]}
                    color='white'
                    onClick={actions.getSignInToken(val.key)}>
                    <Block ellipsis fs='s'>
                      {val.displayName}
                    </Block>
                  </Button>
                ),
                sorted
              )}
            </Grid>
          </Block>
          <Loading hide={!loading} absolute bottom='130px' />
        </Block>
      )
    },
    controller: {
      * getSignInToken ({ context, actions }, uid) {
        yield actions.setLoading(true)
        const idToken = yield auth().currentUser.getToken(true)
        const { value } = yield context.fetch(`/api/weoAuth`, {
          method: 'POST',
          headers: {
            'CONTENT-TYPE': 'application/json',
            Authorization: 'Bearer ' + idToken
          },
          body: JSON.stringify({ uid })
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
      setLoading: (state, loading) => ({ loading })
    }
  })
)

const ClassList = fire(({ schoolId }) => ({
  school: {
    ref: `/schools/${schoolId}/classes#orderByValue`,
    join: {
      ref: '/classes',
      child: 'classInfo',
      childRef: (val, ref) => val.map(({ key }) => ref.child(key))
    }
  }
}))(
  component({
    render ({ props, context }) {
      const { school } = props
      if (school.loading) return <span />

      const schools = school.value

      const cols = getCols(schools.length)

      return (
        <Block>
          <Block fs='m' p='l' pb textAlign='center' bold>
            Find Your Class
          </Block>
          <Grid itemsPerRow={cols} pb px align='center start'>
            {mapValues(
              ({ classInfo, key }, i) => (
                <Button
                  onClick={context.setUrl(`/schools/${props.schoolId}/${key}`)}
                  border={`2px solid ${colors[i % cols]}`}
                  hoverProps={{ highlight: 0.02 }}
                  color={colors[i % cols]}
                  textAlign='center'
                  maxWidth={175}
                  minWidth={175}
                  bgColor='white'
                  px='s'
                  m='s'
                  py
                  bold>
                  <Block ellipsis fs='s'>
                    {classInfo.displayName}
                  </Block>
                </Button>
              ),
              school.value
            )}
          </Grid>
        </Block>
      )
    }
  })
)

function getCols (items) {
  return Math.ceil(items / Math.ceil(Math.sqrt(items)))
}
