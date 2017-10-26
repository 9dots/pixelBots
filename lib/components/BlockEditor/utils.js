/**
 * Imports
 */

import objEqual from '@f/deep-equal'
import unique from '@f/unique'
import range from '@f/range'

const INIT = 'INITIALIZE_BLOCK_EDITOR'

/**
 * Exports
 */

export {
  expandSelectedLoops,
  computeIndentation,
  getVariableScopes,
  setBlockPayload,
  surroundBlocks,
  insertBlocks,
  stateHistory,
  removeBlocks,
  selIndices,
  getUserFns,
  mapArgs,
  genId
}

/**
 * Helper functions
 */

let count = 0

/**
 * 'generate block id'
 * @return {number} a unique block identifier
 */
function genId () {
  return `${Date.now()}.${count++}`
}

/**
 * set payload for a specific block
 * @param {Array}  [selected=[]] selected blocks
 * @param {Array}  [sequence=[]] all blocks
 * @param {Object} block         the block to update
 * @param {Object} payload       the update payload
 */
function setBlockPayload ({ selected = [], sequence = [] }, block, payload) {
  const newBlock = { ...block, payload }

  return {
    sequence: sequence.map(b => (b.id === block.id ? newBlock : b)),
    selected: selected.map(b => (b.id === block.id ? newBlock : b))
  }
}

/**
 * insert a block into the sequence
 * @param  {Array}  [sequence=[]] The code sequence
 * @param  {Object|Array} blocks  The block or array of blocks to add
 * @param  {Number} idx           The index to insert the blocks at
 * @return {Array}                The updated sequence
 */
function insertBlocks (sequence = [], blocks, idx) {
  sequence = sequence.slice()
  sequence.splice(
    idx,
    0,
    ...[]
      .concat(blocks)
      .filter(Boolean)
      .map(b => ({ ...b }))
  )
  return sequence
}

/**
 * wrap blocks in a surrounding block
 * @param  {Array} sequence  The code sequence
 * @param  {Array} selected  The currently selected blocks
 * @param  {Object} block    The outer block to wrap the selection in
 * @return {Array}           The updated sequence
 */
function surroundBlocks (sequence, selected, block) {
  selected = expandSelectedLoops(sequence, selected)

  const idxs = selIndices(sequence, selected)
  let start = idxs[0]
  let inserted = 0
  sequence = sequence.slice()

  for (let i = 1; i < idxs.length; i++) {
    if (idxs[i] > idxs[i - 1] + 1) {
      sequence.splice(start + inserted++, 0, { ...block })
      sequence.splice(idxs[i - 1] + 1 + inserted++, 0, {
        type: 'block_end',
        parentType: block.type,
        id: genId()
      })
      start = idxs[i]
    }
  }

  sequence.splice(start + inserted++, 0, { ...block })
  sequence.splice(idxs[idxs.length - 1] + 1 + inserted++, 0, {
    type: 'block_end',
    parentType: block.type,
    id: genId()
  })

  return sequence
}

function selIndices (sequence, selected) {
  return selected.map(b => sequence.indexOf(b)).sort(cmp)
}

function cmp (a, b) {
  return a === b ? 0 : a < b ? -1 : 1
}

/**
 * stateHistory middleware - keep track of the undo listen
 */
function stateHistory ({ actions, dispatch, getState }) {
  let reenters = 0

  return next => action => {
    const prevState = getState()
    reenters++
    const result = next(action)
    const enters = reenters
    reenters--
    const nextState = getState()

    if (
      action.type !== 'undo' &&
      action.type !== 'addCapability' &&
      action.type !== 'removeCapability' &&
      prevState.sequence !== nextState.sequence &&
      enters === 1
    ) {
      dispatch(actions.saveEditorState(prevState))
    }

    return result
  }
}

function mapArgs (args, palette) {
  return args.map(
    arg =>
      arg.type === 'string'
        ? {
          ...arg,
          name: 'color',
          default: {
            type: 'string',
            value: 'black'
          },
          values: palette
        }
        : { ...arg, default: 1, values: range(1, 10) }
  )
}

function getUserFns ({ actions, dispatch, getState }) {
  return next => action => {
    const oldFns = getFns(getState().sequence)
    const result = next(action)
    const fns = getFns(getState().sequence)
    if (action.type === 'setDocs') {
      const docs = getState().docs || {}
      const fnNames = fns.map(fn => ({
        ...fn,
        name: fn.payload ? fn.payload[0] : ''
      }))
      const toAdd = fnNames.filter(fn => !docs[fn.name]).map(fn =>
        actions.addCapability(fn.payload[0], {
          type: 'functions',
          args: mapArgs(fn.payload.slice(1), getState().palette)
        })
      )
      dispatch(toAdd)
    }
    if (!objEqual(oldFns, fns) || action.type === INIT) {
      const newFns = fns.filter(
        fn => oldFns.every(f => f.payload[0] !== fn.payload[0]) && fn.payload
      )
      const removedFns = oldFns.filter(
        fn => fns.every(f => f.payload[0] !== fn.payload[0]) && fn.payload
      )
      const toAdd = newFns.map(fn =>
        actions.addCapability(fn.payload[0], {
          type: 'functions',
          args: mapArgs(fn.payload.slice(1), getState().palette)
        })
      )
      const toRemove = removedFns.map(fn =>
        actions.removeCapability(fn.payload[0])
      )
      dispatch(toAdd)
      dispatch(toRemove)
    }
    return result
  }

  function getFns (sequence) {
    return sequence.filter(block => block.type === 'userFn')
  }
}

