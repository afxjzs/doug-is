"use client"

import { useEffect, useState } from "react"

const HEX_VB = "0 0 86.6 100"
const HEX_PTS = "43.3,0 86.6,25 86.6,75 43.3,100 0,75 0,25"

interface ParallaxHex {
	/** Width in px — larger = "closer" to camera */
	size: number
	/** CSS left position (e.g., "10%", "80%") */
	x: string
	/** Initial vertical position in vh */
	y: number
	/** Parallax speed multiplier — larger hexagons should be faster (closer) */
	speed: number
	/** Opacity — closer = more opaque */
	opacity: number
	/** Fill instead of stroke */
	filled?: boolean
	/** Stroke width for outline hexagons */
	strokeWidth?: number
	/** Rotation in degrees */
	rotation?: number
}

const DEFAULT_HEXAGONS: ParallaxHex[] = [
	// Large / close — scroll fast
	{ size: 120, x: "85%", y: 15, speed: 0.15, opacity: 0.06, strokeWidth: 1.5, rotation: 12 },
	{ size: 100, x: "5%", y: 60, speed: 0.12, opacity: 0.05, strokeWidth: 1, rotation: -8 },
	// Medium / mid-distance
	{ size: 60, x: "70%", y: 40, speed: 0.07, opacity: 0.04, strokeWidth: 1, rotation: 20 },
	{ size: 50, x: "20%", y: 25, speed: 0.06, opacity: 0.04, filled: true, rotation: -15 },
	{ size: 70, x: "50%", y: 75, speed: 0.08, opacity: 0.05, strokeWidth: 1.5, rotation: 5 },
	// Small / far away — scroll slow
	{ size: 30, x: "35%", y: 10, speed: 0.03, opacity: 0.03, filled: true, rotation: 30 },
	{ size: 25, x: "60%", y: 55, speed: 0.02, opacity: 0.03, strokeWidth: 2, rotation: -25 },
	{ size: 20, x: "90%", y: 80, speed: 0.02, opacity: 0.02, filled: true, rotation: 45 },
	{ size: 35, x: "15%", y: 90, speed: 0.04, opacity: 0.03, strokeWidth: 1, rotation: 10 },
	{ size: 40, x: "75%", y: 65, speed: 0.05, opacity: 0.04, strokeWidth: 1, rotation: -20 },
]

export function ParallaxHexagons({
	hexagons = DEFAULT_HEXAGONS,
	color = "rgb(var(--color-accent))",
	className = "",
}: {
	hexagons?: ParallaxHex[]
	color?: string
	className?: string
}) {
	const [scrollY, setScrollY] = useState(0)

	useEffect(() => {
		const handleScroll = () => {
			requestAnimationFrame(() => setScrollY(window.scrollY))
		}
		window.addEventListener("scroll", handleScroll, { passive: true })
		return () => window.removeEventListener("scroll", handleScroll)
	}, [])

	return (
		<div
			className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}
			style={{ zIndex: -1 }}
		>
			{hexagons.map((hex, i) => (
				<svg
					key={i}
					className="absolute"
					style={{
						width: hex.size,
						height: hex.size * (100 / 86.6),
						left: hex.x,
						top: `${hex.y}vh`,
						transform: `translateY(${-scrollY * hex.speed}px) rotate(${hex.rotation ?? 0}deg)`,
						opacity: hex.opacity,
						color,
						willChange: "transform",
					}}
					viewBox={HEX_VB}
				>
					<polygon
						points={HEX_PTS}
						fill={hex.filled ? "currentColor" : "none"}
						stroke="currentColor"
						strokeWidth={hex.strokeWidth ?? 0}
					/>
				</svg>
			))}
		</div>
	)
}
