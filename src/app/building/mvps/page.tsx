import { getVariant } from "@/lib/mvp-variants"
import MVPLandingPage from "@/components/mvp/MVPLandingPage"

export default function MVPPage() {
  const variant = getVariant("default")
  return <MVPLandingPage variant={variant} />
}
