<template>
  <div id="header" class="header">
    <div class="container global-width">
      <img :src="require('@/assets/logo.png')" class="logo" @click="handleOpen" />
      <div class="menus">
        <span v-for="menu in menus" :key="menu" @click="handleRoute(menu)">{{ $tm(`${menu}.title`) }}</span>
      </div>
      <div class="wrap">
        <div class="user">
          <span v-if="!isSignIn" class="button" @click="handleConnect">{{ $tm('signin') }}</span>
          <identicon v-if="isSignIn" :size="20" :address="account" />
          <span v-if="isSignIn" class="account ml12">{{ shortAccount }}</span>
          <span v-if="isSignIn" class="button ml24" @click="handleSignOut">{{ $tm('signout') }}</span>
        </div>
        <el-dropdown @command="handleLocale">
          <div class="languages">
            <icon width="16" height="16" :data="require(`@icon/${locale}.svg`)" original />
            <span>{{ $tm(`languages.${locale}.short`) }}</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="item in locales" :key="item" :command="item">
                <icon width="16" height="16" :data="require(`@icon/${item}.svg`)" original />
                <span class="ml8 locale-item">{{ $tm(`languages.${item}.long`) }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import route from '@/mixins/route'
import i18n from '@/i18n'
import Identicon from '@/components/Identicon'
import { shortyAddress } from '@/utils'
import { useStore } from 'vuex'

export default {
  name: 'Header',
  mixins: [route],
  components: {
    Identicon
  },
  setup() {
    const store = useStore()
    const menus = ['home', 'create', 'faq']
    let listened = false

    function signOut() {
      store.dispatch('app/signOut')
    }

    function handleOpen() {
      window.open('https://starcoin.org/')
    }

    if (window.starcoin && !listened) {
      listened = true
      window.starcoin.on('chainChanged', signOut)
      window.starcoin.on('accountsChanged', signOut)
    }

    return {
      menus,
      account: computed(() => store.getters.account),
      locale: computed(() => store.getters.locale),
      shortAccount: computed(() => {
        return shortyAddress(store.getters.account)
      }),
      isSignIn: computed(() => {
        return store.getters.account && store.getters.token
      }),
      locales: i18n.global.availableLocales.reverse(),
      handleLocale: (locale) => store.dispatch('app/setLocale', locale),
      handleConnect: () => store.dispatch('app/connect'),
      handleSignOut: () => store.dispatch('app/signOut'),
      handleOpen
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.header {
  height: 80px;
  background-color: $bg-1-color;
  .container {
    display: flex;
    align-items: center;
    height: 80px;
    margin: 0 auto;
    .logo {
      width: 135px;
      height: 34px;
      cursor: pointer;
    }
    .menus {
      display: flex;
      justify-content: space-between;
      width: 260px;
      margin-left: 160px;
      font-weight: $font-medium;
      span {
        cursor: pointer;
        &:hover {
          color: $light-blue;
        }
      }
    }
    .wrap {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: flex-end;
      .user {
        display: flex;
        align-items: center;
        height: 18px;
        padding-right: 28px;
        font-size: 14px;
        font-weight: bold;
        border-right: 1px solid rgba(255, 255, 255, 0.5);
        .account {
          font-size: 14px;
          font-weight: bold;
        }
        .button {
          cursor: pointer;
          &:hover {
            color: $light-blue;
          }
        }
      }
      .languages {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 61px;
        height: 28px;
        margin-left: 24px;
        cursor: pointer;
        border: 1px solid gray;
        border-radius: 2px;
        box-shadow: 0 2px 8px 0 rgba(126, 143, 177, 0.16);
        span {
          position: relative;
          top: 0;
          margin-left: 4px;
          font-size: 14px;
          font-weight: bold;
          color: white;
        }
      }
    }
  }
}
</style>

<style lang="scss">
@import '~@/styles/variables.scss';
.el-dropdown__popper {
  border: 1px solid gray !important;
  .el-dropdown-menu {
    background-color: $bg-3-color;
    .locale-item {
      color: $primary-font;
      &:hover {
        color: $light-blue;
      }
    }
  }
  .el-popper__arrow {
    display: none;
  }
}
</style>
