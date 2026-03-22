import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { LocaleProvider } from "@/i18n/LocaleContext";
import SidebarAds from "@/components/SidebarAds";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://whoami-test.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "WHOAMI – 무료 운세 · 수비학 · 사주팔자 · 타로 · 점성술 통합 분석",
    template: "%s | WHOAMI",
  },
  description:
    "생년월일로 나를 분석하는 무료 운세 플랫폼. 수비학(Numerology), 사주팔자, 타로, 자미두수, 서양 점성술 5가지 분석을 AI 기반으로 제공합니다. 오늘의 운세, 궁합, 재물운, 직업운까지 한 곳에서 확인하세요.",
  keywords: [
    "운세", "무료운세", "오늘의운세",
    "수비학", "numerology", "인생경로수",
    "사주", "사주팔자", "만세력", "대운",
    "타로", "타로점", "무료타로",
    "자미두수", "명리학",
    "점성술", "별자리운세", "네이탈차트",
    "궁합", "성격분석", "재물운", "직업운",
    "WHOAMI", "생년월일분석",
  ],
  authors: [{ name: "WHOAMI Project" }],
  creator: "WHOAMI Project",
  publisher: "WHOAMI Project",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "WHOAMI – 무료 운세 · 수비학 · 사주 · 타로 · 점성술 통합 분석",
    description: "생년월일 하나로 수비학·사주팔자·타로·자미두수·점성술 5가지 분석. 무료로 나를 발견하세요.",
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: "WHOAMI - 당신의 우주 설계도",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "WHOAMI - 동서양 점술 통합 분석 플랫폼",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WHOAMI – 무료 운세 · 수비학 · 사주 · 타로 통합 분석",
    description: "생년월일 하나로 5가지 동서양 점술 분석을 무료로 받아보세요.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Google Search Console 인증 후 여기에 값을 넣으세요
    // google: "YOUR_VERIFICATION_CODE",
  },
  other: {
    "google-adsense-account": "ca-pub-3436746262635962",
  },
};

/* ── JSON-LD Structured Data ── */
const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "WHOAMI",
  alternateName: "후엠아이",
  url: SITE_URL,
  description: "생년월일 기반 수비학·사주·타로·자미두수·점성술 무료 통합 분석 플랫폼",
  inLanguage: "ko",
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/analyze/numerology/`,
    "query-input": "required name=search_term_string",
  },
};

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "WHOAMI Project",
  url: SITE_URL,
  logo: `${SITE_URL}/og-image.png`,
  description: "동서양 점술 통합 분석 플랫폼 — 수비학, 사주팔자, 타로, 자미두수, 서양 점성술",
  sameAs: [],
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "WHOAMI는 어떤 서비스인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "WHOAMI는 생년월일을 입력하면 수비학, 사주팔자, 타로, 자미두수, 서양 점성술 5가지 분석을 무료로 제공하는 통합 운세 플랫폼입니다.",
      },
    },
    {
      "@type": "Question",
      name: "수비학(Numerology)이란 무엇인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "수비학은 피타고라스 철학에 기반하여 생년월일의 숫자 조합으로 인생경로수, 표현수, 영혼충동수 등을 계산하여 타고난 재능과 삶의 목적을 발견하는 분석 방법입니다.",
      },
    },
    {
      "@type": "Question",
      name: "사주팔자 분석은 어떻게 이루어지나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "만세력 기반으로 태어난 연월일시의 천간·지지 8글자를 추출하고, 오행의 균형과 대운의 흐름을 분석하여 타고난 기질과 인생의 큰 변곡점을 해독합니다.",
      },
    },
    {
      "@type": "Question",
      name: "WHOAMI 분석은 무료인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "네, 모든 기본 분석은 무료로 제공됩니다. 생년월일만 입력하면 바로 분석 결과를 확인할 수 있습니다.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-3436746262635962" />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      </head>
      <body className="antialiased">
        <LocaleProvider>
          <LanguageSwitcher />
          {children}
          <SidebarAds />
        </LocaleProvider>
        {/* AdSense: next/script ensures proper loading after hydration */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3436746262635962"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
