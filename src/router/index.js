import {createWebHistory, createRouter} from 'vue-router'
/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "yt"}' // 访问路由的默认传递参数
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
 noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
 title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
 icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
 breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
 activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
 }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: '/index',
        component: () => import('@/views/index'),
        name: 'Index',
        meta: {title: '首页', icon: 'dashboard', affix: true}
      }
    ]
  },
  {
    path: '/dataConfiguration',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'dataSource',
        component: () => import('@/views/dataConfiguration/dataSource'),
        name: 'dataSource',
        meta: {title: '数据源管理', icon: 'cascader'}
      },
      {
        path: 'dataModel',
        component: () => import('@/views/dataConfiguration/dataModel'),
        name: 'dataModel',
        meta: {title: '数据模型管理', icon: 'tree'}
      },
      {
        path: 'dataTable',
        component: () => import('@/views/dataConfiguration/dataTable'),
        name: 'dataTable',
        meta: {title: '数据表管理', icon: 'date-range'}
      },
      {
        path: 'dataColumn',
        component: () => import('@/views/dataConfiguration/dataColumn'),
        name: 'dataColumn',
        meta: {title: '数据项管理', icon: 'dict'}
      },
      {
        path: 'dataSystem',
        component: () => import('@/views/dataConfiguration/dataSystem'),
        name: 'dataSystem',
        meta: {title: '系统管理', icon: 'system'}
      }
    ]
  },
  {
    path: '/dataRelationship',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'dataRelationEntry',
        component: () => import('@/views/dataRelationship/dataRelationEntry'),
        name: 'dataRelationEntry',
        meta: {title: '数据关系录入', icon: 'documentation'}
      },
      {
        path: 'scoreMethodManage',
        component: () => import('@/views/dataRelationship/scoreMethodManage'),
        name: 'scoreMethodManage',
        meta: {title: '评分方法管理', icon: 'table'}
      },
      {
        path: 'scorePlanManage',
        component: () => import('@/views/dataRelationship/scorePlanManage'),
        name: 'scorePlanManage',
        meta: {title: '评分方案管理', icon: 'tab'}
      },
      {
        path: 'dataExploration',
        component: () => import('@/views/dataRelationship/dataExploration'),
        name: 'dataExploration',
        meta: {title: '数据关系探查', icon: 'documentation'}
      },
    ]
  },
  {
    path: '/dataRelationalApp',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'associationQuery',
        component: () => import('@/views/dataRelationalApp/associationQuery'),
        name: 'associationQuery',
        meta: {title: '数据关联查询', icon: 'documentation'}
      },
    ]
  },
  {
    path: '/system',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'dict',
        component: () => import('@/views/system/dict'),
        name: 'dict',
        meta: {title: '字典管理', icon: 'documentation'}
      },
    ]
  },
  {
    path: '/relationResults',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'gxMap',
        component: () => import('@/views/relationResults/gxMap'),
        name: 'gxMap',
        meta: {title: '成果关系图', icon: 'documentation'}
      },
    ]
  },
]



// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [
  {
    path: '/system/dict-data',
    component: Layout,
    hidden: true,
    permissions: ['system:dict:list'],
    children: [
      {
        path: 'index/:dictId(\\d+)',
        component: () => import('@/views/system/dict/data'),
        name: 'Data',
        meta: { title: '字典数据', activeMenu: '/system/dict' }
      }
    ]
  }
]

const router = createRouter({
  // history: createWebHistory(),
  history: createWebHistory('/intalinkOpen/'),
  routes: constantRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {top: 0}
    }
  },
});

export default router;
