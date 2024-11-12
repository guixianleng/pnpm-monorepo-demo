import {
  Box3,
  Vector3,
  Mesh,
  MeshPhongMaterial,
  MeshStandardMaterial,
  MeshBasicMaterial,
  Object3D,
  ObjectLoader
} from "three"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"
import { DDSLoader } from "three/examples/jsm/loaders/DDSLoader"
import { LoadingManager } from "three/src/loaders/LoadingManager"
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader"
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader"
import { TGALoader } from "three/examples/jsm/loaders/TGALoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"

const box: Box3 = new Box3()
const manager = new LoadingManager()
manager.addHandler(/\.dds$/i, new DDSLoader())
manager.addHandler(/\.tga$/i, new TGALoader())

// 加载器对象接口，提供更好的类型安全性
interface LoaderObj {
  loader: any
  getObject?: (input: any) => Object3D
}

// 获取包围盒大小
function getSize(obj: Object3D): Vector3 {
  box.setFromObject(obj)
  return box.getSize(new Vector3())
}

// 获取包围盒中心
function getCenter(obj: Object3D): Vector3 {
  box.setFromObject(obj)
  return box.getCenter(new Vector3())
}

// 提取文件扩展名
function getExtension(filePath: string): string {
  const extension = filePath.split(".").pop()
  return extension ? extension.toLowerCase() : ""
}

// 如果需要启用 Draco 加载器
function enableDraco(
  isDraco: boolean,
  loaderObj: LoaderObj,
  dir: string = "assets/draco/gltf/"
): void {
  if (isDraco) {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath(dir)
    dracoLoader.setDecoderConfig({ type: "js" })
    loaderObj.loader.setDRACOLoader(dracoLoader)
  }
}

// 根据文件扩展名自动选择模型加载器
function getLoader(
  filePath: string,
  fileType = "",
  isDraco = false,
  plyMaterial: "MeshStandardMaterial" | "MeshBasicMaterial" = "MeshBasicMaterial",
  dracoDir?: string
): LoaderObj | null {
  const fileExtension =
    fileType || getExtension(filePath) === "glb" ? "gltf" : getExtension(filePath)

  const loaderMap: Record<string, () => LoaderObj> = {
    dae: () => ({
      loader: new ColladaLoader(manager),
      getObject: collada => collada.scene
    }),
    fbx: () => ({ loader: new FBXLoader(manager) }),
    gltf: () => {
      const obj: LoaderObj = {
        loader: new GLTFLoader(manager),
        getObject: gltf => {
          const object = gltf.scene
          object.animations = gltf.animations
          return object
        }
      }
      enableDraco(isDraco, obj, dracoDir)
      return obj
    },
    obj: () => ({ loader: new OBJLoader(manager) }),
    ply: () => ({
      loader: new PLYLoader(manager),
      getObject: geometry => {
        geometry.computeVertexNormals()
        const material =
          plyMaterial === "MeshStandardMaterial"
            ? new MeshStandardMaterial()
            : new MeshBasicMaterial({ vertexColors: true })
        return new Mesh(geometry, material)
      }
    }),
    stl: () => ({
      loader: new STLLoader(manager),
      getObject: geometry => new Mesh(geometry, new MeshPhongMaterial())
    }),
    json: () => ({ loader: new ObjectLoader(manager) })
  }

  return loaderMap[fileExtension]?.() || null
}

// 获取材质加载器
function getMTLLoader(): MTLLoader {
  return new MTLLoader(manager)
}

export { getSize, getCenter, getLoader, getMTLLoader }
