import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ashan Sithara | DevOps, Cloud & AI Engineer",
  description: "Ashan Sithara's portfolio — cloud infrastructure, DevOps automation, observability, and AI engineering. Based in Dubai, UAE.",
  openGraph: { title: "Ashan Sithara | Cloud Command Center", description: "DevOps • Cloud • AI Engineer", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
