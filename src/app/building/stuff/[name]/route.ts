import { getStuffSlugs, readThing, injectNav } from "@/lib/stuff"

// Prerendered at build time from the fixed list of files; no runtime filesystem
// access and no arbitrary paths can be requested.
export const dynamic = "force-static"
export const dynamicParams = false

export async function generateStaticParams() {
	const slugs = await getStuffSlugs()
	return slugs.map((name) => ({ name }))
}

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ name: string }> }
) {
	const { name } = await params
	const html = await readThing(name)

	if (html === null) {
		return new Response("Not found", { status: 404 })
	}

	return new Response(injectNav(html), {
		headers: { "content-type": "text/html; charset=utf-8" },
	})
}
