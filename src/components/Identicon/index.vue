<template>
  <div ref="root" class="identicon" :style="`width: ${size}px; height: ${size}px`"></div>
</template>

<script>
import jazzicon from '@metamask/jazzicon'
export default {
  name: 'Identicon',
  props: {
    address: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      default: 32
    }
  },
  computed: {
    root() {
      return this.$refs.root
    }
  },
  watch: {
    address() {
      this.$_drawIcon()
    }
  },
  mounted() {
    this.$_drawIcon()
  },
  methods: {
    $_drawIcon() {
      const diameter = this.root.offsetWidth
      const icon = jazzicon(diameter, this.$_addressToNumber())
      this.root.innerHTML = null
      this.root.appendChild(icon)
    },
    $_addressToNumber() {
      const addr = this.address.slice(2, 10)
      const num = parseInt(addr, 16)
      return num
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.identicon {
  box-sizing: border-box;
  border-radius: 16px;
}
</style>
