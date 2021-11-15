<template>
  <el-config-provider :locale="elLocale">
    <layout />
  </el-config-provider>
</template>

<script>
import Layout from '@/components/Layout'
import { mapGetters } from 'vuex'
export default {
  name: 'App',
  components: { Layout },
  computed: {
    ...mapGetters(['elLocale'])
  },
  created() {}
}
</script>
