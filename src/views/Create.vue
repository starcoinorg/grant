<template>
  <div class="create">
    <div class="title">
      <span class="title__main" ref="reftitle">{{ $tm('create.mainTitle') }}</span>
      <span class="title__sub">{{ $tm('create.subTitle') }}</span>
    </div>
    <el-form
      ref="form"
      :inline-message="true"
      :validate-on-rule-change="false"
      :hide-required-asterisk="true"
      label-position="top"
      :model="formData"
      :rules="{
        title: [{ required: true, trigger: 'change', message: $tm('create.message.title') }],
        desc: [{ required: true, trigger: 'change', message: $tm('create.message.desc') }],
        amount: [{ required: true, trigger: 'change', message: $tm('create.message.amount') }],
        duration: [{ required: true, trigger: 'change', message: $tm('create.message.duration') }],
        project: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value && !validURL(value)) {
                callback($tm('create.message.invalidUrl'))
              }
              callback()
            }
          }
        ],
        contact: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value && !validURL(value)) {
                callback($tm('create.message.invalidUrl'))
              }
              callback()
            }
          }
        ]
      }"
      class="form"
    >
      <el-form-item :inline-message="true" :required="true" :label="$tm('create.form.title')" prop="title" :ref="handleBindField">
        <template #label="{ label }">
          <div class="flex">
            <span class="flex1">{{ label }}</span>
            <span>{{ $t('common.maxcharacters', { max: 48 }) }}</span>
          </div>
        </template>
        <el-input v-model="formData.title" maxlength="48" :placeholder="$tm('create.placeholder.title')"></el-input>
      </el-form-item>
      <el-form-item :label="$tm('create.form.desc')" prop="desc" :ref="handleBindField">
        <template #label="{ label }">
          <div class="flex">
            <span class="flex1">{{ label }}</span>
            <span>{{ $t('common.maxcharacters', { max: 1024 }) }}</span>
          </div>
        </template>
        <el-input v-model="formData.desc" resize="none" rows="8" type="textarea" maxlength="1024" :placeholder="$tm('create.placeholder.desc')"></el-input>
      </el-form-item>
      <el-form-item :label="$tm('create.form.amount')" prop="amount" :ref="handleBindField">
        <number-input
          :count="formData.amount"
          :placeholder="$tm('create.placeholder.amount')"
          :precision="4"
          @change="formData.amount = $event ? Number($event) : null"
        ></number-input>
      </el-form-item>
      <el-form-item :label="$tm('create.form.duration')" prop="duration" :ref="handleBindField">
        <number-input
          :count="formData.duration"
          :placeholder="$tm('create.placeholder.duration')"
          :precision="0"
          :max="3650"
          @change="formData.duration = $event ? Number($event) : null"
        >
          <template #suffix>{{ $tm('timeUnit.days') }}</template>
        </number-input>
      </el-form-item>
      <el-form-item :label="$tm('create.form.project')" prop="project" :ref="handleBindField">
        <template #label="{ label }">
          <div class="flex">
            <span class="flex1">{{ label }}</span>
            <span>{{ $t('common.optional') }}</span>
          </div>
        </template>
        <el-input v-model="formData.project" :placeholder="$tm('create.placeholder.project')"></el-input>
      </el-form-item>
      <el-form-item :label="$tm('create.form.contact')" prop="contact" :ref="handleBindField">
        <template #label="{ label }">
          <div class="flex">
            <span class="flex1">{{ label }}</span>
            <span>{{ $t('common.optional') }}</span>
          </div>
        </template>
        <el-input v-model="formData.contact" :placeholder="$tm('create.placeholder.contact')"></el-input>
      </el-form-item>
      <el-form-item :label="$tm('create.form.grantee')">
        <template #label="{ label }">
          <div class="flex">
            <span class="flex1">{{ label }}</span>
            <span class="opreation" @click="handleDistribute">{{ $tm('common.distribute') }}</span>
          </div>
        </template>
        <div class="grantee" v-for="(item, inx) in formData.grantee" :key="`gt${inx}`">
          <div class="grantee__item">
            <el-form-item
              label=""
              class="grantee__item__address"
              :ref="handleBindField"
              :prop="`grantee.${inx}.address`"
              :rules="{
                required: true,
                message: $tm('create.message.granteeAddress'),
                trigger: 'blur'
              }"
            >
              <el-input v-model="formData.grantee[inx].address" :placeholder="$tm('create.placeholder.grantee')"></el-input>
            </el-form-item>
            <el-form-item
              label=""
              class="grantee__item__percent"
              :ref="handleBindField"
              :prop="`grantee.${inx}.percent`"
              :rules="{
                required: true,
                message: $tm('create.message.granteePercent'),
                trigger: 'blur'
              }"
            >
              <number-input
                :count="formData.grantee[inx].percent"
                :placeholder="$tm('common.percentage')"
                :precision="2"
                :max="100"
                @change="formData.grantee[inx].percent = $event ? Number($event) : null"
              >
                <template #suffix>%</template>
              </number-input>
            </el-form-item>
          </div>
          <el-form-item label="">
            <el-input v-model="formData.grantee[inx].name" :placeholder="$tm('create.placeholder.granteeName')"></el-input>
          </el-form-item>
          <icon v-if="inx > 0" width="24" height="24" data="@icon/remove.svg" class="remove-button" color="auto" @click="handleRemoveGrantee(inx)" />
        </div>
      </el-form-item>
      <span class="percent-desc" :class="{ dander: checkSum }">{{ $tm('common.percentDesc') }}</span>
      <div class="add-button" @click="handleAddGrantee">{{ $tm('create.add') }}</div>
      <div class="create-button" @click="handleSubmit">{{ $tm('create.create') }}</div>
    </el-form>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { remove } from 'lodash'
