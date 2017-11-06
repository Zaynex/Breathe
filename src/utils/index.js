const createInsideOutPromise = () => {
  let promiseResolve = null
  let promiseReject = null
  const promise = new Promise((resolve, reject) => {
    promiseResolve = resolve
    promiseReject = reject
  })
  return {
    promise,
    resolve: (...args) => {
      promiseResolve && promiseResolve(...args)
      promiseResolve = null
      promiseReject = null
    },
    reject: (...args) => {
      promiseReject && promiseReject(...args)
      promiseResolve = null
      promiseReject = null
    }
  }
}

const createAsyncTaskQueue = (onQueueError = () => { }) => {
  let taskSet, taskQueueTail
  const resetTaskQueue = () => {
    taskSet = new Set()
    taskQueueTail = Promise.resolve('QUEUE_HEAD')
  }
  const pushTask = (task) => { // task is async function
    const { promise, resolve, reject } = createInsideOutPromise()
    taskQueueTail = taskQueueTail.then(() => Promise.resolve(task())
      .then(resolve, reject)
      .catch(onQueueError) // mute error
      .then(() => taskSet.delete(task))
    )
    taskSet.add(task)
    return promise
  }
  const getTaskQueueSize = () => taskSet.size
  resetTaskQueue()
  return { resetTaskQueue, pushTask, getTaskQueueSize }
}

export {
  createInsideOutPromise,
  createAsyncTaskQueue
}
