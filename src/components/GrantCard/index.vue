<template>
  <div class="grant-card" @click="handleVote">
    <span class="title">{{ title }}</span>
    <span class="desc">{{ shortDesc }}</span>
    <span class="amount-title mt12">{{ $tm('common.applied') }}</span>
    <div class="amount">
      <icon width="30" height="24" data="@icon/stc.svg" original />
      <span>{{ amount }}</span>
    </div>
    <div class="status blue">
      {{ $tm(`common.detail`) }}
    </div>
  </div>
</template>

<script>
import { ref, toRefs } from 'vue'
import { numberFormatter, toThousandFilter, formatPrice } from '@/utils'
import router from '@/router'
import route from '@/mixins/route'
export default {
  name: 'GrantCard',
  mixins: [route],
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const shortDesc = ref(props.data.desc)
    // eslint-disable-next-line no-useless-escape
    const regMd = /[\\\`\*\_\[\]\#\+\-\!]/g
    const regHtml = /<[^>]+>/g
    shortDesc.value = shortDesc.value.replace(regMd, '').replace(regHtml, '')

    function handleVote() {
      router.push('/vote?gid=' + props.data.gid)
    }

    return {
      ...toRefs(props.data),
      shortDesc,
      amount: toThousandFilter(formatPrice(props.data.amount)),
      approvalCount: numberFormatter(props.data.support_count, 2),
      againstCount: numberFormatter(props.data.negative_count, 2),
      handleVote
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.grant-card {
  display: flex;
  flex-flow: column;
  padding: 24px;
  cursor: pointer;
  background-color: $bg-5-color;
  border-radius: 8px;
  transition: all 0.2s;
  &:hover {
    box-shadow: 0 3px 8px 0 rgba(126, 143, 177, 0.16);
  }
  .title {
    display: -webkit-box;
    height: 56px;
    overflow: hidden;
    font-weight: bold;
    line-height: 28px;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .desc {
    display: -webkit-box;
    height: 72px;
    margin-top: 12px;
    overflow: hidden;
    font-size: 14px;
    line-height: 24px;
    color: #a9abb8;
    text-overflow: ellipsis;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  .amount-title {
    font-size: 14px;
    color: #a9abb8;
  }
  .amount {
    display: flex;
    align-items: center;
    margin-top: 10px;
    font-weight: bold;
    span {
      margin-left: 8px;
    }
  }
  .count {
    display: flex;
    margin-top: 28px;

    &__item {
      display: flex;
      flex: 1;
      flex-flow: column;
      &__title {
        height: 21px;
        font-size: 12px;
        line-height: 21px;
        color: #a9abb8;
      }
      &__container {
        display: flex;
        margin-top: 5px;
        font-weight: bold;
        span {
          margin-left: 8px;
        }
      }
    }
  }
  .status {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 228px;
    height: 37px;
    margin-top: 20px;
    border-radius: 4px;
  }
}
</style>
