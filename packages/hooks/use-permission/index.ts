import { useUserStore } from "@user-admin/store"
/**
 * 校验操作权限
 * @param per
 */
export const useHasPermission = (per: string[]) => {
  const { permissions } = useUserStore()

  const allPermission = "*"
  if (per && per.length > 0) {
    return permissions.some((permission: string) => {
      return allPermission === permission || per.includes(permission)
    })
  }
  return true
}
