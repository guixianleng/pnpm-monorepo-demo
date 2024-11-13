import { ref } from "vue"
import { AnimationClip, Object3D, AnimationMixer } from "three"
import type { Fn } from "../types"

let mixers: AnimationMixer | AnimationMixer[] = null as any

interface AnimateContext {
  getObject: Fn
}

export function useAnimations({ getObject }: AnimateContext) {
  const multipleModel = ref(false)

  // 播放动画
  function playAnimations(autoPlay: boolean) {
    const obj = getObject() as Object3D
    if (!obj) return

    if (multipleModel.value) {
      playMultiple(obj, autoPlay)
    } else {
      playSingle(obj, autoPlay)
    }
  }

  // 播放单个模型的动画
  function playSingle(item: Object3D, isPlay: boolean) {
    mixers = new AnimationMixer(item)
    // console.log("单个动画")
    toggleAnimation(item, mixers, isPlay)
  }

  // 播放多个模型的动画
  function playMultiple(obj: Object3D, isPlay: boolean) {
    mixers = obj.children.map(child => new AnimationMixer(child))
    // console.log("多模型多个动画")
    obj.children.forEach((child, index) => toggleAnimation(child, mixers[index], isPlay))
  }

  // 切换动画播放状态
  function toggleAnimation(item: Object3D, mixer: AnimationMixer, isPlay: boolean) {
    item.animations?.forEach((clip: AnimationClip) => {
      const action = mixer.clipAction(clip)
      isPlay ? action.play() : action.stop()
    })
  }

  // 更新动画混合器
  function updateAnimate(delta: number) {
    if (mixers) {
      if (Array.isArray(mixers)) {
        mixers.forEach(mixer => mixer.update(delta))
      } else {
        mixers.update(delta)
      }
    }
  }

  return {
    playAnimations,
    multipleModel,
    updateAnimate
  }
}
