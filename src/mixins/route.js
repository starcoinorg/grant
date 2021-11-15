import store from '@/store'

export default {
  methods: {
    handleRoute(name, replace = false, params = {}) {
      if (!store.getters.isLock) {
        if (this.$route.name !== name) {
          if (replace) {
            this.$router.replace({ name, params })
          } else {
            this.$router.push({ name, params })
          }
        }
      }
    }
  }
}
