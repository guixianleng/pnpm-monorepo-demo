// export * from "./auth"
// export * from "./modal"
// export * from "./requireIcons"
// export * from "./tab"
import auth from "./auth"
import modal from "./modal"
import tab from "./tab"
import icons from "./requireIcons"

export default {
  ...auth,
  icons,
  ...modal,
  ...tab
}
