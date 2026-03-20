import { MVPVariantConfig } from "./types"

export const defaultVariant: MVPVariantConfig = {
  id: "default",

  hero: {
    headline: "Your MVP\nBuilt and Deployed\nin One Week",
    subHeadline:
      "Most early products die in the same place: too much planning, too many contractors, and not enough real shipping.",
    ctaText: "Let's Build Your MVP",
  },

  valueProp: {
    headline: "Why Now?",
    description:
      "AI has changed the game. What used to take months and $10,000–$25,000 in development costs can now be built in a week — without cutting corners.",
    stats: [
      { value: "1 Week", label: "Idea to live product" },
      { value: "$999", label: "Early bird price" },
      { value: "100%", label: "Custom-built for you" },
    ],
  },

  features: {
    headline: "What You Get",
    description:
      "A real, deployed web application — not a mockup, not a slide deck.",
    items: [
      {
        title: "Production-Ready Web App",
        description:
          "Deployed on modern infrastructure (Vercel + Supabase). Your app is live and accessible to real users from day one.",
        icon: "rocket",
      },
      {
        title: "User Authentication",
        description:
          "Secure login and signup built in. Your users can create accounts and access their data.",
        icon: "lock",
      },
      {
        title: "Basic Payments",
        description:
          "Stripe integration so you can start collecting revenue and validating willingness to pay.",
        icon: "credit-card",
      },
      {
        title: "Your Core User Flow",
        description:
          "The one thing your app needs to do — built end-to-end, polished, and ready for real users.",
        icon: "flow",
      },
    ],
  },

  audience: {
    headline: "Is This for You?",
    description:
      "This isn't for everyone. It's for people who are ready to stop planning and start shipping.",
    items: [
      "You have a strong idea but no technical cofounder",
      "You need to validate demand before raising or hiring",
      "You want to productize a workflow or service you already offer",
      "You're stuck between \"learn to code\" and \"hire an expensive agency\"",
    ],
  },

  credentials: {
    headline: "Built by a Human Who's Done This Before",
    description:
      "I'm Doug — a founder, engineer, and product builder with 25+ years of shipping real products. I've raised capital, exited companies, and made every mistake in the book so you don't have to.",
    image: "/images/doug-2024-cropped.png",
    credentials: [
      { text: "Y Combinator W15" },
      { text: "Techstars '24" },
      { text: "25+ Years Building" },
      { text: "2x Exits" },
      { text: "TechCrunch Disrupt" },
    ],
  },

  process: {
    headline: "How It Works",
    steps: [
      {
        number: 1,
        title: "Book a Discovery Call",
        description:
          "30 minutes to understand your idea, your users, and what success looks like. We'll define exactly what your MVP needs to do.",
      },
      {
        number: 2,
        title: "We Align on the Spec",
        description:
          "I'll map out the core user flow, features, and technical approach. You'll know exactly what you're getting before I write a line of code.",
      },
      {
        number: 3,
        title: "I Build It",
        description:
          "Using AI-accelerated development and 25 years of best practices, your MVP comes to life in about a week.",
      },
      {
        number: 4,
        title: "You Launch",
        description:
          "Your app goes live on your own domain. Share it, sell it, get feedback, and keep building.",
      },
    ],
  },

  faq: {
    headline: "Questions You Probably Have",
    items: [
      {
        question: "Can a real app actually be built in a week?",
        answer:
          "Yes. AI has fundamentally changed development speed. I combine AI tooling with 25 years of product building experience to build in days what used to take months. The key is focus — we build one core user flow extremely well, not a bloated feature list.",
      },
      {
        question: "What if my idea is too complex?",
        answer:
          "That's what the discovery call is for. We'll figure out together what the right starting point is — the core thing your app needs to do to be useful. If your vision is bigger than a week, we'll scope the right first version and you can keep building from there.",
      },
      {
        question: "What happens after the MVP is built?",
        answer:
          "You own everything. The code is built with best practices on a modern stack, so you can continue building on top of it. Need help iterating? I offer ongoing development services too.",
      },
      {
        question: "Is this a template or cookie-cutter app?",
        answer:
          "No. Every MVP is built from the ground up per your specifications. I use proven boilerplate and reusable components the same way any serious engineer would. But your app's logic, design, and user experience are unique to your product.",
      },
    ],
  },

  pricing: {
    show: true,
    currentPrice: "$999",
    originalPrice: "$2,500",
    label: "Early Bird",
  },

  form: {
    headline: "Ready to Build?",
    description:
      "You don't need a 12-person team. You need someone who can shape the product, make smart tradeoffs, and get it into the world.",
    fields: [
      {
        name: "name",
        label: "Your Name",
        type: "text",
        placeholder: "Jane Smith",
        required: true,
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "jane@example.com",
        required: true,
      },
      {
        name: "phone",
        label: "Phone (optional)",
        type: "tel",
        placeholder: "(555) 123-4567",
        required: false,
      },
      {
        name: "stage",
        label: "Where are you at with this?",
        type: "select",
        placeholder: "Select one...",
        required: true,
        options: [
          { value: "just-an-idea", label: "Just an idea" },
          { value: "some-research", label: "I've done some research" },
          {
            value: "customers-no-product",
            label: "I have paying customers but no product",
          },
          {
            value: "needs-rebuild",
            label: "I have a prototype but need it rebuilt",
          },
        ],
      },
      {
        name: "idea",
        label: "Tell me about your idea",
        type: "textarea",
        placeholder:
          "What does your app do? Who is it for? Share as much or as little as you'd like.",
        required: true,
      },
    ],
    submitText: "Submit & Book Your Call",
  },

  cal: {
    link: "afxjzs/mvp-discovery-call",
    namespace: "mvp-discovery-call",
    layout: "month_view",
  },
}
