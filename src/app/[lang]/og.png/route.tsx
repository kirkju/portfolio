import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { cv } from "@/data/cv";
import { ui } from "@/data/ui";
import { defaultLocale, isLocale, locales } from "@/lib/i18n";
import { ogImage } from "@/lib/og";

// Imagen para Open Graph y Twitter Card. En el export se genera una vez por idioma
// durante el build y se publica como /es/og.png y /en/og.png.
export const dynamic = "force-static";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const assetsDir = path.join(process.cwd(), "src", "assets");

// Se leen una sola vez por build.
const assets = Promise.all([
  readFile(path.join(assetsDir, "fonts", "Geist-Regular.ttf")),
  readFile(path.join(assetsDir, "fonts", "Geist-SemiBold.ttf")),
  readFile(path.join(assetsDir, "fonts", "GeistMono-Medium.ttf")),
  readFile(path.join(process.cwd(), "src", "app", "icon.svg")),
]);

export async function GET(_request: Request, { params }: RouteContext<"/[lang]/og.png">) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : defaultLocale;
  const [regular, semibold, mono, icon] = await assets;
  const [role, focus] = cv.profile.title[locale].split(" · ");
  const iconSrc = `data:image/svg+xml;base64,${icon.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#050b18",
          backgroundImage:
            "radial-gradient(circle at 12% 0%, rgba(24, 72, 150, 0.85), transparent 55%), radial-gradient(circle at 100% 100%, rgba(34, 211, 238, 0.16), transparent 45%)",
          color: "#e6edf7",
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse solo admite <img> */}
          <img src={iconSrc} width={72} height={72} alt="" style={{ borderRadius: 18 }} />
          <div style={{ display: "flex", fontFamily: "Geist Mono", fontSize: 24, letterSpacing: 3, color: "#93a4be" }}>
            {cv.profile.location[locale].toUpperCase()}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 600, letterSpacing: -4, color: "#f3f6fb", lineHeight: 1 }}>
            {cv.profile.name}
          </div>
          <div style={{ display: "flex", marginTop: 26, fontSize: 40, lineHeight: 1.2 }}>
            <span>{role}</span>
            {focus ? <span style={{ color: "#93a4be", whiteSpace: "pre" }}>{" · "}</span> : null}
            {focus ? <span style={{ color: "#22d3ee" }}>{focus}</span> : null}
          </div>
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {ui[locale].meta.ogTags.map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex",
                padding: "12px 20px",
                borderRadius: 999,
                border: "1px solid #1b2b47",
                backgroundColor: "rgba(10, 22, 41, 0.85)",
                fontFamily: "Geist Mono",
                fontSize: 22,
                color: "#e6edf7",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      width: ogImage.width,
      height: ogImage.height,
      fonts: [
        { name: "Geist", data: regular, weight: 400, style: "normal" },
        { name: "Geist", data: semibold, weight: 600, style: "normal" },
        { name: "Geist Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  );
}
