import { AmbientLight, PointLight, HemisphereLight, DirectionalLight, Light, Scene } from "three"
import { BasePropsType } from "../props"
import { ComputedRef, unref } from "vue"

interface ILightContext {
  getProps: ComputedRef<BasePropsType>
  scene: Scene
}

let allLights: Light[] = []

export function useLights({ getProps, scene }: ILightContext) {
  function updateLights() {
    const { lights } = unref(getProps)
    scene.remove(...allLights)
    allLights = []

    // 遍历传入的光源数据，动态创建并添加到场景中
    lights.forEach((item: any) => {
      if (!item.type) return
      const type = item.type.toLowerCase()
      let light: any = null
      // 环境光源 (Ambient Light)
      if (type === "ambient" || type === "ambientlight") {
        const color = item.color === 0x000000 ? item.color : item.color || 0x404040
        const intensity = item.intensity === 0 ? item.intensity : item.intensity || 1
        light = new AmbientLight(color, intensity)
      }

      // 点光源 (Point Light)
      if (type === "point" || type === "pointlight") {
        const color = item.color === 0x000000 ? item.color : item.color || 0xffffff
        const intensity = item.intensity === 0 ? item.intensity : item.intensity || 1
        const distance = item.distance || 0
        const decay = item.decay === 0 ? item.decay : item.decay || 1
        light = new PointLight(color, intensity, distance, decay)
        if (item.position) {
          light.position.copy(item.position)
        }
      }

      // 平行光源 (Directional Light)
      if (type === "directional" || type === "directionallight") {
        const color = item.color === 0x000000 ? item.color : item.color || 0xffffff
        const intensity = item.intensity === 0 ? item.intensity : item.intensity || 1

        light = new DirectionalLight(color, intensity)

        if (item.position) {
          light.position.copy(item.position)
        }

        if (item.target) {
          light.target.copy(item.target)
        }
      }

      // 半球光源 (Hemisphere Light)
      if (type === "hemisphere" || type === "hemispherelight") {
        const skyColor = item.skyColor === 0x000000 ? item.skyColor : item.skyColor || 0xffffff
        const groundColor =
          item.groundColor === 0x000000 ? item.groundColor : item.groundColor || 0xffffff
        const intensity = item.intensity === 0 ? item.intensity : item.intensity || 1

        light = new HemisphereLight(skyColor, groundColor, intensity)

        if (item.position) {
          light.position.copy(item.position)
        }
      }

      // 如果光源有效，则将其添加到场景中
      if (light) {
        allLights.push(light)
        scene.add(light)
      }
    })
  }

  // 光源跟随相机
  function setLightFollowCamera(camera: any) {
    const vector = camera.position.clone()
    scene.children.forEach((item: any) => {
      if (item instanceof PointLight) {
        item.position.set(vector.x, vector.y, vector.z)
      }
    })
  }

  return {
    updateLights,
    setLightFollowCamera
  }
}
