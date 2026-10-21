import { ImageResponse } from "next/og";

export const alt =
  "Hoang Dang. Research software for clinical and laboratory systems. MIT CSAIL and Harvard Medical School, Boston.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#ffffff",
          color: "#1a1d21",
        }}
      >
        <div style={{ height: 14, width: "100%", background: "#14365c" }} />
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "72px 80px 64px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 76, lineHeight: 1.05, letterSpacing: -1 }}>
              Hoang Dang
            </div>
            <div
              style={{
                marginTop: 28,
                maxWidth: 820,
                fontSize: 34,
                lineHeight: 1.35,
                color: "#3f4754",
              }}
            >
              Research software for clinical and laboratory systems.
            </div>
          </div>
          <div style={{ fontSize: 22, color: "#3f4754" }}>
            MIT CSAIL · Harvard Medical School · Boston
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