import NumberInput from '@/components/NumberInput'
import { validURL } from '@/utils/validate'
import { setGrant } from '@/apis'
import { durationToSeconds, priceToAmount } from '@/utils'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
export default {
  name: 'Create',
  components: { NumberInput },
  emits: ['scrollTo'],
  setup(props, { emit }) {
    const store = useStore()
    const fields = {}
    const form = ref(null)
    const formData = reactive({
      title: null,
      desc: null,
      amount: null,
      duration: null,
      project: null,
      contact: null,
      grantee: [
        {
          address: null,
          name: null,
          percent: null
        }
      ]
    })
    const checkSum = ref(false)
    const router = useRouter()

    function handleBindField(el) {
      if (el) {
        fields[el.prop] = el.$el
      }
    }

    function handleDistribute() {
      const len = formData.grantee.length
      const avg = Number((Math.floor(10000 / len) / 100).toFixed(2))
      const percents = new Array(len).fill(avg)
      let diff = 100
      percents.forEach((t) => {
        diff -= t
      })
      percents[0] = Number((percents[0] + diff).toFixed(2))
      formData.grantee.forEach((t, inx) => {
        t.percent = percents[inx]
      })
    }

    function handleAddGrantee() {
      formData.grantee.push({
        address: null,
        name: null,
        percent: null
      })
    }

    function handleRemoveGrantee(index) {
      remove(formData.grantee, (val, inx) => {
        return index === inx
      })
    }

    function handleCheckSum() {
      const _sum = formData.grantee.reduce((sum, t) => {
        if (t.percent >= 0) {
          sum += t.percent
        }
        return Number(sum.toFixed(2))
      }, 0)
      checkSum.value = _sum !== 100
      return checkSum.value
    }

    function submitGrants() {
      form.value
        .validate()
        .then(() => {
          if (!handleCheckSum()) {
            const { title, desc, amount, duration, project, contact, grantee } = formData
            setGrant(
              title,
              priceToAmount(amount),
              desc,
              project,
              contact,
              durationToSeconds(duration),
              JSON.stringify(
                [...grantee].map((t) => {
                  return {
                    addr: t.address,
                    name: t.name,
                    share: (t.percent / 100).toFixed(4)
                  }
                })
              )
            ).then(() => {
              router.replace('/home')
            })
          }
        })
        .catch((err) => {
          const field = Object.keys(err)[0]
          fields[field].scrollIntoView({ behavior: 'smooth' })
        })
    }

    function handleSubmit() {
      if (store.getters.account) {
        submitGrants()
      } else {
        store.dispatch('app/connect').then(() => {
          submitGrants()
        })
      }
    }

    onMounted(() => {
      emit('scrollTo', 0)
    })

    return {
      form,
      formData,
      fields,
      checkSum,
      handleBindField,
      handleDistribute,
      handleAddGrantee,
      handleRemoveGrantee,
      handleSubmit,
      validURL
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.create {
  .title {
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 240px;
    &__main {
      font-size: 56px;
      font-weight: bold;
    }
    &__sub {
      margin-top: 24px;
      font-size: 14px;
      line-height: 40px;
    }
  }
  .form {
    width: 1120px;
    padding: 32px 40px;
    margin: 0 auto;
    margin-bottom: 120px;
    background-color: $bg-4-color;
    border-radius: 4px;
    .opreation {
      color: $light-blue;
      cursor: pointer;
    }
    .percent-desc {
      display: inline-block;
      width: 100%;
      font-size: 14px;
      color: $gray-font;
      text-align: right;
    }
  }
  .button {
    display: block;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 740px;
    height: 48px;
    margin: 0 auto;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.2s;
  }
  .add-button {
    @extend .button;

    margin-top: 36px;
    color: $light-blue;
    background-color: transparent;
    border: 1px solid $light-blue;
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
  .create-button {
    @extend .button;

    margin-top: 24px;
    color: white;
    background-color: #4a5471;
    border: 1px solid #4a5471;
    &:hover {
      background-color: scale-color(#4a5471, $lightness: +15%);
    }
  }
}
</style>

<style lang="scss">
@import '~@/styles/variables.scss';
.ext-input {
  color: $primary-font;
  background-color: $bg-6-color;
  border-color: $bg-6-color;
  border-radius: 8px;
  &::placeholder {
    color: rgb(255, 255, 255, 0.32);
  }
}
.create {
  .el-form-item__label {
    font-weight: $font-medium;
    color: $gray-font;
  }
  .el-input {
    .el-input__inner {
      @extend .ext-input;

      min-height: 76px;
    }
    .el-input__suffix {
      display: flex;
      align-items: center;
      margin-right: 12px;
    }
  }
  .el-textarea {
    .el-textarea__inner {
      @extend .ext-input;

      padding-top: 12px;
      padding-bottom: 12px;
      font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
    }
  }
  .grantee {
    position: relative;
    &__item {
      display: flex;
      margin-bottom: 12px;
      &__address {
        flex: 1;
      }
      &__percent {
        width: 269px;
        margin-left: 12px;
      }
    }
    .remove-button {
      position: absolute;
      top: 26px;
      right: -30px;
      color: $grey;
      cursor: pointer;
      transition: color 0.2s;
      &:hover {
        color: $red;
      }
    }
  }
  .grantee + .grantee {
    margin-top: 12px;
  }
  .dander {
    color: #f56c6c !important;
  }
}
</style>
