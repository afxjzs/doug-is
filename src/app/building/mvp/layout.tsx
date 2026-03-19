import { Metadata } from "next"
import {
  getCanonicalUrl,
  getSiteName,
} from "@/lib/utils/domain-detection"

const title = "Your MVP, Built and Deployed in One Week | Doug Rogers"
const description =
  "Get a production-ready web app built and deployed in one week. Work with a YC alum and 25-year veteran product builder. $999 early bird pricing."

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: getCanonicalUrl("/building/mvp"),
    siteName: getSiteName(),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: "@glowingrec",
  },
  alternates: {
    canonical: getCanonicalUrl("/building/mvp"),
  },
}

export default function MVPLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
