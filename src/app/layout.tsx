import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Transformative Bildung – Projekte",
    template: "%s – Transformative Bildung",
  },
  description:
    "Entdecken Sie inspirierende Transformationsprojekte in der europäischen Hochschulbildung. Eine Initiative der Zukunftsallianz für Transformative Bildung.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    siteName: "Transformative Bildung – Projekte",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
