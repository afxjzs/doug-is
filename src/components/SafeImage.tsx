"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface SafeImageProps {
	src: string
	alt: string
	width?: number
	height?: number
	className?: string
	priority?: boolean
	fallbackSrc?: string
	fill?: boolean
	sizes?: string
	quality?: number
	onLoad?: () => void
	onError?: () => void
}

/**
 * SafeImage component that handles loading states and errors gracefully
 * Uses next/image for optimization with fallback handling
 */
export default function SafeImage({
	src,
	alt,
	width,
	height,
	className = "",
	priority = false,
	fallbackSrc = "https://placehold.co/600x400?text=Image+Not+Available",
	fill = false,
	sizes = "100vw",
	quality = 85,
	onLoad,
	onError,
}: SafeImageProps) {
	const [hasError, setHasError] = useState<boolean>(false)
	const [isLoaded, setIsLoaded] = useState<boolean>(false)

	// Check if image is from Supabase to disable optimization
	const isSupabaseImage =
		typeof src === "string" &&
		(src.includes("supabase.co") || src.includes("supabase.in"))

	// Handle image load error
	const handleError = () => {
		console.error(
			`Image failed to load: ${src}${
				isSupabaseImage ? " (Supabase image)" : ""
			}`
		)
		// Log extra details to help with debugging
		if (typeof window !== "undefined") {
			console.debug("Browser:", navigator.userAgent)
			console.debug("Image dimensions:", fill ? "fill" : `${width}x${height}`)
		}
		setHasError(true)
		onError?.()
	}

	// Handle image load success
	const handleLoad = () => {
		setIsLoaded(true)
		onLoad?.()
	}

	// Use the fallback if there's an error
	const imageSrc = hasError ? fallbackSrc : src

	return (
		<div className={cn("relative overflow-hidden", className)}>
			{/* Loading state */}
			{!isLoaded && !hasError && (
				<div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse" />
			)}

			{/* Image component with error handling */}
			<Image
				src={imageSrc}
				alt={alt}
				width={!fill ? width : undefined}
				height={!fill ? height : undefined}
				className={cn(
					"transition-opacity duration-300",
					isLoaded ? "opacity-100" : "opacity-0"
				)}
				onError={handleError}
				onLoad={handleLoad}
				priority={priority}
				fill={fill}
				sizes={sizes}
				quality={quality}
				unoptimized={isSupabaseImage || hasError} // Don't optimize Supabase images or fallback images
			/>
		</div>
	)
}
