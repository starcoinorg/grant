<template>
  <div id="footer" class="footer">
    <div class="container global-width">
      <div class="logo-wrap">
        <img :src="require('@/assets/logo.png')" class="logo" />
        <span class="copyright">{{ $tm('copyright') }}</span>
      </div>
      <div class="link-wrap">
        <span class="title">{{ $tm('links.technology') }}</span>
        <a href="https://chrome.google.com/webstore/detail/starmask/mfhbebgoclkghebffdldpobeajmbecfk?hl=zh-CN" target="_blank">{{ $tm('links.starmask') }}</a>
        <a href="https://stcscan.io/" target="_blank">{{ $tm('links.explorer') }}</a>
        <a href="https://starcoin.org/zh/developer/" target="_blank">{{ $tm('links.docs') }}</a>
        <a href="https://starcoin.org/zh/developer/sdk/" target="_blank">{{ $tm('links.sdk') }}</a>
      </div>
      <div class="link-wrap">
        <span class="title">{{ $tm('links.community') }}</span>
        <a href="https://starcoin.org/zh/news/" target="_blank">{{ $tm('links.news') }}</a>
        <a href="https://westar.io/" target="_blank">{{ $tm('links.labs') }}</a>
        <a href="https://www.movelang.io/" target="_blank">{{ $tm('links.chinese') }}</a>
        <a href="https://github.com/starcoinorg/starcoin/discussions" target="_blank">{{ $tm('links.github') }}</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.footer {
  padding-top: 96px;
  padding-bottom: 118px;
  background-color: $bg-3-color;
  .container {
    display: flex;
    height: 190px;
    margin: 0 auto;
    .logo-wrap {
      display: flex;
      flex: 1;
      flex-flow: column;
      .logo {
        width: 143px;
        height: 36px;
        cursor: pointer;
      }
      .copyright {
        margin-top: 8px;
        font-size: 12px;
        color: $second-font;
      }
    }
    .link-wrap {
      display: flex;
      flex-flow: column;
      width: 180px;
      .title {
        font-size: 16px;
        font-weight: bold;
        color: $primary-font;
      }
      a {
        height: 21px;
        margin-top: 18px;
        font-size: 14px;
        line-height: 21px;
        color: $second-font;
        text-decoration: none;
        &:hover {
          color: $light-blue;
        }
      }
    }
  }
}
</style>
