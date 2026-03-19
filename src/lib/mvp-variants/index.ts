import { MVPVariantConfig } from "./types"
import { defaultVariant } from "./default"

export type { MVPVariantConfig }

/** Registry of all variants. Add new variants here. */
const variants: Record<string, MVPVariantConfig> = {
  default: defaultVariant,
}

/** Get a variant config by slug. Falls back to default if not found. */
export function getVariant(slug?: string): MVPVariantConfig {
  if (!slug || !variants[slug]) {
    return defaultVariant
  }
  return variants[slug]
}

/** Get all registered variant IDs (useful for generateStaticParams). */
export function getAllVariantIds(): string[] {
  return Object.keys(variants)
}
