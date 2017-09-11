/**
 * Imports
 */

import test from 'tape'
import colorDistance from '.'

/**
 * <Color Distance/> tests
 */


test('<colorDistance/> should work', t => {
  t.plan(1)
  t.equal(colorDistance('#fff', '#f5f5f5') < colorDistance('#ffffff', '#000'), true)
})
