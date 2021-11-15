<template>
  <div class="home">
    <div class="banner">
      <div class="title">{{ $tm('home.mainTitle') }}</div>
      <div class="subtitle">{{ $tm('home.subTitle') }}</div>
      <button class="toFaq" @click="handleRoute('faq')">{{ $tm('home.toFaq') }}</button>
    </div>
    <div class="tabs">
      <span :class="{ active: code === 3001 }" @click="handleTab(3001)">{{ $tm('dictionary.3001') }}</span>
      <span :class="{ active: code === 3002 }" @click="handleTab(3002)">{{ $tm('dictionary.3002') }}</span>
      <span :class="{ active: code === 3003 }" @click="handleTab(3003)">{{ $tm('dictionary.3003') }}</span>
    </div>
    <div class="grants">
      <grant-card class="items" v-for="(grant, inx) in grants" :key="inx" :data="grant" />
    </div>
    <div v-if="hasMore" class="buttons">
      <button class="load" @click="handleLoad(false)">{{ $tm('common.loadMore') }}</button>
    </div>
  </div>
</template>

<script>
import route from '@/mixins/route'
import { ref, onBeforeMount, onMounted, nextTick } from 'vue'
import { getGrants } from '@/apis'
import GrantCard from '@/components/GrantCard'
export default {
  mixins: [route],
  components: {
    GrantCard
  },
  emits: ['scrollTo'],
  setup(props, { emit }) {
    const code = ref(3001)
    const hasMore = ref(true)
    const grants = ref([])
    let pageSize = 20
    let pageNum = 1
    let pageMax = 1
    let total = 0

    function handleTab(_code) {
      if (code.value !== _code) {
        code.value = _code
      }
      handleLoad(true)
    }

    async function handleLoad(clean) {
      if (clean) pageNum = 1
      else pageNum++
      const { total_count, list } = await getGrants(pageSize, pageNum, code.value)
      if (clean) grants.value = []
      if (total_count > 0) total = total_count
      pageMax = Math.ceil(total / pageSize)
      nextTick(() => {
        grants.value.push(...list)
      })
      hasMore.value = pageNum < pageMax
    }

    onBeforeMount(() => {
      handleLoad(true)
    })

    onMounted(() => {
      emit('scrollTo', 0)
    })

    return {
      code,
      hasMore,
      grants,
      handleTab,
      handleLoad
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.home {
  background-color: $bg-2-color;
  .banner {
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 615px;
    background-image: url('~@/assets/banner.png');
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: cover;
    .title {
      font-size: 56px;
      font-weight: bold;
    }
    .subtitle {
      margin-top: 24px;
      color: $normal-font;
    }
    .toFaq {
      padding: 12px 56px;
      margin-top: 48px;
      font-size: 18px;
      font-weight: $font-medium;
      color: $primary-font;
      cursor: pointer;
      background-color: transparent;
      border: 2px solid $primary-font;
      border-radius: 32px;
      transition: background-color 0.2s;
      &:hover {
        background-color: rgba(255, 255, 255, 0.151);
      }
    }
  }
  .tabs {
    display: flex;
    justify-content: center;
    span {
      display: inline-block;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 176px;
      height: 64px;
      margin-top: 88px;
      margin-bottom: 72px;
      font-size: 14px;
      color: $primary-font;
      cursor: pointer;
      background-color: $bg-5-color;
      transition: all 0.2s;
      &:hover {
        color: $light-blue;
      }
      &:nth-child(1) {
        border-radius: 8px 0 0 8px;
      }
      &:nth-child(2) {
        border-right: 1px solid #313131;
        border-left: 1px solid #313131;
      }
      &:nth-child(3) {
        border-radius: 0 8px 8px 0;
      }
    }
    .active {
      background-color: $blue;
      &:hover {
        color: $primary-font;
      }
    }
  }
  .grants {
    display: grid;
    grid-template-columns: repeat(4, 276px);
    grid-gap: 32px;
    width: 1200px;
    padding-bottom: 64px;
    margin: 0 auto;
  }
  .buttons {
    padding-bottom: 128px;
    text-align: center;
    .load {
      width: 158px;
      height: 35px;
      margin: 0 auto;
      color: #a9abb8;
      cursor: pointer;
      background-color: transparent;
      border: 1px solid #a9abb8;
      border-radius: 88px;
      transition: all 0.2s;
      &:hover {
        color: white;
        background-color: rgba(255, 255, 255, 0.171);
        border-color: white;
      }
    }
  }
}
</style>
