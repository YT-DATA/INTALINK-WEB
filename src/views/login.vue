<template>
  <div class="login">
    <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form" size="small" label-width="0">
      <div class="login-image">
        <img src="@/assets/images/login-image.png"/>
      </div>
      <div class="login-form-main">
        <LangSelect class="login-lang-select"></LangSelect>
        <h3 class="title">{{ $t('login.title') }}</h3>
        <el-form-item prop="username">
          <el-input
              v-model="loginForm.username"
              type="text"
              size="large"
              auto-complete="off"
              :placeholder="$t('login.username')"
          >
            <template #prepend>
              <svg-icon icon-class="user" class="el-input__icon input-icon"/>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
              v-model="loginForm.password"
              type="password"
              size="large"
              auto-complete="off"
              :placeholder="$t('login.password')"
              @keyup.enter="handleLogin"
          >
            <template #prepend>
              <svg-icon icon-class="password" class="el-input__icon input-icon"/>
            </template>
          </el-input>
        </el-form-item>
        <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">{{
            $t('login.rememberMe')
          }}
        </el-checkbox>
        <el-form-item style="width:100%;">
          <el-button
              :loading="loading"
              size="large"
              type="primary"
              style="width:100%;"
              @click.prevent="handleLogin"
          >
            <span v-if="!loading">{{ $t('login.logIn') }}</span>
            <span v-else>{{ $t('login.logIning') }}</span>
          </el-button>
        </el-form-item>
      </div>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
    </div>
  </div>
</template>

<script setup>
import Cookies from "js-cookie";
import {encrypt, decrypt} from "@/utils/jsencrypt";
import useUserStore from '@/store/modules/user'
import useAppStore from '@/store/modules/app'
import LangSelect from "@/components/LangSelect/index.vue";

const userStore = useUserStore()
const route = useRoute();
const router = useRouter();
const {proxy} = getCurrentInstance();

const loginForm = ref({
  username: "admin",
  password: "123456",
  rememberMe: false,
  code: "",
  uuid: ""
});

const loginRules = {
  username: [{required: true, trigger: "blur", message: "请输入您的账号"}],
  password: [{required: true, trigger: "blur", message: "请输入您的密码"}],
  code: [{required: true, trigger: "change", message: "请输入验证码"}]
};

const codeUrl = ref("");
const loading = ref(false);
// 验证码开关
const captchaEnabled = ref(true);
// 注册开关
const register = ref(true);
const redirect = ref(undefined);

// watch(route, (newRoute) => {
//   redirect.value = newRoute.query && newRoute.query.redirect;
// }, {immediate: true});

function handleLogin() {
  proxy.$refs.loginRef.validate(valid => {
    if (valid) {
      loading.value = true;
      // 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码
      if (loginForm.value.rememberMe) {
        Cookies.set("username", loginForm.value.username, {expires: 30});
        Cookies.set("password", encrypt(loginForm.value.password), {expires: 30});
        Cookies.set("rememberMe", loginForm.value.rememberMe, {expires: 30});
      } else {
        // 否则移除
        Cookies.remove("username");
        Cookies.remove("password");
        Cookies.remove("rememberMe");
      }
      if (loginForm.value.username == 'admin' && loginForm.value.password == '123456') {
        const query = route.query;
        const otherQueryParams = Object.keys(query).reduce((acc, cur) => {
          if (cur !== "redirect") {
            acc[cur] = query[cur];
          }
          return acc;
        }, {});
        router.push({path: redirect.value || "/", query: otherQueryParams});
        sessionStorage.setItem("isLogin", JSON.stringify({isLogin: true}))
      } else {
        loading.value = false;
        proxy.$modal.msgError('账号或密码不正确!')
      }
    }
  });
}

function getCookie() {
  const username = Cookies.get("username");
  const password = Cookies.get("password");
  const rememberMe = Cookies.get("rememberMe");
  loginForm.value = {
    username: username === undefined ? loginForm.value.username : username,
    password: password === undefined ? loginForm.value.password : decrypt(password),
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
  };
}

getCookie();
</script>

<style lang='scss' scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  //background-image: url("../assets/images/login-background.jpg");
  background-image: url("../assets/images/login-bg.png");
  background-size: cover;
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
  font-weight: bold;
}

.login-form {
  //border-radius: 6px;
  //background: #ffffff;
  //width: 400px;
  //padding: 25px 25px 5px 25px;
  border-radius: 25px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  width: 955px;
  min-height: 260px;
  padding: 80px 35px 30px 15px;
  background: #fff;
  border: 1px solid #eaeaea;
  -webkit-box-shadow: 0 0 25px #cac6c6;
  box-shadow: 0 0 25px #cac6c6;
  bottom: calc(50% - 101px);

  .login-image {
    float: left;
    width: 530px;
    height: 320px;
    margin-top: 0;

    img {
      width: 100%;
    }
  }

  .login-form-main {
    float: left;
    width: 350px;

    .el-button {
      font-size: 12px;
      padding: 4px 12px !important;
      height: 32px !important;
    }
  }

  .el-input {
    height: 40px;

    input {
      height: 40px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0px;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
  height: 40px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}

.login-code-img {
  height: 40px;
  padding-left: 12px;
}
</style>
<style lang="scss">
.login {
  .login-form {

    .login-form-main {
      position: relative;
      top: 0;

      .login-lang-select {
        position: absolute;
        top: 0;
        right: 0;

        .lang-wrapper {
          margin: 0 !important;
        }
      }
    }

  }
}
</style>
