import axios from 'axios'
import { ElMessage } from 'element-plus'
import { isUndefined } from 'lodash'
import store from '@/store'
import i18n from '@/i18n'

const CancelToken = axios.CancelToken

// message duration
const duration = 5 * 1000

const setLoading = (config, count, force) => {
  if (force || config.loading) {
    store.dispatch('app/toggleLoading', count)
  }
}

const showMessage = (config, message, type = 'success') => {
  if ((config.showSuccess && type === 'success') || (config.showError && type === 'error')) {
    ElMessage({
      showClose: true,
      duration,
      type,
      message: config.message ?? message
    })
  }
}

// 同一时间仅存在一次有效请求的地址白名单配置
const singleRequestUrls = []

const cancels = []

const checkCancel = (url) => {
  const cancelObj = cancels.filter((t) => !t.process).find((t) => t.url === url)
  if (cancelObj) {
    cancelObj.process = true
    cancelObj.cancel({ cancel: true, obj: cancelObj })
  }
}

const clearCancel = (timeToken) => {
  if (timeToken) {
    const inx = cancels.find((t) => t.timeToken === timeToken)
    cancels.splice(inx, 1)
  }
}

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000, // request timeout
  // 是否显示成功消息，默认为post请求展示
  showSuccess: undefined,
  // 自定义成功消息
  successMessage: null,
  // 是否显示失败消息，默认为所有请求展示
  showError: true,
  // 自定义失败消息
  errorMessage: null,
  // show loading when loading is true
  loading: true,
  loadingTarget: document.body
})

service.interceptors.request.use(
  (config) => {
    checkCancel(config.url)
    const { token, adminToken } = store.getters
    config.headers['Authorization'] = token
    config.headers['AdminToken'] = adminToken
    if (isUndefined(config.showSuccess)) {
      config.showSuccess = config.method.toLowerCase() === 'post'
    }
    if (singleRequestUrls.includes(config.url)) {
      config.cancelToken = new CancelToken((cancel) => {
        const timeToken = Date.now()
        config.timeToken = timeToken
        cancels.push({ cancel, timeToken, url: config.url })
      })
    }

    setLoading(config, 1)
    return config
  },
  (error) => {
    setLoading(error.config, -1)
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  ({ config, data }) => {
    clearCancel(config.timeToken)
    setLoading(config, -1)
    const _messageKey = `common.code.${data.code}`
    const _message = i18n.global.tm(_messageKey)
    if (data.code === 0) {
      showMessage(config, config.successMessage ?? _message)
      return data.data
    } else {
      showMessage(config, config.errorMessage ?? _message, 'error')
      if (data.code === 2) {
        store.dispatch('app/signOut')
      }
      return Promise.reject(new Error(data.message || 'Error'))
    }
  },
  (error) => {
    const { message, response, config } = error
    if (message.cancel) {
      cancels.splice(
        cancels.findIndex((t) => t === message.obj),
        1
      )
      setLoading(config, -1, true)
    } else {
      setLoading(config, -1)
      showMessage(config, response?.data?.message ?? message, 'error')
    }

    return Promise.reject(error)
  }
)

export default service
