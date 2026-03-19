export interface MVPVariantConfig {
  /** Unique variant identifier (used for analytics + routing) */
  id: string

  /** Hero section */
  hero: {
    headline: string
    subHeadline: string
    ctaText: string
  }

  /** Value proposition section */
  valueProp: {
    headline: string
    description: string
    stats: Array<{
      value: string
      label: string
    }>
  }

  /** What you get section */
  features: {
    headline: string
    description: string
    items: Array<{
      title: string
      description: string
      icon: string // icon identifier
    }>
  }

  /** Credentials / "work with a real human" section */
  credentials: {
    headline: string
    description: string
    image: string // path to headshot
    credentials: Array<{
      text: string
      logo?: string // optional logo image path
    }>
  }

  /** How it works section */
  process: {
    headline: string
    steps: Array<{
      number: number
      title: string
      description: string
    }>
  }

  /** FAQ section */
  faq: {
    headline: string
    items: Array<{
      question: string
      answer: string
    }>
  }

  /** Pricing display */
  pricing: {
    show: boolean
    currentPrice: string
    originalPrice: string
    label: string // e.g. "Early Bird"
  }

  /** Form configuration */
  form: {
    headline: string
    description: string
    fields: Array<{
      name: string
      label: string
      type: "text" | "email" | "tel" | "textarea" | "select"
      placeholder: string
      required: boolean
      options?: Array<{ value: string; label: string }> // for select fields
    }>
    submitText: string
  }

  /** Cal.com configuration */
  cal: {
    link: string
    namespace: string
    layout: string
  }
}
