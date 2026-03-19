import { getVariant, getAllVariantIds } from "@/lib/mvp-variants"
import MVPLandingPage from "@/components/mvp/MVPLandingPage"

interface MVPVariantPageProps {
  params: Promise<{ variant: string }>
}

export function generateStaticParams() {
  return getAllVariantIds()
    .filter((id) => id !== "default")
    .map((id) => ({ variant: id }))
}

export default async function MVPVariantPage({ params }: MVPVariantPageProps) {
  const { variant: variantSlug } = await params
  const variant = getVariant(variantSlug)
  return <MVPLandingPage variant={variant} />
}
