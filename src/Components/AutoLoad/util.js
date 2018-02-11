export const createAsyncTaskQueue = () => {
  let queueTail = Promise.resolve('QUEUE_HEAD')
  const pushTask = (asyncTask, stillRunWhenError = true) => {

    let currentTask = queueTail.then(asyncTask)
    // 如果发生错误依然继续 task 链
    if (stillRunWhenError) {
      queueTail = currentTask.catch(console.log)
    } else {
      // 拦截队伍中存在的 error,但不影响队伍继续
      queueTail = currentTask
    }

    return queueTail
  }
  const clearQueue = () => {
    queueTail = Promise.resolve('QUEUE_HEAD')
  }
  return { pushTask, clearQueue }
}

// 图片加载失败后继续 resolve
export const loadImageAsync = (image, src) => {
  return new Promise((resolve, reject) => {
    image.src = src
    image.onload = () => {
      resolve()
    }
    image.onerror = () => reject('image load false')
  })
}
