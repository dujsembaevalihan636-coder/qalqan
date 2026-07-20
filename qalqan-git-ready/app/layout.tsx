import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { SiteFooter } from "@/components/SiteFooter";
import { LanguageProvider } from "@/lib/i18n/context";

// Display: editorial high-fashion serif with Cyrillic — weight through scale.
const display = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

// Body: technical-refined sans, excellent Cyrillic optical sizing.
const body = IBM_Plex_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

// Meta labels / act numbers — geometric precision (Triadic Ballet).
const meta = IBM_Plex_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-meta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Qalqan — цифровой щит от дропперских схем",
  description:
    "Проверь сообщение за секунды. Красные флаги, вопросы, которые стоит задать, и коллективная карта угроз по Казахстану.",
  icons: {
    icon: [{ url: "/favicon-32.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/logo-q.png" }],
  },
  openGraph: {
    title: "Qalqan — цифровой щит",
    description:
      "Тебя вербуют в дропперы. Проверь сообщение до того, как отдашь карту.",
    locale: "ru_KZ",
    type: "website",
    images: [{ url: "/logo-q.png", width: 1168, height: 1082, alt: "Qalqan" }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#080809",
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      className={`${display.variable} ${body.variable} ${meta.variable}`}
    >
      <body>
        <LanguageProvider>
          <Nav />
          <main id="main">{children}</main>
          <SiteFooter />
        </LanguageProvider>
      </body>
    </html>
  );
}
