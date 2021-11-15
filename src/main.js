import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import './permission'
import { VueSvgIconPlugin } from '@yzfe/vue3-svgicon'
import installElementPlus from './plugins/element'
import './styles/index.scss'
import VMdPreview from '@kangc/v-md-editor/lib/preview'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import '@kangc/v-md-editor/lib/theme/style/github.css'
import createHljsTheme from '@kangc/v-md-editor/lib/theme/hljs'
import hljs from 'highlight.js'
const hljsTheme = createHljsTheme({
  Hljs: hljs
})
VMdPreview.vMdParser.theme(hljsTheme)

const app = createApp(App)
installElementPlus(app)
store.dispatch('app/init').then(() => {
  app.use(store).use(router).use(i18n).use(VueSvgIconPlugin, { tagName: 'icon' }).use(VMdPreview).mount('#app')
})
