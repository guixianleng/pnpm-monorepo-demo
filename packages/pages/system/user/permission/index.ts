export const permission = {
  /**
   * 用户管理-新增
   */
  ADD: ["system:user:add"],
  /**
   * 用户管理-修改
   */
  EDIT: ["system:user:edit"],
  /**
   * 用户管理-删除
   */
  DELETE: ["system:user:delete"],
  /**
   * 用户管理-导入导出
   */
  EXPORT: ["system:user:export"],
  /**
   * 角色分配
   */
  AUTH_ROLE: ["system:user:role"],
  /**
   * 重置密码
   */
  CZMM: ["system:user:resetPwd"]
}
