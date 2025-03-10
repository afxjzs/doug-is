"use client"

import Image from "next/image"
import styles from "./IconWithGradient.module.css"

export default function IconWithGradient({
	icon,
	creator,
}: {
	icon: string
	creator: string
}) {
	return (
		<div className={styles.iconContainer}>
			<div className={styles.iconWrapper}>
				{/* Original icon */}
				<Image
					src={icon}
					alt={`Icon by ${creator}`}
					width={48}
					height={48}
					className={styles.icon}
				/>

				{/* Gradient overlay with mask */}
				<div
					className={styles.gradientOverlay}
					style={
						{
							maskImage: `url(${icon})`,
							WebkitMaskImage: `url(${icon})`,
							maskSize: "contain",
							WebkitMaskSize: "contain",
							maskRepeat: "no-repeat",
							WebkitMaskRepeat: "no-repeat",
							maskPosition: "center",
							WebkitMaskPosition: "center",
						} as React.CSSProperties
					}
				/>

				{/* Glow effect */}
				<div
					className={styles.gradientGlow}
					style={
						{
							maskImage: `url(${icon})`,
							WebkitMaskImage: `url(${icon})`,
							maskSize: "contain",
							WebkitMaskSize: "contain",
							maskRepeat: "no-repeat",
							WebkitMaskRepeat: "no-repeat",
							maskPosition: "center",
							WebkitMaskPosition: "center",
						} as React.CSSProperties
					}
				/>
			</div>
		</div>
	)
}
