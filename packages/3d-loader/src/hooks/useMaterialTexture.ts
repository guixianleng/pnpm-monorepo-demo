import { BasePropsType } from "../props"
import { ComputedRef, unref } from "vue"
import { getMTLLoader } from "../util/loadModel"
import { isString } from "../util/helpers"
import { Fn } from "../types"

interface IMtlContext {
  getProps: ComputedRef<BasePropsType>
  loader: any
  loadFilePath: Fn
}

export function useMaterialTexture({ getProps, loader, loadFilePath }: IMtlContext) {
  // 加载材质
  function loadMaterial(filePath: string, getObject: any, index: number) {
    const { crossOrigin, requestHeader, mtlPath } = unref(getProps)

    // 获取材质加载器
    const mtlLoader = getMTLLoader()
    if (crossOrigin) {
      mtlLoader.setCrossOrigin(crossOrigin)
    }
    if (requestHeader) {
      mtlLoader.setRequestHeader(requestHeader as any)
    }

    // 获取对应索引的材质路径
    const mtl = isString(mtlPath) ? mtlPath : mtlPath[index]
    const mtlPathArray: any = /^(.*\/)([^/]*)$/.exec(mtl)
    const path = mtlPathArray[1]
    const file = mtlPathArray[2]
    // 设置材质加载器的路径并加载材质
    mtlLoader.setPath(path).load(file, (materials: any) => {
      materials.preload()
      loader?.setMaterials(materials)
      loadFilePath(filePath, getObject, index)
    })
  }

  return {
    loadMaterial
  }
}
