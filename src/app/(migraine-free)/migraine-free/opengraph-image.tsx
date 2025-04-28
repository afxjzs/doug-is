import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Migraine Trigger Foods Database"
export const size = {
	width: 1200,
	height: 630,
}
export const contentType = "image/png"

export default async function Image() {
	return new ImageResponse(
		(
			<div
				style={{
					background: "linear-gradient(to bottom, #0f172a, #1e293b)",
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					padding: "40px",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						gap: "20px",
					}}
				>
					<h1
						style={{
							fontSize: "60px",
							color: "white",
							textAlign: "center",
							marginBottom: "20px",
						}}
					>
						Migraine Trigger Foods Database
					</h1>
					<p
						style={{
							fontSize: "32px",
							color: "#94a3b8",
							textAlign: "center",
							maxWidth: "800px",
						}}
					>
						A comprehensive database of foods and ingredients that may trigger
						migraines
					</p>
					<div
						style={{
							display: "flex",
							gap: "20px",
							marginTop: "40px",
						}}
					>
						<div
							style={{
								background: "rgba(239, 68, 68, 0.2)",
								padding: "16px 32px",
								borderRadius: "9999px",
								border: "2px solid rgba(239, 68, 68, 0.3)",
								color: "#ef4444",
							}}
						>
							Avoid
						</div>
						<div
							style={{
								background: "rgba(34, 197, 94, 0.2)",
								padding: "16px 32px",
								borderRadius: "9999px",
								border: "2px solid rgba(34, 197, 94, 0.3)",
								color: "#22c55e",
							}}
						>
							OK
						</div>
						<div
							style={{
								background: "rgba(234, 179, 8, 0.2)",
								padding: "16px 32px",
								borderRadius: "9999px",
								border: "2px solid rgba(234, 179, 8, 0.3)",
								color: "#eab308",
							}}
						>
							Caution
						</div>
					</div>
				</div>
				<div
					style={{
						position: "absolute",
						bottom: "40px",
						display: "flex",
						alignItems: "center",
						gap: "8px",
					}}
				>
					<span style={{ color: "#94a3b8", fontSize: "24px" }}>doug.is</span>
				</div>
			</div>
		),
		{
			...size,
		}
	)
}
