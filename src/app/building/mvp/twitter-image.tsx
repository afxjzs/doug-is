import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Your MVP — Built and Deployed in One Week"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #0B1120 0%, #1E293B 50%, #0B1120 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "-50px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            right: "-50px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "0 80px",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 20px",
              borderRadius: "9999px",
              background: "rgba(59,130,246,0.1)",
              border: "1px solid rgba(59,130,246,0.25)",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#34D399",
              }}
            />
            <span style={{ color: "#60A5FA", fontSize: "18px" }}>
              Now accepting projects
            </span>
          </div>

          <div
            style={{
              fontSize: "72px",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              marginBottom: "24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span style={{ background: "linear-gradient(135deg, #60A5FA, #A78BFA, #34D399)", backgroundClip: "text", color: "transparent" }}>
              Your MVP
            </span>
            <span style={{ background: "linear-gradient(135deg, #60A5FA, #A78BFA, #34D399)", backgroundClip: "text", color: "transparent" }}>
              Built and Deployed
            </span>
            <span style={{ background: "linear-gradient(135deg, #60A5FA, #A78BFA, #34D399)", backgroundClip: "text", color: "transparent" }}>
              in One Week
            </span>
          </div>

          <p
            style={{
              fontSize: "24px",
              color: "#94A3B8",
              maxWidth: "700px",
              lineHeight: 1.5,
              marginBottom: "36px",
            }}
          >
            From idea to production-ready app. Built by a YC alum with 25 years experience.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ color: "#64748B", fontSize: "24px", textDecoration: "line-through" }}>
              $2,500
            </span>
            <span style={{ color: "#FFFFFF", fontSize: "56px", fontWeight: 800 }}>
              $999
            </span>
            <div
              style={{
                padding: "6px 16px",
                borderRadius: "9999px",
                background: "rgba(52,211,153,0.15)",
                border: "1px solid rgba(52,211,153,0.25)",
                color: "#34D399",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              Early Bird
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "24px",
            right: "40px",
            color: "#475569",
            fontSize: "18px",
          }}
        >
          doug.is/building/mvp
        </div>
      </div>
    ),
    { ...size }
  )
}
