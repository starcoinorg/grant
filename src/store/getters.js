const getters = {
  loading: (state) => state.app.loading,
  locale: (state) => state.app.locale,
  elLocale: (state) => state.app.elLocale,
  starcoinProvider: (state) => state.app.starcoinProvider,
  token: (state) => state.app.token,
  tokenExpired: (state) => state.app.tokenExpired,
  account: (state) => state.app.account
}
export default getters
