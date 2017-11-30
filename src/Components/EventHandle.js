import React, { PureComponent } from 'react'

// function currying
// 本质上是这个函数返回一个接受参数的函数，而不是直接返回执行结果
export class EventHandle extends PureComponent {
  constructor (props) {
    super(props)
  }

  handleClick = (param) => (e) => {
    console.log(`param`, param, `e`, e)
  }

  render () {
    return <div
      onClick={this.handleClick('i need some param')}>
      EventHandle Component
    </div>
  }
}
