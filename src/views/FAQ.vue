<template>
  <div class="faq">
    <div class="title global-width">{{ $tm('faq.title') }}</div>
    <div class="message">
      <div class="main">{{ $tm('faq.message[0][0]') }}</div>
      <div class="desc">{{ $tm('faq.message[0][1]') }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.faq {
  padding-bottom: 24px;
  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 196px;
    margin: 0 auto;
    font-size: 56px;
    font-weight: bold;
  }
  .message {
    display: flex;
    flex-flow: column;
    width: 1200px;
    padding: 64px 40px;
    margin: 0 auto;
    font-weight: $font-medium;
    background-color: $bg-4-color;
    border-radius: 8px;
    .main {
      height: 48px;
      font-size: 32px;
      line-height: 48px;
    }
    .desc {
      margin-top: 16px;
      font-size: 16px;
      line-height: 24px;
      color: $normal-font;
    }
  }
  .message + .message {
    margin-top: 24px;
  }
}
</style>
