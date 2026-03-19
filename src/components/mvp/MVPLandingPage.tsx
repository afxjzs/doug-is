"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { MVPVariantConfig } from "@/lib/mvp-variants/types"
import { useAnalytics } from "@/lib/analytics/context"

interface MVPLandingPageProps {
  variant: MVPVariantConfig
}

type FormStatus = "idle" | "submitting" | "success" | "error"

const STORAGE_KEY = "mvp-lead-form"

const iconMap: Record<string, React.ReactNode> = {
  rocket: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
  ),
  lock: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
  "credit-card": (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
    </svg>
  ),
  flow: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ),
}

function loadCalEmbed(calLink: string, namespace: string) {
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
      light: { "cal-brand": "#0d1121" },
      dark: { "cal-brand": "#517bf4" },
    },
    hideEventTypeDetails: false,
    layout: "month_view",
  })
}

export default function MVPLandingPage({ variant }: MVPLandingPageProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [formStatus, setFormStatus] = useState<FormStatus>("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const calLoadedRef = useRef(false)
  const analytics = useAnalytics()

  // Check for ?showcal=1 to skip straight to calendar
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("showcal") === "1") {
      setFormStatus("success")
    }
  }, [])

  // Track page view with UTM params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const utmProps: Record<string, string> = {}
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
      const val = params.get(key)
      if (val) utmProps[key] = val
    }
    analytics.trackEvent({
      event: "project_view" as any,
      properties: {
        project_name: "mvp-landing",
        project_type: "landing-page",
        variant: variant.id,
        referrer: document.referrer || undefined,
        ...utmProps,
        timestamp: new Date().toISOString(),
      },
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Initialize form data from localStorage or defaults
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.status === "success") {
          setFormStatus("success")
          setFormData(parsed.data || {})
          return
        }
        setFormData(parsed.data || {})
        return
      } catch {
        // ignore corrupt data
      }
    }
    const initial: Record<string, string> = {}
    variant.form.fields.forEach((f) => {
      initial[f.name] = ""
    })
    setFormData(initial)
  }, [variant.form.fields])

  // Persist form data to localStorage
  const updateFormData = useCallback(
    (name: string, value: string) => {
      setFormData((prev) => {
        const next = { ...prev, [name]: value }
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ data: next, status: "idle" })
        )
        return next
      })
    },
    []
  )

  // Load Cal.com when form succeeds
  useEffect(() => {
    if (formStatus === "success" && !calLoadedRef.current) {
      calLoadedRef.current = true
      setTimeout(() => {
        loadCalEmbed(variant.cal.link, variant.cal.namespace)
      }, 100)
    }
  }, [formStatus, variant.cal.link, variant.cal.namespace])

  // Listen for Cal.com booking completion
  useEffect(() => {
    const handleCalMessage = (e: MessageEvent) => {
      if (e.data?.type === "CAL:booking:created" || e.data?.type === "booking:created") {
        analytics.trackEvent({
          event: "project_demo_click" as any,
          properties: {
            project_name: "mvp-landing",
            interaction: "cal_booking_completed",
            variant: variant.id,
            timestamp: new Date().toISOString(),
          },
        })
      }
    }
    window.addEventListener("message", handleCalMessage)
    return () => window.removeEventListener("message", handleCalMessage)
  }, [analytics, variant.id])

  const scrollToForm = () => {
    analytics.trackEvent({
      event: "project_demo_click" as any,
      properties: {
        project_name: "mvp-landing",
        interaction: "cta_click",
        variant: variant.id,
        timestamp: new Date().toISOString(),
      },
    })
    formRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus("submitting")
    setErrorMessage("")

    analytics.trackEvent({
      event: "contact_form_submit",
      properties: {
        form_type: "mvp-lead",
        variant: variant.id,
        stage: formData.stage,
        timestamp: new Date().toISOString(),
      },
    })

    try {
      const res = await fetch("/api/mvp-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || "",
          idea: formData.idea,
          stage: formData.stage,
          variant: variant.id,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Something went wrong")
      }

      setFormStatus("success")
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ data: formData, status: "success" })
      )

      analytics.trackEvent({
        event: "contact_form_success",
        properties: {
          form_type: "mvp-lead",
          variant: variant.id,
          stage: formData.stage,
          timestamp: new Date().toISOString(),
        },
      })
    } catch (error) {
      const msg = error instanceof Error ? error.message : "An unexpected error occurred"
      setFormStatus("error")
      setErrorMessage(msg)

      analytics.trackEvent({
        event: "contact_form_error",
        properties: {
          form_type: "mvp-lead",
          error_message: msg,
          variant: variant.id,
          timestamp: new Date().toISOString(),
        },
      })
    }
  }


  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        .mvp-landing * { box-sizing: border-box; }
        .mvp-landing h1, .mvp-landing h2, .mvp-landing h3, .mvp-landing h4 { font-family: 'Inter', system-ui, sans-serif; }
        @keyframes mvp-float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        @keyframes mvp-glow-pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
        @keyframes mvp-gradient-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes mvp-slide-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .mvp-gradient-text { background: linear-gradient(135deg, #60A5FA, #A78BFA, #34D399); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; background-size: 200% 200%; animation: mvp-gradient-shift 6s ease infinite; }
        .mvp-card-glow:hover { box-shadow: 0 0 40px rgba(59, 130, 246, 0.08), 0 8px 32px rgba(0, 0, 0, 0.3); }
        .mvp-stat-card { background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.8)); backdrop-filter: blur(12px); }
        .mvp-feature-icon { background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(167, 139, 250, 0.15)); }
        .mvp-step-number { background: linear-gradient(135deg, #3B82F6, #8B5CF6); }
        .mvp-cta-btn { background: linear-gradient(135deg, #3B82F6, #6366F1); transition: all 0.3s ease; }
        .mvp-cta-btn:hover { background: linear-gradient(135deg, #2563EB, #4F46E5); box-shadow: 0 0 40px rgba(59, 130, 246, 0.35); transform: translateY(-2px); }
        .mvp-form-input { transition: all 0.2s ease; }
        .mvp-form-input:focus { box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2); }
      `}</style>

      <div className="mvp-landing bg-[#0B1120] text-[#F8FAFC]">

        {/* Hero */}
        <section className="relative overflow-hidden min-h-[85vh] flex items-center">
          {/* Background gradient mesh */}
          <div className="absolute inset-0">
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[120px]" style={{ animation: "mvp-glow-pulse 4s ease infinite" }} />
            <div className="absolute top-[20%] right-[-5%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" style={{ animation: "mvp-glow-pulse 5s ease infinite 1s" }} />
            <div className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] bg-emerald-500/8 rounded-full blur-[100px]" style={{ animation: "mvp-glow-pulse 6s ease infinite 2s" }} />
            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
          </div>

          <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-0 text-center" style={{ animation: "mvp-slide-up 0.8s ease-out" }}>
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[rgba(59,130,246,0.08)] border border-[rgba(59,130,246,0.2)] text-sm text-blue-400 mb-10 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Now accepting projects
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05] mb-8">
              <span className="mvp-gradient-text">
                {variant.hero.headline.split("\n").map((line, i, arr) => (
                  <span key={i}>
                    {line}
                    {i < arr.length - 1 && <br />}
                  </span>
                ))}
              </span>
            </h1>

            <p className="text-lg md:text-2xl text-[#94A3B8] max-w-2xl mx-auto mb-12 leading-relaxed font-light">
              {variant.hero.subHeadline}
            </p>

            {/* Hero mockup image */}
            <div className="relative mx-auto max-w-2xl mb-12">
              <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-emerald-500/20 rounded-3xl blur-2xl" />
              <Image
                src="/images/app-mockups.webp"
                alt="Example MVPs built by Doug"
                width={800}
                height={500}
                className="relative rounded-2xl"
                priority
              />
            </div>

            {variant.pricing.show && (
              <div className="flex items-center justify-center gap-4 mb-12">
                <span className="text-[#64748B] line-through text-xl">
                  {variant.pricing.originalPrice}
                </span>
                <span className="text-5xl md:text-6xl font-extrabold text-white">
                  {variant.pricing.currentPrice}
                </span>
                <span className="px-4 py-1.5 rounded-full bg-emerald-500/15 text-emerald-400 text-sm font-semibold border border-emerald-500/25">
                  {variant.pricing.label}
                </span>
              </div>
            )}

            <button
              onClick={scrollToForm}
              className="mvp-cta-btn inline-flex items-center gap-3 px-10 py-5 text-white text-lg font-semibold rounded-2xl"
            >
              {variant.hero.ctaText}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        </section>

        {/* Value Prop / Stats */}
        <section className="relative py-24 md:py-32">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-5">
              {variant.valueProp.headline}
            </h2>
            <p className="text-[#94A3B8] text-lg md:text-xl text-center max-w-3xl mx-auto mb-16 leading-relaxed">
              {variant.valueProp.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {variant.valueProp.stats.map((stat, idx) => (
                <div
                  key={stat.label}
                  className="mvp-stat-card text-center p-10 rounded-3xl border border-[rgba(148,163,184,0.08)] hover:border-[rgba(59,130,246,0.2)] transition-all duration-300"
                >
                  <div className={`text-5xl md:text-6xl font-extrabold mb-3 ${idx === 0 ? "text-blue-400" : idx === 1 ? "text-emerald-400" : "text-purple-400"}`}>
                    {stat.value}
                  </div>
                  <div className="text-[#94A3B8] text-sm uppercase tracking-widest font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What You Get */}
        <section className="py-24 md:py-32 relative">
          {/* Subtle background accent */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[300px] h-[500px] bg-purple-600/5 rounded-full blur-[100px]" />

          <div className="relative max-w-5xl mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-5">
              {variant.features.headline}
            </h2>
            <p className="text-[#94A3B8] text-lg md:text-xl text-center max-w-2xl mx-auto mb-16">
              {variant.features.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {variant.features.items.map((item) => (
                <div
                  key={item.title}
                  className="mvp-card-glow group p-8 rounded-3xl bg-[#111827] border border-[rgba(148,163,184,0.08)] hover:border-[rgba(99,102,241,0.3)] transition-all duration-300"
                >
                  <div className="mvp-feature-icon w-14 h-14 rounded-2xl flex items-center justify-center text-blue-400 mb-5 group-hover:scale-110 transition-transform duration-300">
                    {iconMap[item.icon] || iconMap.rocket}
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-blue-300 transition-colors">{item.title}</h3>
                  <p className="text-[#94A3B8] leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Credentials / About */}
        <section className="py-24 md:py-32 relative overflow-hidden">
          <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-b from-[#111827]/50 via-[#0B1120] to-[#111827]/50" />
          {/* Accent glow behind photo */}
          <div className="absolute left-[10%] top-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[80px]" />

          <div className="relative max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
              {/* Photo side */}
              <div className="text-center md:text-left">
                <div className="relative inline-block mb-10">
                  {/* Glow ring */}
                  <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-emerald-500/30 blur-sm" />
                  <div className="relative w-52 h-52 md:w-64 md:h-64 rounded-3xl overflow-hidden border border-[rgba(148,163,184,0.15)]">
                    <Image
                      src={variant.credentials.image}
                      alt="Doug Rogers"
                      width={256}
                      height={256}
                      className="object-cover w-full h-full"
                      priority
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  {variant.credentials.credentials.map((cred) => (
                    <span
                      key={cred.text}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111827] border border-[rgba(148,163,184,0.1)] text-sm text-[#CBD5E1] font-medium"
                    >
                      {cred.logo && (
                        <Image
                          src={cred.logo}
                          alt={cred.text}
                          width={18}
                          height={18}
                          className="object-contain"
                        />
                      )}
                      {cred.text}
                    </span>
                  ))}
                </div>
              </div>

              {/* Copy side */}
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                  <span className="mvp-gradient-text">{variant.credentials.headline}</span>
                </h2>
                <p className="text-[#94A3B8] text-lg leading-relaxed">
                  {variant.credentials.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 md:py-32 relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[500px] h-[300px] bg-indigo-600/5 rounded-full blur-[100px]" />

          <div className="relative max-w-5xl mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-20">
              {variant.process.headline}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {/* Connecting line (desktop) */}
              <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0" />

              {variant.process.steps.map((step) => (
                <div key={step.number} className="relative text-center group">
                  <div className="mvp-step-number relative z-10 w-24 h-24 rounded-3xl flex items-center justify-center text-3xl font-extrabold text-white mx-auto mb-8 shadow-[0_0_30px_rgba(59,130,246,0.2)] group-hover:shadow-[0_0_40px_rgba(99,102,241,0.3)] transition-shadow duration-300">
                    {step.number}
                  </div>
                  <h3 className="font-bold text-lg mb-3">{step.title}</h3>
                  <p className="text-[#94A3B8] text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 md:py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120] via-[#111827]/30 to-[#0B1120]" />

          <div className="relative max-w-3xl mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
              {variant.faq.headline}
            </h2>
            <div className="space-y-4">
              {variant.faq.items.map((item, idx) => (
                <div
                  key={item.question}
                  className="rounded-2xl border border-[rgba(148,163,184,0.08)] overflow-hidden transition-all duration-200 hover:border-[rgba(148,163,184,0.15)]"
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-6 md:p-7 text-left bg-[#111827] hover:bg-[#1E293B]/60 transition-colors"
                  >
                    <span className="font-semibold text-lg pr-4">{item.question}</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${openFaqIndex === idx ? "bg-blue-500/20 rotate-180" : "bg-[rgba(148,163,184,0.08)]"}`}>
                      <svg
                        className="w-4 h-4 text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{ maxHeight: openFaqIndex === idx ? "500px" : "0px", opacity: openFaqIndex === idx ? 1 : 0 }}
                  >
                    <div className="px-6 md:px-7 pb-6 md:pb-7 bg-[#111827] text-[#94A3B8] leading-relaxed">
                      {item.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-24 md:py-32 relative" ref={formRef}>
          {/* Background accent */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[600px] h-[400px] bg-blue-600/8 rounded-full blur-[120px]" />

          <div className="relative max-w-lg mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-5">
              <span className="mvp-gradient-text">{variant.form.headline}</span>
            </h2>
            <p className="text-[#94A3B8] text-lg text-center mb-12">
              {variant.form.description}
            </p>

            {formStatus === "success" ? (
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-6 border border-emerald-500/25">
                  <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">You&apos;re in!</h3>
                <p className="text-[#94A3B8] mb-10">
                  Now let&apos;s get a time on the calendar to talk about your idea.
                </p>
                {/* Cal.com embed container */}
                <div
                  id={`my-cal-inline-${variant.cal.namespace}`}
                  className="w-full min-h-[550px] rounded-2xl overflow-auto bg-[#111827] border border-[rgba(148,163,184,0.1)]"
                  style={{ colorScheme: "dark" }}
                />
              </div>
            ) : (
              <div className="p-8 md:p-10 rounded-3xl bg-[#111827] border border-[rgba(148,163,184,0.08)]">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {formStatus === "error" && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      {errorMessage}
                    </div>
                  )}

                  {variant.form.fields.map((field) => (
                    <div key={field.name}>
                      <label
                        htmlFor={field.name}
                        className="block text-sm font-medium text-[#CBD5E1] mb-2"
                      >
                        {field.label}
                        {!field.required && (
                          <span className="text-[#475569] ml-1 font-normal">(optional)</span>
                        )}
                      </label>

                      {field.type === "select" ? (
                        <select
                          id={field.name}
                          name={field.name}
                          value={formData[field.name] || ""}
                          onChange={(e) => updateFormData(field.name, e.target.value)}
                          required={field.required}
                          disabled={formStatus === "submitting"}
                          className="mvp-form-input w-full px-4 py-3.5 rounded-xl bg-[#0B1120] border border-[rgba(148,163,184,0.12)] text-white focus:outline-none focus:border-blue-500/50 appearance-none"
                        >
                          <option value="" disabled>
                            {field.placeholder}
                          </option>
                          {field.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      ) : field.type === "textarea" ? (
                        <textarea
                          id={field.name}
                          name={field.name}
                          value={formData[field.name] || ""}
                          onChange={(e) => {
                            updateFormData(field.name, e.target.value)
                            // Auto-expand
                            e.target.style.height = "auto"
                            e.target.style.height = e.target.scrollHeight + "px"
                          }}
                          placeholder={field.placeholder}
                          required={field.required}
                          disabled={formStatus === "submitting"}
                          rows={4}
                          className="mvp-form-input w-full px-4 py-3.5 rounded-xl bg-[#0B1120] border border-[rgba(148,163,184,0.12)] text-white placeholder-[#475569] focus:outline-none focus:border-blue-500/50 resize-none overflow-hidden"
                        />
                      ) : (
                        <input
                          type={field.type}
                          id={field.name}
                          name={field.name}
                          value={formData[field.name] || ""}
                          onChange={(e) => updateFormData(field.name, e.target.value)}
                          placeholder={field.placeholder}
                          required={field.required}
                          disabled={formStatus === "submitting"}
                          className="mvp-form-input w-full px-4 py-3.5 rounded-xl bg-[#0B1120] border border-[rgba(148,163,184,0.12)] text-white placeholder-[#475569] focus:outline-none focus:border-blue-500/50"
                        />
                      )}
                    </div>
                  ))}

                  <button
                    type="submit"
                    disabled={formStatus === "submitting"}
                    className="mvp-cta-btn w-full py-4 text-white text-lg font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                  >
                    {formStatus === "submitting" ? (
                      <span className="inline-flex items-center gap-2">
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      variant.form.submitText
                    )}
                  </button>

                  <p className="text-center text-sm text-[#475569]">
                    No spam. Just a quick conversation about your idea.
                  </p>
                </form>
              </div>
            )}
          </div>
        </section>

        {/* Minimal footer */}
        <footer className="py-8 border-t border-[rgba(148,163,184,0.06)]">
          <div className="max-w-5xl mx-auto px-6 text-center text-sm text-[#475569]">
            &copy; {new Date().getFullYear()} Doug Rogers. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  )
}
