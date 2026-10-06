"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import Image, { type ImageProps } from "next/image"

type Props = ImageProps & {
	alt: string
	src: string
	/** Classes for the clickable wrapper. With `fill`, give it a size (it is the positioned parent). */
	wrapperClassName?: string
}

/**
 * A next/image that opens full size when clicked. The overlay closes on Escape, the close
 * button, or any click, and hands focus back to the image.
 */
export default function ZoomableImage({ wrapperClassName = "", alt, ...imageProps }: Props) {
	const [open, setOpen] = useState(false)
	const triggerRef = useRef<HTMLButtonElement>(null)
	const closeRef = useRef<HTMLButtonElement>(null)

	const close = useCallback(() => {
		setOpen(false)
		triggerRef.current?.focus()
	}, [])

	useEffect(() => {
		if (!open) return
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") close()
		}
		document.addEventListener("keydown", onKey)
		const previousOverflow = document.body.style.overflow
		document.body.style.overflow = "hidden"
		closeRef.current?.focus()
		return () => {
			document.removeEventListener("keydown", onKey)
			document.body.style.overflow = previousOverflow
		}
	}, [open, close])

	return (
		<>
			<button
				ref={triggerRef}
				type="button"
				onClick={() => setOpen(true)}
				aria-label={`View full size: ${alt}`}
				className={`relative block w-full cursor-zoom-in ${imageProps.fill ? "h-full" : ""} ${wrapperClassName}`}
			>
				<Image {...imageProps} alt={alt} />
			</button>

			{/* Portaled to <body>: the page content sits in a z-0 stacking context, which would
			    otherwise keep the overlay under the site header whatever its z-index. */}
			{open && createPortal(
				<div
					role="dialog"
					aria-modal="true"
					aria-label={alt}
					onClick={close}
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 cursor-zoom-out"
				>
					<button
						ref={closeRef}
						type="button"
						onClick={close}
						aria-label="Close"
						className="absolute top-4 right-4 rounded-full bg-[rgba(var(--color-foreground),0.1)] hover:bg-[rgba(var(--color-foreground),0.2)] p-2 text-[rgb(var(--color-foreground))]"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M18 6 6 18M6 6l12 12" />
						</svg>
					</button>
					{/* The original file at its own size, shrunk only to fit the screen. */}
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={imageProps.src}
						alt={alt}
						className="max-h-[95vh] max-w-[95vw] object-contain rounded-lg shadow-2xl"
					/>
				</div>,
				document.body
			)}
		</>
	)
}
