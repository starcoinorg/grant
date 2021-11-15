import { ElMessageBox, ElMessage, ElLoading } from 'element-plus'
import LocalStorage from '@/utils/persistent-storage'
import { LOCALE, DICT, TOKEN, TOKEN_EXPIRED, ACCOUNT, CONFIG } from '@/utils/constant'
import { getAccounts, personalSign, requestPermissions } from '@/apis/starmask'
import { getTime, getToken, refreshToken } from '@/apis/index'
import I18n from '@/i18n'
import { providers } from '@starcoin/starcoin'
import StarMaskOnboarding from '@starcoin/starmask-onboarding'
import { getDicts, getConfig } from '@/apis'
import zh from 'element-plus/lib/locale/lang/zh-cn'
import en from 'element-plus/lib/locale/lang/en'

const { isStarMaskInstalled } = StarMaskOnboarding

const elLanguages = { zh, en }

const state = {
  loading: 0,
  locale: null,
  elLocale: null,
  starMaskOnboarding: new StarMaskOnboarding(),
  starcoinProvider: null,
  token: LocalStorage.get(TOKEN),
  tokenExpired: LocalStorage.get(TOKEN_EXPIRED, 0),
  account: LocalStorage.get(ACCOUNT),
  config: null
}

const mutations = {
  SET_STARCOIN_PROVIDER(state, provider) {
    state.starcoinProvider = provider
  },

  SET_LOCALE(state, locale) {
    state.locale = locale
    state.elLocale = elLanguages[locale]
    I18n.global.locale = locale
    LocalStorage.set(LOCALE, locale)
  },

  SET_TOKEN(state, { token, tokenExpired }) {
    state.token = token
    state.tokenExpired = tokenExpired ?? Math.floor(Date.now() / 1000)
    LocalStorage.set(TOKEN, token)
    LocalStorage.set(TOKEN_EXPIRED, tokenExpired)
  },

  SET_ACCOUNT(state, account) {
    state.account = account
    LocalStorage.set(ACCOUNT, account)
  },

  SET_DICTS(state, dicts) {
    state.dicts = dicts
    LocalStorage.set(DICT, dicts)
  },

  SET_CONFIG(state, config) {
    state.config = config
    LocalStorage.set(CONFIG, config)
  },

  TOGGLE_LOADING(state, count) {
    state.loading = count >= 0 ? count : 0
    if (state.loading > 0 && !state.loadingInstance) {
      state.loadingInstance = ElLoading.service({
        lock: true,
        background: 'rgba(255, 255, 255, 0.6)'
      })
    }
    if (state.loading === 0 && state.loadingInstance) {
      state.loadingInstance.close()
      state.loadingInstance = null
    }
  }
}

const actions = {
  async init({ commit, dispatch, state }) {
    const broswerLocale = (navigator.language || navigator.userLanguage).substring(0, 2)
    const locale = LocalStorage.get(LOCALE, broswerLocale) ?? 'zh'
    const now = Date.now() / 1000
    commit('SET_LOCALE', locale)
    await dispatch('setStarcoinProvider')
    // 处理用户token
    if (now < state.tokenExpired) {
      // 刷新token
      await dispatch('refresh')
    } else {
      await dispatch('signOut')
    }
    // 更新字典
    await dispatch('setDicts')
    // 更新配置参数
    await dispatch('setConfig')
  },

  setStarcoinProvider({ commit, state }) {
    let provider = null
    if (window.starcoin && !state.starcoinProvider) {
      provider = new providers.Web3Provider(window.starcoin, 'any')
      commit('SET_STARCOIN_PROVIDER', provider)
    }
  },

  setToken({ commit }, token) {
    commit('SET_TOKEN', token)
  },

  setAccount({ commit }, account) {
    commit('SET_ACCOUNT', account)
  },

  setLocale({ commit }, locale) {
    commit('SET_LOCALE', locale)
  },

  async setDicts({ commit }) {
    const dicts = await getDicts()
    commit('SET_DICTS', dicts)
  },

  toggleLoading({ commit }, count) {
    const loadingCount = state.loading
    commit('TOGGLE_LOADING', loadingCount + count)
  },

  addCachedViews({ commit }, view) {
    commit('ADD_CACHED_VIEWS', view)
  },

  removeCachedViews({ commit }, view) {
    commit('REMOVE_CACHED_VIEWS', view)
  },

  async setConfig({ commit }) {
    const conf = await getConfig()
    commit('SET_CONFIG', conf)
  },
  // *************** logic ****************
  /**
   * 连接starmask
   */
  connect({ dispatch }) {
    if (isStarMaskInstalled()) {
      // 已安装，调用授权登录
      return dispatch('signIn')
    } else {
      // 未安装，弹出下载窗口
      return dispatch('donwloadStarmask')
    }
  },

  /**
   * 授权登录
   */
  async signIn({ commit, dispatch }) {
    if (state.config.chain_id.toString() === window.starcoin.networkVersion.toString()) {
      await requestPermissions()
      const accounts = await getAccounts()
      const time = await getTime()
      const signature = await personalSign(accounts[0], time.toString())
      const { account_addr, token, expire } = await getToken(signature)
      commit('SET_ACCOUNT', account_addr)
      commit('SET_TOKEN', { token, tokenExpired: expire })
      await dispatch('setStarcoinProvider')
    } else {
      ElMessage.warning({
        showClose: true,
        message: I18n.global.tm('message.unsupportNode')
      })
    }
  },

  /**
   * 登出
   */
  signOut({ commit }) {
    commit('SET_ACCOUNT')
    commit('SET_TOKEN', {})
    commit('SET_STARCOIN_PROVIDER', null)
  },

  /**
   * starmask 下载弹窗
   */
  donwloadStarmask() {
    const title = I18n.global.tm('common.tips')
    const message = I18n.global.tm('message.starmaskNotInstalled')
    const confirm = I18n.global.tm('common.download')
    const cancel = I18n.global.tm('common.cancel')
    ElMessageBox.confirm(message, title, {
      confirmButtonText: confirm,
      cancelButtonText: cancel,
      type: 'warning'
    }).then(() => {
      state.starMaskOnboarding.startOnboarding()
    })
  },

  /**
   * 刷新token
   */
  async refresh({ commit, state }) {
    const { account, token } = state
    if (account && token) {
      const { token, expire } = await refreshToken()
      commit('SET_TOKEN', { token, tokenExpired: expire })
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
