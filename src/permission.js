import router from './router'
import usePermissionStore from '@/store/modules/permission'
import useUserStore from '@/store/modules/user'

router.beforeEach((to, from, next) => {
  const isLogin = sessionStorage.getItem('isLogin') || {isLogin: false}
  let loginState = null
  if (typeof isLogin === 'object') {
    loginState = isLogin.isLogin
  } else {
    loginState = JSON.parse(isLogin).isLogin
  }

  // 如果当前的访问的请求是Login放行
  if (to.path === '/login') {
    next()
  } else {
    // 如果当前的访问的请求不是Login，需要判断是否登录
    if (!loginState) {
      next('/login')
    } else {
      next()
    }
  }
  if (useUserStore().roles.length === 0) {
    useUserStore().getInfo().then(() => {
      usePermissionStore().generateRoutes().then(res => {
        next()
      })
    })
  } else {
    next()
  }
})

router.afterEach(() => {
})
