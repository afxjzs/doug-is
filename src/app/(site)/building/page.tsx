import { listThings } from "@/lib/stuff"
import BuildingPortfolio from "./BuildingPortfolio"
import StuffSection from "./StuffSection"

// listThings() reads src/content/stuff/ from disk, so this page is a server
// component. The interactive Companies/Projects half lives in BuildingPortfolio.
export const dynamic = "force-static"

export default async function BuildingPage() {
	const things = await listThings()

	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-12">
				<p className="font-[family-name:var(--font-mono)] text-xs tracking-[0.1em] text-[rgba(var(--color-accent),0.75)] mb-2">
					doug.is/building
				</p>
				<h1 className="text-4xl font-bold display-heading mb-4">Building</h1>
				<p className="text-xl text-[rgba(var(--color-foreground),0.8)]">
					Companies and projects I&apos;m building or have built.
				</p>
			</div>

			<BuildingPortfolio />

			<StuffSection things={things} />
		</div>
	)
}
