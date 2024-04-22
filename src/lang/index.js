import {createI18n} from 'vue-i18n'
import Cookies from 'js-cookie'
import elementEnLocale from 'element-plus/es/locale/lang/en'
import elementZhLocale from 'element-plus/es/locale/lang/zh-cn'
import enLocale from './en.js'
import zhLocale from './zh.js'

const messages = {
  en_US: {
    ...enLocale,
    ...elementEnLocale
  },
  zh_CN: {
    ...zhLocale,
    ...elementZhLocale
  }
}

const i18n = createI18n({
  // 设置语言 选项 en | zh
  locale: Cookies.get('language') || 'zh_CN',
  // 设置文本内容
  messages
})

export default i18n