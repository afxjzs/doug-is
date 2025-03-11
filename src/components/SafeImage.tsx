"use client"

import { useState } from "react"
import Image from "next/image"

interface SafeImageProps {
	src: string
	alt: string
	fill?: boolean
	className?: string
	width?: number
	height?: number
}

export default function SafeImage({
	src,
	alt,
	fill,
	className,
	width = 800,
	height = 600,
}: SafeImageProps) {
	const [error, setError] = useState(false)

	// Use a simple placeholder instead of complex logic
	if (error || !src) {
		return (
			<div
				className={`${
					className || ""
				} bg-gradient-to-r from-purple-500/30 to-pink-500/30 flex items-center justify-center`}
				style={fill ? undefined : { width, height }}
			>
				<span className="text-white/50 text-sm">{alt}</span>
			</div>
		)
	}

	return (
		<Image
			src={src}
			alt={alt}
			fill={fill}
			width={!fill ? width : undefined}
			height={!fill ? height : undefined}
			className={className}
			onError={() => setError(true)}
			unoptimized={true} // Skip image optimization to reduce build issues
			loading="lazy" // Use lazy loading for better performance
		/>
	)
}
