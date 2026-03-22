import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ❌ output: 'export' 제거 — 정적 빌드는 API 라우트 불가
  // Vercel은 SSR + API Routes를 네이티브 지원
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // 서버 전용 패키지 (Edge/Serverless에서 번들 제외)
  serverExternalPackages: [],
};

export default nextConfig;
