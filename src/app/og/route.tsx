import { ImageResponse } from "next/og";

export const runtime = "edge";

/* ORIGINAL RECTANGLE VERSION - To switch back, replace the circle div (lines 103-139) with:
        <div
          style={{
            width: Math.round(WIDTH * 0.52),
            height: HEIGHT,
            position: "relative",
            overflow: "hidden",
            display: "flex",
          }}
        >
          <img
            src={avatarUrl}
            alt="Profile"
            width={Math.round(WIDTH * 0.52)}
            height={HEIGHT}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "saturate(1.05)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, rgba(5,7,8,0) 0%, rgba(5,7,8,0.25) 20%, rgba(5,7,8,0.5) 60%, rgba(5,7,8,0.85) 100%)",
            }}
          />
        </div>
*/

const WIDTH = 1200;
const HEIGHT = 630;

// Load Inter 28pt Bold font
const interFontPromise = fetch(
  new URL("../../../public/fonts/Inter/static/Inter_28pt-Black.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

function truncateMessage(input: string, maxChars = 100) {
  const text = (input || "").trim();
  if (!text) return "Come work for X";
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars).trimEnd() + "...";
}

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const raw = searchParams.get("t") || "Come work for X";
  const msg = truncateMessage(raw);

  const avatarUrl = new URL("/Nikita_DM.jpg", origin).toString();
  
  // Load the font data
  const interFontData = await interFontPromise;

  return new ImageResponse(
    (
      // Outer canvas
      <div
        style={{
          width: WIDTH,
          height: HEIGHT,
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "space-between",
          backgroundColor: "#050708",
          color: "#E7E9EA",
          fontFamily: "Inter, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        {/* Left panel: message + title */}
        <div
          style={{
            flex: 1,
            padding: 56,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Simulated chat bubble from Nikita */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              {/* Small avatar to emphasize sender */}
              <img
                src={avatarUrl}
                alt="Nikita avatar"
                width={56}
                height={56}
                style={{
                  borderRadius: 9999,
                  objectFit: "cover",
                }}
              />
              <div
                style={{
                  maxWidth: 520,
                  backgroundColor: "#16181C",
                  padding: "20px 22px",
                  borderRadius: 20,
                  borderTopLeftRadius: 6,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
                  fontSize: 40,
                  lineHeight: 1.25,
                  whiteSpace: "pre-wrap",
                  overflow: "hidden",
                }}
              >
                {msg}
              </div>
            </div>
          </div>

          {/* Bottom-left title */}
          <div
            style={{
              fontSize: 36,
              fontFamily: "Inter, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
              fontWeight: 900,
              color: "#E7E9EA",
            }}
          >
            Did Nikita just message you? Yes.
          </div>
        </div>

        {/* Right panel: big profile image - CIRCLE VERSION */}
        <div
          style={{
            width: Math.round(WIDTH * 0.52),
            height: HEIGHT,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#050708",
          }}
        >
          <div
            style={{
              width: HEIGHT - 60,
              height: HEIGHT - 60,
              borderRadius: "50%",
              overflow: "hidden",
              position: "relative",
              display: "flex",
            }}
          >
            <img
              src={avatarUrl}
              alt="Profile"
              width={HEIGHT - 60}
              height={HEIGHT - 60}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "saturate(1.05)",
              }}
            />
          </div>
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        {
          name: "Inter",
          data: interFontData,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
