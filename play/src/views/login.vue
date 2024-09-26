<template>
  <div class="login">
    <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">用户管理系统</h3>
      <el-form-item prop="loginName">
        <el-input
          v-model="loginForm.loginName"
          type="text"
          size="large"
          auto-complete="off"
          placeholder="账号"
        >
          <template #prefix>
            <adv-svg-icon icon-class="user" class="el-input__icon input-icon" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          size="large"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter="handleLogin"
        >
          <template #prefix>
            <adv-svg-icon icon-class="password" class="el-input__icon input-icon" />
          </template>
        </el-input>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin-bottom: 25px">
        记住密码
      </el-checkbox>
      <el-form-item style="width: 100%">
        <el-button
          :loading="loading"
          size="large"
          type="primary"
          style="width: 100%"
          @click.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2018-2024 All Rights Reserved.</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { AdvSvgIcon } from 'advint-ui'
  import { useUserStore } from '~/store/modules/user'
  import { LoginData } from '~/api/types'
  import { to } from 'await-to-js'
  import md5 from 'js-md5'

  const userStore = useUserStore()
  const router = useRouter()

  const loginForm = ref<LoginData>({
    loginName: '',
    password: '',
    rememberMe: false,
  } as LoginData)

  const loginRules: ElFormRules = {
    loginName: [{ required: true, trigger: 'blur', message: '请输入您的账号' }],
    password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }],
  }

  const loading = ref(false)

  const redirect = ref(undefined)
  const loginRef = ref<ElFormInstance>()

  watch(
    () => router.currentRoute.value,
    (newRoute: any) => {
      redirect.value = newRoute.query && newRoute.query.redirect
    },
    { immediate: true }
  )

  const handleLogin = () => {
    loginRef.value?.validate(async (valid: boolean, fields: any) => {
      if (valid) {
        loading.value = true
        // 勾选了需要记住密码设置在 localStorage 中设置记住用户名和密码
        if (loginForm.value.rememberMe) {
          localStorage.setItem('username', String(loginForm.value.loginName))
          localStorage.setItem('password', String(loginForm.value.password))
          localStorage.setItem('rememberMe', String(loginForm.value.rememberMe))
        } else {
          localStorage.removeItem('username')
          localStorage.removeItem('password')
          localStorage.removeItem('rememberMe')
        }
        // 调用action的登录方法
        const [err] = await to(
          userStore.login({
            loginName: loginForm.value.loginName,
            password: md5(loginForm.value.password),
          })
        )
        if (!err) {
          const redirectUrl = (redirect.value && decodeURIComponent(redirect.value)) || '/'
          await router.push(redirectUrl)
          loading.value = false
        } else {
          loading.value = false
        }
      } else {
        console.log('error submit!', fields)
      }
    })
  }

  const getLoginData = () => {
    const username = localStorage.getItem('username')
    const password = localStorage.getItem('password')
    const rememberMe = localStorage.getItem('rememberMe')
    loginForm.value = {
      loginName: username === null ? String(loginForm.value.loginName) : username,
      password: password === null ? String(loginForm.value.password) : String(password),
      rememberMe: rememberMe === null ? false : Boolean(rememberMe),
    } as LoginData
  }

  onMounted(() => {
    getLoginData()
  })
</script>

<style lang="scss" scoped>
  .login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-image: url('../assets/images/login-background.jpg');
    background-size: cover;
  }

  .title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #707070;
  }

  .login-form {
    border-radius: 6px;
    background: #ffffff;
    width: 400px;
    padding: 25px 25px 5px 25px;

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
    font-family: Arial, serif;
    font-size: 12px;
    letter-spacing: 1px;
  }

  .login-code-img {
    height: 40px;
    padding-left: 12px;
  }
</style>
