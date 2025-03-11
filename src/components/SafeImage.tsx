"use client"

import { useState, useEffect } from "react"
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
	const [imgSrc, setImgSrc] = useState<string>(src)
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [hasError, setHasError] = useState<boolean>(false)

	// Reset state when src changes
	useEffect(() => {
		setImgSrc(src)
		setIsLoading(true)
		setHasError(false)
	}, [src])

	// Handle image load error
	const handleError = () => {
		setHasError(true)
		setImgSrc(fallbackSrc)
		setIsLoading(false)
		onError?.()
	}

	// Handle image load success
	const handleLoad = () => {
		setIsLoading(false)
		onLoad?.()
	}

	return (
		<div className={cn("relative overflow-hidden", className)}>
			{/* Loading indicator */}
			{isLoading && (
				<div className="absolute inset-0 bg-gray-100 animate-pulse" />
			)}

			{/* Image component with error handling */}
			<Image
				src={imgSrc}
				alt={alt}
				width={!fill ? width : undefined}
				height={!fill ? height : undefined}
				className={cn(
					"transition-opacity duration-300",
					isLoading ? "opacity-0" : "opacity-100",
					hasError ? "bg-gray-100" : ""
				)}
				onError={handleError}
				onLoad={handleLoad}
				priority={priority}
				fill={fill}
				sizes={sizes}
				quality={quality}
			/>
		</div>
	)
}
