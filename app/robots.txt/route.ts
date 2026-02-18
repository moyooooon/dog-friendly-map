export async function GET() {
  return new Response(
    `User-agent: *
Allow: /

Sitemap: https://dog-friendly-map.vercel.app/sitemap.xml
`,
    { headers: { "Content-Type": "text/plain" } }
  );
}
