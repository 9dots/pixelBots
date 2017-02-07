/**
 * Imports
 */

import AppLayout from 'layouts/AppLayout'
import Explore from 'pages/Explore'
import {component, element} from 'vdux'
import enroute from 'enroute'

/**
 * <Router/>
 */

const router = enroute({
  '/featured': (params, props) => <AppLayout {...params} {...props}>
    <Explore tab='featured' {...props} />
  </AppLayout>,
  '/featured/:project': (params, props) => <AppLayout {...params} {...props}>
    <Explore tab='featured' project={params.project} {...props} {...params} />
  </AppLayout>,
  '*': (params, props) => <AppLayout {...params} {...props}>
    <Explore tab='featured' {...props} />
  </AppLayout>
})

export default component({
  render ({props, context}) {
    return (
      router(context.url, props)
    )
  }
})
