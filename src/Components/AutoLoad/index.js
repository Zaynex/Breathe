import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { createAsyncTaskQueue, loadImageAsync } from './util'

const { pushTask } = createAsyncTaskQueue()

export default class AutoLoad extends PureComponent {

  componentDidMount () {
    const taskPromise = pushTask(async () => {
      const { src } = this.props
      await loadImageAsync(this.imageRef, src)
    })
  }

  getElementRef = ref => this.imageRef = ref
  render () {
    const { src, ...others } = this.props
    return <img ref={this.getElementRef} {...others} />
  }
}
AutoLoad.propTypes = {
  src: PropTypes.string
}
