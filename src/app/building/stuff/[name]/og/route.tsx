import { ImageResponse } from "next/og"
import { getStuffSlugs, getThingMeta } from "@/lib/stuff"

// A branded 1200x630 social card generated from each thing's <title>.
// Prerendered at build time (like the page itself) from the fixed file list.
export const dynamic = "force-static"
export const dynamicParams = false

const size = { width: 1200, height: 630 }

export async function generateStaticParams() {
	const slugs = await getStuffSlugs()
	return slugs.map((name) => ({ name }))
}

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ name: string }> }
) {
	const { name } = await params
	const meta = await getThingMeta(name)
	const title = meta?.title ?? "doug.is / building / stuff"
	const fontSize = title.length > 70 ? 52 : title.length > 40 ? 66 : 80

	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					padding: "72px 80px",
					background: "#0a0e1a",
					color: "#f4f6f8",
					fontFamily: "system-ui, sans-serif",
				}}
			>
				<div
					style={{
						display: "flex",
						fontSize: 26,
						letterSpacing: 6,
						textTransform: "uppercase",
						color: "#d4a853",
						fontWeight: 600,
					}}
				>
					doug.is
				</div>
				<div
					style={{
						display: "flex",
						fontSize,
						fontWeight: 700,
						lineHeight: 1.1,
						maxWidth: "1040px",
					}}
				>
					{title}
				</div>
				<div style={{ display: "flex", fontSize: 30, color: "#8a93a3" }}>
					/building/stuff
				</div>
			</div>
		),
		{ ...size }
	)
}
