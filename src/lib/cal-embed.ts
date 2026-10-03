/**
 * Inline Cal.com booking embed, shared by /building/mvps and /automating.
 * Renders into the element with id `my-cal-inline-<namespace>`, which the
 * caller must already have in the DOM.
 */

interface CalEmbedOptions {
  calLink: string
  namespace: string
  /** Cal's brand color for its light and dark themes (the embed runs dark). */
  brand: { light: string; dark: string }
}

export function loadCalEmbed({ calLink, namespace, brand }: CalEmbedOptions) {
  // Match Cal.com's official embed pattern: set up queue before script loads
  const C = window as any
  const A = "https://app.cal.com/embed/embed.js"
  const L = "init"
  const p = function (a: any, ar: any) { a.q.push(ar) }
  const d = document

  C.Cal = C.Cal || function (...args: any[]) {
    const cal = C.Cal
    const ar = args
    if (!cal.loaded) {
      cal.ns = {}
      cal.q = cal.q || []
      d.head.appendChild(d.createElement("script")).src = A
      cal.loaded = true
    }
    if (ar[0] === L) {
      const api: any = function (...apiArgs: any[]) { p(api, apiArgs) }
      const ns = ar[1]
      api.q = api.q || []
      if (typeof ns === "string") {
        cal.ns[ns] = cal.ns[ns] || api
        p(cal.ns[ns], ar)
        p(cal, ["initNamespace", ns])
      } else {
        p(cal, ar)
      }
      return
    }
    p(cal, ar)
  }

  C.Cal("init", namespace, { origin: "https://app.cal.com" })

  C.Cal.ns[namespace]("inline", {
    elementOrSelector: `#my-cal-inline-${namespace}`,
    config: { layout: "month_view", useSlotsViewOnSmallScreen: "true", theme: "dark" },
    calLink,
  })

  C.Cal.ns[namespace]("ui", {
    theme: "dark",
    cssVarsPerTheme: {
      light: { "cal-brand": brand.light },
      dark: { "cal-brand": brand.dark },
    },
    hideEventTypeDetails: false,
    layout: "month_view",
  })
}
