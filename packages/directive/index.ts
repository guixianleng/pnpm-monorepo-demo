import { hasPermi, hasRoles } from "./permission"
import { App } from "vue"

export default (app: App) => {
  app.directive("hasPermi", hasPermi)
  app.directive("hasRoles", hasRoles)
}
