import type { Metadata } from "next";
import { headers } from "next/headers";
import HomeClient from "./HomeClient";

function truncateForOg(input: string, maxChars = 50) {
  const text = (input || "").trim();
  if (!text) return "Come work for X";
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars).trimEnd() + "...";
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const params = await searchParams;
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") || "http";
  const origin = `${proto}://${host}`;

  const raw = (typeof params?.t === "string"
    ? params.t
    : Array.isArray(params?.t)
    ? params?.t?.[0]
    : undefined) || "Come work for X";
  const t = truncateForOg(raw);
  const ogUrl = `${origin}/og?t=${encodeURIComponent(t)}`;

  return {
    title: "Nikita just DM'd you",
    description: "Warning: Parody. Mock up a Nikita DM.",
    openGraph: {
      title: "Nikita just DM'd you",
      description: "Warning: Parody. Mock up a Nikita DM.",
      images: [ogUrl],
    },
    twitter: {
      card: "summary_large_image",
      title: "Nikita just DM'd you",
      description: "Warning: Parody. Mock up a Nikita DM.",
      images: [ogUrl],
    },
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const t = (typeof params?.t === "string"
    ? params?.t
    : Array.isArray(params?.t)
    ? params?.t?.[0]
    : undefined) || undefined;
  return <HomeClient initialMessage={t} />;
}

