import type { Metadata } from "next";
import "./globals.css";
import IntroLoader from "@/components/IntroLoader";
import SectionCursors from "@/components/SectionCursors";

export const metadata: Metadata = {
  title: "Ashan Sithara | DevOps, Cloud & AI Engineer",
  description: "Ashan Sithara's portfolio — cloud infrastructure, DevOps automation, observability, and AI engineering. Based in Dubai, UAE.",
  openGraph: { title: "Ashan Sithara | Cloud Command Center", description: "DevOps • Cloud • AI Engineer", type: "website" },
};

// Runs before first paint: arms the intro (hides hero elements via globals.css) unless the visitor prefers
// reduced motion or arrived on a #section link. A failsafe un-hides everything if the app never hydrates.
const introScript = `(function(){try{var d=document.documentElement;if(location.hash||matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('intro-active');window.__introPlay=true;if('scrollRestoration' in history)history.scrollRestoration='manual';window.__introFailsafe=setTimeout(function(){d.classList.remove('intro-active');window.__introPlay=false},8000)}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: introScript }} /></head><body><IntroLoader />{children}<SectionCursors /></body></html>;
}
