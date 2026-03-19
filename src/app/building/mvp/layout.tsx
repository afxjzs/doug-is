import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Build Your MVP in One Week | Doug Rogers",
  description:
    "Get a production-ready web app built and deployed in one week. Work with a YC alum and 25-year veteran builder. $999 early bird pricing.",
}

export default function MVPLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
