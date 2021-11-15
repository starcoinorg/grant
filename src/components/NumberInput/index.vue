<template>
  <div>
    <el-input ref="input" v-model="val" class="number-input" :placeholder="placeholder">
      <template #suffix>
        <slot name="suffix" />
      </template>
    </el-input>
  </div>
</template>

<script>
import { formatNumber } from '@/utils'
export default {
  name: 'NumberInput',
  props: {
    precision: {
      type: Number,
      default: 2
    },
    placeholder: {
      type: String,
      default: null
    },
    max: {
      type: Number,
      default: 0
    },
    count: {
      type: [String, Number],
      default: null
    }
  },
  emits: ['change'],
  data() {
    return {
      val: null
    }
  },
  computed: {
    input() {
      return this.$refs.input
    }
  },
  watch: {
    count() {
      if (this.val !== this.count) this.val = this.count
    },
    val() {
      if (this.max && this.val > this.max) {
        this.val = this.max
      } else {
        this.val = formatNumber(this.val, this.precision)
      }
      this.$emit('change', this.val)
    }
  },
  mounted() {
    this.val = this.count
  }
}
</script>
