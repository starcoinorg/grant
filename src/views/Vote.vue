<template>
  <div class="vote">
    <div class="head">
      <div class="wrap">
        <span class="title">{{ data.title }}</span>
        <div class="content">
          <v-md-preview :text="data.desc" class="md"></v-md-preview>
          <div class="right">
            <div class="right__head">
              <div class="countdown">
                <span>{{ data.duration + $tm('timeUnit.days') }}</span>
                <span class="mt12">{{ $tm('vote.countdown') }}</span>
              </div>
              <div class="website active" @click="handleOpen(data.website)">
                <icon width="24" height="24" data="@icon/website.svg" color="auto" />
                <span class="mt8">{{ $tm('vote.website') }}</span>
              </div>
              <div class="contact active" @click="handleOpen(data.contact)">
                <icon width="24" height="24" data="@icon/contact.svg" color="auto" />
                <span class="mt8">{{ $tm('vote.community') }}</span>
              </div>
            </div>
            <div class="right__foot">
              <div class="grantee">
                <span>{{ $tm('vote.address') }}</span>
                <span>{{ $tm('vote.name') }}</span>
                <span>{{ $tm('vote.percentage') }}</span>
              </div>
              <div class="grantee" v-for="(item, inx) in data.grantee" :key="`gt${inx}`">
                <span class="flex">
                  <el-tooltip v-if="item.addr.length > 24" effect="dark" :content="item.addr" placement="bottom">
                    <span class="flex1">{{ item.addr.substr(0, 10) + '...' + item.addr.substr(-11) }}</span>
                  </el-tooltip>
                  <span v-else class="flex1">{{ item.addr }}</span>
                  <div @click="handleClipboard(item.addr, $event)" class="copy">
                    <icon class="copy__icon" width="20" height="20" data="@icon/copy.svg" color="auto" />
                  </div>
                </span>
                <span>{{ item.name }}</span>
                <span>{{ item.percent }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="chunk" style="margin-bottom: 90px">
      <span class="chunk__title">{{ $tm('vote.detail') }}</span>
      <div class="wrap">
        <div class="wrap__item">
          <span class="wrap__item__main">
            <icon width="30" height="24" data="@icon/stc.svg" original />
            <span class="ml12">{{ data.amount }}</span>
          </span>
          <span class="wrap__item__sub">{{ $tm('common.applied') }}</span>
        </div>
        <div class="wrap__item bl">
          <span
            class="wrap__item__main wrap__item__button"
            :class="{
              blue: data.status === 2001,
              green: data.status === 2002,
              red: data.status === 2003,
              black: data.status === 2004
            }"
            >{{ $tm(`dictionary.${data.status}`) }}</span
          >
          <span class="wrap__item__sub">{{ $tm('vote.status') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onBeforeMount, onMounted, reactive } from 'vue'
import handleClipboard from '@/utils/clipboard'
import { getGrantById } from '@/apis'
import { getParam, formatPrice, numberFormatter, toThousandFilter } from '@/utils'
export default {
  name: 'Vote',
  emits: ['scrollTo'],
  setup(props, { emit }) {
    const gid = getParam('gid')
    const data = reactive({
      title: null,
      desc: '',
      duration: null,
      amount: 0,
      grantee: [],
      approval: 0,
      against: 0,
      status: null,
      choice: null,
      votes: 0
    })
    let width = 1088
    let size = 64
    let offset = 6

    function computedWidth(approval, against) {
      let percent = 0
      let right = 0
      let left = 0
      if (approval > 0 && against === 0) {
        percent = 100
      } else if (approval === 0 && against === 0) {
        percent = 0
      } else {
        percent = (approval / (approval + against)) * 100
      }
      if (percent === 0) {
        right = width - size
        left = offset
      } else if (percent === 100) {
        right = offset
        left = width - size
      } else {
        const cc = (width * percent) / 100
        right = width - cc - size - offset * 2
        left = cc + size / 2 - offset * 2
      }
      if (right < offset && left > width - size) {
        right = offset
        left = width - size
      }
    }

    function handleFetch() {
      getGrantById(gid).then(({ title, desc, end_ts, detail_link, contact, recipients, amount, support_count, negative_count, status, choice, votes }) => {
        data.title = title
        data.desc = desc
        data.duration = Math.ceil((end_ts - Date.now() / 1000) / 24 / 60 / 60)
        if (data.duration < 0) {
          data.duration = 0
        }
        data.website = detail_link
        data.contact = contact
        data.grantee = recipients.map((t) => {
          return {
            ...t,
            percent: (t.share * 100).toFixed(2) + '%'
          }
        })
        data.amount = toThousandFilter(formatPrice(amount, 0))
        data.approval = numberFormatter(support_count, 2)
        data.against = numberFormatter(negative_count, 2)
        data.status = status
        data.choice = choice
        data.votes = votes ? numberFormatter(votes, 2) : 0
        computedWidth(support_count, negative_count)
      })
    }

    function handleOpen(url) {
      if (url && url !== null && url !== undefined) {
        window.open(url)
      }
    }

    onBeforeMount(() => {
      handleFetch()
    })

    onMounted(() => {
      emit('scrollTo', 0)
    })

    return {
      data,
      handleOpen,
      handleClipboard
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.vote {
  .head {
    padding-top: 72px;
    padding-bottom: 72px;
    background-color: #0d1116;
    .wrap {
      display: flex;
      flex-flow: column;
      width: 1200px;
      margin: 0 auto;
      .title {
        font-size: 56px;
        font-weight: bold;
        line-height: 72px;
      }
      .content {
        display: flex;
        margin-top: 24px;
        .md {
          flex: 7;
        }
        .right {
          display: flex;
          flex: 5;
          flex-flow: column;
          padding-left: 48px;
          margin-left: 48px;
          border-left: 2px solid #2c3042;
          &__head {
            display: flex;
            justify-content: space-between;
            padding-bottom: 25px;
            font-size: 14px;
            font-weight: $font-medium;
            border-bottom: 1px solid #313549;
            div {
              display: flex;
              flex-flow: column;
              width: 100px;
            }
            .website,
            .contact {
              align-items: center;
              justify-content: center;
              color: $gray-font;
            }
            .active {
              color: $light-blue;
              cursor: pointer;
              transition: color 0.2s;
              &:hover {
                color: scale-color($color: $light-blue, $lightness: 15%);
              }
            }
          }
          &__foot {
            display: flex;
            flex-flow: column;
            margin-top: 25px;
            .grantee {
              display: flex;
              align-items: center;
              font-size: 14px;
              font-weight: $font-medium;
              line-height: 24px;
              color: $gray-font;
              span {
                &:nth-child(1) {
                  display: flex;
                  flex: 1;
                  align-items: center;
                }
                &:nth-child(2) {
                  width: 140px;
                  margin: 0 12px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
                &:nth-child(3) {
                  width: 80px;
                }
                .copy {
                  margin-left: 8px;
                  cursor: pointer;
                  transition: color 0.2s;
                  &:hover {
                    color: $primary-font;
                  }
                  &__icon {
                    pointer-events: none;
                  }
                }
              }
            }
            .grantee + .grantee {
              margin-top: 16px;
            }
          }
        }
      }
    }
  }
  .chunk {
    width: 1200px;
    margin: 0 auto;
    margin-top: 90px;
    &__title {
      font-size: 32px;
      line-height: 48px;
    }
    .wrap {
      display: flex;
      align-items: center;
      padding: 64px 0;
      margin-top: 24px;
      background-color: #262939;
      border-radius: 8px;
      &__item {
        display: flex;
        flex: 1;
        flex-flow: column;
        align-items: center;
        justify-content: center;
        &__main {
          font-size: 24px;
          font-weight: bold;
          line-height: 36px;
        }
        &__sub {
          margin-top: 24px;
          font-size: 16px;
          line-height: 20px;
          color: $gray-font;
        }
        &__button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 120px;
          height: 45px;
          font-size: 16px;
          user-select: none;
          border-radius: 4px;
        }
      }
      .bl {
        border-left: 1px solid #383a4b;
      }
      &__vote {
        display: flex;
        flex: 1;
        flex-flow: column;
        padding: 0 56px;
        &__count {
          display: flex;
          &__item {
            display: flex;
            flex: 1;
            flex-flow: column;
            .main {
              margin-top: 8px;
              font-size: 24px;
              font-weight: bold;
              line-height: 36px;
            }
            .sub {
              font-size: 16px;
              line-height: 20px;
              color: $gray-font;
            }
            &:nth-child(2) {
              align-items: flex-end;
              justify-content: flex-end;
            }
          }
        }
        &__progress {
          position: relative;
          width: 1088px;
          height: 64px;
          margin-top: 24px;
          background-color: white;
          &__approval {
            border-top: 64px solid $blue;
            border-right: 64px solid transparent;
          }
          &__against {
            border-bottom: 64px solid $red;
            border-left: 64px solid transparent;
          }
          .fighter {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            height: 0;
            transition: left 0.2s;
          }
        }
        &__divider {
          margin-top: 56px;
        }
        &__buttons {
          display: flex;
          justify-content: center;
          margin-top: 56px;
          button {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 396px;
            height: 64px;
            font-size: 21px;
            color: $primary-font;
            cursor: pointer;
            border: none;
            border-radius: 4px;
            transition: background-color 0.2s;
            img {
              position: absolute;
              top: 0;
              right: 0;
            }
          }
          .appoval {
            background-color: $blue;
            &:hover {
              background-color: scale-color($color: $blue, $lightness: 15%);
            }
          }
          .against {
            background-color: $red;
            &:hover {
              background-color: scale-color($color: $red, $lightness: 15%);
            }
          }
          button + button {
            margin-left: 72px;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.vote {
  .el-divider {
    background-color: #878c98;
    .el-divider__text {
      font-size: 18px;
      font-weight: bold;
      color: white;
      background-color: #262939;
    }
  }
}
</style>
