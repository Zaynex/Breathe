
const __DEV__ = process.env.NODE_ENV === 'development'

const MUTE_ERROR = (error) => { __DEV__ && console.error(error) }

const createInsideOutPromise = () => {
  let promiseResolve, promiseReject
  return {
    promise: new Promise((resolve, reject) => {
      promiseResolve = resolve
      promiseReject = reject
    }),
    resolve: (value) => {
      if (promiseResolve === undefined) return
      const resolve = promiseResolve
      promiseResolve = promiseReject = undefined
      return resolve(value)
    },
    reject: (error) => {
      if (promiseReject === undefined) return
      const reject = promiseReject
      promiseResolve = promiseReject = undefined
      return reject(error)
    }
  }
}

const createQueueStatus = (size = 0, isValid = true) => ({
  getSize: () => size,
  increaseSize: () => ++size,
  decreaseSize: () => --size,
  getIsValid: () => isValid,
  invalid: () => (isValid = false)
})

const createAsyncTaskQueue = (onQueueError = MUTE_ERROR) => {
  let queueStatus, queueTail
  const resetTaskQueue = () => {
    queueStatus && queueStatus.invalid()
    queueStatus = createQueueStatus()
    queueTail = Promise.resolve('QUEUE_HEAD')
  }
  const getTaskQueueSize = () => queueStatus.getSize()
  const pushTask = (asyncTask) => { // task is async function
    const { promise, resolve } = createInsideOutPromise()
    const taskPromise = queueTail.then(asyncTask)
    taskPromise
      .catch(onQueueError) // should not re-throw error for the queue to keep running
      .then(() => {
        queueStatus.decreaseSize()
        queueStatus.getIsValid() && resolve()
      }) // the promise chain is not chained up directly
    queueStatus.increaseSize()
    queueTail = promise
    return taskPromise
  }
  resetTaskQueue()
  return { resetTaskQueue, getTaskQueueSize, pushTask }
}

export { createAsyncTaskQueue }