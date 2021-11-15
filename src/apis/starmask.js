import { ElMessage } from 'element-plus'
import store from '@/store'

function baseRequest(method, params) {
  if (window.starcoin) {
    store.dispatch('app/toggleLoading', 1)
    return window.starcoin
      .request({ method, params })
      .then((res) => {
        return res
      })
      .catch((err) => {
        ElMessage.error({
          showClose: true,
          message: err.message
        })
        return Promise.reject(err)
      })
      .finally(() => {
        store.dispatch('app/toggleLoading', -1)
      })
  } else {
    return Promise.reject(new Error('starmask dose not exsit'))
  }
}

function getProvider() {
  return store.getters.starcoinProvider
}

export function getAccounts() {
  return baseRequest('stc_accounts')
}

export function requestAccounts() {
  return baseRequest('stc_requestAccounts')
}

export function getPermissions() {
  return baseRequest('wallet_getPermissions')
}

export function requestPermissions() {
  return baseRequest('wallet_requestPermissions', [{ stc_accounts: {} }])
}

export function personalSign(account, msg) {
  const message = `0x${Buffer.from(msg, 'utf8').toString('hex')}`
  return baseRequest('personal_sign', [message, account])
}

export function chainInfo() {
  return baseRequest('chain.info')
}

// 获取余额
export function getBalance(account) {
  return getProvider().getBalance(account)
}
