import {getToken, setToken, removeToken} from '@/utils/auth'
import defAva from '@/assets/images/profile.jpg'

const useUserStore = defineStore(
  'user',
  {
    state: () => ({
      token: getToken(),
      id: '',
      name: '',
      avatar: '',
      roles: [],
      permissions: []
    }),
    actions: {
      // 登录
      login(userInfo) {
        const username = userInfo.username.trim()
        const password = userInfo.password
        const code = userInfo.code
        const uuid = userInfo.uuid
        return new Promise((resolve, reject) => {
          login(username, password, code, uuid).then(res => {
            let data = res.data
            setToken(data.access_token)
            this.token = data.access_token
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 获取用户信息
      getInfo() {
        return new Promise((resolve, reject) => {
          const res = {
            "msg": "操作成功",
            "code": 200,
            "permissions": [
              "*:*:*"
            ],
            "roles": [
              "admin"
            ],
            "user": {
              "createBy": "admin",
              "createTime": "2023-12-26 14:00:55",
              "updateBy": null,
              "updateTime": null,
              "remark": "管理员",
              "userId": 1,
              "deptId": 103,
              "userName": "admin",
              "nickName": "admin",
              "email": "ry@163.com",
              "phonenumber": "15888888888",
              "sex": "1",
              "avatar": "http://127.0.0.1:9300/statics/2024/04/13/434f5d601999a5e1b8a656c284f9929_20240413184555A001.jpg",
              "password": "$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2",
              "status": "0",
              "delFlag": "0",
              "loginIp": "127.0.0.1",
              "loginDate": "2023-12-26T14:00:55.000+08:00",
              "dept": {
                "createBy": null,
                "createTime": null,
                "updateBy": null,
                "updateTime": null,
                "remark": null,
                "deptId": 103,
                "parentId": 101,
                "ancestors": "0,100,101",
                "deptName": "研发部门",
                "orderNum": 1,
                "leader": "元拓",
                "phone": null,
                "email": null,
                "status": "0",
                "delFlag": null,
                "parentName": null,
                "children": []
              },
              "roles": [
                {
                  "createBy": null,
                  "createTime": null,
                  "updateBy": null,
                  "updateTime": null,
                  "remark": null,
                  "roleId": 1,
                  "roleName": "超级管理员",
                  "roleKey": "admin",
                  "roleSort": 1,
                  "dataScope": "1",
                  "menuCheckStrictly": false,
                  "deptCheckStrictly": false,
                  "status": "0",
                  "delFlag": null,
                  "flag": false,
                  "menuIds": null,
                  "deptIds": null,
                  "permissions": null,
                  "admin": true
                }
              ],
              "roleIds": null,
              "postIds": null,
              "roleId": null,
              "admin": true
            }
          }
          const user = res.user
          const avatar = (user.avatar == "" || user.avatar == null) ? defAva : user.avatar;

          if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            this.roles = res.roles
            this.permissions = res.permissions
          } else {
            this.roles = ['ROLE_DEFAULT']
          }
          this.id = user.userId
          this.name = user.userName
          this.avatar = avatar
          resolve(res)
        })
      },
      // 退出系统
      logOut() {
        return new Promise((resolve, reject) => {
          logout(this.token).then(() => {
            this.token = ''
            this.roles = []
            this.permissions = []
            removeToken()
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      }
    }
  })

export default useUserStore
