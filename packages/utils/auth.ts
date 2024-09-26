import { useStorage, useSessionStorage } from "@vueuse/core"

const TokenKey = "User-Admin-Ui-Token"
const AuthorTokenKey = "Authorization"

const tokenStorage = useStorage<null | string>(TokenKey, null)
const authTokenStorage = useSessionStorage<null | string>(AuthorTokenKey, null)

export const getToken = () => tokenStorage.value

export const setToken = (access_token: string) => (tokenStorage.value = access_token)

export const removeToken = () => (tokenStorage.value = null)

// 存储header的Authorization的key
export const getAuthToken = () => authTokenStorage.value

export const setAuthToken = (token_name: string) => (authTokenStorage.value = token_name)

export const removeAuthToken = () => (authTokenStorage.value = null)
