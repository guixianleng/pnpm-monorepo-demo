import { useUserStore } from "@user-admin/store"
import { getToken } from "@user-admin/utils"
import { createAxios } from "advint-ui"
import { ElMessageBox } from "element-plus"

// 是否显示重新登录
export const isRelogin = { show: false }

export const Http = createAxios({
  // header携带的令牌名称
  tokenName: "advint-token",
  // 传入的身份令牌，这里模拟自研平台的token
  getToken: () => getToken(),
  // 设置请求默认参数, 详见最下方 `Ts类型`
  requestOptions: {
    // 错误提示方式
    errorMessageMode: "message",
    joinTime: false,
    abnormalLoginFn: () => {
      // 登录异常处理
      if (!isRelogin.show) {
        isRelogin.show = true
        ElMessageBox.confirm("登录状态已过期，您可以继续留在该页面，或者重新登录", "系统提示", {
          confirmButtonText: "重新登录",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            isRelogin.show = false
            useUserStore()
              .logout()
              .then(() => {
                location.href = import.meta.env.VITE_APP_CONTEXT_PATH + "login"
              })
          })
          .catch(() => {
            isRelogin.show = false
          })
      }
      return Promise.reject("无效的会话，或者会话已过期，请重新登录。")
    },
    apiUrl: import.meta.env.VITE_APP_BASE_API
  }
})
