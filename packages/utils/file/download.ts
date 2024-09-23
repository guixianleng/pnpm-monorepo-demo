import { dataURLtoBlob, urlToBase64 } from "./base64Conver"
import type { BlobPart } from "./types"
import { UrlData } from "./types"

/**
 * 下载在线图片
 * @param url 图片地址
 * @param filename 文件名
 * @param mime
 * @param bom
 */
export function downloadByOnlineUrl(url: string, filename: string, mime?: string, bom?: BlobPart) {
  urlToBase64(url).then(base64 => {
    downloadByBase64(base64, filename, mime, bom)
  })
}

/**
 * 下载base64的图片
 * @param buf
 * @param filename
 * @param mime
 * @param bom
 */
export function downloadByBase64(buf: string, filename: string, mime?: string, bom?: BlobPart) {
  const base64Buf = dataURLtoBlob(buf)
  downloadByData(base64Buf, filename, mime, bom)
}

/**
 * 下载文件流的文件
 * @param {*} data
 * @param {*} filename
 * @param {*} mime
 * @param {*} bom
 */
export function downloadByData(data: BlobPart, filename: string, mime?: string, bom?: BlobPart) {
  const blobData = typeof bom !== "undefined" ? [bom, data] : [data]
  const blob = new Blob(blobData, { type: mime || "application/octet-stream" })

  const blobURL = window.URL.createObjectURL(blob)
  const tempLink = document.createElement("a")
  tempLink.style.display = "none"
  tempLink.href = blobURL
  tempLink.setAttribute("download", filename)
  if (typeof tempLink.download === "undefined") {
    tempLink.setAttribute("target", "_blank")
  }
  document.body.appendChild(tempLink)
  tempLink.click()
  document.body.removeChild(tempLink)
  window.URL.revokeObjectURL(blobURL)
}

/**
 * 下载链接地址
 * @param {*} sUrl
 */
export function downloadByUrl({ url, target = "_blank", fileName }: UrlData): boolean {
  const isChrome = window.navigator.userAgent.toLowerCase().indexOf("chrome") > -1
  const isSafari = window.navigator.userAgent.toLowerCase().indexOf("safari") > -1

  if (/(iP)/g.test(window.navigator.userAgent)) {
    console.error("Your browser does not support download!")
    return false
  }

  if (isChrome || isSafari) {
    const link = document.createElement("a")
    link.href = url
    link.target = target

    if (link.download !== undefined) {
      link.download = fileName || url.substring(url.lastIndexOf("/") + 1, url.length)
    }

    if (document.createEvent) {
      const e = document.createEvent("MouseEvents")
      e.initEvent("click", true, true)
      link.dispatchEvent(e)
      return true
    }
  }
  if (url.indexOf("?") === -1) {
    url += "?download"
  }

  openWindow(url, { target })

  return true
}

export function openWindow(
  url: string,
  opt?: { target?: "_self" | "_blank" | string; noopener?: boolean; noreferrer?: boolean }
) {
  const { target = "__blank", noopener = true, noreferrer = true } = opt || {}
  const feature: string[] = []

  noopener && feature.push("noopener=yes")
  noreferrer && feature.push("noreferrer=yes")

  window.open(url, target, feature.join(","))
}
