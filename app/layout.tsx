import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://dog-friendly-map.vercel.app";

export const metadata: Metadata = {
  title: "犬とお出かけマップ | ドッグラン・ペット可ホテル・動物病院を地図で検索",
  description: "犬と一緒に行けるスポットを地図で簡単検索。ドッグラン、犬と泊まれるホテル・旅館、ペットホテル、トリミング、ペット用品店、動物病院を全国から探せます。OpenStreetMapのデータを活用した完全無料のサービスです。",
  keywords: ["犬", "ドッグラン", "ペット可ホテル", "犬と泊まれる宿", "動物病院", "トリミング", "ペットホテル", "ペット用品店", "犬のお出かけ", "ペットOK", "dog friendly"],
  openGraph: {
    title: "犬とお出かけマップ",
    description: "ドッグラン・ペット可ホテル・動物病院などを地図で検索。犬連れのお出かけをサポートします。",
    url: siteUrl,
    siteName: "犬とお出かけマップ",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "犬とお出かけマップ",
    description: "ドッグラン・ペット可ホテル・動物病院などを地図で検索。犬連れのお出かけをサポートします。",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
