import router from './router'
import store from './store/index'

router.beforeEach(async (to, from, next) => {
  store.dispatch('app/refresh')
  next()
})
