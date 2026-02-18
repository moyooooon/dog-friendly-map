import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://dog-friendly-map.vercel.app";

export const metadata: Metadata = {
  title: "犬とお出かけマップ | ドッグラン・ドッグカフェ・ペット可ホテル・動物病院を地図で検索",
  description: "犬と一緒に行けるスポットを地図で簡単検索。ドッグラン、ドッグカフェ、犬と泊まれるホテル・旅館、ペットホテル、トリミング、ペット用品店、動物病院を全国から探せます。完全無料・登録不要のサービスです。",
  keywords: [
    "犬", "ドッグラン", "ドッグカフェ", "犬カフェ", "ペット可ホテル", "犬と泊まれる宿",
    "犬と泊まれるホテル", "動物病院", "トリミング", "ペットホテル", "ペット用品店",
    "犬のお出かけ", "ペットOK", "dog friendly", "犬連れ", "ペット可", "犬同伴",
    "犬 地図", "ペット 地図", "ドッグフレンドリー",
  ],
  openGraph: {
    title: "犬とお出かけマップ | ドッグラン・カフェ・ホテルを地図で検索",
    description: "ドッグラン・ドッグカフェ・ペット可ホテル・動物病院などを地図で検索。犬連れのお出かけをサポートする完全無料サービス。",
    url: siteUrl,
    siteName: "犬とお出かけマップ",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "犬とお出かけマップ",
    description: "ドッグラン・ドッグカフェ・ペット可ホテル・動物病院などを地図で検索。犬連れのお出かけをサポートします。",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: "9DaAlRaYjvs8-vYDr-sflzOGuewMgFD5Mmdt6OKCxQY",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "犬とお出かけマップ",
  description: "犬と一緒に行けるスポットを地図で簡単検索。ドッグラン、ドッグカフェ、犬と泊まれるホテル・旅館、ペットホテル、トリミング、ペット用品店、動物病院を全国から探せます。",
  url: siteUrl,
  applicationCategory: "TravelApplication",
  operatingSystem: "Web",
  inLanguage: "ja",
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "JPY",
  },
  audience: {
    "@type": "Audience",
    audienceType: "犬を飼っている人、ペットオーナー",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