/**
 * getVariableScopes middleware - keep a map of all scope variables
 */
function getVariableScopes ({ actions, dispatch, getState }) {
  return next => action => {
    const prevSequence = getState().sequence
    const result = next(action)
    const { sequence } = getState()
    if (prevSequence !== sequence || action.type === INIT) {
      dispatch(actions.setParameterScopes(sequenceToScopeVars(sequence)))
    }
    return result
  }

  /**
   * create a map of lineNumbers to scope variables from the sequence
   * @param  {Array} sequence  code sequence
   * @return {Object}          map of scope variables in the form
   *                               {[lineNum]: vars}
   */
  function sequenceToScopeVars (sequence) {
    return sequence
      .map((block, lineNum) => ({ ...block, lineNum }))
      .filter(
        block =>
          block.type === 'userFn' ||
          (block.type === 'block_end' && block.parentType === 'userFn')
      )
      .reduce(groupMatches, [])
      .reduce((acc, match) => {
        const args = (match[0].payload || []).slice(1)
        if (args.length) {
          const startLine = match[0].lineNum
          const endLine = match[1].lineNum
          const vals = range(startLine, endLine).reduce(
            (lineObj, num) => ({
              ...lineObj,
              [num]: args
            }),
            {}
          )
          return mergeObject(acc, vals)
        }
        return acc
      }, {})
  }

  /**
   * merge two objects that include all keys and concat shared keys
   * @param  {Object} a first object
   * @param  {Object} b second object
   * @return {Object}   merged object
   */
  function mergeObject (a, b) {
    const obj = Object.keys(a)
      .filter(key => b[key])
      .reduce((acc, key) => ({ ...acc, [key]: a[key].concat(b[key]) }), {})
    const leftOvers = Object.keys(b)
      .filter(key => !a[key])
      .reduce((acc, key) => ({ ...acc, [key]: b[key] }), {})

    return {
      ...a,
      ...obj,
      ...leftOvers
    }
  }

  /**
   * group userFns with matching block ends
   * @return {Array}       grouped blocks
   */
  function groupMatches (acc, block) {
    if (block.type === 'userFn') {
      return acc.concat(block)
    } else {
      const match = acc.slice().pop()
      return [[match, block], ...acc].slice(0, -1)
    }
  }
}

/**
 * expandSelectedLoops
 *
 * Expand the selection to include the entirety of any loops
 * that have been selected
 */

function expandSelectedLoops (sequence, selected) {
  return unique(
    selected.reduce((acc, block) => {
      if (block.block) {
        const idx = sequence.indexOf(block)
        const loop = [block]
        let level = 0

        for (let i = idx + 1; i < sequence.length; i++) {
          const item = sequence[i]
          loop.push(item)

          if (item.block) {
            level++
          } else if (item.type === 'block_end') {
            if (level === 0) {
              break
            } else {
              level--
            }
          }
        }

        return acc.concat(unique(loop))
      }

      return acc.concat(block)
    }, [])
  )
}

/**
 * remove blocks from the sequence
 * @param  {Array}  sequence  the code sequence
 * @param  {Object} block     the block to remove from the sequence
 * @return {Array}            the new code sequence
 */
function removeBlocks (sequence, block) {
  if (Array.isArray(block)) {
    return block.reduce(removeBlocks, sequence)
  }

  if (block.block) {
    const idx = sequence.indexOf(block)
    let endBlock
    let level = 0

    for (let i = idx + 1; i < sequence.length; i++) {
      const item = sequence[i]
      if (item.block) level++
      if (item.type === 'block_end') {
        if (level === 0) {
          endBlock = item
          break
        }

        level--
      }
    }

    if (endBlock) {
      sequence = removeBlocks(sequence, endBlock)
    }
  }

  return sequence.filter(b => b !== block)
}

/**
 * compute the indentation of the sequence
 * @param  {Array}  [sequence=[]] the code sequence
 * @return {Array}                the updated code sequence
 */
function computeIndentation (sequence = []) {
  let level = 0
  return (sequence || []).reduce((acc, block) => {
    if (block.type === 'block_end') {
      level--
    }

    acc.push(level)

    if (block.block) {
      level++
    }

    return acc
  }, [])
}
