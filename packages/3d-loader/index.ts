import Loader from "./src/index.vue"
import { withInstall } from "../utils"
import type { SFCWithInstall } from "../utils"

const Adv3dLoader: SFCWithInstall<typeof Loader> = withInstall(Loader)

export default Adv3dLoader
