import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import CTA from "@/components/landing/CTA";
import { PublicLayout } from "@/components/layout/PublicLayout";

export default function Home() {
  return (
    <PublicLayout showFooter={false}>
      <Hero />
      <Features />
      <CTA />
    </PublicLayout>
  );
}
