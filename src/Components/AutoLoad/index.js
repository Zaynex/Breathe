import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { createAsyncTaskQueue } from './util'

const { pushTask, getTaskQueueSize } = createAsyncTaskQueue()

export default class AutoLoad extends PureComponent {

  componentDidMount () {
    const taskPromise = pushTask(async () => {
      const { src } = this.props
      await loadImageAsync(this.imageRef, src)
      console.log('getTaskQueueSize', getTaskQueueSize())
    })
  }
  getElementRef = ref => this.imageRef = ref
  render () {
    return <img alt="" ref={this.getElementRef} />
  }
}
AutoLoad.propTypes = {
  src: PropTypes.string,
}

const loadImageAsync = (image, src) => {
  return new Promise((resolve) => {
    image.src = src
    image.onload = () => {
      resolve()
    }
    image.onerror = resolve
  })
}