import { CSSProperties } from "vue"
import { createTypes, toValidableType, VueTypesInterface, VueTypeValidableDef } from "vue-types"

type PropTypes = VueTypesInterface & {
  readonly style: VueTypeValidableDef<CSSProperties>
}

const newPropTypes = createTypes({
  func: undefined,
  bool: undefined,
  string: undefined,
  number: undefined,
  object: undefined,
  integer: undefined
}) as PropTypes

class propTypes extends newPropTypes {
  static get style() {
    return toValidableType("style", {
      type: [String, Object],
      default: undefined
    })
  }
}

export { propTypes }
