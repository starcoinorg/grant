<template>
  <el-scrollbar class="layout" ref="scrollbar">
    <ext-header class="header" />
    <router-view :style="`min-height: ${minHeight}`" class="container" v-slot="{ Component }" @scrollTo="handleScrollTo">
      <transition name="fade" mode="out-in">
        <component ref="container" :is="Component" />
      </transition>
    </router-view>
    <ext-footer />
  </el-scrollbar>
</template>

<script>
import { onMounted, ref } from 'vue'
import ExtHeader from './Header.vue'
import ExtFooter from './Footer.vue'
import { containerHeight } from '@/utils'
export default {
  name: 'Layout',
  components: {
    ExtHeader,
    ExtFooter
  },
  setup() {
    const scrollbar = ref(null)
    const minHeight = ref('0px')

    onMounted(() => {
      minHeight.value = containerHeight() + 'px'
    })

    function handleScrollTo(top) {
      scrollbar.value.setScrollTop(top)
    }

    return {
      scrollbar,
      minHeight,
      handleScrollTo
    }
  }
}
</script>

<style lang="scss" scoped>
.layout {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.header {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 10;
  height: 80px;
  box-shadow: 0 1px 1px 0 rgba(126, 143, 177, 0.16);
}
.container {
  margin-top: 80px;
}
</style>
