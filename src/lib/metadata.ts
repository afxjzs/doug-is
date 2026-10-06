import type { Metadata } from "next"

/**
 * One place for page titles and social metadata.
 *
 * Title format: "doug.is / Advising" for a section, "doug.is / building /
 * Oil Price Ticker" for a page inside one. The root layout owns the format
 * through its "doug.is / %s" title template; pages pass only their own part.
 * Open Graph and Twitter titles don't go through that template, so
 * pageMetadata() builds the same full string for them from the same constants.
 *
 * Paths and image URLs are relative. The root layout's metadataBase
 * (getSiteUrl()) turns them into absolute URLs.
 */

export const SITE_NAME = "doug.is"
export const TITLE_SEPARATOR = " / "
export const TITLE_TEMPLATE = `${SITE_NAME}${TITLE_SEPARATOR}%s`
export const HOME_TITLE = `${SITE_NAME} | Engineer, Advisor, Investor`
export const TWITTER_HANDLE = "@doug__is"

const DEFAULT_IMAGE: SocialImage = {
	url: "/images/projects/doug-is.png",
	width: 1200,
	height: 630,
	alt: SITE_NAME,
}

export interface SocialImage {
	url: string
	width?: number
	height?: number
	alt?: string
}

export interface PageMetadataOptions {
	/** Title parts after "doug.is", e.g. ["Advising"] or ["building", "Inn Ruby Gem"]. */
	trail: string[]
	description: string
	/** The page's canonical path, e.g. "/advising". */
	path: string
	image?: SocialImage
	/** Set for blog posts; adds article timestamps to Open Graph. */
	article?: {
		publishedTime?: string | null
		modifiedTime?: string | null
		section?: string
		tags?: string[]
	}
	noindex?: boolean
}

export function formatTitle(trail: string[]): string {
	return [SITE_NAME, ...trail].join(TITLE_SEPARATOR)
}

export function pageMetadata({
	trail,
	description,
	path,
	image = DEFAULT_IMAGE,
	article,
	noindex,
}: PageMetadataOptions): Metadata {
	if (trail.length === 0) {
		throw new Error(`pageMetadata(${path}): trail is empty; the homepage sets its own title`)
	}
	const fullTitle = formatTitle(trail)
	const images = [{ ...image, alt: image.alt ?? fullTitle }]

	return {
		// The root layout's template turns `default` into "doug.is / ...".
		// Passing the template along means a layout using this helper hands
		// the same format to the pages under it.
		title: { default: trail.join(TITLE_SEPARATOR), template: TITLE_TEMPLATE },
		description,
		alternates: { canonical: path },
		openGraph: {
			title: fullTitle,
			description,
			url: path,
			siteName: SITE_NAME,
			locale: "en_US",
			images,
			...(article
				? {
						type: "article",
						publishedTime: article.publishedTime ?? undefined,
						modifiedTime: article.modifiedTime ?? article.publishedTime ?? undefined,
						authors: ["Douglas Rogers"],
						section: article.section,
						tags: article.tags,
					}
				: { type: "website" }),
		},
		twitter: {
			card: "summary_large_image",
			title: fullTitle,
			description,
			images: [image.url],
			creator: TWITTER_HANDLE,
		},
		...(noindex ? { robots: { index: false, follow: false } } : {}),
	}
}
