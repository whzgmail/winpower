import { createApp } from 'vue'
import './style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import App from './App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// import { createPinia } from 'pinia'
import router from './router/index.js'

import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const app = createApp(App)

app.use(ElementPlus, {
    locale: zhCn,
})

//导入图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component('el-icon-'+key, component)
}

//
app.use(ElementPlus, { zIndex: 3000 })
// app.use(createPinia())
app.use(router)

app.mount('#app')