/** @jsx element */

import element from 'vdux/element'
import {Block, Flex, Grid, Text} from 'vdux-ui'
import {Card} from 'vdux-containers'
import {setUrl} from 'redux-effects-location'
import animalDescriptions from '../animalApis/animalDescriptions'
import {endRunMessage} from '../actions'
import reduce from '@f/reduce'
import {firebaseSet} from 'vdux-fire'

function render ({props}) {
  const {gameID, title, handleSave = setAnimal} = props

  return (
    <Flex relative m='0 auto' column align='center center' minHeight='100%' w='96%'>
      <Block absolute top='1em'>
        <Text color='#666' fs='l'>{title}</Text>
      </Block>
      <Grid itemsPerRow='3' tall mt='3em' columnAlign='start center'>
        {reduce(makeCard, [], animalDescriptions)}
      </Grid>
    </Flex>
  )

  function makeCard (cur, next, key) {
    return [
      ...cur,
      (<Card
        bgColor='secondary'
        hoverProps={{highlight: true}}
        cursor='pointer'
        onClick={() => handleSave(key)}
        sq='300px'
        m='20px'
        color='white'>
        <Block p='20px' column align='center center'>
          <Block
            sq='100px'
            boxShadow='0 0 5px 2px rgba(0,0,0,0.2)'
            backgroundPosition='50%'
            backgroundSize='cover'
            backgroundImage={`url(${next.image})`}/>
          <Text mt='20px' fontWeight='800' fs='l'>{key}</Text>
          <Block mt='10px'>
            {next.description}
          </Block>
        </Block>
      </Card>)
    ]
  }

  function * setAnimal (animal) {
    try {
      yield firebaseSet({
        method: 'set',
        value: buildAnimal(animal),
        ref: `/games/${gameID}`
      })
      yield setUrl(`/${gameID}/create/options`)
    } catch (e) {
      yield endRunMessage({header: 'Error', body: e.message})
    }
  }
}

function buildAnimal (animal) {
  return {
    animals: {
      0: {
        type: animal,
        sequence: [],
        initial: {
          location: [0, 0],
          dir: 0,
          rot: 0
        },
        current: {
          location: [0, 0],
          dir: 0,
          rot: 0
        }
      }
    }
  }
}

export default {
  render
}
